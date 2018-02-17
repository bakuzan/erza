import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ClearableInput from '../../components/clearable-input/clearable-input';
import RelatedSeriesList from './tag-management-related-series-list';

import { Strings } from '../../constants/values';
import { getEventValue } from '../../utils/common';
import * as actions from '../../actions/tags';

class TagManagementDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.item.animeWithTag && !this.props.item.animeWithTag) {
      this.setState({ item: nextProps.item });
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
    this.props.onComplete();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.actions.updateTag(this.state.item);
  }

  render() {
    const { item } = this.state;
    const { onComplete } = this.props;
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
              <button
                type="submit"
                className="button ripple"
                disabled={!canEdit}
              >
                {Strings.edit}
              </button>
            </div>
          </form>
        </div>
        <div className="padding-left-10 padding-right-10 margin-top-20">
          <div>
            <button
              type="button"
              className="button primary ripple"
              onClick={this.handleDelete}
              disabled={!canDelete}
            >
              {Strings.delete}
            </button>
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
          <button type="button" className="button ripple" onClick={onComplete}>
            {Strings.ok}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  item: state.entities.tags.byId[ownProps.selectedTagId]
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  TagManagementDetails
);
