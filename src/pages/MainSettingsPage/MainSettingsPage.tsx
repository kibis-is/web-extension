import { Heading, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoConstructOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

// Components
import SettingsLinkItem from '../../components/SettingsLinkItem';

// Constants
import { ADVANCED_ROUTE, DEFAULT_GAP, SETTINGS_ROUTE } from '../../constants';

const MainSettingsPage: FC = () => {
  const { t } = useTranslation();

  return (
    <VStack flexGrow={1} pt={4} w="full">
      <Heading
        color="gray.500"
        pb={DEFAULT_GAP - 2}
        px={DEFAULT_GAP - 2}
        size="md"
        textAlign="left"
        w="full"
      >
        {t<string>('titles.page', { context: 'settings' })}
      </Heading>
      <SettingsLinkItem
        icon={IoConstructOutline}
        label={t<string>('titles.page', { context: 'advanced' })}
        to={`${SETTINGS_ROUTE}${ADVANCED_ROUTE}`}
      />
      <Spacer />
      <Text color="gray.500" fontSize="sm" py={4} textAlign="center" w="full">
        {`v${__VERSION__}`}
      </Text>
    </VStack>
  );
};

export default MainSettingsPage;