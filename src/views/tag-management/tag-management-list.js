import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../components/loaders/loading-spinner/loading-spinner';
import ClearableInput from '../../components/clearable-input/clearable-input';
import TagList from '../../components/list-components/tag-list';

import { mapStateToEntityList } from '../../utils/data';
import * as actions from '../../actions/tags';

import './tag-management.css';

const loadData = props => props.actions.loadTagList();
const initialState = {
  search: ''
};

class TagManagementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState };

    this.handleUserInput = this.handleUserInput.bind(this);
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

  render() {
    const items = this.props.tags.filter(
      x => x.name.indexOf(this.state.search) > -1
    );

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
        {!this.props.isFetching && <TagList items={items} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(TagManagementList);
