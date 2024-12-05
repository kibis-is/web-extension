import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { v4 as uuidV4 } from 'uuid';

export default class UUID {
  private readonly _uuid: string;

  constructor(uuid?: string | Uint8Array) {
    let _uuid = uuidV4();

    if (uuid) {
      _uuid = typeof uuid === 'string' ? uuid : UUID.encode(uuid);
    }

    this._uuid = _uuid;
  }

  /**
   * public static functions
   */

  public static decode(value: string): Uint8Array {
    return decodeHex(value.replace(/-/g, ''));
  }

  public static encode(value: Uint8Array): string {
    const hexString = encodeHex(value);

    return `${hexString.slice(0, 8)}-${hexString.slice(
      8,
      12
    )}-${hexString.slice(12, 16)}-${hexString.slice(16, 20)}-${hexString.slice(
      20,
      32
    )}`;
  }

  /**
   * public functions
   */

  public toBytes(): Uint8Array {
    return UUID.decode(this._uuid);
  }

  public toString(): string {
    return this._uuid;
  }
}
