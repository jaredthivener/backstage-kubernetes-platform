import { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BuildIcon from '@material-ui/icons/Build';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import CloudIcon from '@material-ui/icons/Cloud';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  SidebarSubmenu,
  SidebarSubmenuItem,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import GroupIcon from '@material-ui/icons/People';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthOpen,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthOpen - 24,
    marginLeft: 16,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav */}
        <SidebarItem icon={DashboardIcon} to="/" text="Dashboard" />
        <MyGroupsSidebarItem
          singularTitle="My Group"
          pluralTitle="My Groups"
          icon={GroupIcon}
        />
        <SidebarDivider />
        {/* Kubernetes as a Service */}
        <SidebarItem icon={SettingsEthernetIcon} to="clusters" text="Clusters" />
        <SidebarItem icon={CloudIcon} text="Platforms">
          <SidebarSubmenu title="Cloud Providers">
            <SidebarSubmenuItem
              title="Azure (AKS)"
              to="/clusters?csp=azure"
              icon={CloudIcon}
            />
            <SidebarSubmenuItem
              title="AWS (EKS)"
              to="/clusters?csp=aws"
              icon={CloudIcon}
            />
            <SidebarSubmenuItem
              title="GCP (GKE)"
              to="/clusters?csp=gcp"
              icon={CloudIcon}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={SecurityIcon} to="security" text="Security" />
        <SidebarItem icon={AttachMoneyIcon} to="cost" text="Cost" />
        <SidebarItem icon={AssessmentIcon} to="monitoring" text="Monitoring" />
        <SidebarDivider />
        {/* Standard Backstage */}
        <SidebarItem icon={BuildIcon} to="tools" text="Tools" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={HeadsetMicIcon} to="support" text="Support" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        <SidebarDivider />
        <SidebarScrollWrapper>
          {/* Items in this group will be scrollable if they run out of space */}
        </SidebarScrollWrapper>
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <NotificationsSidebarItem />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
