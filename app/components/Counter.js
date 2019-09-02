import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Graph from 'react-graph-vis';
import * as dg from 'dis-gui';


const { dialog } = require('electron').remote; // browse the filesystem!


import styles from './Counter.css';
import routes from '../constants/routes';

const graphOptions = {
    layout: {
        hierarchical: false
    },
    edges: {
        color: "#000000"
    }
};


class Counter extends Component<Props> {

  handleOpenFile = () => {
    console.log({dialog});
    const promise = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
    console.log({promise});
    promise.then(payload => {
            const { canceled, filePaths, bookmarks} = payload;
            if (canceled) {
              return;
            }
            console.log(filePaths);
          })
  }


  render() {
    const {
      dependencyTree,
      getDotGraph,
      counter
    } = this.props;

    const hasNodes = dependencyTree.nodes.length > 0;

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        <dg.GUI>
          <dg.Text label='Text' value='Hello world!'/>
          <dg.Number label='Number' value={65536}/>
          <dg.Number label='Range' value={512} min={-1024} max={1024} step={64}/>
          <dg.Checkbox label='Checkbox' checked={true}/>
          <dg.Select label='Select' options={['Option one', 'Option two', 'Option three']}/>
          <dg.Button label='Button'/>
          <dg.Folder label='Folder' expanded={true}>
            <dg.Text label='Text' value='Hello folder!'/>
            <dg.Number label='Number' value={2}/>
            <dg.Folder label='Subfolder' expanded={true}>
              <dg.Text label='Text' value='Hello subfolder!'/>
              <dg.Number label='Number' value={2}/>
            </dg.Folder>
          </dg.Folder>
        </dg.GUI>

        <div
          className={styles.graphContainer}
        >
            {hasNodes &&
            <Graph
            graph={dependencyTree}
            options={graphOptions}
            />}
        </div>

        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={() => getDotGraph()}
            data-tclass="btn"
            type="button"
          >
            Fetch Graph
          </button>
          <button
            className={styles.btn}
            onClick={this.handleOpenFile}
            type="button"
          >
            Select File
          </button>
        </div>
      </div>
    );
  }
}

export default Counter;
