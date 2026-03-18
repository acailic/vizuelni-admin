/**
 * @file MobileChartContainer.tsx
 * @description Mobile-optimized chart container
 */

'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';

export function MobileChartContainer({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Box w='100%' minH='250px' bg='white' borderRadius='lg' shadow='md' p={4}>
      {title && (
        <Box fontSize='lg' fontWeight='bold' mb={2}>
          {title}
        </Box>
      )}
      {children}
    </Box>
  );
}
