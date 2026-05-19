'use client';

import { memo, useEffect } from 'react';

import { useUserStore } from '@/store/user';
import { userProfileSelectors } from '@/store/user/slices/auth/selectors';

const V2ProviderSync = memo(() => {
  const userId = useUserStore(userProfileSelectors.userId);

  useEffect(() => {
    if (!userId) return;
    fetch('/api/sync-providers', { method: 'POST' }).catch(() => {});
  }, [userId]);

  return null;
});

V2ProviderSync.displayName = 'V2ProviderSync';

export default V2ProviderSync;
