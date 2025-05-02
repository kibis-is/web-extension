import { info, setFailed } from '@actions/core';
import { Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

// enums
import { ErrorCodeEnum } from './enums';

// errors
import { ActionError } from './errors';

// utils
import { handleError, publish, upload } from './utils';

(async () => {
  const styles = (await import('ansi-styles')).default;
  const infoPrefix = `${styles.yellow.open}[INFO]${styles.yellow.close}`;
  let operationID: string;
  let zipPath: string;
  let zipFileStats: Stats;

  if (!process.env.API_KEY) {
    setFailed(`invalid input for environment variable "API_KEY"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.CLIENT_ID) {
    setFailed(`invalid input for environment variable "CLIENT_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.PRODUCT_ID) {
    setFailed(`invalid input for environment variable "PRODUCT_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.ZIP_FILE_NAME) {
    setFailed(`invalid input for environment variable "ZIP_FILE_NAME"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.GITHUB_WORKSPACE) {
    setFailed(`environment variable "GITHUB_WORKSPACE" not defined`);

    process.exit(ErrorCodeEnum.UnknownError);
  }

  try {
    zipPath = resolve(process.env.GITHUB_WORKSPACE, process.env.ZIP_FILE_NAME);
    zipFileStats = await stat(zipPath);

    // check if the file exists
    if (!zipFileStats.isFile()) {
      throw new ActionError(
        ErrorCodeEnum.FileNotFoundError,
        `zip file "${zipPath}" does not exist`
      );
    }

    info(`${infoPrefix} access token created`);
    info(
      `${infoPrefix} uploading add-on "${process.env.PRODUCT_ID}" with zip file "${zipPath}"`
    );

    operationID = await upload(
      process.env.PRODUCT_ID,
      process.env.CLIENT_ID,
      process.env.API_KEY,
      zipPath
    );

    info(
      `${infoPrefix} successfully uploaded zip file with operation "${operationID}"`
    );
    info(`${infoPrefix} publishing add-on: ${process.env.PRODUCT_ID}`);

    operationID = await publish(
      process.env.PRODUCT_ID,
      process.env.CLIENT_ID,
      process.env.API_KEY
    );

    info(
      `${infoPrefix} successfully published add-on "${process.env.PRODUCT_ID}" with operation "${operationID}"`
    );
  } catch (error) {
    handleError(error);
  }
})();
