import React, { useCallback, useState, useReducer, useEffect } from 'react';
import Graph from 'react-graph-vis';
import * as dg from 'dis-gui';


import { remote } from 'electron';

import { PrimaryAppBar } from './Toolbar';

import styles from './page-dependency-tree.css';


const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';

// Mini reducer
const SET_HIERARCHY_PROPERTY = 'SET_HIERARCHY_PROPERTY';
const initialHierarchyState = {
  enabled: true,
  levelSeparation: 150,
  nodeSpacing: 100,
  treeSpacing: 200,
  blockShifting: true,
  edgeMinimization: true,
  parentCentralization: true,
  direction: 'UD',
  sortMethod: 'hubsize'
}
const hierarchyReducer = (state, action) => {
    switch (action.type) {
    case SET_HIERARCHY_PROPERTY:
      return {
          ...state,
          ...action.payload
      };
    default:
      throw new Error();
  }
}


const PageDependencyTree = props => {

  const [filePath, setFilePath ] = useState(DEFAULT_PATH);
  const [webpackConfig, setWebpackConfig] = useState(null);
  const [isHierarchical, setIsHierarchical ] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible ] = useState(false);

  // Hierarchy Properties
  const [ hierarchyState, hierarchyDispatch ] = useReducer(hierarchyReducer, initialHierarchyState);

  const handleOpenFileOrDirectory = useCallback(
    () => {
      // Note: on windows or linux, a dialog is only allowed to open one, not both
      // As a result, that would lead to just opening a directory dialogy.
      dialog
        .showOpenDialog({ properties: ['openFile', 'openDirectory'] })
        .then(payload => {
          const { canceled, filePaths, bookmarks } = payload;
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
      getDotGraph(filePath, webpackConfig);
    },
    [filePath, webpackConfig]
  );
  const handleToggleHierarchy = useCallback(
    (event) => {
      setIsHierarchical(event);
    },
    [setIsHierarchical]
  );
  const handleSetFilepath = useCallback(
    filepath => {
      setFilePath(filepath);
    },
    [setFilePath]
  );
  const handleSetWebpackConfig= useCallback(
    config => {
      setWebpackConfig(config);
    },
    [setWebpackConfig]
  );

  // TODO: figure out how to only run this once with hooks. UseEffect doesn't work.
  const handleSetHierarchyProp = new Map();
  // Build the handlers once - operate on handleSetHierarchyProp;
  const hierarchyProps = Object.keys(initialHierarchyState);
  hierarchyProps.forEach(prop => {
    handleSetHierarchyProp[prop] = useCallback(
      value =>
        hierarchyDispatch({
          type: SET_HIERARCHY_PROPERTY,
          payload: { [prop]: value }
        }),
      [hierarchyDispatch]
    );
  });

  const { dependencyTree, getDotGraph } = props;
  const hasNodes = dependencyTree && dependencyTree.nodes.length > 0;
  const visJsGraphOptions = { layout: { hierarchical: isHierarchical && hierarchyState }, edges: { color: '#000000' } };

  const guiStyle = {
    bottom: '0px',
    right: '0px',
    controlWidth: 400,
    font: '14px Roboto, sans-serif',
    label: { fontColor: '#eeeeee' }
  };

  const ControlPanel = () => <dg.GUI style={guiStyle}>
      <dg.Folder label="Data Settings" expanded={true}>
        <dg.Text label="Filepath" value={filePath} onFinishChange={handleSetFilepath} />
        <dg.Text label="webpack path" value={webpackConfig} onFinishChange={handleSetWebpackConfig} />
      </dg.Folder>

      <dg.Folder label="Graph Settings" expanded={true}>
        <dg.Folder label="Layout" expanded={true}>
          <dg.Checkbox label="Use Hierarchy" checked={isHierarchical} onChange={handleToggleHierarchy} />
          {isHierarchical && <dg.Folder label="Hierarchy Options" expanded={isHierarchical}>
              <dg.Select label="direction" options={['UD', 'DU', 'LR', 'LR']} value={hierarchyState.direction} onChange={handleSetHierarchyProp['direction']} />
              <dg.Select label="sortMethod" options={['directed', 'hubsize']} value={hierarchyState.sortMethod} onChange={handleSetHierarchyProp['sortMethod']} />
              <dg.Checkbox label="blockShifting" checked={hierarchyState.blockShifting} onChange={handleSetHierarchyProp['blockShifting']} />
              <dg.Checkbox label="edgeMinimization" checked={hierarchyState.edgeMinimization} onChange={handleSetHierarchyProp['edgeMinimization']} />
              <dg.Checkbox label="parentCentralization" checked={hierarchyState.parentCentralization} onChange={handleSetHierarchyProp['parentCentralization']} />
              <dg.Number label="levelSeparation" value={hierarchyState.levelSeparation} min={0} max={200} step={1} onFinishChange={handleSetHierarchyProp['levelSeparation']} />
              <dg.Number label="nodeSpacing" value={hierarchyState.nodeSpacing} min={0} max={300} step={1} onFinishChange={handleSetHierarchyProp['nodeSpacing']} />
              <dg.Number label="treeSpacing" value={hierarchyState.treeSpacing} min={0} max={300} step={1} onFinishChange={handleSetHierarchyProp['treeSpacing']} />
            </dg.Folder>}
        </dg.Folder>
      </dg.Folder>
    </dg.GUI>;

  const appBarProps = {
    handleOpenFileClick: handleOpenFileOrDirectory,
    fetchTree: handleFetchTree
  };

  return <div>
      <PrimaryAppBar {...appBarProps}/>
      <div className={styles.graphContainer}>
        {hasNodes && (
          <Graph graph={dependencyTree} options={visJsGraphOptions} />
        )}
      </div>
      <ControlPanel></ControlPanel>
    </div>;
};

export default PageDependencyTree;
