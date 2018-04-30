import { connect } from 'react-redux';

import { Loaders } from 'meiko';

const mapStateToProps = state => ({
  isFetching: state.isFetching
});

export default connect(mapStateToProps)(Loaders.LoadableContent);
