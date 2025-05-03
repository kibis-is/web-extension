import { type AnnotationProperties, error, info } from '@actions/core';

// types
import type { ILogger } from '../types';

export default async function createLogger(): Promise<ILogger> {
  const styles = (await import('ansi-styles')).default;

  return {
    error: (message: string | Error, properties?: AnnotationProperties) =>
      error(
        typeof message === 'string'
          ? `${styles.red.open}[ERROR]${styles.red.close}`
          : message,
        properties
      ),
    info: (message: string) =>
      info(`${styles.yellow.open}[INFO]${styles.yellow.close}: ${message}`),
  };
}
