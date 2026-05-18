'use client';

import { memo } from 'react';

import { NavPanelPortal } from '@/features/NavPanel';
import SideBarLayout from '@/features/NavPanel/SideBarLayout';

import Body from './Body';
import Header from './Header';

const SideBar = memo(() => {
  return (
    <NavPanelPortal navKey={'workspace-settings'}>
      <SideBarLayout body={<Body />} header={<Header />} />
    </NavPanelPortal>
  );
});

export default SideBar;
