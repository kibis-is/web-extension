import axios, { AxiosResponse } from 'axios';
import { createReadStream } from 'node:fs';

// constants
import { BASE_URL } from '../constants';

// utils
import authorizationHeaders from './authorizationHeaders';

/**
 * Publishes a submission.
 * @param {string} productID - The extension's product ID.
 * @param {string} clientID - The client ID.
 * @param {string} apiKey - The API key.
 * @returns {Promise<string>} A promise that resolves to the operation ID associated with this publish.
 * @see {@link https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api#publishing-the-submission}
 */
export default async function publish(
  productID: string,
  clientID: string,
  apiKey: string
): Promise<string> {
  const url: string = `${BASE_URL}/v1/products/${productID}/submissions`;
  const response: AxiosResponse = await axios.post(
    url,
    { notes: '' },
    {
      headers: authorizationHeaders(clientID, apiKey),
    }
  );

  return response.headers.location;
}
