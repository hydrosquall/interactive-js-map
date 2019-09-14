import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

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
  return (
    <List className={classes.root} dense={true} subheader={<ListSubheader>{`${props.subtitle}`}</ListSubheader>} style={{ height: props.height }}>
      {props.itemData.map(item => {

        return (
        <ListItem button key={item}>
        <ListItemText primary={`${item}`} />
      </ListItem>)
      })}
    </List>
  );
}
