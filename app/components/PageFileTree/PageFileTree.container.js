import { connect } from 'react-redux';

// Redux machinery
import { getFileTree, setFilePath } from '../../store/actions/file-tree';
import {
  fileTreeList$,
  searchResults$,
  searchResultsByFileList$,
  filePath$
} from '../../store/selectors/file-tree';

import PageFileTree from './PageFileTree';

const mapStateToProps = state => ({
  fileTreeList: fileTreeList$(state),
  searchResults: searchResults$(state),
  searchResultsByFile: searchResultsByFileList$(state),
  filePath: filePath$(state)
});

const mapDispatchToProps = {
  getFileTree,
  setFilePath
};

const PageFileTreeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageFileTree);
// mapStateToProps,
// mapDispatchToProps

export default PageFileTreeContainer;
