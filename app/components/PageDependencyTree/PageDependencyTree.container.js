import { connect } from 'react-redux';

// Redux machinery
import { getDotGraph } from '../../store/actions/dependency-tree';
import { visNetworkGraph$, dotGraph$ } from '../../store/selectors/dependency-tree';

import PageDependencyTree from './PageDependencyTree';

const mapStateToProps = (state) => ({
  dependencyTree: visNetworkGraph$(state)
})

const mapDispatchToProps = {
  getDotGraph
}

const PageDependencyTreeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDependencyTree);

export default PageDependencyTreeContainer;
