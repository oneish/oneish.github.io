import { describe, it, expect } from 'vitest';
import { songs } from '../scripts/data.js';

describe('Data Module', () => {
  it('should export songs array with 11 items', () => {
    expect(songs).toBeDefined();
    expect(Array.isArray(songs)).toBe(true);
    expect(songs.length).toBe(11);
  });

  it('should have songs with required properties', () => {
    songs.forEach((song) => {
      expect(song).toHaveProperty('title');
      expect(song).toHaveProperty('artist');
      expect(song).toHaveProperty('file');
      
      expect(typeof song.title).toBe('string');
      expect(typeof song.artist).toBe('string');
      expect(typeof song.file).toBe('string');
      
      expect(song.title.length).toBeGreaterThan(0);
      expect(song.artist.length).toBeGreaterThan(0);
      expect(song.file.length).toBeGreaterThan(0);
      
      // Verify file path format
      expect(song.file).toMatch(/^assets\/audio\/.*\.mp3$/);
    });
  });

  it('should have unique song titles', () => {
    const titles = songs.map(song => song.title);
    const uniqueTitles = [...new Set(titles)];
    expect(uniqueTitles.length).toBe(songs.length);
  });

  it('should have unique file paths', () => {
    const files = songs.map(song => song.file);
    const uniqueFiles = [...new Set(files)];
    expect(uniqueFiles.length).toBe(songs.length);
  });
});
