import { Code, HStack, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

// components
import CopyIconButton from '@provider/components/generic/CopyIconButton';
import PageHeader from '@provider/components/pages/PageHeader';
import SettingsExternalLinkItem from '@provider/components/settings/SettingsExternalLinkItem';
import SettingsTextItem from '@provider/components/settings/SettingsTextItem';
import SettingsSubHeading from '@provider/components/settings/SettingsSubHeading';

// constants
import { KIBISIS_LINK, LICENSE_LINK, SOURCE_CODE_LINK } from '@provider/constants';

// hooks
import useSubTextColor from '@provider/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode, useSelectSystemInfo } from '@provider/selectors';
import { DEFAULT_GAP } from '@common/constants';

const AboutSettingsPage: FC = () => {
  const { t } = useTranslation();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  const systemInfo = useSelectSystemInfo();
  // hooks
  const subTextColor = useSubTextColor();

  return (
    <>
      {/*header*/}
      <PageHeader colorMode={colorMode} title={t<string>('titles.page', { context: 'about' })} />

      <VStack spacing={DEFAULT_GAP - 2} w="full">
        {/*details*/}
        <VStack spacing={0} w="full">
          <SettingsSubHeading text={t<string>('headings.details')} />

          {/*extension id*/}
          <SettingsTextItem fontSize="sm" label={t<string>('labels.extensionId')}>
            <HStack alignItems="center" justifyContent="flex-end" spacing={1} w="full">
              <Code fontSize="xs" textAlign="right" w="full">
                {browser.runtime.id}
              </Code>

              <CopyIconButton
                ariaLabel={t<string>('labels.copyExtensionID')}
                tooltipLabel={t<string>('labels.copyExtensionID')}
                value={browser.runtime.id}
              />
            </HStack>
          </SettingsTextItem>

          {/*device id*/}
          {systemInfo?.deviceID && (
            <SettingsTextItem fontSize="sm" label={t<string>('labels.deviceID')}>
              <HStack alignItems="center" justifyContent="flex-end" spacing={1} w="full">
                <Code fontSize="xs" textAlign="right" w="full">
                  {systemInfo.deviceID}
                </Code>

                <CopyIconButton
                  ariaLabel={t<string>('labels.copyDeviceID')}
                  tooltipLabel={t<string>('labels.copyDeviceID')}
                  value={systemInfo.deviceID}
                />
              </HStack>
            </SettingsTextItem>
          )}

          {/*version*/}
          <SettingsTextItem fontSize="sm" label={t<string>('labels.version')}>
            <Text color={subTextColor} fontSize="xs" textAlign="right">
              {__VERSION__}
            </Text>
          </SettingsTextItem>
        </VStack>

        {/*links*/}
        <VStack spacing={0} w="full">
          <SettingsSubHeading text={t<string>('headings.links')} />

          {/*website*/}
          <SettingsExternalLinkItem label={t<string>('labels.website')} to={KIBISIS_LINK} />

          {/*source code*/}
          <SettingsExternalLinkItem label={t<string>('labels.sourceCode')} to={SOURCE_CODE_LINK} />

          {/*license*/}
          <SettingsExternalLinkItem label={t<string>('labels.license')} to={LICENSE_LINK} />
        </VStack>
      </VStack>
    </>
  );
};

export default AboutSettingsPage;
