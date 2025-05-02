interface IInitializeOptions {
  navigatorCredentialsCreateFn: typeof navigator.credentials.create;
  navigatorCredentialsGetFn: typeof navigator.credentials.get;
}

export default IInitializeOptions;
