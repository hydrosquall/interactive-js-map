import React, { useCallback, useState, useRef } from 'react';
import Cytoscape from 'cytoscape';

import { remote } from 'electron';
import CytoscapeComponent from 'react-cytoscapejs';
import dagre from 'cytoscape-dagre';

import { PrimaryAppBar } from '../PageDependencyTree/Toolbar';

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

  const { getFileTree, fileTreeList } = props;

  // All the cached callbacks
  const handleFetchTree = useCallback(
    () => {
      getFileTree(filePath);
    },
    [filePath]
  );

  const hasNodes = fileTreeList && fileTreeList.length > 0;
  // console.log(fileTreeList);

  const appBarProps = {
    handleOpenFileClick: handleOpenFileOrDirectory,
    fetchTree: handleFetchTree
  };

  return <div>
      <PrimaryAppBar {...appBarProps} />
      <div className={styles.graphContainer}>
        {hasNodes && (
          <CytoscapeComponent
            elements={fileTreeList}
            style={ { width: '100%', height: '800px' }}
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
    </div>;
};

export default PageFileTree;
