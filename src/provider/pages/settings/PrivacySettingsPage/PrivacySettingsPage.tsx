import { VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';

// components
import PageHeader from '@provider/components/pages/PageHeader';
import SettingsExternalLinkItem from '@provider/components/settings/SettingsExternalLinkItem';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { KIBISIS_LINK } from '@provider/constants';

// selectors
import { useSelectSettingsColorMode } from '@provider/selectors';

const PrivacySettingsPage: FC = () => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();

  return (
    <>
      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'privacy' })} />

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*privacy policy link*/}
        <SettingsExternalLinkItem label={t<string>('labels.privacyPolicy')} to={`${KIBISIS_LINK}/privacy-policy`} />
      </VStack>
    </>
  );
};

export default PrivacySettingsPage;
