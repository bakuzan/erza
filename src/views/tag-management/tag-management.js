import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import ClearableInput from '../../components/clearable-input/clearable-input';
import TagList from '../../components/list-components/tag-list';
import TagManagementDetails from './tag-management-details';

import { mapStateToEntityList } from '../../utils/data';
import * as actions from '../../actions/tags';

const loadData = props => props.actions.loadTagList();
const initialState = {
  search: '',
  selectedTagId: null
};

class TagManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
  }

  componentDidMount() {
    loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAdult !== this.props.isAdult) {
      loadData(nextProps);
      this.setState(initialState);
    }
  }

  handleUserInput(event) {
    const search = event.target.value.toLowerCase();
    this.setState({ search });
  }

  handleTagClick(selectedTagId) {
    if (selectedTagId) this.props.actions.loadTag(selectedTagId);
    this.setState({ selectedTagId });
  }

  render() {
    if (this.state.selectedTagId) {
      return (
        <TagManagementDetails
          selectedTagId={this.state.selectedTagId}
          onComplete={() => this.handleTagClick(null)}
        />
      );
    }

    const items = this.props.tags.filter(
      x => x.name.indexOf(this.state.search) > -1
    );

    console.log('%c TM', 'color: magenta', this.props, this.state);
    return (
      <div className="flex-row">
        <div className="filters-container">
          <div>
            <ClearableInput
              value={this.state.search}
              onChange={this.handleUserInput}
            />
          </div>
        </div>
        {this.props.isFetching && <LoadingSpinner size="fullscreen" />}
        {!this.props.isFetching && (
          <TagList items={items} onClick={this.handleTagClick} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  tags: mapStateToEntityList(state.entities.tags)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TagManagement);
