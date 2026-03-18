import { extractKeywords } from '../keyword-extractor';

describe('extractKeywords', () => {
  it('extracts health topic from Serbian Cyrillic', () => {
    const result = extractKeywords('здравље у Србији', 'sr-Cyrl');
    expect(result.topic).toBe('health');
  });

  it('extracts location from query', () => {
    const result = extractKeywords('saobraćaj u Beogradu', 'sr-Latn');
    expect(result.location).toBe('belgrade');
  });

  it('extracts year from query', () => {
    const result = extractKeywords('ekonomija 2024', 'sr-Latn');
    expect(result.topic).toBe('economy');
    expect(result.year).toBe('2024');
  });

  it('returns remaining terms as q', () => {
    const result = extractKeywords('traffic accidents unknown term', 'en');
    expect(result.topic).toBe('safety');
    expect(result.q).toBe('accidents unknown term');
  });

  it('handles empty query', () => {
    const result = extractKeywords('', 'en');
    expect(result).toEqual({});
  });
});
