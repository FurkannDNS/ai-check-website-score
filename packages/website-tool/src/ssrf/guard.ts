import { resolveAndValidateHostname } from './dns-resolver.js';

export interface UrlSecurityCheckResult {
  isSafe: boolean;
  url: URL;
  resolvedIps: string[];
  reason?: string;
}

export interface GuardOptions {
  allowLocal?: boolean;
}

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

const BLOCKED_PORTS = new Set([
  21,   // FTP
  22,   // SSH
  23,   // Telnet
  25,   // SMTP
  53,   // DNS
  110,  // POP3
  143,  // IMAP
  3306, // MySQL
  5432, // PostgreSQL
  6379, // Redis
  9200, // Elasticsearch
  11211,// Memcached
  27017,// MongoDB
]);

/**
 * Validates a target URL against SSRF vulnerabilities, protocol abuses,
 * blocked ports, and unroutable / private network addresses.
 */
export async function guardUrl(
  urlString: string,
  options: GuardOptions = {}
): Promise<UrlSecurityCheckResult> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlString);
  } catch {
    return {
      isSafe: false,
      url: new URL('http://invalid.target'),
      resolvedIps: [],
      reason: `Malformed URL: ${urlString}`,
    };
  }

  // Protocol check
  if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
    return {
      isSafe: false,
      url: parsedUrl,
      resolvedIps: [],
      reason: `Disallowed protocol: ${parsedUrl.protocol}. Only http: and https: are allowed.`,
    };
  }

  // Port check
  if (parsedUrl.port) {
    const portNum = parseInt(parsedUrl.port, 10);
    if (BLOCKED_PORTS.has(portNum)) {
      return {
        isSafe: false,
        url: parsedUrl,
        resolvedIps: [],
        reason: `Disallowed target port: ${portNum}`,
      };
    }
  }

  // Hostname & DNS resolution check
  const dnsCheck = await resolveAndValidateHostname(parsedUrl.hostname, {
    allowLocal: options.allowLocal,
  });
  if (!dnsCheck.isSafe) {
    return {
      isSafe: false,
      url: parsedUrl,
      resolvedIps: dnsCheck.resolvedIps,
      reason: dnsCheck.reason,
    };
  }

  return {
    isSafe: true,
    url: parsedUrl,
    resolvedIps: dnsCheck.resolvedIps,
  };
}
