import type { IEditor } from '@lobehub/editor';
import { useCallback, useEffect } from 'react';

import { getFileListFromDataTransferItems } from './useLocalDragUpload';

/**
 * Hook for handling paste file uploads from the system clipboard.
 * Uses a window-level paste listener to reliably capture images pasted
 * via Ctrl+V (e.g. screenshots, images copied from other apps).
 *
 * The editor parameter is accepted for API compatibility but the listener
 * operates at the window level so it works regardless of editor paste mode.
 *
 * @param editor - The editor instance (kept for API compatibility)
 * @param onUploadFiles - Callback when files are pasted
 */
export const usePasteFile = (
  editor: IEditor | undefined,
  onUploadFiles: (files: File[]) => void | Promise<void>,
) => {
  void editor;

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      if (!event.clipboardData) return;

      const items = Array.from(event.clipboardData.items);
      // Only process file items (images, etc.) — text items return empty array
      const files = await getFileListFromDataTransferItems(items);

      if (files.length === 0) return;

      onUploadFiles(files);
    },
    [onUploadFiles],
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);
};
