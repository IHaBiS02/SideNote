// Sample note and image data for tests

export function createSampleNote(overrides = {}) {
  const now = Date.now();
  return {
    id: overrides.id || 'test-note-1',
    title: overrides.title || 'Test Note',
    content: overrides.content || '# Hello\nThis is a test note.',
    settings: overrides.settings || { fontSize: 12 },
    metadata: {
      createdAt: overrides.createdAt || now,
      lastModified: overrides.lastModified || now,
      ...(overrides.deletedAt ? { deletedAt: overrides.deletedAt } : {}),
    },
    isPinned: overrides.isPinned || false,
    ...(overrides.pinnedAt ? { pinnedAt: overrides.pinnedAt } : {}),
  };
}

export function createSampleImage(overrides = {}) {
  const blob = new Blob(['fake image data'], { type: 'image/png' });
  return {
    id: overrides.id || 'test-image-1',
    blob: overrides.blob || blob,
    deletedAt: overrides.deletedAt || null,
  };
}

export function createMultipleNotes(count = 3) {
  return Array.from({ length: count }, (_, i) => createSampleNote({
    id: `note-${i + 1}`,
    title: `Note ${i + 1}`,
    content: `Content for note ${i + 1}`,
    createdAt: Date.now() - (count - i) * 1000,
    lastModified: Date.now() - (count - i) * 1000,
  }));
}
