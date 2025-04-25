// types
import type { IParams } from './types';

/** Simply wraps a fetch in a delay.
 * @param {IParams} parms - The URL and a delay.
 * @returns {Response} the response.
 */
export default async function fetchWithDelay({
  delay,
  url,
}: IParams): Promise<Response> {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      let response: Response;

      try {
        response = await fetch(url);

        resolve(response);
      } catch (error) {
        reject(error);
      }
    }, delay)
  );
}
