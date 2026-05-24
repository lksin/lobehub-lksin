import { t } from 'i18next';
import { useCallback } from 'react';

import { message } from '@/components/AntdStaticMethods';
import { useVisualMediaUploadAbility } from '@/hooks/useVisualMediaUploadAbility';
import { useFileStore } from '@/store/file';

interface UseUploadFilesOptions {
  model?: string;
  provider?: string;
}

/**
 * Hook to handle file uploads with visual media support filtering.
 * Filters out image/video files if the model cannot receive them directly or via fallback,
 * and shows a warning when files are rejected.
 *
 * @param options - The model and provider to check for vision support
 * @returns handleUploadFiles - Callback to handle file uploads
 */
export const useUploadFiles = (options: UseUploadFilesOptions = {}) => {
  const { model = '', provider = '' } = options;

  const { canUploadImage, canUploadVideo } = useVisualMediaUploadAbility(model, provider);
  const uploadFiles = useFileStore((s) => s.uploadChatFiles);

  const handleUploadFiles = useCallback(
    async (files: File[]) => {
      let hasRejectedImage = false;
      let hasRejectedVideo = false;

      const filteredFiles = files.filter((file) => {
        if (file.type.startsWith('image')) {
          if (!canUploadImage) hasRejectedImage = true;
          return canUploadImage;
        }
        if (file.type.startsWith('video')) {
          if (!canUploadVideo) hasRejectedVideo = true;
          return canUploadVideo;
        }
        return true;
      });

      if (hasRejectedImage) {
        message.warning(t('upload.action.imageDisabled', { ns: 'chat' }));
      } else if (hasRejectedVideo) {
        message.warning(t('upload.clientMode.visionNotSupported', { ns: 'chat' }));
      }

      if (filteredFiles.length > 0) {
        uploadFiles(filteredFiles);
      }
    },
    [canUploadImage, canUploadVideo, uploadFiles],
  );

  return { canUploadImage, canUploadVideo, handleUploadFiles };
};
