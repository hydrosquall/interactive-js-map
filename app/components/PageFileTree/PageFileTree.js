import React, { useCallback, useState, useRef } from 'react';
import path from 'path';
import Cytoscape from 'cytoscape';
import { remote } from 'electron';
import CytoscapeComponent from 'react-cytoscapejs';
import dagre from 'cytoscape-dagre';
import SplitPane from 'react-split-pane';

import orange from '@material-ui/core/colors/orange';
import grey from '@material-ui/core/colors/grey';


import { Navbar } from '../Navbar';
import { ResultsTable } from './ResultsTable';

import styles from './page-file-tree.css';

Cytoscape.use(dagre);
const LAYOUT_OPTIONS = { name: 'dagre', rankDir: 'LR', padding: 10 };

const { dialog } = remote; // Open file dialog


const DEFAULT_MAP_FRACTION = 0.6;

const PageFileTree = props => {
  const { getFileTree, fileTreeList, searchResults, searchResultsByFile, filePath, setFilePath } = props;

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

  // All the cached callbacks
  const handleFetchTree = useCallback(
    () => {
      getFileTree(filePath);

      if (cytoscapeRef.current !== null) {
        const cy = cytoscapeRef.current;

        cy.remove(':simple'); // another way to say all!
        cy.add(fileTreeList);
        const layout = cy.layout(LAYOUT_OPTIONS);
        layout.run();

      }
    },
    [filePath, getFileTree, cytoscapeRef]
  );
  const pageWidth = window.innerWidth;
  const defaultMapWidth = pageWidth * DEFAULT_MAP_FRACTION; // sizing based on vega-lite sizing
  const [storedWidth, setWidth] = useState(pageWidth - defaultMapWidth);

  const leftWidth = storedWidth;
  const rightWidth = pageWidth - leftWidth;

  const hasNodes = fileTreeList && fileTreeList.length > 0;

  const appBarProps = {
    handleOpenFileClick: handleOpenFileOrDirectory,
    fetchTree: handleFetchTree,
    filePath
  };

  return (<div>
      <Navbar {...appBarProps} />
      <SplitPane split="vertical" minSize={250} defaultSize={defaultMapWidth} primary="first" onChange={size => setWidth(size)}>
        <div className={styles.graphContainer}>
          {hasNodes && (
            <CytoscapeComponent
              elements={fileTreeList}
              style={ { width: `${leftWidth}`, height: '800px' }}
              layout={LAYOUT_OPTIONS}
              cy={(cy) => {
                cytoscapeRef.current = cy;
                // add some handlers
                // http://js.cytoscape.org/#events/user-input-device-events
                cy.on('tap', 'node', (event) => {
                  // We can place tooltips at this point
                  // console.log(filePath)
                  const nodePath = event.target.id();
                  console.log(event.target.data());

                });

              }}
              stylesheet={[
                {
                  // http://js.cytoscape.org/#selectors
                  selector: `node[type = 'file']`,
                  style: {
                    backgroundColor: grey[300],
                    opacity: 1,
                  }
                },
                {
                  selector: `node[type = 'directory']`,
                  style: {
                    backgroundColor: 'green',
                    opacity: 0.5,
                    // shape: 'rectangle'
                  }
                },
                {
                  selector: `node[matches > 0]`,
                  style: {
                    backgroundColor: orange[400],
                    content: 'data(label)'
                    // opacity: 0.5,
                    // shape: 'rectangle'
                  }
                }
              ]}
            />
          )}
        </div>
      <ResultsTable rows={searchResults} rowsByGroup={searchResultsByFile} width={rightWidth}/>
      </SplitPane>

  </div>);
};

export default PageFileTree;
