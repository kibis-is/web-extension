interface IAccountPasskey {
  algorithm: number;
  id: string;
  name: string;
  publicKey: string;
  transports: AuthenticatorTransport[];
  userID: string;
}

export default IAccountPasskey;
