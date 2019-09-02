import { connect } from 'react-redux';

// Redux machinery
import { getDotGraph } from '../store/actions/dependency-tree';
import { visNetworkGraph$, dotGraph$ } from '../store/selectors/dependency-tree';

import Counter from '../components/Counter';

const mapStateToProps = (state) => ({
  dependencyTree: visNetworkGraph$(state)
})

const mapDispatchToProps = {
  getDotGraph
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
