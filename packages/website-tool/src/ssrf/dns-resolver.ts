import dns from 'node:dns/promises';
import { validateIpAddress } from './ip-validator.js';

export interface DnsValidationResult {
  isSafe: boolean;
  hostname: string;
  resolvedIps: string[];
  reason?: string;
}

export interface DnsValidationOptions {
  allowLocal?: boolean;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'instance-data',
  '169.254.169.254',
]);

const BLOCKED_HOSTNAME_SUFFIXES = [
  '.local',
  '.internal',
  '.localhost',
  '.lan',
  '.home.arpa',
  '.corp',
];

/**
 * Resolves a hostname via DNS and checks all resulting IPv4/IPv6 addresses
 * against SSRF restrictions.
 */
export async function resolveAndValidateHostname(
  hostname: string,
  options: DnsValidationOptions = {}
): Promise<DnsValidationResult> {
  const lowerHost = hostname.toLowerCase().trim();

  // If local is allowed and host is localhost or 127.0.0.1
  if (options.allowLocal && (lowerHost === 'localhost' || lowerHost === '127.0.0.1' || lowerHost === '::1')) {
    return {
      isSafe: true,
      hostname: lowerHost,
      resolvedIps: ['127.0.0.1'],
    };
  }

  // Check static blocked hostnames
  if (BLOCKED_HOSTNAMES.has(lowerHost)) {
    return {
      isSafe: false,
      hostname: lowerHost,
      resolvedIps: [],
      reason: `Blocked internal hostname: ${lowerHost}`,
    };
  }

  // Check suffix patterns
  for (const suffix of BLOCKED_HOSTNAME_SUFFIXES) {
    if (lowerHost.endsWith(suffix)) {
      return {
        isSafe: false,
        hostname: lowerHost,
        resolvedIps: [],
        reason: `Blocked domain suffix: ${suffix}`,
      };
    }
  }

  // If the hostname is already an IP address, validate directly
  const ipCheck = validateIpAddress(lowerHost, { allowLocal: options.allowLocal });
  if (ipCheck.reason && !ipCheck.reason.startsWith('Invalid IP address format')) {
    return {
      isSafe: ipCheck.isSafe,
      hostname: lowerHost,
      resolvedIps: [lowerHost],
      reason: ipCheck.reason,
    };
  }

  // Resolve hostname via DNS
  try {
    const lookupResults = await dns.lookup(lowerHost, { all: true });

    if (!lookupResults || lookupResults.length === 0) {
      return {
        isSafe: false,
        hostname: lowerHost,
        resolvedIps: [],
        reason: `DNS resolution failed: no IP addresses found for ${lowerHost}`,
      };
    }

    const resolvedIps = lookupResults.map((r) => r.address);

    for (const record of lookupResults) {
      const check = validateIpAddress(record.address, { allowLocal: options.allowLocal });
      if (!check.isSafe) {
        return {
          isSafe: false,
          hostname: lowerHost,
          resolvedIps,
          reason: `Resolved IP (${record.address}) is unsafe: ${check.reason}`,
        };
      }
    }

    return {
      isSafe: true,
      hostname: lowerHost,
      resolvedIps,
    };
  } catch (err) {
    return {
      isSafe: false,
      hostname: lowerHost,
      resolvedIps: [],
      reason: `DNS resolution error for ${lowerHost}: ${(err as Error).message}`,
    };
  }
}
