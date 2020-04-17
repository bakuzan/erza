import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { capitalise } from 'ayaka/capitalise';
import ClearableInput from 'meiko/ClearableInput';
import LoadableContent from 'containers/LoadableContent';
import TagList from 'components/ListComponents/TagList';
import { lazyLoader } from 'components/LazyLoaders';

import Paths from 'constants/paths';
import Strings from 'constants/strings';
import { mapStateToEntityList } from 'utils/data';
import * as actions from 'actions/tags';

import './TagManagement.scss';

const TagGraph = lazyLoader(() =>
  import(/* webpackChunkName: 'TagGraph' */ '../TagGraph')
);

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
        <div
          className="filters-container"
          style={{ minHeight: `calc(100vh - 50px)` }}
        >
          <div>
            <ClearableInput
              id="search"
              name="search"
              label="Search"
              value={this.state.search}
              onChange={this.handleUserInput}
            />
          </div>

          <div className="flex-spacer"></div>

          <div>
            <p>View graphs to see a network of the tag relations</p>
            <div style={{ display: 'flex' }}>
              {[Strings.anime, Strings.manga].map((value) => (
                <NavLink
                  key={value}
                  className="erza-link"
                  style={{ margin: `0 10px` }}
                  to={`${Paths.base}${Paths.tagGraph}${value}`}
                  onMouseEnter={() => TagGraph.preload()}
                >
                  {capitalise(value)}
                </NavLink>
              ))}
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TagManagementList);
