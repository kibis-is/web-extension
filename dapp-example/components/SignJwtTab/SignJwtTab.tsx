import { generate as generateUUID } from '@agoralabs-sh/uuid';
import { IBaseResult, ISignBytesResult } from '@agoralabs-sh/avm-web-provider';
import {
  Button,
  Code,
  CreateToastFnReturn,
  Grid,
  HStack,
  Icon,
  TabPanel,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { encodeURLSafe as encodeBase64Url } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { verifyBytes } from 'algosdk';
import React, { ChangeEvent, FC, useState } from 'react';
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from 'react-icons/io5';

// enums
import { ConnectionTypeEnum } from '../../enums';

// hooks
import useDefaultTextColor from '../../hooks/useDefaultTextColor';
import usePrimaryColorScheme from '../../hooks/usePrimaryColorScheme';
import useSubTextColor from '../../hooks/useSubTextColor';

// theme
import { theme } from '@common/theme';

// types
import { IAccountInformation } from '../../types';

// utils
import { isValidJwt } from '../../utils';

interface IProps {
  account: IAccountInformation | null;
  connectionType: ConnectionTypeEnum | null;
}

function createSignatureToSign(header: string, payload: string): Uint8Array {
  const encoder: TextEncoder = new TextEncoder();
  const rawHeader: Uint8Array = encoder.encode(
    JSON.stringify(JSON.parse(header))
  );
  const rawPayload: Uint8Array = encoder.encode(
    JSON.stringify(JSON.parse(payload))
  );

  return encoder.encode(
    `${encodeBase64Url(rawHeader)}.${encodeBase64Url(rawPayload)}`
  );
}

const SignJwtTab: FC<IProps> = ({ account }: IProps) => {
  const toast: CreateToastFnReturn = useToast({
    duration: 3000,
    isClosable: true,
    position: 'top',
  });
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColorScheme = usePrimaryColorScheme();
  // states
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [signedData, setSignedData] = useState<Uint8Array | null>(null);
  // misc
  const encoder: TextEncoder = new TextEncoder();
  // handlers
  const handleClearClick = () => {
    setHeader('');
    setPayload('');
    setSignedData(null);
  };
  const handleSignJwtClick = (withSigner: boolean) => async () => {
    let result: IBaseResult & ISignBytesResult;

    if (!header || !payload) {
      toast({
        description: 'You must add header and payload.',
        status: 'error',
        title: 'No Data Provided!',
      });

      return;
    }

    if (!isValidJwt(header, payload)) {
      toast({
        status: 'error',
        title: 'Invalid JWT!',
      });

      return;
    }

    // if (!algorand) {
    //   toast({
    //     description:
    //       'Algorand Provider has been intialized; there is no supported wallet.',
    //     status: 'error',
    //     title: 'window.algorand Not Found!',
    //   });
    //
    //   return;
    // }
    //
    // try {
    //   result = await algorand.signBytes({
    //     data: createSignatureToSign(header, payload),
    //     ...(withSigner && {
    //       signer: account?.address || undefined,
    //     }),
    //   });
    //
    //   toast({
    //     description: `Successfully signed JWT for wallet "${result.id}".`,
    //     status: 'success',
    //     title: 'JWT Signed!',
    //   });
    //
    //   setSignedData(result.signature);
    // } catch (error) {
    //   toast({
    //     description: (error as BaseError).message,
    //     status: 'error',
    //     title: `${(error as BaseError).code}: ${(error as BaseError).name}`,
    //   });
    // }
  };
  const handleHeaderTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setHeader(event.target.value);
  const handlePayloadTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => setPayload(event.target.value);
  const handleVerifySignedJWT = () => {
    let verifiedResult: boolean;

    if (!header || !payload || !signedData || !account) {
      toast({
        status: 'error',
        title: 'No Data To Verify!',
      });

      return;
    }

    verifiedResult = verifyBytes(
      createSignatureToSign(header, payload),
      signedData,
      account.address
    ); // verify using the algosdk

    if (!verifiedResult) {
      toast({
        description: 'The signed data failed verification',
        status: 'error',
        title: 'Signed Data is Invalid!',
      });

      return;
    }

    toast({
      description: 'The signed data has been verified.',
      status: 'success',
      title: 'Signed Data is Valid!',
    });
  };
  const handleUseJwtPreset = () => {
    const now: number = new Date().getTime(); // now in milliseconds

    if (!account) {
      toast({
        description: 'You must first enable the dApp with the wallet.',
        status: 'error',
        title: 'No Account Not Found!',
      });

      return;
    }

    setHeader(`{
  "alg": "EdDSA",
  "crv": "Ed25519",
  "typ": "JWT"
}`);
    setPayload(`{
  "aud": "${window.location.protocol}//${window.location.host}",
  "exp": ${now + 300000},
  "iat": ${now},
  "iss": "did:algo:${account.address}",
  "jti": "${generateUUID()}",
  "gty": "did",
  "sub": "${account.address}"
}`);
  };

  return (
    <TabPanel w="full">
      <VStack justifyContent="center" spacing={8} w="full">
        {/*header*/}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="sm">
            Header:
          </Text>
          <Textarea
            onChange={handleHeaderTextareaChange}
            placeholder={`A valid JWT header, e.g.:
{
  "alg": "EdDSA",
  "crv": "Ed25519",
  "typ": "JWT"
}
            `}
            rows={5}
            value={header || ''}
          />
          <HStack spacing={2} w="full">
            <Text color={defaultTextColor} fontSize="sm">
              Encoded:
            </Text>
            {header && (
              <Code fontSize="sm" wordBreak="break-word">
                {encodeBase64Url(
                  encoder.encode(JSON.stringify(JSON.parse(header)))
                )}
              </Code>
            )}
          </HStack>
        </VStack>
        {/* Payload */}
        <VStack alignItems="flex-start" spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="sm">
            Payload:
          </Text>
          <Textarea
            onChange={handlePayloadTextareaChange}
            placeholder={`A valid JWT payload, e.g.:
{
  "aud": "https://exmaple.com",
  "exp": 109282718234,
  ...
}
            `}
            rows={9}
            value={payload || ''}
          />
          <HStack spacing={2} w="full">
            <Text color={defaultTextColor} fontSize="sm">
              Encoded:
            </Text>
            {payload && (
              <Code fontSize="sm" wordBreak="break-word">
                {encodeBase64Url(
                  encoder.encode(JSON.stringify(JSON.parse(payload)))
                )}
              </Code>
            )}
          </HStack>
        </VStack>

        {/*valid*/}
        <HStack spacing={2}>
          <Text color={defaultTextColor} fontSize="sm">
            Is JWT Valid:
          </Text>
          {isValidJwt(header, payload) ? (
            <Icon as={IoCheckmarkCircleSharp} color="green.500" size="md" />
          ) : (
            <Icon as={IoCloseCircleSharp} color="red.500" size="md" />
          )}
        </HStack>

        {/*signed data*/}
        <HStack spacing={2} w="full">
          <Text color={defaultTextColor} fontSize="sm">
            Encoded signed data (hex):
          </Text>
          {signedData && (
            <Code fontSize="sm" wordBreak="break-word">
              {encodeHex(signedData).toUpperCase()}
            </Code>
          )}
        </HStack>

        {/*ctas*/}
        <Grid gap={2} templateColumns="repeat(2, 1fr)" w="full">
          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme="primaryLight"
            minW={250}
            onClick={handleUseJwtPreset}
            size="lg"
          >
            Use JWT Preset
          </Button>

          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            minW={250}
            onClick={handleSignJwtClick(true)}
            size="lg"
          >
            Sign JWT
          </Button>

          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            minW={250}
            onClick={handleSignJwtClick(false)}
            size="lg"
          >
            Sign JWT Without Signer
          </Button>

          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            isDisabled={!signedData}
            minW={250}
            onClick={handleVerifySignedJWT}
            size="lg"
          >
            Verify Signed JWT
          </Button>

          <Button
            borderRadius={theme.radii['3xl']}
            colorScheme={primaryColorScheme}
            minW={250}
            onClick={handleClearClick}
            size="lg"
            variant="outline"
          >
            Clear
          </Button>
        </Grid>
      </VStack>
    </TabPanel>
  );
};

export default SignJwtTab;
