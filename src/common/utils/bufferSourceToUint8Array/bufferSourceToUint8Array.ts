/**
 * Convenience function that converts a `BufferSource` to a `Uint8Array`.
 * @param {BufferSource} bufferSource - The `BufferSource` to convert.
 * @returns {Uint8Array} The `BufferSource` converted to `Uint8Array`.
 */
export default function bufferSourceToUint8Array(
  bufferSource: BufferSource
): Uint8Array {
  // if the buffer source is ArrayBufferView
  if (ArrayBuffer.isView(bufferSource)) {
    return new Uint8Array(
      bufferSource.buffer,
      bufferSource.byteOffset,
      bufferSource.byteLength
    );
  }

  return new Uint8Array(bufferSource);
}
