import {
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBackOutline, IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

// components
import Button from '@common/components/Button';
import IconButton from '@common/components/IconButton';
import AddAssetsARC0200AssetItem from './AddAssetsARC0200AssetItem';
import AddAssetsARC0200AssetSummaryModalContent from './AddAssetsARC0200AssetSummaryModalContent';
import AddAssetsConfirmingModalContent from './AddAssetsConfirmingModalContent';
import Warning from '@extension/components/Warning';

// constants
import { BODY_BACKGROUND_COLOR, DEFAULT_GAP } from '@common/constants';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// features
import { addARC0200AssetHoldingsThunk } from '@extension/features/accounts';
import {
  clearAssets,
  IAssetsWithNextToken,
  IQueryARC0200AssetPayload,
  IQueryByIdAsyncThunkConfig,
  queryARC0200AssetThunk,
  setConfirming,
  setSelectedAsset,
} from '@extension/features/add-assets';
import { create as createNotification } from '@extension/features/notifications';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import usePrimaryColorScheme from '@extension/hooks/usePrimaryColorScheme';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// selectors
import {
  useSelectAccounts,
  useSelectAddAssetsAccount,
  useSelectAddAssetsARC0200Assets,
  useSelectAddAssetsConfirming,
  useSelectAddAssetsFetching,
  useSelectAddAssetsSelectedAsset,
  useSelectSettingsSelectedNetwork,
  useSelectSettingsPreferredBlockExplorer,
  useSelectSettings,
  useSelectSettingsColorMode,
} from '@extension/selectors';

// theme
import { theme } from '@common/theme';

// types
import type {
  IAccountInformation,
  IAppThunkDispatch,
  IAppThunkDispatchReturn,
  IARC0200Asset,
  IAssetTypes,
  IMainRootState,
  IModalProps,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import isNumericString from '@extension/utils/isNumericString';
import isReKeyedAuthAccountAvailable from '@extension/utils/isReKeyedAuthAccountAvailable';

const AddAssetsForWatchAccountModal: FC<IModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  const assetContainerRef = useRef<HTMLDivElement | null>(null);
  // selectors
  const account = useSelectAddAssetsAccount();
  const accounts = useSelectAccounts();
  const arc0200Assets = useSelectAddAssetsARC0200Assets();
  const confirming = useSelectAddAssetsConfirming();
  const colorMode = useSelectSettingsColorMode();
  const explorer = useSelectSettingsPreferredBlockExplorer();
  const fetching = useSelectAddAssetsFetching();
  const selectedNetwork = useSelectSettingsSelectedNetwork();
  const selectedAsset = useSelectAddAssetsSelectedAsset();
  const { appearance } = useSelectSettings();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // state
  const [query, setQuery] = useState<string>('');
  const [queryARC0200AssetDispatch, setQueryARC0200AssetDispatch] =
    useState<IAppThunkDispatchReturn<
      IQueryARC0200AssetPayload,
      IQueryByIdAsyncThunkConfig,
      IAssetsWithNextToken<IARC0200Asset>
    > | null>(null);
  // misc
  const isOpen = useMemo<boolean>(() => {
    let accountInformation: IAccountInformation | null;

    if (!account || !selectedNetwork) {
      return false;
    }

    accountInformation = AccountRepository.extractAccountInformationForNetwork(
      account,
      selectedNetwork
    );

    // if the account has been re-keyed, check that the address is not available, i.e. is abstractly a watch account
    if (accountInformation && accountInformation.authAddress) {
      return !isReKeyedAuthAccountAvailable({
        accounts,
        authAddress: accountInformation.authAddress,
      });
    }

    // otherwise, just check if it is actually a watch account
    return account.watchAccount;
  }, [account, accounts, selectedNetwork]);
  // handlers
  const handleAddARC0200AssetClick = async () => {
    if (
      !selectedNetwork ||
      !account ||
      !selectedAsset ||
      selectedAsset.type === AssetTypeEnum.Standard
    ) {
      return;
    }

    dispatch(setConfirming(true));

    try {
      await dispatch(
        addARC0200AssetHoldingsThunk({
          accountId: account.id,
          assets: [selectedAsset],
          genesisHash: selectedNetwork.genesisHash,
        })
      ).unwrap();

      dispatch(
        createNotification({
          title: t<string>('headings.addedAsset', {
            symbol: selectedAsset.symbol,
          }),
          type: 'success',
        })
      );

      handleClose();
    } catch (error) {
      switch (error.code) {
        case ErrorCodeEnum.OfflineError:
          dispatch(
            createNotification({
              ephemeral: true,
              title: t<string>('headings.offline'),
              type: 'error',
            })
          );
          break;
        default:
          dispatch(
            createNotification({
              description: t<string>('errors.descriptions.code', {
                code: error.code,
                context: error.code,
              }),
              ephemeral: true,
              title: t<string>('errors.titles.code', { context: error.code }),
              type: 'error',
            })
          );
          break;
      }
    }

    dispatch(setConfirming(false));
  };
  const handleCancelClick = () => handleClose();
  const handleClearQuery = () => {
    setQuery('');
    dispatch(clearAssets());
  };
  const handleClose = () => {
    setQuery('');
    setQueryARC0200AssetDispatch(null);
    onClose && onClose();
  };
  const handleKeyUp = () => {
    // if the query is empty, clear assets
    if (query.length <= 0) {
      dispatch(clearAssets());
    }

    if (!account || !isNumericString(query)) {
      return;
    }

    // abort the previous arc200 assets request
    if (queryARC0200AssetDispatch) {
      queryARC0200AssetDispatch.abort();
    }

    setQueryARC0200AssetDispatch(
      dispatch(
        queryARC0200AssetThunk({
          accountId: account.id,
          applicationId: query,
          refresh: true,
        })
      )
    );
  };
  const handleOnQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNumericString(event.target.value)) {
      return;
    }

    setQuery(event.target.value);
  };
  const handlePreviousClick = () => dispatch(setSelectedAsset(null));
  const handleSelectAssetClick = (asset: IAssetTypes) =>
    dispatch(setSelectedAsset(asset));
  // renders
  const renderContent = () => {
    if (selectedNetwork && account) {
      if (selectedAsset && selectedAsset.type === AssetTypeEnum.ARC0200) {
        if (confirming) {
          return (
            <AddAssetsConfirmingModalContent
              colorMode={colorMode}
              asset={selectedAsset}
            />
          );
        }

        return (
          <AddAssetsARC0200AssetSummaryModalContent
            asset={selectedAsset}
            blockExplorer={explorer}
            network={selectedNetwork}
          />
        );
      }
    }

    return (
      <VStack flexGrow={1} spacing={DEFAULT_GAP / 2} w="full">
        <VStack px={DEFAULT_GAP} spacing={DEFAULT_GAP / 2} w="full">
          {/*descriptions*/}
          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            w="full"
          >
            {t<string>('captions.addAssetForWatchAccount')}
          </Text>

          {/*warning*/}
          <Warning
            message={t('captions.addAssetForWatchAccountWarning')}
            size="xs"
          />

          {/*search*/}
          <InputGroup w="full">
            <Input
              colorScheme={primaryColorScheme}
              focusBorderColor={primaryColor}
              onChange={handleOnQueryChange}
              onKeyUp={handleKeyUp}
              size="md"
              type="text"
              value={query}
              w="full"
            />

            <InputRightElement>
              {fetching && (
                <Spinner
                  thickness="1px"
                  speed="0.65s"
                  color={defaultTextColor}
                  size="sm"
                />
              )}
              {!fetching && query.length > 0 && (
                <IconButton
                  aria-label="Clear query"
                  colorMode={appearance.theme}
                  icon={IoCloseOutline}
                  onClick={handleClearQuery}
                  size="sm"
                  variant="ghost"
                />
              )}
            </InputRightElement>
          </InputGroup>
        </VStack>

        {/*asset list*/}
        <VStack
          flexGrow={1}
          overflowY="scroll"
          ref={assetContainerRef}
          spacing={0}
          w="full"
        >
          {selectedNetwork &&
            arc0200Assets.map((asset, index) => (
              <AddAssetsARC0200AssetItem
                added={
                  selectedNetwork &&
                  !!account?.networkInformation[
                    convertGenesisHashToHex(selectedNetwork.genesisHash)
                  ].arc200AssetHoldings.find((value) => value.id === asset.id)
                }
                asset={asset}
                key={`add-asset-modal-item-${index}`}
                network={selectedNetwork}
                onClick={handleSelectAssetClick}
              />
            ))}
        </VStack>
      </VStack>
    );
  };
  const renderFooter = () => {
    if (confirming) {
      return null;
    }

    if (selectedAsset) {
      return (
        <HStack spacing={DEFAULT_GAP - 2} w="full">
          <Button
            colorMode={appearance.theme}
            leftIcon={<IoArrowBackOutline />}
            onClick={handlePreviousClick}
            size="lg"
            variant="outline"
            w="full"
          >
            {t<string>('buttons.previous')}
          </Button>

          <Button
            colorMode={appearance.theme}
            onClick={handleAddARC0200AssetClick}
            size="lg"
            variant="solid"
            w="full"
          >
            {t<string>('buttons.addAsset')}
          </Button>
        </HStack>
      );
    }

    return (
      <Button
        colorMode={appearance.theme}
        onClick={handleCancelClick}
        size="lg"
        variant="outline"
        w="full"
      >
        {t<string>('buttons.cancel')}
      </Button>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={handleClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent
        backgroundColor={BODY_BACKGROUND_COLOR}
        borderTopRadius={theme.radii['3xl']}
        borderBottomRadius={0}
      >
        <ModalHeader display="flex" justifyContent="center" px={DEFAULT_GAP}>
          <Heading color={defaultTextColor} size="md" textAlign="center">
            {t<string>('headings.addAsset')}
          </Heading>
        </ModalHeader>

        <ModalBody display="flex" px={0}>
          {renderContent()}
        </ModalBody>

        <ModalFooter p={DEFAULT_GAP}>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAssetsForWatchAccountModal;
