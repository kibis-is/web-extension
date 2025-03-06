/**
 * Convenience function that converts a `Uint8Array` to a `ArrayBuffer`.
 * @param {Uint8Array} value - The `Uint8Array` to convert.
 * @returns {ArrayBuffer} The `Uint8Array` converted to `ArrayBuffer`.
 */
export default function uint8ArrayToArrayBuffer(
  value: Uint8Array
): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength
  );
}
