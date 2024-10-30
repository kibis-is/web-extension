// utils
import chainReferenceFromGenesisHash from './chainReferenceFromGenesisHash';

interface ITestParams {
  expected: string;
  genesisHash: string;
}

describe(`${__dirname}#chainReferenceFromGenesisHash`, () => {
  it.each<ITestParams>([
    {
      expected: 'r20fSQI8gWe_kFZziNonSPCXLwcQmH_n',
      genesisHash: 'r20fSQI8gWe/kFZziNonSPCXLwcQmH/nxROvnnueWOk=',
    },
    {
      expected: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
      genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    },
  ])(
    `should convert the standard unit of "$genesisHash" to a chain reference of "$expected"`,
    ({ expected, genesisHash }) => {
      expect(chainReferenceFromGenesisHash(genesisHash)).toBe(expected);
    }
  );
});
