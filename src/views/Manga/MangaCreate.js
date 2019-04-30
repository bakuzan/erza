import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { lazyLoader } from 'components/LazyLoaders';
import {
  loadMangaByIdForEdit,
  createManga,
  editManga
} from '../../actions/manga';

import { Strings } from '../../constants/values';

const BaseCreate = lazyLoader(() =>
  import(/* webpackChunkName: 'ItemCreation' */ '../BaseCreate')
);

const mapStateToProps = (state, ownProps) => ({
  type: Strings.manga,
  itemId: ownProps.match.params.id
    ? Number(ownProps.match.params.id)
    : undefined
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      loadById: loadMangaByIdForEdit,
      create: createManga,
      edit: editManga
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseCreate);
