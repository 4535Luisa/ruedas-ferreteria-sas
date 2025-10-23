import { ShortenDescriptionPipe } from './shorten-description.pipe';

describe('ShortenDescriptionPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenDescriptionPipe();
    expect(pipe).toBeTruthy();
  });
});
