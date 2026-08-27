import { describe, it, expect } from 'vitest';
import { validateIpAddress } from '../src/ssrf/ip-validator.js';
import { guardUrl } from '../src/ssrf/guard.js';

describe('SSRF Protection & IP Validation', () => {
  describe('validateIpAddress', () => {
    it('should block IPv4 loopback (127.0.0.1)', () => {
      const result = validateIpAddress('127.0.0.1');
      expect(result.isSafe).toBe(false);
      expect(result.reason).toContain('Forbidden IP address range');
    });

    it('should block unspecified IPv4 (0.0.0.0)', () => {
      const result = validateIpAddress('0.0.0.0');
      expect(result.isSafe).toBe(false);
    });

    it('should block private Class A (10.0.0.1)', () => {
      const result = validateIpAddress('10.254.1.5');
      expect(result.isSafe).toBe(false);
    });

    it('should block private Class B (172.16.0.1)', () => {
      const result = validateIpAddress('172.16.50.1');
      expect(result.isSafe).toBe(false);
    });

    it('should block private Class C (192.168.1.1)', () => {
      const result = validateIpAddress('192.168.1.100');
      expect(result.isSafe).toBe(false);
    });

    it('should block Cloud Metadata IP (169.254.169.254)', () => {
      const result = validateIpAddress('169.254.169.254');
      expect(result.isSafe).toBe(false);
    });

    it('should block IPv6 loopback (::1)', () => {
      const result = validateIpAddress('::1');
      expect(result.isSafe).toBe(false);
    });

    it('should block IPv4-mapped IPv6 loopback (::ffff:127.0.0.1)', () => {
      const result = validateIpAddress('::ffff:127.0.0.1');
      expect(result.isSafe).toBe(false);
    });

    it('should block IPv4-mapped IPv6 private (::ffff:192.168.1.1)', () => {
      const result = validateIpAddress('::ffff:192.168.1.1');
      expect(result.isSafe).toBe(false);
    });

    it('should allow valid public IPv4 addresses', () => {
      const result = validateIpAddress('93.184.216.34'); // example.com
      expect(result.isSafe).toBe(true);
    });

    it('should allow valid public DNS IP (8.8.8.8)', () => {
      const result = validateIpAddress('8.8.8.8');
      expect(result.isSafe).toBe(true);
    });
  });

  describe('guardUrl', () => {
    it('should reject non-HTTP protocols (file://, ftp://)', async () => {
      const fileRes = await guardUrl('file:///etc/passwd');
      expect(fileRes.isSafe).toBe(false);
      expect(fileRes.reason).toContain('Disallowed protocol');

      const ftpRes = await guardUrl('ftp://example.com/test');
      expect(ftpRes.isSafe).toBe(false);
    });

    it('should reject blocked internal ports (SSH 22, Redis 6379, MySQL 3306)', async () => {
      const sshRes = await guardUrl('http://93.184.216.34:22');
      expect(sshRes.isSafe).toBe(false);
      expect(sshRes.reason).toContain('Disallowed target port');

      const redisRes = await guardUrl('http://93.184.216.34:6379');
      expect(redisRes.isSafe).toBe(false);
    });

    it('should block localhost and internal domains', async () => {
      const localhostRes = await guardUrl('http://localhost:3000');
      expect(localhostRes.isSafe).toBe(false);

      const localRes = await guardUrl('http://myservice.local');
      expect(localRes.isSafe).toBe(false);

      const internalRes = await guardUrl('http://metadata.google.internal');
      expect(internalRes.isSafe).toBe(false);
    });
  });
});
