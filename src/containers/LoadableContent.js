import { connect } from 'react-redux';

import LoadableContent from 'meiko/LoadableContent';

const mapStateToProps = (state) => ({
  isFetching: state.isFetching
});

export default connect(mapStateToProps)(LoadableContent);
