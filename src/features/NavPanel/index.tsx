'use client';

import { type PropsWithChildren, type ReactNode } from 'react';
import { memo, useLayoutEffect, useRef, useSyncExternalStore } from 'react';

import SidebarContent from '@/routes/(main)/home/_layout/SidebarContent';

import { NavPanelDraggable } from './components/NavPanelDraggable';

export const NAV_PANEL_RIGHT_DRAWER_ID = 'nav-panel-drawer';

type NavPanelSnapshot = {
  key: string;
  node: ReactNode;
} | null;

let currentSnapshot: NavPanelSnapshot = null;
const listeners = new Set<() => void>();

const subscribeNavPanel = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getNavPanelSnapshot = () => currentSnapshot;
const setNavPanelSnapshot = (snapshot: NavPanelSnapshot) => {
  currentSnapshot = snapshot;
  listeners.forEach((listener) => listener());
};

const FALLBACK_NAV_KEY = 'home';

const getActiveNavKey = () => currentSnapshot?.key ?? FALLBACK_NAV_KEY;

export const useActiveNavKey = () =>
  useSyncExternalStore(subscribeNavPanel, getActiveNavKey, getActiveNavKey);

const NavPanel = memo(() => {
  const panelContent = useSyncExternalStore(
    subscribeNavPanel,
    getNavPanelSnapshot,
    getNavPanelSnapshot,
  );

  // Fallback renders the home sidebar's content directly — using `<Sidebar />`
  // (the portal wrapper) here loops with the portal's unmount cleanup:
  // mount fallback → portal sets snapshot → fallback unmounts → cleanup
  // clears snapshot → mount fallback → …
  const activeContent = panelContent || { key: FALLBACK_NAV_KEY, node: <SidebarContent /> };

  return (
    <>
      <NavPanelDraggable activeContent={activeContent} />
      <div
        id={NAV_PANEL_RIGHT_DRAWER_ID}
        style={{
          height: '100%',
          position: 'relative',
          width: 0,
          zIndex: 10,
        }}
      />
    </>
  );
});

export default NavPanel;

interface NavPanelPortalProps extends PropsWithChildren {
  /**
   * Unique key to trigger transition animation when content changes
   * @example <NavPanelPortal navKey="chat">...</NavPanelPortal>
   */
  navKey?: string;
}

export const NavPanelPortal = memo<NavPanelPortalProps>(({ children, navKey = 'default' }) => {
  const navKeyRef = useRef(navKey);
  navKeyRef.current = navKey;

  useLayoutEffect(() => {
    if (!children) return;

    setNavPanelSnapshot({
      key: navKey,
      node: children,
    });
  }, [children, navKey]);

  // Clear the snapshot on unmount if this portal still owns it. Without this,
  // a route transition where the next layout's portal effect doesn't fire in
  // the same commit (concurrent transitions, lazy boundaries, Fragment-key
  // remounts) leaves the previous owner's snapshot in place — visible as a
  // stale sidebar that may render empty under its new state (e.g. workspace
  // settings sidebar after the active workspace is deleted).
  useLayoutEffect(
    () => () => {
      if (currentSnapshot?.key === navKeyRef.current) {
        setNavPanelSnapshot(null);
      }
    },
    [],
  );

  return null;
});
