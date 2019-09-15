import React from 'react';

import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { format } from 'date-fns/esm';


import { logsByAuthor$ } from '../../store/selectors/dependency-tree';

// https://material-ui.com/components/tree-view/
const useStyles = makeStyles({
  root: {
    height: 320,
    overflow: 'auto',
    flexGrow: 1,
    // maxWidth: 400
  },
  datePill: {
    color: 'gray',
    fontSize: '0.8rem'
  },
  commitSubject: {
    fontSize: '0.9rem',
    fontFamily: 'monospace'
  }
});

const formatDate = date => format(date, 'MM-dd-yy');

export default function CommitTree(props) {
  const classes = useStyles();
  const logs = useSelector(logsByAuthor$); // authorName: { subject, committerDate, }

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {Object.entries(logs).map(([authorName, commits], i) => {

        const authorLabel = <div>
            {authorName} {`(${commits.length}) `}<span className={classes.datePill}>
              {formatDate(commits[0].committerDate)} {' to '}
               {formatDate(commits[commits.length - 1].committerDate)}
            </span>
          </div>;

        return (
          <TreeItem label={authorLabel} nodeId={`${authorName}-parent`}>
            {commits.map((commit, j) => {
              const label = <div className={classes.commitSubject}>
                  <span className={classes.datePill}>
                    {formatDate(commit.committerDate)}
                  </span> {' '}
                  {commit.subject}
                </div>;
              return <TreeItem label={label} nodeId={`${authorName}-${j}`}></TreeItem>;
            })}
          </TreeItem>
        );
      })}
    </TreeView>
  );
}
