"use client";

import { useEffect } from 'react';

/**
 * Initializes the @google/model-viewer web component once globally.
 * This prevents multiple import calls and ensures the custom element is registered.
 */
export default function ModelViewerInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@google/model-viewer').catch(err => {
        console.error('Failed to load @google/model-viewer:', err);
      });
    }
  }, []);

  return null;
}
