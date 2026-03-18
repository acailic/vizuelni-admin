/**
 * @file TouchDragContext.tsx
 * @description Touch gesture handling
 */

'use client';

import React, { createContext, useState } from 'react';

export const TouchContext = createContext<any>({});

export function TouchDragContext({
  children,
  onDrop: _onDrop,
}: {
  children: React.ReactNode;
  onDrop?: (result: unknown) => void;
}) {
  const [isDragging, _setIsDragging] = useState(false);
  return (
    <TouchContext.Provider value={{ isDragging }}>
      <div>{children}</div>
    </TouchContext.Provider>
  );
}
