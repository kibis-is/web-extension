/**
 * Creates the authorization headers used when making requests.
 * @param {string} clientID - The client ID.
 * @param {string} apiKey - The API key.
 * @returns {Record<'Authorization' | 'X-ClientID', string>} An object that can be used to authorize requests.
 */
export default function authorizationHeaders(
  clientID: string,
  apiKey: string
): Record<'Authorization' | 'X-ClientID', string> {
  return {
    Authorization: `ApiKey ${apiKey}`,
    ['X-ClientID']: clientID,
  };
}
