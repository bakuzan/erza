import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { lazyLoader } from 'components/LazyLoaders';
import {
  loadAnimeByIdForEdit,
  createAnime,
  editAnime
} from '../../actions/anime';

import { Strings } from '../../constants/values';

const BaseCreate = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemCreation' */ '../BaseCreate')
);

const mapStateToProps = (state, ownProps) => ({
  type: Strings.anime,
  itemId: ownProps.match.params.id
    ? Number(ownProps.match.params.id)
    : undefined
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      loadById: loadAnimeByIdForEdit,
      create: createAnime,
      edit: editAnime
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseCreate);
