import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTrackedBlobUrl,
  revokeAllBlobUrls,
  revokeTrackedBlobUrl,
  getTrackedBlobUrlCount,
  getTimestamp,
  sanitizeFilename,
  extractImageIds
} from '../../src/utils.js';

describe('test setup verification', () => {
  it('should have IndexedDB available', () => {
    expect(indexedDB).toBeDefined();
  });

  it('should have browser API mocked', () => {
    expect(globalThis.browser).toBeDefined();
    expect(globalThis.browser.storage.local.get).toBeDefined();
  });

  it('should have crypto.randomUUID available', () => {
    const uuid = crypto.randomUUID();
    expect(uuid).toBeTruthy();
  });
});

describe('blob URL tracking', () => {
  beforeEach(() => {
    revokeAllBlobUrls();
  });

  it('should create and track a blob URL', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const url = createTrackedBlobUrl(blob);
    expect(url).toBeTruthy();
    expect(getTrackedBlobUrlCount()).toBe(1);
  });

  it('should track multiple blob URLs', () => {
    const blob1 = new Blob(['a'], { type: 'text/plain' });
    const blob2 = new Blob(['b'], { type: 'text/plain' });
    createTrackedBlobUrl(blob1);
    createTrackedBlobUrl(blob2);
    expect(getTrackedBlobUrlCount()).toBe(2);
  });

  it('should revoke all tracked blob URLs', () => {
    const blob1 = new Blob(['a'], { type: 'text/plain' });
    const blob2 = new Blob(['b'], { type: 'text/plain' });
    createTrackedBlobUrl(blob1);
    createTrackedBlobUrl(blob2);
    revokeAllBlobUrls();
    expect(getTrackedBlobUrlCount()).toBe(0);
  });

  it('should revoke a single tracked blob URL', () => {
    const blob1 = new Blob(['a'], { type: 'text/plain' });
    const blob2 = new Blob(['b'], { type: 'text/plain' });
    const url1 = createTrackedBlobUrl(blob1);
    createTrackedBlobUrl(blob2);
    revokeTrackedBlobUrl(url1);
    expect(getTrackedBlobUrlCount()).toBe(1);
  });

  it('should not error on double revoke', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const url = createTrackedBlobUrl(blob);
    revokeTrackedBlobUrl(url);
    expect(() => revokeTrackedBlobUrl(url)).not.toThrow();
    expect(getTrackedBlobUrlCount()).toBe(0);
  });

  it('should not error revoking untracked URL', () => {
    expect(() => revokeTrackedBlobUrl('blob:fake-url')).not.toThrow();
  });
});

describe('getTimestamp', () => {
  it('should return a formatted timestamp string', () => {
    const ts = getTimestamp();
    expect(ts).toMatch(/^\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}$/);
  });
});

describe('sanitizeFilename', () => {
  it('should replace invalid characters with underscores', () => {
    expect(sanitizeFilename('file/name')).toBe('file_name');
    expect(sanitizeFilename('file\\name')).toBe('file_name');
    expect(sanitizeFilename('file?name')).toBe('file_name');
    expect(sanitizeFilename('file:name')).toBe('file_name');
    expect(sanitizeFilename('file"name')).toBe('file_name');
  });

  it('should not modify valid filenames', () => {
    expect(sanitizeFilename('valid-file_name.txt')).toBe('valid-file_name.txt');
  });
});

describe('extractImageIds', () => {
  it('should extract image IDs from markdown content', () => {
    const content = '![Image](images/abc123.png) some text ![Image](images/def456.png)';
    const ids = extractImageIds(content);
    expect(ids).toContain('abc123');
    expect(ids).toContain('def456');
    expect(ids).toHaveLength(2);
  });

  it('should return empty array for content without images', () => {
    expect(extractImageIds('no images here')).toEqual([]);
  });

  it('should deduplicate image IDs', () => {
    const content = '![A](images/same.png) ![B](images/same.png)';
    const ids = extractImageIds(content);
    expect(ids).toHaveLength(1);
    expect(ids[0]).toBe('same');
  });
});
