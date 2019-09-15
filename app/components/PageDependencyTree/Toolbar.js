import React, { useState, useCallback, useEffect } from 'react';
import { remote } from 'electron';
import { Link } from 'react-router-dom';

// import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux'

// Redux machinery
import { setFilterPatterns } from '../../store/actions/dependency-tree';
import {
  filterPatterns$
} from '../../store/selectors/dependency-tree';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FolderOpen from '@material-ui/icons/FolderOpen';

import Loop from '@material-ui/icons/Loop';
import SettingsApplications from '@material-ui/icons/SettingsApplications';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


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

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open } = props;

  const patterns = useSelector(filterPatterns$); // just strings
  const patternString = patterns.join('\n')
  const [ rawPatterns, setRawPatterns ] = useState(patternString);

  const handleClose = useCallback((event) => {
    onClose();
  }, [onClose]);
  const dispatch = useDispatch();
  const handleCloseAndSave = useCallback((event) => {
    onClose();
    dispatch(setFilterPatterns(rawPatterns.split('\n')));
  }, [setRawPatterns, rawPatterns]);

  // Update internal state when open changes to pull down the new selector
  useEffect(() => {
    setRawPatterns(patternString);
  }, [patternString])

  const handleTextChange = useCallback((event) => setRawPatterns(event.target.value), [setRawPatterns]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Exclusion Patterns</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Exclude files with these REGEX patterns. Uses JS for client-side filtering.
        </DialogContentText>
        <TextField
              autoFocus
              margin="dense"
              id="filterPatterns"
              label="Enter Exclusion Patterns, 1 per line"
              multiline
              rowsMax="10"
              fullWidth
              value={rawPatterns}
              onChange={handleTextChange}
              />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          Close + Discard Changes
        </Button>
        <Button onClick={handleCloseAndSave} color="primary">
          Save Filters
        </Button>
      </DialogActions>
    </Dialog>);
}


export function PrimaryAppBar(props) {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  function handleDialogOpen(event) {
    setIsDialogOpen(true);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

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
          <div style={{ width: 10 }} />
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to={routes.FILETREE}>FileTree</Link>
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
            <IconButton edge="end" onClick={handleDialogOpen} color="inherit">
              <SettingsApplications />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <SimpleDialog open={isDialogOpen} onClose={handleDialogClose} />
    </div>;
}
