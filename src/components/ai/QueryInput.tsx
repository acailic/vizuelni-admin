/**
 * @file QueryInput.tsx
 * @description Natural language query input component with auto-complete and voice support
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Input, IconButton, VStack, Text, Flex } from '@chakra-ui/react';
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

export interface QuerySuggestion {
  text: string;
  type: 'recent' | 'popular' | 'recommended';
}

export interface QueryInputProps {
  locale: 'sr-Cyrl' | 'sr-Latn' | 'en';
  placeholder?: string;
  onSubmit: (query: string) => void;
  suggestions?: QuerySuggestion[];
  onSuggestionSelect?: (suggestion: QuerySuggestion) => void;
  enableVoice?: boolean;
  isLoading?: boolean;
}

export function QueryInput({
  locale,
  placeholder,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
  enableVoice = true,
  isLoading = false,
}: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const placeholders = {
    'sr-Cyrl':
      'Питајте о подацима... (нпр. "Прикажи незапосленост у Београду")',
    'sr-Latn':
      'Pitajte o podacima... (npr. "Prikaži nezaposlenost u Beogradu")',
    en: 'Ask about data... (e.g., "Show unemployment in Belgrade")',
  };

  // Voice input setup
  useEffect(() => {
    if (enableVoice && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang =
        locale === 'sr-Cyrl'
          ? 'sr-RS'
          : locale === 'sr-Latn'
            ? 'sr-RS'
            : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [locale, enableVoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSuggestionClick = (suggestion: QuerySuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
  };

  return (
    <Box position='relative' width='100%'>
      <form onSubmit={handleSubmit}>
        <Flex gap={2}>
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder || placeholders[locale]}
            size='lg'
            pr={enableVoice ? '4.5rem' : '3rem'}
            disabled={isLoading}
            aria-label='Query input'
          />

          {enableVoice && (
            <IconButton
              type='button'
              aria-label='Voice input'
              onClick={handleVoiceToggle}
              colorScheme={isRecording ? 'red' : 'gray'}
              variant={isRecording ? 'solid' : 'ghost'}
              disabled={!recognitionRef.current}
            >
              <MicrophoneIcon style={{ width: 20, height: 20 }} />
            </IconButton>
          )}

          <IconButton
            type='submit'
            aria-label='Submit query'
            colorScheme='blue'
            loading={isLoading}
            disabled={!query.trim()}
          >
            <PaperAirplaneIcon style={{ width: 20, height: 20 }} />
          </IconButton>
        </Flex>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <VStack
          position='absolute'
          top='100%'
          left={0}
          right={0}
          bg='white'
          shadow='lg'
          borderRadius='md'
          mt={1}
          maxH='300px'
          overflowY='auto'
          zIndex={10}
          align='stretch'
          p={2}
        >
          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              p={2}
              cursor='pointer'
              borderRadius='md'
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Text fontSize='sm'>{suggestion.text}</Text>
              <Text fontSize='xs' color='gray.500'>
                {suggestion.type}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
