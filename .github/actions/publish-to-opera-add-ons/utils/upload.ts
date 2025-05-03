import { launch } from 'puppeteer';

// enums
import { ErrorCodeEnum } from '../enums';

// errors
import { ActionError } from '../errors';

// types
import type { IUploadParams } from '../types';

/**
 * Launches a headless browser, logins into the developer site, uploads the zip file and submits.
 * @param {IUploadParams} params - The email/password, the extension ID and the path to the zip.
 * @see {@link https://github.com/LinusU/upload-opera-extension}
 */
export default async function upload({
  email,
  extensionID,
  logger,
  password,
  zipPath,
}: IUploadParams): Promise<void> {
  const browser = await launch();
  const url = `https://addons.opera.com/developer/package/${extensionID}/`;

  try {
    const page = await browser.newPage();

    // go to the extension page - the browser will be redirected to the auth page and back once the login succeeded
    await page.goto(url);

    logger.info(`navigated to "${url}"`);

    // perform login
    await page.type('input[name=email]', email);
    await page.type('input[name=password]', password);
    await page.click('button[type=submit]');

    // wait for an element, and then click, "Versions"
    await page.waitForSelector('ul.nav .uib-tab:nth-child(2) a');
    await page.click('ul.nav .uib-tab:nth-child(2) a');

    logger.info('logged in');

    // wait for file uploader, and then select the zip file
    await page.waitForSelector(
      'file-upload[on-upload*=upgradeAddon] input[type=file]'
    );
    await page
      .$('file-upload[on-upload*=upgradeAddon] input[type=file]')
      .then((element) => element?.uploadFile(zipPath));

    logger.info('uploaded file');

    // upload it and wait for it to finish
    await page.click('upload-label');
    await page.waitForSelector('ol.breadcrumb');

    try {
      await page.waitForSelector('[ng-click="submitForModeration()"]');
    } catch (_) {
      let _error: string;

      try {
        _error =
          (await page.evaluate(
            () =>
              document.querySelector('flash-message div.alert span.ng-scope')
                ?.textContent
          )) || 'unknown error occurred while uploading extension';
      } catch (_) {
        _error = 'unknown error occurred while uploading extension';
      }

      throw new ActionError(ErrorCodeEnum.UploadError, _error);
    }

    // submit for moderation
    await page.click('[ng-click="submitForModeration()"]');
  } finally {
    // close the browser
    await browser.close();
  }
}
