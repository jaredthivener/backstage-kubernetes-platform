import { PropsWithChildren } from 'react';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BuildIcon from '@material-ui/icons/Build';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CloudIcon from '@material-ui/icons/Cloud';
import SecurityIcon from '@material-ui/icons/Security';
import StorageIcon from '@material-ui/icons/Storage';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import ChatIcon from '@material-ui/icons/Chat';
import SpeedIcon from '@material-ui/icons/Speed';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIconOutlined from '@material-ui/icons/GroupOutlined';
import { useState } from 'react';
import { useDemoPlatform } from '../shared/DemoPlatformContext';

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

const useProfileStyles = makeStyles(theme => ({
  profileAnchor: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(1.5),
    zIndex: 1301,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 999,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.5, 1),
    boxShadow: theme.shadows[2],
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.text.secondary,
      boxShadow: theme.shadows[4],
    },
  },
  roleChip: {
    fontWeight: 600,
    height: 20,
  },
  arrowIcon: {
    transition: 'transform 0.2s ease',
  },
  arrowIconOpen: {
    transform: 'rotate(180deg)',
  },
  teamRoleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
  },
}));

const ProfileSection = () => {
  const classes = useProfileStyles();
  const { currentPersona, personas, teamMembers, setPersona } = useDemoPlatform();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);

  const menuOpen = Boolean(menuAnchorEl);
  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Tooltip title="Profile">
        <ButtonBase
          className={classes.profileAnchor}
          onClick={openProfileMenu}
          aria-label="Open profile menu"
          disableRipple
          disableTouchRipple
        >
          <Avatar style={{ width: 32, height: 32, fontSize: 16 }}>
            {currentPersona.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
          </Avatar>
          <Box mr={0.5} ml={1} textAlign="left">
            <Typography variant="h6" style={{ fontWeight: 700, lineHeight: 1.05 }}>
              {currentPersona.name}
            </Typography>
            <Chip label={currentPersona.role} size="small" className={classes.roleChip} />
          </Box>
          <ExpandMoreIcon
            fontSize="small"
            color="action"
            className={`${classes.arrowIcon} ${menuOpen ? classes.arrowIconOpen : ''}`}
          />
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={() => setMenuAnchorEl(null)}
        keepMounted
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="body2" style={{ fontWeight: 600 }}>{currentPersona.name}</Typography>
            <Typography variant="caption" color="textSecondary">{currentPersona.email}</Typography>
            <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 2 }}>
              {currentPersona.role} • {currentPersona.team}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <Typography variant="caption" color="textSecondary">Switch Persona</Typography>
        </MenuItem>
        {personas.map(persona => (
          <MenuItem
            key={persona.id}
            selected={persona.id === currentPersona.id}
            onClick={() => {
              setPersona(persona.id);
              setMenuAnchorEl(null);
            }}
          >
            <Box>
              <Typography variant="body2">{persona.name}</Typography>
              <Typography variant="caption" color="textSecondary">{persona.role} • {persona.team}</Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
            setTeamDialogOpen(true);
          }}
        >
          <GroupIconOutlined fontSize="small" style={{ marginRight: 8 }} />
          View Team Roles
        </MenuItem>
      </Menu>

      <Dialog
        open={teamDialogOpen}
        onClose={() => setTeamDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Team Roles</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Current team view for {currentPersona.team}.
          </Typography>
          {teamMembers.map(member => (
            <Box key={member.id} className={classes.teamRoleRow}>
              <Box>
                <Typography variant="body2" style={{ fontWeight: 600 }}>{member.name}</Typography>
                <Typography variant="caption" color="textSecondary">{member.team}</Typography>
              </Box>
              <Chip size="small" label={member.assignedRole} />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
        <SidebarItem icon={StorageIcon} to="clusters" text="Clusters" />
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
        <SidebarItem icon={SpeedIcon} to="dora" text="DORA Metrics" />
        <SidebarDivider />
        {/* Standard Backstage */}
        <SidebarItem icon={BuildIcon} to="tools" text="Tools" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={HeadsetMicIcon} to="support" text="Support" />
        <SidebarItem icon={ChatIcon} to="aichatbot" text="AI Chat Bot" />
        {/* <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." /> */}
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
    <ProfileSection />
    {children}
  </SidebarPage>
);
