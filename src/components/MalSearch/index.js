import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { AutocompleteInput, LoadingSpinner } from 'mko';
import MalSearchSuggestionItem from './MalSearchSuggestionItem';

import erzaGQL from 'graphql/fetch';
import { getEventValue, getTimeoutSeconds, debounce, capitalise } from 'utils';

import './MalSearch.scss';

const getFilters = (props) => ({
  title: props.search,
  id: props.itemId,
  malId: props.id
});

const checkIfItemExistsAlready = (query) => (props) => {
  const filters = getFilters(props);
  return erzaGQL({ query, variables: { ...filters } });
};

const Errors = {
  failed: () => 'Mal Search failed to get a response.',
  missing: (type) => `Mal Search failed to find the ${type}.`,
  exists: (type) => `${capitalise(type)} already exists.`
};

const Warnings = {
  malIsDisabled: () => `Mal Search is disabled`
};

const initialState = {
  results: [],
  isFirstQuery: true,
  isFetching: false,
  hasSelected: false,
  alreadyExists: false,
  error: null,
  warning: null
};

class MalSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };

    this.timer = null;
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
    this.timer = debounce(
      () => this.setState({ isFetching: true }, this.handleQueries),
      getTimeoutSeconds(2)
    );
  }

  async handleQueries() {
    // Cancel setState callback if timer was cleared
    if (!this.timer) {
      return;
    }

    const response = await this.checkIfExists(this.props);
    const alreadyExists = !!(response.data && response.data.alreadyExists);

    const error = alreadyExists ? Errors.exists : null;
    const warning = Warnings.malIsDisabled;

    this.setState({
      alreadyExists,
      results: [],
      error,
      warning,
      isFetching: false,
      isFirstQuery: false
    });
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
    const { error, warning } = this.state;
    const { type, search, menuClassName } = this.props;
    const malSearchClasses = classNames('mal-search-container', {
      fresh: this.state.isFirstQuery,
      fetching: this.state.isFetching,
      selected: this.state.hasSelected,
      exists: this.state.alreadyExists
    });

    const hasError = !!error;
    const hasWarning = !!warning && !hasError;

    const menuCompleteClasses = classNames('mal-results', menuClassName);

    return (
      <div className={malSearchClasses}>
        <AutocompleteInput
          id="mal-search"
          attr="title"
          label="title"
          items={this.state.results}
          filter={search}
          onChange={this.handleMalSearch}
          onSelect={this.selectAutocompleteSuggestion}
          disableLocalFilter={true}
          suggestionTemplate={MalSearchSuggestionItem}
          menuClassName={menuCompleteClasses}
        />
        <span
          className={classNames('mal-search-messages', {
            'mal-search-messages--error': hasError,
            'mal-search-messages--warning': hasWarning
          })}
        >
          {hasError && error(type)}
          {hasWarning && warning(type)}
        </span>
        {this.state.isFetching && <LoadingSpinner size="control" />}
      </div>
    );
  }
}

MalSearch.propTypes = {
  id: PropTypes.number,
  itemId: PropTypes.string,
  type: PropTypes.string.isRequired,
  search: PropTypes.string,
  onUserInput: PropTypes.func.isRequired,
  selectMalItem: PropTypes.func.isRequired,
  asyncCheckIfExists: PropTypes.func,
  menuClassName: PropTypes.string
};

export default MalSearch;
