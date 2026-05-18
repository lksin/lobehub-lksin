import { AccordionItem, ActionIcon, Text } from '@lobehub/ui';
import { PlusIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateNewModal } from '@/features/LibraryModal';
import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';

import LibraryList from './LibraryList';

const SidebarBody = memo<{ itemKey: string }>(({ itemKey }) => {
  const { t } = useTranslation('file');
  const navigate = useWorkspaceAwareNavigate();

  const { open } = useCreateNewModal();

  const handleCreate = () => {
    open({
      onSuccess: (id) => {
        navigate(`/resource/library/${id}`);
      },
    });
  };

  return (
    <AccordionItem
      itemKey={itemKey}
      paddingBlock={4}
      paddingInline={'8px 4px'}
      action={
        <ActionIcon
          icon={PlusIcon}
          size={'small'}
          title={t('library.new')}
          onClick={handleCreate}
        />
      }
      title={
        <Text ellipsis fontSize={12} type={'secondary'} weight={500}>
          {t('library.title')}
        </Text>
      }
    >
      <LibraryList />
    </AccordionItem>
  );
});

export default SidebarBody;
