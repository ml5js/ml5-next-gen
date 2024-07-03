import modelLoader, { isAbsoluteURL } from '../../src/utils/modelLoader';

describe('isAbsoluteURL', () => {
  it('returns false if relative', () => {
    expect(isAbsoluteURL('/model.json')).toBe(false);
    expect(isAbsoluteURL('/deep/folder')).toBe(false);
    expect(isAbsoluteURL('folder/model.json')).toBe(false);
  });

  it('returns true if absolute', () => {
    expect(isAbsoluteURL('https://example.com/model.json')).toBe(true);
    expect(isAbsoluteURL('http://example.com/model.json')).toBe(true);
    expect(isAbsoluteURL('https://example.com/deep/folder')).toBe(true);
  });
});

describe('modelLoader', () => {
  const warnSpy = jest.spyOn(console, 'warn');

  it('formulates URLs relative to the provided path', () => {
    const loader = modelLoader('https://example.com/model.json');
    expect(loader.modelUrl).toBe('https://example.com/model.json');
    expect(loader.manifestUrl).toBe('https://example.com/manifest.json');
    expect(loader.metadataUrl).toBe('https://example.com/metadata.json');
  });

  it('can start with just a directory', () => {
    const loader = modelLoader('https://example.com/folder');
    expect(loader.modelUrl).toBe('https://example.com/folder/model.json');
    expect(loader.manifestUrl).toBe('https://example.com/folder/manifest.json');
    expect(loader.metadataUrl).toBe('https://example.com/folder/metadata.json');
  });

  it('will absolutize relative paths by default', () => {
    // Fake the current location
    Object.defineProperty(window, 'location', {
      get() {
        return {
          href: 'https://fakedomain.com/page',
          origin: 'https://fakedomain.com'
        };
      },
    });
    // relative to page
    const loader = modelLoader('folder/model.json');
    expect(loader.modelUrl).toBe('https://fakedomain.com/page/folder/model.json');
    // relative to root
    const loader2 = modelLoader('/folder/model.json');
    expect(loader2.modelUrl).toBe('https://fakedomain.com/folder/model.json');
  });

  it('will not absolutize paths if using "prepend" false' , () => {
    const loader = modelLoader('folder/model.json', 'model', false);
    expect(loader.modelUrl).toBe('folder/model.json');
  });

  it('will respect an arbitrary file name (not "model.json")', () => {
    const loader = modelLoader('https://example.com/custom_model_file.json', 'model');
    expect(loader.modelUrl).toBe('https://example.com/custom_model_file.json');
    expect(loader.manifestUrl).toBe('https://example.com/manifest.json');
    expect(loader.metadataUrl).toBe('https://example.com/metadata.json');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('will warn on recognized wrong file type', () => {
    const loader = modelLoader('https://example.com/manifest.json', 'model');
    expect(warnSpy).toHaveBeenCalled();
    expect(loader.modelUrl).toBe('https://example.com/model.json');
  });
});
