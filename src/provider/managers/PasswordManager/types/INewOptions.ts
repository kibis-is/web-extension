// repositories
import PasswordTagRepository from '@provider/repositories/PasswordTagRepository';

interface INewOptions {
  passwordTag: string;
  passwordTagRepository?: PasswordTagRepository;
}

export default INewOptions;
