import type { AnnotationProperties } from '@actions/core';

interface ILogger {
  error: (message: string | Error, properties?: AnnotationProperties) => void;
  info: (message: string) => void;
}

export default ILogger;
