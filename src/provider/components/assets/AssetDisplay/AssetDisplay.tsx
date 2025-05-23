import { HStack, ResponsiveValue, Text, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import * as CSS from 'csstype';
import React, { FC, ReactNode } from 'react';

// hooks
import useDefaultTextColor from '@provider/hooks/useDefaultTextColor';

// utils
import convertToStandardUnit from '@common/utils/convertToStandardUnit';
import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';

interface IProps {
  amountColor?: ResponsiveValue<CSS.Property.Color>;
  atomicUnitAmount: BigNumber;
  decimals: number;
  displayUnit?: boolean;
  displayUnitColor?: ResponsiveValue<CSS.Property.Color>;
  fontSize?: ResponsiveValue<CSS.Property.FontSize | number>;
  icon?: ReactNode;
  prefix?: '+' | '-';
  unit?: string;
}

const AssetDisplay: FC<IProps> = ({
  amountColor,
  atomicUnitAmount,
  decimals,
  displayUnit = false,
  displayUnitColor,
  fontSize = 'sm',
  icon,
  prefix,
  unit,
}: IProps) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();

  return (
    <Tooltip label={`${convertToStandardUnit(atomicUnitAmount, decimals).toString()}${unit ? ` ${unit}` : ''}`}>
      <HStack spacing={1}>
        <Text color={amountColor || defaultTextColor} fontSize={fontSize}>
          {`${prefix || ''}${formatCurrencyUnit(convertToStandardUnit(atomicUnitAmount, decimals), { decimals })}`}
        </Text>

        {icon}

        {displayUnit && unit && (
          <Text color={displayUnitColor || defaultTextColor} fontSize={fontSize}>
            {unit}
          </Text>
        )}
      </HStack>
    </Tooltip>
  );
};

export default AssetDisplay;
