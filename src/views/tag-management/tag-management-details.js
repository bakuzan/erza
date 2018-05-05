import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ClearableInput, Loaders, Button } from 'meiko';
import RelatedSeriesList from './tag-management-related-series-list';

import { Paths } from '../../constants/paths';
import { Strings } from '../../constants/values';
import { getEventValue } from '../../utils/common';
import * as actions from '../../actions/tags';

class TagManagementDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetailExit = this.handleDetailExit.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadTag(this.props.tagId);
  }

  componentDidUpdate(prevProps) {
    if (
      !!this.props.item &&
      !!this.props.item.animeWithTag &&
      (!this.state.item || (!this.props.isFetching && prevProps.isFetching))
    ) {
      this.setState({ item: this.props.item });
    }
  }

  handleUserInput({ target }) {
    const value = getEventValue(target);
    this.setState(prev => ({
      item: {
        ...prev.item,
        [target.name]: value
      }
    }));
  }

  handleDelete() {
    this.props.actions.deleteTag(this.props.item._id);
    this.handleDetailExit();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.actions.updateTag(this.state.item);
  }

  handleDetailExit() {
    this.props.history.push(`${Paths.base}${Paths.tagManagement}`);
  }

  render() {
    const { item } = this.state;
    if (!item) return <Loaders.LoadingSpinner size="fullscreen" />;

    const canEdit = item.name.length > 1;
    const canDelete =
      (!item.animeWithTag || item.animeWithTag.length === 0) &&
      (!item.mangaWithTag || item.mangaWithTag.length === 0);

    return (
      <div>
        <div className="flex width-50 padding-10">
          <form name="tag-edit" onSubmit={this.handleSubmit}>
            <ClearableInput
              name="name"
              label="name"
              placeholder="name"
              value={item.name}
              onChange={this.handleUserInput}
            />
            <div>
              <Button type="submit" className="ripple" disabled={!canEdit}>
                {Strings.edit}
              </Button>
            </div>
          </form>
        </div>
        <div className="padding-left-10 padding-right-10 margin-top-20">
          <div>
            <Button
              btnStyle="primary"
              className="ripple"
              onClick={this.handleDelete}
              disabled={!canDelete}
            >
              {Strings.delete}
            </Button>
          </div>
          <div className="flex-row">
            <RelatedSeriesList
              seriesType={Strings.anime}
              title="Anime series"
              items={item.animeWithTag}
            />
            <RelatedSeriesList
              seriesType={Strings.manga}
              title="Manga series"
              items={item.mangaWithTag}
            />
          </div>
        </div>
        <div className="button-group right-aligned">
          <Button className="ripple" onClick={this.handleDetailExit}>
            {Strings.ok}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  tagId: ownProps.match.params.tagId,
  item: state.entities.tags.byId[ownProps.match.params.tagId]
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  TagManagementDetails
);
