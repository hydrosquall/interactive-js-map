import React, { useCallback, useState, useReducer, useEffect } from 'react';
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

import { remote } from 'electron';

import { PrimaryAppBar } from './Toolbar';
import VirtualizedList from './VirtualizedList';

import styles from './page-dependency-tree.css';


const { dialog } = remote; // Open file dialog

// Placeholder
const DEFAULT_PATH = '/Users/cameron/Projects/open-source/d3-quadtree/src';
const DEFAULT_MAP_FRACTION = 0.5;
const DEFAULT_NODE_COLOR = blue[100];
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
    return grey[300];
  }
  return DEFAULT_NODE_COLOR;
}

const PageDependencyTree = props => {
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

        const { dependencyTree, getDotGraph, networkXGraph } = props;
        const hasNodes = dependencyTree && dependencyTree.nodes.length > 0;
        const pageWidth = window.innerWidth;
        const defaultMapWidth = pageWidth * DEFAULT_MAP_FRACTION; // sizing based on vega-lite sizing
        const [storedWidth, setWidth] = useState(pageWidth - defaultMapWidth);

        const visJsGraphOptions = {
          width: `${storedWidth}`,
          layout: { hierarchical: isHierarchical && hierarchyState }, edges: { color: '#ccc' }, nodes: { shape: 'box', borderWidth: 1 } };

        let graph = dependencyTree;

        if (selectedNode) {
          graph = {
            edges: graph.edges,
            nodes: graph.nodes.map(
              node => {
                const backgroundColor = getNodeColor(node.id, networkXGraph);

                if (node.id === selectedNode) {
                  return { ...node, color: { border: SELECTED_NODE_OUTLINE, background: backgroundColor, highlight: { border: SELECTED_NODE_OUTLINE, background: backgroundColor } } };
                } else {
                  return { ...node, color: {
                    background: backgroundColor,
                    border: backgroundColor
                  } };
                }
              }
            ) };
        }

        if (!isLabelVisible) {
          graph = { edges: graph.edges, nodes: graph.nodes.map(node => ({
              ...node,
              label: undefined
            })) };
        }

        const guiStyle = { bottom: '0px', left: '0px', controlWidth: 400, font: '14px Roboto, sans-serif', label: { fontColor: '#eeeeee' } };

        const ControlPanel = () => <dg.GUI style={guiStyle}>
            <dg.Folder label="Data Settings" expanded>
              <dg.Text label="Filepath" value={filePath} onFinishChange={handleSetFilepath} />
              <dg.Text label="webpack path" value={webpackConfig} onFinishChange={handleSetWebpackConfig} />
            </dg.Folder>

            <dg.Folder label="Graph Settings" expanded>
              <dg.Checkbox label="Use Labels" checked={isLabelVisible} onChange={handleSetLabelVisible} />
              <dg.Folder label="Layout" expanded>
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
            console.log(event);

            if (nodes.length > 0 ) {
              setSelectedNode(nodes[0]);
              console.log(networkXGraph.predecessors(nodes[0]));
              graph = {
                edges: graph.edges,
                nodes: graph.nodes.map(node => {

                  return {
                    ...node,
                    // label: node.id === nodes[0] ? 'foobar' : ''
                  }
                })

              }
            }
            // console.log(event);
            // console.log(networkXGraph);
          }};

        const filteredEdges = graph.edges.filter(edge => edge.from === selectedNode || edge.to === selectedNode);
        const filteredNodes = Array.from(new Set(filteredEdges.flatMap(
              edge => [edge.to, edge.from]
            ))).map(id => ({
          id,
          // label: id,
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


        return <div>
            <PrimaryAppBar {...appBarProps} />
            <SplitPane split="vertical" minSize={250} defaultSize={defaultMapWidth} primary="first" onChange={size => setWidth(size)}>
              <div className={styles.graphContainer} style={{ width: storedWidth }}>
                <div style={{ width: storedWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Typography variant="h6" gutterLeft>
                    {filePath && filePath}
                  </Typography>
                </div>

                {hasNodes && <Graph graph={graph} options={visJsGraphOptions} events={events} />}
                <ControlPanel />
              </div>

              <div styles={{ width: secondPaneWidth }}>
                <Typography variant="h6">
                  {selectedNode && selectedNode}
                </Typography>
                {hasNodes && <Graph graph={filteredGraph} options={filteredGraphOptions} events={events} />}

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <div>
                      {selectedNode && (
                        <VirtualizedList
                          itemData={networkXGraph.successors(
                            selectedNode
                          )}
                          width={secondPaneWidth / 2}
                          height={200}
                          subtitle={'Uses'}
                        />
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <div>
                      {selectedNode && (
                        <VirtualizedList
                          itemData={networkXGraph.predecessors(
                            selectedNode
                          )}
                          width={secondPaneWidth / 2}
                          height={200}
                          subtitle={'Is used by'}
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
