/**
 * plugins/webfontloader.ts
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader');

  const fontsLoadedPromise = new Promise<void>((resolve) => {
    webFontLoader.load({
      google: {
        families: ['Roboto:100,300,400,500,700,900&display=swap'],
      },
      active: resolve,
    });
  });

  // Apply a class to the HTML element when fonts are loaded
  fontsLoadedPromise.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });

  // Apply a class to the HTML element immediately to handle initial display
  document.documentElement.classList.add('fonts-loading');
}
