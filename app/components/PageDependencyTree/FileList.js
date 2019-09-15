import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import React, { useCallback } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: 320,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper
  }
}));

export default function FileList(props) {
  const classes = useStyles();
  const { onRowClick, onSecondaryClick } = props;

  const handleRowClick = useCallback(
    event => {
      const nodeName = event.target.textContent; // same value as item below.
      onRowClick(nodeName);
    },
    [onRowClick]
  );

  const handleSecondaryClick = useCallback(
    event => {
      const filename = event.target.closest('button').dataset.filename; // same value as item below.
      onSecondaryClick(filename);
    },
    [onSecondaryClick]
  );

  return (
    <List
      className={classes.root}
      dense={true}
      subheader={<ListSubheader>{`${props.subtitle}`}</ListSubheader>}
      style={{ height: props.height, width: props.width }}
    >
      {props.itemData.map(item => {
        return (
          <ListItem button key={item}>
            <ListItemText primary={`${item}`} onClick={handleRowClick} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="search"
                onClick={handleSecondaryClick}
                data-filename={item}
              >
                <SearchIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
