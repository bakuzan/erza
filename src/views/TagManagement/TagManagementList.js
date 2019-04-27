import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet-async';

import { ClearableInput } from 'mko';
import LoadableContent from 'containers/LoadableContent';
import TagList from 'components/ListComponents/TagList';

import { mapStateToEntityList } from 'utils/data';
import * as actions from 'actions/tags';

import './TagManagement.scss';

const loadData = (props) => props.actions.loadTagList();
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

  componentDidUpdate(prevProps) {
    if (prevProps.isAdult === this.props.isAdult) {
      return null;
    }

    loadData(this.props);
    this.setState(initialState);
  }

  handleUserInput(event) {
    const search = event.target.value.toLowerCase();
    this.setState({ search });
  }

  render() {
    const items = this.props.tags.filter(
      (x) => x.name.indexOf(this.state.search) > -1
    );

    return (
      <div className="flex flex--row">
        <Helmet>
          <title>Tag Management</title>
        </Helmet>
        <div className="filters-container">
          <div>
            <ClearableInput
              id="search"
              name="search"
              label="Search"
              value={this.state.search}
              onChange={this.handleUserInput}
            />
          </div>
        </div>
        <LoadableContent>
          <TagList items={items} />
        </LoadableContent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAdult: state.isAdult,
  tags: mapStateToEntityList(state.entities.tags)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagManagementList);
