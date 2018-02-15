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
    console.log('Delete Tag');
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
    return (
      <div>
        {console.log(
          '%c TM - edit :: implementation in progress',
          'color: orange',
          this.props,
          this.state
        )}
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
              <button type="submit" className="button ripple">
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
            >
              {Strings.delete}
            </button>
          </div>
          <div className="flex">
            <RelatedSeriesList
              seriesType={Strings.anime}
              items={item.animeWithTag}
            />
            <RelatedSeriesList
              seriesType={Strings.manga}
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
  item: state.entities.tags.find(x => x._id === ownProps.selectedTagId)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  TagManagementDetails
);
