import { connect } from 'react-redux';

// Redux machinery
import { getFileTree } from '../../store/actions/file-tree';
import { fileTreeList$ } from '../../store/selectors/file-tree';

import PageFileTree from './PageFileTree';

const mapStateToProps = state => ({
  fileTreeList: fileTreeList$(state)
});

const mapDispatchToProps = {
  getFileTree
};

const PageFileTreeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageFileTree);
// mapStateToProps,
// mapDispatchToProps

export default PageFileTreeContainer;
