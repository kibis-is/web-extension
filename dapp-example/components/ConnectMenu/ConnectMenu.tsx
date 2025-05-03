import {
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { randomString } from '@stablelib/random';
import React, { type FC, Fragment, useMemo } from 'react';

// constants
import { DEFAULT_GAP } from '@common/constants';

// config
import { networks } from '@extension/config';

// enums
import { NetworkTypeEnum } from '@extension/enums';
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';

// types
import type { IHandleConnectParams, IProps } from './types';

// utils
import { parseConnectorType } from '../../utils';

const ConnectMenu: FC<IProps> = ({ onConnect, onDisconnect, toast }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  // memos
  const _networks = useMemo(
    () => networks.filter(({ type }) => type === NetworkTypeEnum.Test),
    []
  );
  const context = useMemo(() => randomString(8), []);
  // handlers
  const handleConnect = (params: IHandleConnectParams) => () => {
    const network =
      networks.find((value) => value.genesisHash === params.genesisHash) ||
      null;

    // if there is no known network, just error early
    if (!network) {
      toast({
        description: `Network "${params.genesisHash}" not found`,
        status: 'error',
        title: `Unknown Network`,
      });

      return;
    }

    onConnect({
      connectionType: params.connectionType,
      network,
    });
  };
  const handleDisconnect = () => onDisconnect();
  // renders
  const renderNetworkTag = () => (
    <Tag colorScheme="yellow" size="sm" variant="solid">
      <TagLabel>TestNet</TagLabel>
    </Tag>
  );

  return (
    <Menu>
      <MenuButton
        _hover={{ bg: 'gray.400' }}
        _expanded={{ bg: 'primary.400' }}
        _focus={{ boxShadow: 'outline' }}
        color={defaultTextColor}
        px={DEFAULT_GAP - 2}
        py={DEFAULT_GAP / 3}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
      >
        Connect <ChevronDownIcon />
      </MenuButton>

      <MenuList>
        {[
          ConnectionTypeEnum.AVMWebProvider,
          ConnectionTypeEnum.UseWallet,
          ConnectionTypeEnum.WalletConnect,
        ].map((connectionType, connectorIndex, array) => {
          const dividerElement =
            connectorIndex < array.length - 1 ? <MenuDivider /> : null;

          return (
            <Fragment key={`${context}-connector-item-${connectorIndex}`}>
              {connectorIndex === 0 && dividerElement}

              <MenuGroup
                color={defaultTextColor}
                title={parseConnectorType(connectionType)}
              >
                {_networks.map((network, networkIndex) => (
                  <MenuItem
                    key={`${context}-${network.genesisHash.slice(
                      0,
                      5
                    )}-network-item-${networkIndex}`}
                    onClick={handleConnect({
                      connectionType,
                      genesisHash: network.genesisHash,
                    })}
                  >
                    <HStack alignItems="center" w="full">
                      <Text color={defaultTextColor} size="sm">
                        {`Connect to ${network.canonicalName}`}
                      </Text>

                      {renderNetworkTag()}
                    </HStack>
                  </MenuItem>
                ))}
              </MenuGroup>

              {dividerElement}
            </Fragment>
          );
        })}

        <MenuDivider />

        <MenuItem onClick={handleDisconnect}>
          <Text color={defaultTextColor} size="sm" w="full">
            Disconnect
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ConnectMenu;
