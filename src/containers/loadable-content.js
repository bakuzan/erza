import { connect } from 'react-redux';

import LoadableContent from '../components/loaders/loadable-content';

const mapStateToProps = state => ({
  isFetching: state.isFetching
});

export default connect(mapStateToProps)(LoadableContent);
