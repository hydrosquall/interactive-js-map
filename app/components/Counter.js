import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Graph from 'react-graph-vis';


import styles from './Counter.css';
import routes from '../constants/routes';

const graphOptions = {
    layout: {
        hierarchical: true
    },
    edges: {
        color: "#000000"
    }
};


class Counter extends Component<Props> {
  render() {
    const {
      dependencyTree,
      getDotGraph,
      counter
    } = this.props;

    const hasNodes = dependencyTree.nodes.length > 0;
    console.log(dependencyTree.node);

    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>

        {hasNodes &&
          <div
            className={styles.graphContainer}
          >
            <Graph
            graph={dependencyTree}
            options={graphOptions}
          />


        </div>
        }
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={() => getDotGraph()}
            data-tclass="btn"
            type="button"
          >
            async button
          </button>
        </div>
      </div>
    );
  }
}

export default Counter;
