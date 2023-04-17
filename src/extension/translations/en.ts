// Types
import { IResourceLanguage } from '@extension/types';

const translation: IResourceLanguage = {
  buttons: {
    addAccount: 'Add Account',
    addAsset: 'Add Asset',
    allow: 'Allow',
    cancel: 'Cancel',
    changePassword: 'Change Password',
    clearAllData: 'Clear All Data',
    confirm: 'Confirm',
    copySeedPhrase: 'Copy Seed Phrase',
    create: 'Create',
    getStarted: 'Get Started',
    import: 'Import',
    next: 'Next',
    ok: 'OK',
    previous: 'Previous',
    receive: 'Receive',
    removeAllSessions: 'Remove All Sessions',
    save: 'Save',
    send: 'Send',
    sign: 'Sign',
  },
  captions: {
    addressCopied: 'Address copied!',
    addressDoesNotMatch: 'This address does not match the signer',
    allowBetaNet: 'Let BetaNet networks appear in the networks list.',
    allowDidTokenFormat:
      'The DID token format "did:algo:<public_address>" will be an option when sharing an address.',
    allowTestNet: 'Let TestNet networks appear in the networks list.',
    assetIdCopied: 'Asset ID copied!',
    audienceDoesNotMatch:
      'The intended recipient of this token, does not match the host',
    changePassword1:
      'Enter your new password. You will be prompted to enter your current password.',
    changePassword2:
      'You will be prompted to enter your current password when you press "Change Password".',
    changeTheme: 'Choose between dark and light mode.',
    clearAllData: 'Are you sure you want to clear all your data?',
    clearAllDataWarning:
      'Once this has been completed, it cannot be reversed. All your settings and accounts will be removed',
    connectRequest:
      'An application is requesting to connect. Select which accounts you would like to enable:',
    copied: 'Copied!',
    createNewAccount:
      'Create a new account. You will be prompted to save a mnemonic seed phrase.',
    createPassword1: `First, let's create a new password to secure this device.`,
    createPassword2:
      'This password will be used to encrypt your private keys, so make it strong!',
    enterSeedPhrase: `Add your seed phrase to import your account.`,
    importExistingAccount: `Import an existing account using you mnemonic seed phrase.`,
    importExistingAccountComplete: `To finalize we will encrypt your account keys with your password and you will be able to start using this account.`,
    importRekeyedAccount: `Import an existing account that has been rekeyed. You will need the mnemonic seed phrase of the authorized account and the address of the rekeyed account.`,
    invalidAlgorithm: `The suggested signing method does not match the method that will be used to sign this token`,
    minimumBalance: `Minimum balance is {{amount}} algo. Based on the account configuration, this is the minimum balance needed to keep the account open.`,
    mustEnterPasswordToConfirm: 'You must enter your password to confirm.',
    mustEnterPasswordToSign: 'You must enter your password to sign.',
    nameYourAccount: `Give your account a nickname. Don't worry you can change this later on.`,
    newAccountComplete:
      'We are almost done. Before we safely secure your new account on this device, we just need you to confirm you have copied your seed phrase.',
    noAccountsFound:
      'You can create a new account or import an existing account.',
    noAssetsFound:
      'You have not opt-ed into any assets. Try adding an assets now.',
    noSessionsFound: 'Enabled dApps will appear here.',
    offline: 'It looks like you are offline, some features may not work',
    passwordScoreInfo:
      'To conform with our Strong Password policy, you are required to use a sufficiently strong password. Password must be at least 8 characters.',
    removeAccount: 'Are you sure you want to remove account "{{address}}"?',
    removeAccountWarning:
      'To add this account back you will need the seed phrase',
    removeAllSessions: 'Are you sure you want to remove all sessions?',
    removeAllAccountsWarning:
      'Removing all accounts will also remove this session',
    saveMnemonicPhrase1:
      'Here is your 25 word mnemonic seed phrase; it is the key to your account.',
    saveMnemonicPhrase2: `Make sure you save this in a secure place.`,
    securityTokenExpired: 'This token has expired',
    signJwtRequest: 'An application is requesting to sign a security token.',
    signMessageRequest: 'An application is requesting to sign a message.',
    support:
      'Please <2>contact us</2> for further assistance so we can resolve this issue for you.',
  },
  errors: {
    descriptions: {
      code: `Something has gone wrong.`,
      code_2000: 'The password seems to be invalid.',
    },
    inputs: {
      copySeedPhraseRequired:
        'You must confirm you have copied the seed phrase',
      invalidMnemonic: 'Invalid seed phrase',
      invalidPassword: 'Invalid password',
      passwordMinLength: 'Must be at least 8 characters',
      passwordTooWeak: 'This password is too weak',
      required: '{{name}} is required',
      unknown: `Something doesn't look right`,
    },
    titles: {
      code: 'Well this is embarrassing...',
      code_2000: 'Invalid password',
    },
  },
  headings: {
    authentication: 'Authentication',
    beta: 'Beta',
    clearAllData: 'Clear All Data',
    comingSoon: 'Coming Soon!',
    createNewAccount: 'Create A New Account',
    dangerZone: 'Danger Zone',
    developer: 'Developer',
    enterYourSeedPhrase: 'Enter your seed phrase',
    generateSeedPhrase: 'Generate seed phrase',
    importExistingAccount: 'Import An Existing Account',
    importExistingAccountComplete: 'Almost There...',
    importRekeyedAccount: 'Import A Rekeyed Account',
    nameYourAccount: 'Name your account',
    newAccountComplete: 'Almost There...',
    noAccountsFound: 'No accounts found',
    noAssetsFound: 'No assets found',
    noSessionsFound: 'No sessions found',
    removeAccount: 'Remove Account',
    removeAllSessions: 'Remove All Sessions',
    shareAddress: 'Share Address',
  },
  labels: {
    activity: 'Activity',
    address: 'Address',
    addressToSign: 'Address to sign',
    accountName: 'Account Name',
    addAccount: 'Add Account',
    allowBetaNet: 'Allow BetaNet networks?',
    allowDidTokenFormat: 'Allow DID token format in address sharing?',
    allowTestNet: 'Allow TestNet networks?',
    assets: 'Assets',
    audience: 'Audience',
    authorizedAccounts: 'Authorized accounts',
    authorizedAddresses: 'Authorized addresses',
    balance: 'Balance',
    copySeedPhraseConfirm:
      'I confirm I have copied my seed phrase to a secure place.',
    dark: 'Dark',
    default: 'Default',
    did: 'DID',
    expirationDate: 'Expiration date',
    id: 'ID',
    information: 'Information',
    issueDate: 'Issue date',
    issuer: 'Issuer',
    light: 'Light',
    nfts: 'NFTs',
    manageAccounts: 'Manage Accounts',
    message: 'Message',
    moreInformation: 'More Information',
    newPassword: 'New Password',
    password: 'Password',
    removeAccount: 'Remove account',
    removeSession: 'Remove session',
    seedPhrase: 'Seed Phrase',
    settings: 'Settings',
    shareAddress: 'Share address',
    signingMethod: 'Signing Method',
    theme: 'Theme',
    unknownApp: 'Unknown App',
    unknownHost: 'unknown host',
  },
  placeholders: {
    enterPassword: 'Enter password',
    nameAccount: 'Enter a name for this account (optional)',
  },
  titles: {
    page: '',
    page_accountSetup: 'Choose How To Add An Account',
    page_advanced: 'Advanced',
    page_appearance: 'Appearance',
    page_changePassword: 'Change Password',
    page_createNewAccount: 'Create A New Account',
    page_createPassword: 'Secure Your Device',
    page_general: 'General',
    page_importExistingAccount: 'Import An Existing Account',
    page_importRekeyedAccount: 'Import A Rekeyed Account',
    page_security: 'Security',
    page_sessions: 'Sessions',
    page_settings: 'Settings',
  },
};

export default translation;
