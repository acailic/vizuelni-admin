/**
 * @file ChatInterface.tsx
 * @description Conversational AI interface with message history
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack, Text, Flex, IconButton } from '@chakra-ui/react';
import {
  ArrowPathIcon,
  BookmarkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { QueryInput, QuerySuggestion } from './QueryInput';
import { InsightDisplay, Insight } from './InsightDisplay';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string | React.ReactNode;
  insights?: Insight[];
  timestamp: Date;
  chartConfig?: any;
}

export interface ChatInterfaceProps {
  messages: Message[];
  onQuerySubmit: (query: string) => void;
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en';
  isLoading?: boolean;
  suggestions?: QuerySuggestion[];
  onBookmark?: (message: Message) => void;
  onShare?: (message: Message) => void;
  onRetry?: (messageId: string) => void;
}

export function ChatInterface({
  messages,
  onQuerySubmit,
  locale,
  isLoading = false,
  suggestions = [],
  onBookmark,
  onShare,
  onRetry,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBookmark = (message: Message) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(message.id)) {
        newSet.delete(message.id);
      } else {
        newSet.add(message.id);
      }
      return newSet;
    });
    onBookmark?.(message);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isBookmarked = bookmarkedIds.has(message.id);

    return (
      <Box
        key={message.id}
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        maxW='80%'
        bg={isUser ? 'blue.500' : 'white'}
        color={isUser ? 'white' : 'black'}
        borderRadius='lg'
        p={4}
        shadow='md'
      >
        {/* Message content */}
        <Box mb={message.insights ? 3 : 0}>
          {typeof message.content === 'string' ? (
            <Text>{message.content}</Text>
          ) : (
            message.content
          )}
        </Box>

        {/* Insights (for assistant messages) */}
        {!isUser && message.insights && message.insights.length > 0 && (
          <Box mt={3}>
            <InsightDisplay insights={message.insights} locale={locale} />
          </Box>
        )}

        {/* Message actions */}
        <HStack justify='space-between' mt={2}>
          <Text fontSize='xs' opacity={0.7}>
            {message.timestamp.toLocaleTimeString(
              locale === 'sr-Cyrl' || locale === 'sr-Latn' ? 'sr-RS' : 'en-US',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )}
          </Text>

          {!isUser && (
            <HStack gap={1}>
              {onRetry && (
                <IconButton
                  aria-label='Retry'
                  size='xs'
                  variant='ghost'
                  onClick={() => onRetry(message.id)}
                >
                  <ArrowPathIcon style={{ width: 16, height: 16 }} />
                </IconButton>
              )}
              {onBookmark && (
                <IconButton
                  aria-label='Bookmark'
                  size='xs'
                  variant='ghost'
                  colorScheme={isBookmarked ? 'yellow' : 'gray'}
                  onClick={() => handleBookmark(message)}
                >
                  <BookmarkIcon style={{ width: 16, height: 16 }} />
                </IconButton>
              )}
              {onShare && (
                <IconButton
                  aria-label='Share'
                  size='xs'
                  variant='ghost'
                  onClick={() => onShare(message)}
                >
                  <ShareIcon style={{ width: 16, height: 16 }} />
                </IconButton>
              )}
            </HStack>
          )}
        </HStack>
      </Box>
    );
  };

  return (
    <Flex direction='column' h='100%' bg='gray.50'>
      {/* Messages area */}
      <Box flex={1} overflowY='auto' p={4}>
        <VStack gap={4} align='stretch'>
          {messages.length === 0 ? (
            <Box textAlign='center' py={10}>
              <Text fontSize='lg' color='gray.500' mb={2}>
                {locale === 'sr-Cyrl'
                  ? 'Питајте о државним подацима'
                  : locale === 'sr-Latn'
                    ? 'Pitajte o državnim podacima'
                    : 'Ask about government data'}
              </Text>
              <Text fontSize='sm' color='gray.400'>
                {locale === 'sr-Cyrl'
                  ? 'На пример: "Прикажи тренд незапослености у Београду"'
                  : locale === 'sr-Latn'
                    ? 'Na primer: "Prikaži trend nezaposlenosti u Beogradu"'
                    : 'For example: "Show unemployment trends in Belgrade"'}
              </Text>
            </Box>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input area */}
      <Box p={4} bg='white' borderTop='1px' borderColor='gray.200'>
        <QueryInput
          locale={locale}
          onSubmit={onQuerySubmit}
          suggestions={suggestions}
          isLoading={isLoading}
          enableVoice={true}
        />
      </Box>
    </Flex>
  );
}
