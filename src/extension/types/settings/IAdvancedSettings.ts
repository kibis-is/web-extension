/**
 * @property {boolean} allowAccountPasskeys - Whether to allow account passkeys.
 * @property {boolean} allowBetaNet - Whether to allow BetaNet networks in the network list.
 * @property {boolean} allowDidTokenFormat -Whether to allow the did token format in qr code sharing.
 * @property {boolean} allowTestNet - Whether to allow TestNet networks in the network list.
 * @property {boolean} debugLogging - Whether the extension console debug logging is enabled.
 */
interface IAdvancedSettings {
  allowAccountPasskeys: boolean;
  allowBetaNet: boolean;
  allowDidTokenFormat: boolean;
  allowTestNet: boolean;
  debugLogging: boolean;
}

export default IAdvancedSettings;
