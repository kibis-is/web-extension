import {
  Center,
  Flex,
  Icon,
  IconButton,
  Heading,
  HStack,
  Select,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

// components
import ConnectMenu from '../ConnectMenu';
import EnabledAccountsTable from '../EnabledAccountsTable';
import ImportAccountViaQRCodeTab from '../ImportAccountViaQRCodeTab';
import SendKeyRegistrationViaURITab from '../SendKeyRegistrationViaURITab';
import SignApplicationTransactionTab from '../SignApplicationTransactionTab';
import SignAssetTransactionTab from '../SignAssetTransactionTab';
import SignAtomicTransactionsTab from '../SignAtomicTransactionsTab';
import SignKeyRegistrationTransactionTab from '../SignKeyRegistrationTransactionTab';
import SignPaymentTransactionTab from '../SignPaymentTransactionTab';
import SignMessageTab from '../SignMessageTab';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useAVMWebProviderConnector from '../../hooks/useAVMWebProviderConnector';
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import usePrimaryColorScheme from '../../hooks/usePrimaryColorScheme';
import useSubTextColor from '../../hooks/useSubTextColor';
import useUseWalletConnector from '../../hooks/useUseWalletConnector';
import useWalletConnectConnector from '../../hooks/useWalletConnectConnector';

// types
import type { INetwork } from '@extension/types';
import type { IAccountInformation, IBaseTransactionProps } from '../../types';
import type { IOnConnectParams } from '../ConnectMenu';

const Root: FC = () => {
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  const { colorMode, toggleColorMode } = useColorMode();
  // hooks
  const {
    connectAction: avmWebProviderConnectAction,
    disconnectAction: avmWebProviderDisconnectAction,
    enabledAccounts: avmWebProviderEnabledAccounts,
    signMessageAction: avmWebProviderSignMessageAction,
    signTransactionsAction: avmWebProviderSignTransactionsAction,
  } = useAVMWebProviderConnector({ toast });
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  const subTextColor = useSubTextColor();
  const {
    connectAction: useWalletConnectAction,
    disconnectAction: useWalletDisconnectAction,
    enabledAccounts: useWalletEnabledAccounts,
    signTransactionsAction: useWalletSignTransactionsAction,
  } = useUseWalletConnector({ toast });
  const {
    connectAction: walletConnectConnectAction,
    disconnectAction: walletConnectDisconnectAction,
    enabledAccounts: walletConnectEnabledAccounts,
    signTransactionsAction: walletConnectSignTransactionsAction,
  } = useWalletConnectConnector({ toast });
  // states
  const [connectionType, setConnectionType] =
    useState<ConnectionTypeEnum | null>(null);
  const [enabledAccounts, setEnabledAccounts] = useState<IAccountInformation[]>(
    []
  );
  const [selectedAccount, setSelectedAccount] =
    useState<IAccountInformation | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<INetwork | null>(null);
  // handlers
  const handleAddressSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const account: IAccountInformation | null =
      enabledAccounts.find((value) => value.address === event.target.value) ||
      null;

    if (account) {
      setSelectedAccount(account);
    }
  };
  const handleConnect = async ({
    connectionType,
    network,
  }: IOnConnectParams) => {
    let result: boolean = false;

    switch (connectionType) {
      case ConnectionTypeEnum.AVMWebProvider:
        result = await avmWebProviderConnectAction(network);
        break;
      case ConnectionTypeEnum.UseWallet:
        result = await useWalletConnectAction(network);
        break;
      case ConnectionTypeEnum.WalletConnect:
        result = await walletConnectConnectAction(network);
        break;
      default:
        break;
    }

    if (!result) {
      return;
    }

    setConnectionType(connectionType);
    setSelectedNetwork(network);
  };
  const handleDisconnect = async () => {
    switch (connectionType) {
      case ConnectionTypeEnum.AVMWebProvider:
        await avmWebProviderDisconnectAction();
        break;
      case ConnectionTypeEnum.UseWallet:
        await useWalletDisconnectAction();
        break;
      case ConnectionTypeEnum.WalletConnect:
        await walletConnectDisconnectAction();
        break;
      default:
        break;
    }

    setConnectionType(null);
    setSelectedNetwork(null);
  };
  const handleOnChangeColorMode = () => toggleColorMode();
  // renders
  const renderContent = () => {
    let signTransactionProps: IBaseTransactionProps;

    switch (connectionType) {
      case ConnectionTypeEnum.AVMWebProvider:
        signTransactionProps = {
          account: selectedAccount,
          connectionType,
          network: selectedNetwork,
          signTransactionsAction: avmWebProviderSignTransactionsAction,
        };

        return (
          <Tabs colorScheme={primaryColorScheme} w="full">
            <TabList>
              <Tab>
                <Text fontSize="sm">Sign Payment Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Asset Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Atomic Transactions</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Application Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Key Registration Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Message</Text>
              </Tab>

              <Tab>
                <Text fontSize="sm">Import Account Via QR Code</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Send Key Registration Via URI</Text>
              </Tab>
            </TabList>

            <TabPanels>
              <SignPaymentTransactionTab {...signTransactionProps} />

              <SignAssetTransactionTab {...signTransactionProps} />

              <SignAtomicTransactionsTab {...signTransactionProps} />

              <SignApplicationTransactionTab {...signTransactionProps} />

              <SignKeyRegistrationTransactionTab {...signTransactionProps} />

              <SignMessageTab
                account={selectedAccount}
                signMessageAction={avmWebProviderSignMessageAction}
              />

              <ImportAccountViaQRCodeTab />

              <SendKeyRegistrationViaURITab
                account={selectedAccount}
                network={selectedNetwork}
              />
            </TabPanels>
          </Tabs>
        );
      case ConnectionTypeEnum.UseWallet:
        signTransactionProps = {
          account: selectedAccount,
          connectionType,
          network: selectedNetwork,
          signTransactionsAction: useWalletSignTransactionsAction,
        };

        return (
          <Tabs colorScheme={primaryColorScheme} w="full">
            <TabList>
              <Tab>
                <Text fontSize="sm">Sign Payment Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Asset Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Atomic Transactions</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Application Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Key Registration Transaction</Text>
              </Tab>

              <Tab>
                <Text fontSize="sm">Import Account Via QR Code</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Send Key Registration Via URI</Text>
              </Tab>
            </TabList>

            <TabPanels>
              <SignPaymentTransactionTab {...signTransactionProps} />

              <SignAssetTransactionTab {...signTransactionProps} />

              <SignAtomicTransactionsTab {...signTransactionProps} />

              <SignApplicationTransactionTab {...signTransactionProps} />

              <SignKeyRegistrationTransactionTab {...signTransactionProps} />

              <ImportAccountViaQRCodeTab />

              <SendKeyRegistrationViaURITab
                account={selectedAccount}
                network={selectedNetwork}
              />
            </TabPanels>
          </Tabs>
        );

      case ConnectionTypeEnum.WalletConnect:
        signTransactionProps = {
          account: selectedAccount,
          connectionType,
          network: selectedNetwork,
          signTransactionsAction: walletConnectSignTransactionsAction,
        };

        return (
          <Tabs colorScheme={primaryColorScheme} w="full">
            <TabList>
              <Tab>
                <Text fontSize="sm">Sign Payment Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Asset Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Atomic Transactions</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Application Transaction</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Sign Key Registration Transaction</Text>
              </Tab>

              <Tab>
                <Text fontSize="sm">Import Account Via QR Code</Text>
              </Tab>
              <Tab>
                <Text fontSize="sm">Send Key Registration Via URI</Text>
              </Tab>
            </TabList>

            <TabPanels>
              <SignPaymentTransactionTab {...signTransactionProps} />

              <SignAssetTransactionTab {...signTransactionProps} />

              <SignAtomicTransactionsTab {...signTransactionProps} />

              <SignApplicationTransactionTab {...signTransactionProps} />

              <SignKeyRegistrationTransactionTab {...signTransactionProps} />

              <ImportAccountViaQRCodeTab />

              <SendKeyRegistrationViaURITab
                account={selectedAccount}
                network={selectedNetwork}
              />
            </TabPanels>
          </Tabs>
        );
      default:
        return (
          <Tabs colorScheme={primaryColorScheme} w="full">
            <TabList>
              <Tab>
                <Text fontSize="sm">Import Account Via QR Code</Text>
              </Tab>
            </TabList>

            <TabPanels>
              <ImportAccountViaQRCodeTab />
            </TabPanels>
          </Tabs>
        );
    }
  };

  useEffect(() => {
    switch (connectionType) {
      case ConnectionTypeEnum.AVMWebProvider:
        setEnabledAccounts(avmWebProviderEnabledAccounts);
        break;
      case ConnectionTypeEnum.UseWallet:
        setEnabledAccounts(useWalletEnabledAccounts);
        break;
      case ConnectionTypeEnum.WalletConnect:
        setEnabledAccounts(walletConnectEnabledAccounts);
        break;
      default:
        setEnabledAccounts([]);
        break;
    }
  }, [
    avmWebProviderEnabledAccounts,
    useWalletEnabledAccounts,
    walletConnectEnabledAccounts,
  ]);
  useEffect(
    () => setSelectedAccount(enabledAccounts[0] || null),
    [enabledAccounts]
  );

  return (
    <Center as="main" backgroundColor={BODY_BACKGROUND_COLOR}>
      <Flex
        alignItems="center"
        direction="column"
        minH="100vh"
        maxW={1024}
        px={DEFAULT_GAP}
        pb={DEFAULT_GAP}
        pt={DEFAULT_GAP - 2}
        w="full"
      >
        <VStack spacing={8} w="full">
          <HStack
            alignItems="flex-start"
            justifyContent="space-between"
            w="full"
          >
            <IconButton
              aria-label="Change color mode"
              icon={
                <Icon
                  as={colorMode === 'light' ? IoMoonOutline : IoSunnyOutline}
                  color={subTextColor}
                />
              }
              onClick={handleOnChangeColorMode}
              variant="ghost"
            />

            {/*title*/}
            <VStack flexGrow={1}>
              <Heading color={defaultTextColor} textAlign="center" w="full">
                {document.title}
              </Heading>

              <Text
                color={subTextColor}
                fontSize="sm"
                textAlign="center"
                w="full"
              >
                [FOR DEVELOPMENT PURPOSES ONLY]
              </Text>
            </VStack>

            {/*connect menu*/}
            <ConnectMenu
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              toast={toast}
            />
          </HStack>

          {/*enabled accounts table*/}
          <EnabledAccountsTable
            enabledAccounts={enabledAccounts}
            connectionType={connectionType}
            network={selectedNetwork}
          />

          {/*select address*/}
          <HStack spacing={DEFAULT_GAP / 3} w="full">
            <Text color={defaultTextColor}>Address:</Text>

            <Select
              color={defaultTextColor}
              onChange={handleAddressSelect}
              placeholder="Select an address"
              value={selectedAccount?.address || undefined}
            >
              {enabledAccounts.map((value, index) => (
                <option key={`address-option-${index}`} value={value.address}>
                  {value.address}
                </option>
              ))}
            </Select>
          </HStack>

          {/*tabs*/}
          {renderContent()}
        </VStack>
      </Flex>
    </Center>
  );
};

export default Root;
