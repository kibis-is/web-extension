import axios, { type AxiosResponse } from 'axios';
import { createReadStream } from 'node:fs';

// constants
import { BASE_URL } from '../constants';

// enums
import { ErrorCodeEnum, UploadStatusEnum } from '../enums';

// errors
import { ActionError } from '../errors';

// types
import type { IUploadStatusResponse } from '../types';

// utils
import authorizationHeaders from './authorizationHeaders';
import waitInMilliseconds from './waitInMilliseconds';

/**
 * Uploads the zip file to as a draft submission.
 * @param {string} productID - The extension's product ID.
 * @param {string} clientID - The client ID.
 * @param {string} apiKey - The API key.
 * @param {string} zipPath - path to the zip file.
 * @returns {Promise<string>} A promise that resolves to the operation ID associated with this upload.
 * @see {@link https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api#uploading-a-package-to-update-an-existing-submission}
 */
export default async function upload(
  productID: string,
  clientID: string,
  apiKey: string,
  zipPath: string
): Promise<string> {
  const _authorizationHeaders = authorizationHeaders(clientID, apiKey);
  const pollTime = 3000; // 3 seconds
  const retries = 5;
  const uploadURL = `${BASE_URL}/v1/products/${productID}/submissions/draft/package`;
  const uploadResponse = await axios.post(
    uploadURL,
    createReadStream(zipPath),
    {
      headers: {
        ..._authorizationHeaders,
        'Content-Type': 'application/zip',
      },
    }
  );
  let attempts = 0;
  let operationID: string;
  let uploadStatusURL: string;
  let uploadStatusResponse: AxiosResponse<IUploadStatusResponse>;
  let uploadStatus: UploadStatusEnum | null = null;

  operationID = uploadResponse.headers.location;

  if (!operationID) {
    throw new ActionError(
      ErrorCodeEnum.UploadError,
      `failed to get location header from upload response`
    );
  }

  uploadStatusURL = `${uploadURL}/operations/${operationID}`;

  // poll the upload status check
  while (uploadStatus !== UploadStatusEnum.Succeeded && attempts < retries) {
    uploadStatusResponse = await axios.get(uploadStatusURL, {
      headers: {
        ..._authorizationHeaders,
      },
    });

    switch (uploadStatusResponse.data.status) {
      case UploadStatusEnum.Failed:
        throw new ActionError(
          ErrorCodeEnum.UploadError,
          `failed to get status of uploaded zip file${
            uploadStatusResponse.data.errorCode
              ? ` with code "${uploadStatusResponse.data.errorCode}"`
              : ''
          }: ${
            uploadStatusResponse.data.errors?.join(',') ||
            uploadStatusResponse.data.message
          }`
        );
      case UploadStatusEnum.InProgress:
        await waitInMilliseconds(pollTime);
        break;
      case UploadStatusEnum.Succeeded:
      default:
        break;
    }

    attempts++;
    uploadStatus = uploadStatusResponse.data.status;
  }

  // if we don't have a succeeded status, it probably timed out
  if (uploadStatus !== UploadStatusEnum.Succeeded) {
    throw new ActionError(
      ErrorCodeEnum.UploadError,
      `failed to get status of upload, status returned "${uploadStatus}"`
    );
  }

  return operationID;
}
