import React, { useCallback, useState, useReducer, useEffect, useRef } from 'react';
import Graph from 'react-graph-vis';
// import { info } from 'jsnetworkx';

import * as dg from 'dis-gui';
import SplitPane from 'react-split-pane';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FolderOpen from '@material-ui/icons/FolderOpen';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';

import { remote } from 'electron';

import { PrimaryAppBar } from './Toolbar';
import VirtualizedList from './VirtualizedList';

import styles from './page-dependency-tree.css';

import { dirname } from 'path';


const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';
const DEFAULT_MAP_FRACTION = 0.5;
const DEFAULT_NODE_COLOR = blue[100];
const ROOT_NODE_COLOR = grey[500];
const SELECTED_NODE_COLOR = red[100];
const SELECTED_NODE_OUTLINE = red[500];

// Mini reducer
const SET_HIERARCHY_PROPERTY = 'SET_HIERARCHY_PROPERTY';
const initialHierarchyState = {
  enabled: true,
  levelSeparation: 140,
  nodeSpacing: 100,
  treeSpacing: 200,
  blockShifting: false,
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

// Graph is some jsnetworkx instance
const getNodeColor = (nodeId, graph) => {
  const isLeafNode = graph.outDegree(nodeId) === 0;
  if (isLeafNode) { // only ever gets imported
    return green[100];
  }

  const isRootNode = graph.inDegree(nodeId) === 0; // only exports things, could be an entrypoint
  if (isRootNode) {
    return ROOT_NODE_COLOR;
  }
  return DEFAULT_NODE_COLOR;
}

const getNodeColorEnriched = (enrichedNode) => {
  // island nodes - stand by themselves.
  const isIsland = enrichedNode.outDegree === 0 && enrichedNode.inDegree === 0;
  if (isIsland) {
    // only ever gets imported
    return grey[200];
  }


  const isLeafNode = enrichedNode.outDegree === 0;
  if (isLeafNode) {
    // only ever gets imported
    return green[100];
  }

  // No parents, but does have children.
  const isRootNode = enrichedNode.inDegree === 0;
  if (isRootNode) {
    return ROOT_NODE_COLOR;
  }
  return DEFAULT_NODE_COLOR;
};

// Escape particular files
// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const PageDependencyTree = props => {
        const visJsRef = useRef(null);

        const [filePath, setFilePath] = useState(DEFAULT_PATH);
        const [webpackConfig, setWebpackConfig] = useState(null);
        const [isHierarchical, setIsHierarchical] = useState(false);
        const [isDrawerVisible, setIsDrawerVisible] = useState(false);
        const [isLabelVisible, setIsLabelVisible] = useState(false);

        const [selectedNode, setSelectedNode] = useState(undefined);
        const [selectedEdges, setSelectedEdges] = useState([]);

        // Hierarchy Properties
        const [hierarchyState, hierarchyDispatch] = useReducer(hierarchyReducer, initialHierarchyState);

        const handleOpenFileOrDirectory = useCallback(
          () => {
            // Note: on windows or linux, a dialog is only allowed to open one, not both
            // As a result, that would lead to just opening a directory dialogy.
            dialog
              .showOpenDialog({
                properties: ['openFile', 'openDirectory']
              })
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
            setSelectedNode(undefined);
            getDotGraph(filePath, webpackConfig);
          },
          [filePath, webpackConfig, setSelectedNode]
        );

        const handleSetSelectedNode = useCallback(
          (node) => {
            setSelectedNode(node);
            if (visJsRef !== null) {
              visJsRef.current.selectNodes( [node]);
            }
          },
          [setSelectedNode, visJsRef]
        );
        const handleToggleHierarchy = useCallback(
          event => {
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
        const handleSetWebpackConfig = useCallback(
          config => {
            setWebpackConfig(config);
          },
          [setWebpackConfig]
        );
        const handleSetLabelVisible = useCallback(
          isVisible => {
            setIsLabelVisible(isVisible);
          },
          [setIsLabelVisible]
        );

        const { dependencyTree, getDotGraph, networkXGraph, addFilterPatterns } = props;

        // TODO: figure out how to only run this once with hooks. UseEffect doesn't work, but this is fine for now.
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

        // Filter buttons
        const handleFilterFile = useCallback(
          () => {
            setSelectedNode(undefined);
            addFilterPatterns([`^${escapeRegExp(selectedNode)}`]);

          },
          [addFilterPatterns, setSelectedNode, selectedNode]
        );
        const handleFilterFolder = useCallback(
          () => {
            setSelectedNode(undefined);
            addFilterPatterns([`^${escapeRegExp(dirname(selectedNode))}\/*`]);

          },
          [addFilterPatterns, setSelectedNode, selectedNode]
        );

        const hasNodes = dependencyTree && dependencyTree.nodes.length > 0;
        const pageWidth = window.innerWidth;
        const defaultMapWidth = pageWidth * DEFAULT_MAP_FRACTION; // sizing based on vega-lite sizing
        const [storedWidth, setWidth] = useState(pageWidth - defaultMapWidth);

        const visJsGraphOptions = { width: `${storedWidth}`, layout: { hierarchical: isHierarchical && hierarchyState }, edges: { color: '#ccc' }, nodes: { shape: 'box', borderWidth: 1, color: {highlight: { border: SELECTED_NODE_OUTLINE }} } };

        let graph = {
            edges: dependencyTree.edges,
            nodes: dependencyTree.nodes.map(
              node => {
                const backgroundColor = getNodeColorEnriched(node);
                return { ...node, color: { background: backgroundColor, border: backgroundColor } };
              }
            )
        };


        if (!isLabelVisible) {
          graph = { edges: graph.edges, nodes: graph.nodes.map(node => ({
              ...node,
              label: undefined
            })) };
        }

        const guiStyle = { bottom: '0px', left: '0px', controlWidth: 400, font: '14px Roboto, sans-serif', label: { fontColor: '#eeeeee' } };

        // Assume folder can collapse when you're in detail view.
        const isExpandFolders = selectedNode === undefined;

        const ControlPanel = () => <dg.GUI style={guiStyle}>
            <dg.Folder label="Data Settings">
              <dg.Text label="Filepath" value={filePath} onFinishChange={handleSetFilepath} />
              <dg.Text label="webpack path" value={webpackConfig} onFinishChange={handleSetWebpackConfig} />
            </dg.Folder>

            <dg.Folder label="Graph Settings" expanded={isExpandFolders}>
              <dg.Checkbox label="Use Labels" checked={isLabelVisible} onChange={handleSetLabelVisible} />
              <dg.Folder label="Layout" expanded={isExpandFolders}>
                <dg.Checkbox label="Use Hierarchy" checked={isHierarchical} onChange={handleToggleHierarchy} />
                {isHierarchical && <dg.Folder label="Hierarchy Options" expanded={isHierarchical}>
                    <dg.Select label="direction" options={['UD', 'DU', 'LR', 'RL']} value={hierarchyState.direction} onChange={handleSetHierarchyProp.direction} />
                    <dg.Select label="sortMethod" options={['directed', 'hubsize']} value={hierarchyState.sortMethod} onChange={handleSetHierarchyProp.sortMethod} />
                    <dg.Checkbox label="blockShifting" checked={hierarchyState.blockShifting} onChange={handleSetHierarchyProp.blockShifting} />
                    <dg.Checkbox label="edgeMinimization" checked={hierarchyState.edgeMinimization} onChange={handleSetHierarchyProp.edgeMinimization} />
                    <dg.Checkbox label="parentCentralization" checked={hierarchyState.parentCentralization} onChange={handleSetHierarchyProp.parentCentralization} />
                    <dg.Number label="levelSeparation" value={hierarchyState.levelSeparation} min={0} max={200} step={1} onFinishChange={handleSetHierarchyProp.levelSeparation} />
                    <dg.Number label="nodeSpacing" value={hierarchyState.nodeSpacing} min={0} max={300} step={1} onFinishChange={handleSetHierarchyProp.nodeSpacing} />
                    <dg.Number label="treeSpacing" value={hierarchyState.treeSpacing} min={0} max={300} step={1} onFinishChange={handleSetHierarchyProp.treeSpacing} />
                  </dg.Folder>}
              </dg.Folder>
            </dg.Folder>
          </dg.GUI>;

        const appBarProps = { handleOpenFileClick: handleOpenFileOrDirectory, fetchTree: handleFetchTree };

        const events = {
          select: (event) => {
            const { nodes, edges } = event;
            // console.log(event);

            if (nodes.length > 0 ) {
              setSelectedNode(nodes[0]);
            }
          }};

        // For the right side panel
        const filteredEdges = graph.edges.filter(edge => edge.from === selectedNode || edge.to === selectedNode);
        const filteredNodes = Array.from(new Set(filteredEdges.flatMap(
              edge => [edge.to, edge.from]
            ))).map(id => ({
          id,
          color:
            id === selectedNode
              ? SELECTED_NODE_COLOR
              : getNodeColor(id, networkXGraph)
        }));
        const filteredGraph = {
          nodes: filteredNodes,
          edges: filteredEdges
        }

        const secondPaneWidth = pageWidth - storedWidth - 6;

        const filteredGraphOptions = {
          ...visJsGraphOptions,
          width: `${secondPaneWidth}`,
          height: '250',
          layout: { hierarchical: {
            direction: 'DU',
            sortMethod: 'directed'
          }}
        };

        const rootNodes = graph.nodes
          .filter(node => node.inDegree === 0 && node.outDegree !== 0)
          .map(node => node.id);

        const successors = networkXGraph && networkXGraph.hasNode(selectedNode) ? networkXGraph.successors(
                            selectedNode
                          ): [];

        const predecessors = networkXGraph && networkXGraph.hasNode(selectedNode) ? networkXGraph.predecessors(selectedNode) : [];

        return <div>
            <PrimaryAppBar {...appBarProps} />
            <SplitPane split="vertical" minSize={250} defaultSize={defaultMapWidth} primary="first" onChange={size => setWidth(size)}>
              <div className={styles.graphContainer} style={{ width: storedWidth }}>
                <div style={{ width: storedWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Typography variant="h6" gutterLeft>
                    {filePath && filePath}
                  </Typography>
                </div>
                {hasNodes && <Graph graph={graph} options={visJsGraphOptions} events={events} getNetwork={network => {
                      visJsRef.current = network;
                    }} />}
                <ControlPanel />
              </div>

              <div styles={{ width: secondPaneWidth }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <div>
                      {graph.nodes.length > 0 && (
                        <VirtualizedList
                          itemData={rootNodes}
                          width={secondPaneWidth}
                          height={200}
                          subtitle={`"Root" Files (${
                            rootNodes.length
                          }) - Probable Entrypoints`}
                          onRowClick={handleSetSelectedNode}
                        />
                      )}
                    </div>
                  </Grid>
                </Grid>
                <div>
                  {selectedNode && <Typography variant="h6">
                      {selectedNode}

                      <Tooltip title="Close detail" placement="top-end">
                        <IconButton aria-label="clear" onClick={() => setSelectedNode(undefined)}>
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>


                      <Tooltip title="Exclude file" placement="top-end">
                        <IconButton aria-label="filter-file" onClick={handleFilterFile} color='secondary'>
                          <InsertDriveFile />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Exclude folder" placement="top-end">
                        <IconButton aria-label="filter-folder" onClick={handleFilterFolder} color='secondary'>
                          <FolderOpen />
                        </IconButton>
                      </Tooltip>


                    </Typography>}
                </div>

                {hasNodes && <Graph graph={filteredGraph} options={filteredGraphOptions} events={events} />}

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <div>
                      {selectedNode && (
                        <VirtualizedList
                          itemData={successors}
                          width={secondPaneWidth / 2}
                          height={200}
                          subtitle={`Uses (${successors.length})`}
                          onRowClick={handleSetSelectedNode}
                        />
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div>
                      {selectedNode && (
                        <VirtualizedList
                          itemData={predecessors}
                          width={secondPaneWidth / 2}
                          height={200}
                          subtitle={`Used by (${predecessors.length})`}
                          onRowClick={handleSetSelectedNode}
                        />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </SplitPane>
          </div>;
      }

export default PageDependencyTree;
