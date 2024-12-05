enum ProviderMessageReferenceEnum {
  // messages sent from within the provider (extension)
  CredentialLockActivated = 'provider:credential_lock_activated',
  EventAdded = 'provider:event_added',
  FactoryReset = 'provider:factory_reset',
  RegistrationCompleted = 'provider:registration_completed',
  SessionsUpdated = 'provider:sessions_updated',
  ThemeUpdated = 'provider:theme_updated',
}

export default ProviderMessageReferenceEnum;
