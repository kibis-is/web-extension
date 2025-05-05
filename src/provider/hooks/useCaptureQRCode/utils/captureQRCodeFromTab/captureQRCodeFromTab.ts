import jsQR, { QRCode } from 'jsqr';
import browser, { Windows } from 'webextension-polyfill';

// utils
import convertDataUriToImageData from '@provider/utils/convertDataUriToImageData';

export default async function captureQRCodeFromTab(): Promise<string> {
  let dataImageUrl: string;
  let imageData: ImageData | null;
  let result: QRCode | null;
  let windows: Windows.Window[];
  let window: Windows.Window | null;

  windows = await browser.windows.getAll();
  window = windows.find((value) => value.type !== 'popup') || null; // get windows that are not the extension window

  if (!window) {
    throw new Error(`unable to find any browser windows`);
  }

  dataImageUrl = await browser.tabs.captureVisibleTab(window.id, {
    format: 'png',
  });
  imageData = await convertDataUriToImageData(dataImageUrl);

  if (!imageData) {
    throw new Error('unable to get image data for current window');
  }

  result = jsQR(imageData.data, imageData.width, imageData.height);

  if (!result) {
    throw new Error(`no qr code found on window "${window.title}"`);
  }

  return result.data;
}
