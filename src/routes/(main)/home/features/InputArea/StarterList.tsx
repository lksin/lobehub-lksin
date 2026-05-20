import { OpenAI } from '@lobehub/icons';
import { Button, Center, Tag } from '@lobehub/ui';
import { createStaticStyles, cx } from 'antd-style';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useStableNavigate } from '@/hooks/useStableNavigate';

const styles = createStaticStyles(({ css, cssVar }) => ({
  button: css`
    height: 40px;
    border-color: ${cssVar.colorFillSecondary};
    background: transparent;
    box-shadow: none !important;

    &:hover {
      border-color: ${cssVar.colorFillSecondary} !important;
      background: ${cssVar.colorBgElevated} !important;
    }
  `,
  newTag: css`
    padding-inline: 10px !important;
    border-radius: 999px !important;
  `,
}));

const StarterList = memo(() => {
  const { t } = useTranslation('home');
  const navigate = useStableNavigate();

  const handleClick = useCallback(() => {
    navigate('/image?model=gpt-image-2');
  }, [navigate]);

  return (
    <Center horizontal gap={8}>
      <Tag className={styles.newTag} size={'small'}>
        {t('starter.newLabel')}
      </Tag>
      <Button
        className={cx(styles.button)}
        icon={OpenAI.Avatar}
        shape={'round'}
        variant={'outlined'}
        iconProps={{ size: 18 }}
        onClick={handleClick}
      >
        {t('starter.imageGeneration')}
      </Button>
    </Center>
  );
});

export default StarterList;
