import { imageUrlToBase64 } from '@lobechat/utils/imageToBase64';
import { parseDataUri } from '@lobechat/utils/uriParser';
import { isDesktopLocalStaticServerUrl } from '@lobechat/utils/url';

import type { VisualFileItem } from '../../visualMedia';

/**
 * Desktop attachments are exposed through a 127.0.0.1 static file server.
 * Convert those URLs in the client before sending a remote visual request;
 * otherwise the server sees its own localhost and SSRF protection blocks it.
 */
export const resolveClientVisualMediaUris = async (
  items: VisualFileItem[],
): Promise<VisualFileItem[]> =>
  Promise.all(
    items.map(async (item) => {
      const { type } = parseDataUri(item.uri);

      if (type !== 'url' || !isDesktopLocalStaticServerUrl(item.uri)) return item;

      const { base64, mimeType } = await imageUrlToBase64(item.uri);

      return {
        ...item,
        uri: `data:${mimeType};base64,${base64}`,
      };
    }),
  );
