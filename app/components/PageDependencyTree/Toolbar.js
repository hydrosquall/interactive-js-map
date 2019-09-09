import React from 'react';
import { remote } from 'electron';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FolderOpen from '@material-ui/icons/FolderOpen';
// import MenuIcon from '@material-ui/icons/MenuIcon';
import Loop from '@material-ui/icons/Loop';
import SettingsApplications from '@material-ui/icons/SettingsApplications';

import routes from '../../constants/routes';


const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';

// Theming pattern

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
}));


export function PrimaryAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }


  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );


  return <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
              edge="start"
              className={classes.menuButton} color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to={routes.HOME}>Dependencies</Link>
          </Typography>
          <div style={{width: 10}}>

          </div>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to={routes.FILETREE} >FileTree</Link>
          </Typography>

          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase placeholder="Search…" classes={{ root: classes.inputRoot, input: classes.inputInput }} inputProps={{ 'aria-label': 'search' }} />
          </div> */}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton onClick={props.fetchTree} color="inherit">
              <Loop />
            </IconButton>
            <IconButton onClick={props.handleOpenFileClick} color="inherit">
              <FolderOpen />
            </IconButton>
            {/* <IconButton edge="end" onClick={handleProfileMenuOpen} color="inherit">
              <SettingsApplications />
            </IconButton> */}
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>;
}
