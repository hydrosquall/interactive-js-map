import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import { FixedSizeList } from 'react-window';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/search';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // maxHeight: 400,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper
  }
}));

function Row(props) {
  const { index, style, data } = props;

  return <ListItem button style={style} key={data[index]}>
      <ListItemText primary={`${data[index]}`} />
    </ListItem>;
}

Row.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
};

// export default function VirtualizedList(props) {
//   const classes = useStyles();
//   return (
//     <div className={classes.root} style={{ height: props.height }}>
//       <FixedSizeList height={props.height} width={props.width} itemData={props.itemData} itemSize={18} itemCount={props.itemData.length}>
//         {Row}
//       </FixedSizeList>
//     </div>
//   );
// }




export default function MyList(props) {
  const classes = useStyles();
  const { onRowClick } = props;

  const handleRowClick = useCallback(
    (event) => {
      const nodeName = event.target.textContent; // same value as item below.
      onRowClick(nodeName);
    },
    [onRowClick]
  );
  return (
    <List className={classes.root} dense={true} subheader={<ListSubheader>{`${props.subtitle}`}</ListSubheader>} style={{ height: props.height, width: props.width }}>
      {props.itemData.map(item => {
        return <ListItem button key={item}>
            <ListItemText primary={`${item}`} onClick={handleRowClick} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="search" onClick={() => console.log(item)}>
                <SearchIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>;
      })}
    </List>
  );
}
