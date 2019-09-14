import { connect } from 'react-redux';

// Redux machinery
import { getDotGraph } from '../../store/actions/dependency-tree';
import {
  visNetworkGraph$,
  dotGraph$,
  networkXGraph$,
  enrichedGraph$
} from '../../store/selectors/dependency-tree';

import PageDependencyTree from './PageDependencyTree';

const mapStateToProps = state => ({
  dependencyTree: enrichedGraph$(state),
  networkXGraph: networkXGraph$(state)
});

const mapDispatchToProps = {
  getDotGraph
}

const PageDependencyTreeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDependencyTree);

export default PageDependencyTreeContainer;
