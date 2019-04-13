import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { AutocompleteInput, LoadingSpinner } from 'mko';
import MalSearchSuggestionItem from './MalSearchSuggestionItem';

import {
  getEventValue,
  getTimeoutSeconds,
  debounce,
  capitalise,
  isArray
} from 'utils';
import fetchFromServer from 'graphql/fetch';
import { Paths } from 'constants/paths';

import './MalSearch.scss';

const getFilters = (props) => ({
  title: props.search,
  id: props.itemId,
  malId: props.id
});

const hasMalError = (data) => !data || !data.success || !isArray(data);

const checkIfItemExistsAlready = (query) => (props) => {
  const filters = getFilters(props);
  return fetchFromServer(`${Paths.graphql.base}${query(filters)}`);
};

const searchMyAnimeList = (type) => (search) =>
  fetchFromServer(Paths.build(Paths.malSearch, { type, search }));

const Errors = {
  failed: () => 'Mal Search failed to get a response.',
  missing: (type) => `Mal Search failed to find the ${type}.`,
  exists: (type) => `${capitalise(type)} already exists.`
};

const initialState = {
  results: [],
  isFirstQuery: true,
  isFetching: false,
  hasSelected: false,
  alreadyExists: false,
  error: null
};

class MalSearch extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    itemId: PropTypes.string,
    type: PropTypes.string.isRequired,
    search: PropTypes.string,
    onUserInput: PropTypes.func.isRequired,
    selectMalItem: PropTypes.func.isRequired,
    asyncCheckIfExists: PropTypes.func,
    menuClassName: PropTypes.string
  };

  timer = null;
  queryMal = null;
  checkIfExists = null;

  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };

    this.timer = null;
    this.queryMal = searchMyAnimeList(props.type);
    this.checkIfExists = !!props.asyncCheckIfExists
      ? checkIfItemExistsAlready(props.asyncCheckIfExists)
      : () => Promise.resolve({});

    this.handleMalSearch = this.handleMalSearch.bind(this);
    this.selectAutocompleteSuggestion = this.selectAutocompleteSuggestion.bind(
      this
    );
  }

  componentDidMount() {
    if (!this.props.id) {
      return;
    }

    this.handleQueries();
  }

  componentDidUpdate(prevProps, prevState) {
    const hasSelectedChanged = prevState.hasSelected !== this.state.hasSelected;
    const hasSearchChanged = this.props.search !== prevProps.search;
    if (!hasSearchChanged && !hasSelectedChanged) {
      return;
    }

    if (this.props.search) {
      this.fetchMalResults();
    } else {
      this.setState(initialState);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  fetchMalResults() {
    this.timer = debounce(() => {
      this.setState({ isFetching: true }, this.handleQueries);
    }, getTimeoutSeconds(2));
  }

  async handleQueries() {
    const response = await this.checkIfExists(this.props);
    const alreadyExists = !!(response.data && response.data.alreadyExists);
    const results = await this.queryMal(this.props.search);

    const malError = hasMalError(results);
    const error = alreadyExists
      ? Errors.exists
      : malError
      ? Errors.failed
      : null;

    this.setState(
      {
        alreadyExists,
        results: !malError ? results : [],
        error,
        isFetching: false,
        isFirstQuery: false
      },
      () => {
        if (this.props.id && !this.state.hasSelected) {
          this.selectAutocompleteSuggestion(this.props.id);
        }
      }
    );
  }

  selectAutocompleteSuggestion(selectedId, forceRemove = false) {
    const item = this.state.results.find((x) => x.id === selectedId);
    if (forceRemove || item) {
      this.props.selectMalItem(item);
    }
    this.setState((prev) => ({
      hasSelected: !!item,
      error: !item ? Errors.missing : prev.error
    }));
  }

  handleMalSearch(event) {
    const search = getEventValue(event.target);
    this.props.onUserInput(event);
    if (!search) {
      return this.selectAutocompleteSuggestion(null, true);
    }
  }

  render() {
    const { type, search, menuClassName } = this.props;
    const malSearchClasses = classNames('mal-search-container', {
      fresh: this.state.isFirstQuery,
      fetching: this.state.isFetching,
      selected: this.state.hasSelected,
      exists: this.state.alreadyExists
    });
    const menuCompleteClasses = classNames('mal-results', menuClassName);
    const clearableInputClasses = {
      clearInputButtonClass: classNames('mal-clear-input')
    };

    return (
      <div className={malSearchClasses}>
        <AutocompleteInput
          id="mal-search"
          attr="title"
          items={this.state.results}
          filter={search}
          onChange={this.handleMalSearch}
          onSelect={this.selectAutocompleteSuggestion}
          disableLocalFilter={true}
          suggestionTemplate={MalSearchSuggestionItem}
          menuClassName={menuCompleteClasses}
          clearableInputProps={clearableInputClasses}
        />
        <span className={classNames('mal-search-messages')}>
          {!!this.state.error && this.state.error(type)}
        </span>
        {this.state.isFetching && <LoadingSpinner size="control" />}
      </div>
    );
  }
}

export default MalSearch;
