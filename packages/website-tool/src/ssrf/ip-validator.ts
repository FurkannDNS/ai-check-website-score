import ipaddr from 'ipaddr.js';

export interface IpValidationResult {
  isSafe: boolean;
  ip: string;
  reason?: string;
}

export interface IpValidationOptions {
  allowLocal?: boolean;
}

/**
 * Checks if an IP address (IPv4 or IPv6) is private, loopback, link-local,
 * multicast, carrier-grade NAT, or cloud metadata.
 */
export function validateIpAddress(
  ipString: string,
  options: IpValidationOptions = {}
): IpValidationResult {
  try {
    if (!ipaddr.isValid(ipString)) {
      return {
        isSafe: false,
        ip: ipString,
        reason: `Invalid IP address format: ${ipString}`,
      };
    }

    let parsed = ipaddr.parse(ipString);

    // Convert IPv4-mapped IPv6 (::ffff:127.0.0.1) to IPv4
    if (parsed.kind() === 'ipv6' && (parsed as ipaddr.IPv6).isIPv4MappedAddress()) {
      parsed = (parsed as ipaddr.IPv6).toIPv4Address();
    }

    const range = parsed.range();

    // If local is explicitly allowed, permit loopback and private
    if (options.allowLocal && (range === 'loopback' || range === 'private' || range === 'unspecified')) {
      // Still enforce cloud metadata blocking even if allowLocal is true
      const normalizedIp = parsed.toString();
      const cloudMetadataIps = [
        '169.254.169.254',
        '169.254.170.2',
        '100.100.100.200',
        'fd00:ec2::254',
      ];
      if (cloudMetadataIps.includes(normalizedIp)) {
        return {
          isSafe: false,
          ip: ipString,
          reason: `Forbidden Cloud metadata IP: ${normalizedIp}`,
        };
      }

      return {
        isSafe: true,
        ip: normalizedIp,
      };
    }

    // Block dangerous IPv4 & IPv6 ranges
    const unsafeRanges = [
      'loopback',         // 127.0.0.0/8, ::1/128
      'private',          // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7 (unique local)
      'linkLocal',        // 169.254.0.0/16, fe80::/10
      'carrierGradeNat',  // 100.64.0.0/10
      'multicast',        // 224.0.0.0/4, ff00::/8
      'broadcast',        // 255.255.255.255/32
      'unspecified',      // 0.0.0.0/8, ::/128
      'reserved',         // 240.0.0.0/4
    ];

    if (unsafeRanges.includes(range)) {
      return {
        isSafe: false,
        ip: ipString,
        reason: `Forbidden IP address range: ${range} (${ipString})`,
      };
    }

    // Explicit check for cloud metadata addresses (AWS, GCP, Azure, OpenStack, etc.)
    const cloudMetadataIps = [
      '169.254.169.254',
      '169.254.170.2',
      '100.100.100.200', // Alibaba Cloud
      'fd00:ec2::254',   // AWS IPv6 metadata
    ];

    const normalizedIp = parsed.toString();
    if (cloudMetadataIps.includes(normalizedIp)) {
      return {
        isSafe: false,
        ip: ipString,
        reason: `Forbidden Cloud metadata IP: ${normalizedIp}`,
      };
    }

    return {
      isSafe: true,
      ip: normalizedIp,
    };
  } catch (err) {
    return {
      isSafe: false,
      ip: ipString,
      reason: `Failed to validate IP address: ${(err as Error).message}`,
    };
  }
}
