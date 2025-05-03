import { Heading, Text, VStack } from '@chakra-ui/react';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// components
import Button from '@common/components/Button';
import KibisisIcon from '@extension/components/icons/KibisisIcon';

// constants
import { DEFAULT_GAP } from '@common/constants';
import { CREATE_PASSWORD_ROUTE } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import { useSelectSettingsColorMode } from '@extension/selectors';

// utils
import calculateIconSize from '@common/utils/calculateIconSize';

const GetStartedPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // selectors
  const colorMode = useSelectSettingsColorMode();
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();
  const subTextColor = useSubTextColor();
  // misc
  const iconSize = calculateIconSize('xl');
  // handlers
  const handleGetStartedClick = () => navigate(CREATE_PASSWORD_ROUTE);

  return (
    <VStack
      flexGrow={1}
      pb={DEFAULT_GAP}
      px={DEFAULT_GAP}
      spacing={DEFAULT_GAP / 3}
      w="full"
    >
      <VStack
        flexGrow={1}
        justifyContent="center"
        spacing={DEFAULT_GAP / 3}
        w="full"
      >
        <KibisisIcon color={primaryColor} boxSize={iconSize} />

        <Heading color={defaultTextColor}>{__APP_TITLE__}</Heading>

        {__VERSION__ && (
          <Text color={subTextColor} fontSize="sm">{`v${__VERSION__}`}</Text>
        )}
      </VStack>

      <Button
        colorMode={colorMode}
        onClick={handleGetStartedClick}
        rightIcon={<IoArrowForwardOutline />}
        size="lg"
        w="full"
      >
        {t<string>('buttons.getStarted')}
      </Button>
    </VStack>
  );
};

export default GetStartedPage;
