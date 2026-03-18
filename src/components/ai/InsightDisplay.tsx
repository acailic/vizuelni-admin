/**
 * @file InsightDisplay.tsx
 * @description Display AI-generated insights with visual formatting
 */

'use client';

import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Badge, Icon } from '@chakra-ui/react';
import {
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';

export interface Insight {
  type: 'trend' | 'anomaly' | 'comparison' | 'summary';
  title: string;
  description: string;
  confidence: number;
  importance: 'high' | 'medium' | 'low';
  data?: any;
}

export interface InsightDisplayProps {
  insights: Insight[];
  locale?: 'sr-Cyrl' | 'sr-Latn' | 'en';
  maxVisible?: number;
  showConfidence?: boolean;
}

export function InsightDisplay({
  insights,
  locale = 'en',
  maxVisible = 3,
  showConfidence = true,
}: InsightDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);
  const onToggle = () => setIsOpen(!isOpen);

  const typeIcons = {
    trend: ArrowTrendingUpIcon,
    anomaly: ExclamationTriangleIcon,
    comparison: ArrowTrendingDownIcon,
    summary: LightBulbIcon,
  };

  const typeColors = {
    trend: 'blue',
    anomaly: 'orange',
    comparison: 'purple',
    summary: 'green',
  };

  const importanceColors = {
    high: 'red',
    medium: 'yellow',
    low: 'gray',
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High confidence';
    if (confidence >= 0.7) return 'Medium confidence';
    return 'Low confidence';
  };

  const visibleInsights = insights.slice(0, maxVisible);
  const remainingInsights = insights.slice(maxVisible);

  return (
    <Box
      bg='gray.50'
      borderRadius='lg'
      p={4}
      borderLeft='4px solid'
      borderLeftColor='blue.500'
    >
      <HStack
        cursor='pointer'
        onClick={onToggle}
        mb={isOpen ? 3 : 0}
        justify='space-between'
      >
        <HStack>
          <Icon as={LightBulbIcon} color='blue.500' boxSize={5} />
          <Text fontWeight='bold' fontSize='lg'>
            {locale === 'sr-Cyrl'
              ? 'Увиди'
              : locale === 'sr-Latn'
                ? 'Uvidi'
                : 'Insights'}
          </Text>
          <Badge colorScheme='blue'>{insights.length}</Badge>
        </HStack>
        <Icon
          as={ChevronDownIcon}
          boxSize={5}
          transform={isOpen ? 'rotate(180deg)' : 'rotate(0)'}
          transition='transform 0.2s'
        />
      </HStack>

      {isOpen && (
        <VStack align='stretch' gap={3}>
          {visibleInsights.map((insight, index) => (
            <Box
              key={index}
              bg='white'
              p={3}
              borderRadius='md'
              shadow='sm'
              borderLeft='3px solid'
              borderLeftColor={`${typeColors[insight.type]}.500`}
            >
              <HStack justify='space-between' mb={1}>
                <HStack>
                  <Icon
                    as={typeIcons[insight.type]}
                    color={`${typeColors[insight.type]}.500`}
                    boxSize={4}
                  />
                  <Text fontWeight='semibold' fontSize='sm'>
                    {insight.title}
                  </Text>
                </HStack>
                <HStack gap={2}>
                  <Badge
                    colorScheme={importanceColors[insight.importance]}
                    size='sm'
                  >
                    {insight.importance}
                  </Badge>
                  {showConfidence && (
                    <Badge colorScheme='gray' variant='outline' size='sm'>
                      {getConfidenceLabel(insight.confidence)}
                    </Badge>
                  )}
                </HStack>
              </HStack>
              <Text fontSize='sm' color='gray.700' mt={1}>
                {insight.description}
              </Text>
            </Box>
          ))}

          {remainingInsights.length > 0 && (
            <Text fontSize='sm' color='gray.500' textAlign='center'>
              +{remainingInsights.length} more insights
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}
