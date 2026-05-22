'use client';

import { Button, Flexbox, Text } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { Undo2Icon } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ModelSelect from '@/features/ModelSelect';
import { useEnabledChatModels } from '@/hooks/useEnabledChatModels';
import LobeMessage from '@/routes/onboarding/components/LobeMessage';
import { useAiInfraStore } from '@/store/aiInfra';
import { serverConfigSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';

import KlavisServerList from '../components/KlavisServerList';

const ONBOARDING_PROVIDER = 'group-5';

interface ProSettingsStepProps {
  onBack: () => void;
}

const ProSettingsStep = memo<ProSettingsStepProps>(({ onBack }) => {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();

  const enableKlavis = useServerConfigStore(serverConfigSelectors.enableKlavis);

  const [updateDefaultModel, finishOnboarding] = useUserStore((s) => [
    s.updateDefaultModel,
    s.finishOnboarding,
  ]);

  const defaultAgentConfig = useUserStore(
    (s) => settingsSelectors.currentSettings(s).defaultAgent?.config,
  );

  const refreshAiProviderRuntimeState = useAiInfraStore((s) => s.refreshAiProviderRuntimeState);
  const enabledChatModels = useEnabledChatModels();

  const [isSyncing, setIsSyncing] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const isNavigatingRef = useRef(false);
  const autoSelectedRef = useRef(false);
  // Capture stable ref to avoid stale closure in the one-shot effect
  const refreshRef = useRef(refreshAiProviderRuntimeState);
  refreshRef.current = refreshAiProviderRuntimeState;

  // On mount: sync providers from V2, then refresh the enabled model list
  useEffect(() => {
    let cancelled = false;
    fetch('/api/sync-providers', { method: 'POST' })
      .then(async (res) => {
        if (cancelled || !res.ok) return;
        await refreshRef.current();
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsSyncing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select the first group-5 model once sync finishes and models are available
  useEffect(() => {
    if (isSyncing || autoSelectedRef.current) return;
    const group5Provider = enabledChatModels.find((p) => p.id === ONBOARDING_PROVIDER);
    if (!group5Provider || group5Provider.children.length === 0) return;

    if (defaultAgentConfig?.provider !== ONBOARDING_PROVIDER) {
      void updateDefaultModel(group5Provider.children[0].id, ONBOARDING_PROVIDER);
    }
    autoSelectedRef.current = true;
  }, [isSyncing, enabledChatModels, defaultAgentConfig?.provider, updateDefaultModel]);

  const hasGroup5Models = enabledChatModels.some(
    (p) => p.id === ONBOARDING_PROVIDER && p.children.length > 0,
  );

  const handleFinish = useCallback(async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsNavigating(true);
    await finishOnboarding();
    navigate('/');
  }, [finishOnboarding, navigate]);

  const handleBack = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsNavigating(true);
    onBack();
  }, [onBack]);

  const handleModelChange = useCallback(
    ({ model, provider }: { model: string; provider: string }) => {
      updateDefaultModel(model, provider);
    },
    [updateDefaultModel],
  );

  return (
    <Flexbox gap={16}>
      <LobeMessage
        sentences={[t('proSettings.title'), t('proSettings.title2'), t('proSettings.title3')]}
      />
      <Flexbox gap={16}>
        <Text color={cssVar.colorTextSecondary}>{t('proSettings.model.title')}</Text>
        <ModelSelect
          loading={isSyncing}
          providerIds={!isSyncing && hasGroup5Models ? [ONBOARDING_PROVIDER] : undefined}
          showAbility={false}
          size="large"
          style={{ width: '100%' }}
          value={defaultAgentConfig}
          onChange={handleModelChange}
        />
      </Flexbox>

      {enableKlavis && (
        <Flexbox gap={16}>
          <Text color={cssVar.colorTextSecondary}>{t('proSettings.connectors.title')}</Text>
          <KlavisServerList />
        </Flexbox>
      )}

      <Flexbox horizontal align={'center'} justify={'space-between'} style={{ marginTop: 16 }}>
        <Button
          disabled={isNavigating}
          icon={Undo2Icon}
          type={'text'}
          style={{
            color: cssVar.colorTextDescription,
          }}
          onClick={handleBack}
        >
          {t('back')}
        </Button>
        <Button
          disabled={isNavigating}
          style={{ minWidth: 120 }}
          type="primary"
          onClick={() => void handleFinish()}
        >
          {t('finish')}
        </Button>
      </Flexbox>
    </Flexbox>
  );
});

ProSettingsStep.displayName = 'ProSettingsStep';

export default ProSettingsStep;
