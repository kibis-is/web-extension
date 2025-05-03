import { setFailed } from '@actions/core';
import { Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

// enums
import { ErrorCodeEnum } from './enums';

// errors
import { ActionError } from './errors';

// utils
import { createLogger, handleError, upload } from './utils';

(async () => {
  const logger = await createLogger();
  let zipPath: string;
  let zipFileStats: Stats;

  if (!process.env.EMAIL) {
    setFailed(`invalid input for environment variable "EMAIL"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.PASSWORD) {
    setFailed(`invalid input for environment variable "PASSWORD"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.EXTENSION_ID) {
    setFailed(`invalid input for environment variable "EXTENSION_ID"`);

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

    logger.info(
      `uploading add-on "${process.env.EXTENSION_ID}" with zip file "${zipPath}"`
    );

    await upload({
      email: process.env.EMAIL,
      extensionID: process.env.EXTENSION_ID,
      logger,
      password: process.env.PASSWORD,
      zipPath,
    });

    logger.info(`successfully published add-on "${process.env.EXTENSION_ID}`);
  } catch (error) {
    logger.error(error);

    handleError(error);
  }
})();
