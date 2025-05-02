// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';

/**
 * Determines if the provider (extension) has been initialized. THe provider is considered initialized if the password
 * tag exists in storage.
 * @returns {Promise<boolean>} A promise that resolves to true if the provider is initialized, false otherwise.
 */
export default async function isProviderInitialized(): Promise<boolean> {
  const passwordTagItem = await new PasswordTagRepository().fetch();

  return !!passwordTagItem;
}
