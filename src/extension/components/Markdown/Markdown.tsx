import {
  Alert,
  Code,
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import React, { type FC } from 'react';
import ReactMarkdown from 'react-markdown';

// components
import Link from '@extension/components/Link';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IProps } from './types';

const Markdown: FC<IProps> = ({ sourceAsString }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor();
  const primaryColor = usePrimaryColor();

  return (
    <ReactMarkdown
      children={sourceAsString}
      components={{
        a: ({ children, href }) => (
          <Link fontSize="sm" href={href} isExternal={true}>
            {children}
          </Link>
        ),
        blockquote: ({ children }) => (
          <Alert status="warning" variant="left-accent">
            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {children}
            </Text>
          </Alert>
        ),
        code: ({ children }) => <Code>{children}</Code>,
        h1: ({ children }) => (
          <Heading color={primaryColor} fontSize="lg" textAlign="left" w="full">
            {children}
          </Heading>
        ),
        h2: ({ children }) => (
          <Heading color={primaryColor} fontSize="md" textAlign="left" w="full">
            {children}
          </Heading>
        ),
        h3: ({ children }) => (
          <Heading color={primaryColor} fontSize="sm" textAlign="left" w="full">
            {children}
          </Heading>
        ),
        li: ({ children }) => <ListItem>{children}</ListItem>,
        ol: ({ children }) => <OrderedList w="full">{children}</OrderedList>,
        p: ({ children }) => (
          <Text
            color={defaultTextColor}
            fontSize="sm"
            textAlign="left"
            w="full"
          >
            {children}
          </Text>
        ),
        ul: ({ children }) => (
          <UnorderedList w="full">
            <Text
              color={defaultTextColor}
              fontSize="sm"
              textAlign="left"
              w="full"
            >
              {children}
            </Text>
          </UnorderedList>
        ),
      }}
    />
  );
};

export default Markdown;
