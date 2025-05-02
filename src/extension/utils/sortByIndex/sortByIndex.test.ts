import { randomBytes } from '@stablelib/random';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccount } from '@extension/types';

// utils
import sortByIndex from './sortByIndex';

interface ITestParams {
  accounts: IAccount[];
  expectedIDs: string[];
  name: string;
}

describe(`${__dirname}/sortByIndex`, () => {
  const now = new Date();

  it.each<ITestParams>([
    {
      accounts: [
        {
          ...AccountRepository.initializeDefaultAccount({
            id: '2',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
          index: 2,
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            id: '3',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
          index: 3,
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            id: '0',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
          index: 0,
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            id: '1',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
          index: 1,
        },
      ],
      expectedIDs: ['0', '1', '2', '3'],
      name: 'should sort by position',
    },
    {
      accounts: [
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: new Date(now).setDate(now.getDate() + 2),
            id: '2',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: new Date(now).setDate(now.getDate() + 3),
            id: '3',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: now.getTime(),
            id: '0',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: new Date(now).setDate(now.getDate() + 1),
            id: '1',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
        },
      ],
      expectedIDs: ['0', '1', '2', '3'],
      name: 'should sort by createdAt date',
    },
    {
      accounts: [
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: now.getTime(),
            id: '2',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: new Date(now).setDate(now.getDate() + 1),
            id: '3',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: new Date(now).setDate(now.getDate() + 3),
            id: '0',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
          index: 0,
        },
        {
          ...AccountRepository.initializeDefaultAccount({
            createdAt: new Date(now).setDate(now.getDate() + 1),
            id: '1',
            publicKey: AccountRepository.encode(randomBytes(32)),
          }),
          index: 1,
        },
      ],
      expectedIDs: ['0', '1', '2', '3'],
      name: 'should sort by a mix of position and createdAt date',
    },
  ])(`$name`, ({ accounts, expectedIDs }) => {
    expect(sortByIndex(accounts).map(({ id }) => id)).toEqual(expectedIDs);
  });

  it('should apply positions to null-indexed elements', () => {
    // arrange
    const items: IAccount[] = [
      {
        ...AccountRepository.initializeDefaultAccount({
          createdAt: now.getTime(),
          id: '2',
          publicKey: AccountRepository.encode(randomBytes(32)),
        }),
      },
      {
        ...AccountRepository.initializeDefaultAccount({
          createdAt: new Date(now).setDate(now.getDate() + 1),
          id: '3',
          publicKey: AccountRepository.encode(randomBytes(32)),
        }),
      },
      {
        ...AccountRepository.initializeDefaultAccount({
          createdAt: new Date(now).setDate(now.getDate() + 3),
          id: '0',
          publicKey: AccountRepository.encode(randomBytes(32)),
        }),
        index: 0,
      },
      {
        ...AccountRepository.initializeDefaultAccount({
          createdAt: new Date(now).setDate(now.getDate() + 1),
          id: '1',
          publicKey: AccountRepository.encode(randomBytes(32)),
        }),
        index: 1,
      },
    ];
    // act
    const result: IAccount[] = sortByIndex(items, {
      mutateIndex: true,
    });

    // assert
    expect(result.map(({ id, index }) => [id, index])).toEqual([
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['3', 3],
    ]);
  });
});
