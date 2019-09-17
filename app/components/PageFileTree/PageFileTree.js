import React, { useCallback, useState, useRef } from 'react';
import Cytoscape from 'cytoscape';

import { remote } from 'electron';
import CytoscapeComponent from 'react-cytoscapejs';
import dagre from 'cytoscape-dagre';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { Navbar } from '../Navbar';
import { ResultsTable } from './ResultsTable';

import styles from './page-file-tree.css';

Cytoscape.use(dagre);

const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';


const PageFileTree = props => {
  const [filePath, setFilePath] = useState(DEFAULT_PATH);

  const cytoscapeRef = useRef(null);

  const handleOpenFileOrDirectory = useCallback(
    () => {
      dialog
        .showOpenDialog({ properties: ['openDirectory'] })
        .then(payload => {
          const { canceled, filePaths } = payload;
          if (canceled) {
            return;
          }
          setFilePath(filePaths[0]); // for now, stick to single-select.
        });
    },
    [setFilePath]
  );

  const { getFileTree, fileTreeList, searchResults } = props;

  // All the cached callbacks
  const handleFetchTree = useCallback(
    () => {
      getFileTree(filePath);
    },
    [filePath]
  );

  const hasNodes = fileTreeList && fileTreeList.length > 0;

  const appBarProps = {
    handleOpenFileClick: handleOpenFileOrDirectory,
    fetchTree: handleFetchTree,
    filePath
  };

  return (<div>
      <Navbar {...appBarProps} />
      <div className={styles.graphContainer}>
        {hasNodes && (
          <CytoscapeComponent
            elements={fileTreeList}
            style={ { width: '100%', height: '400px' }}
            layout={{ name: 'dagre' }}
            cy={(cy) => {
              cytoscapeRef.current = cy;
              // add some handlers
              // http://js.cytoscape.org/#events/user-input-device-events
              cy.on('tap', 'node', (event) => {
                // We can place tooltips at this point
                console.log(event.target.id());
              });

            }}
            stylesheet={[
              {
                // http://js.cytoscape.org/#selectors
                selector: `node[type = 'file']`,
                style: {
                  opacity: 1,
                }},
              {
                selector: `node[type = 'directory']`,
                style: {
                  // backgroundColor: 'green',
                  opacity: 0.5,
                  // shape: 'rectangle'
                }
              }
            ]}
          />
        )}
      </div>
      <ResultsTable rows={searchResults}/>
  </div>);
};

export default PageFileTree;
