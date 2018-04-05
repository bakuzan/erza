import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import fetchFromServer from '../../graphql/fetch';
import DataChecks from '../../graphql/query/list-items';
import AutocompleteInput from '../autocomplete-input/autocomplete-input';
import LoadingSpinner from '../loaders/loading-spinner/loading-spinner';
import MalSearchSuggestionItem from './mal-search-suggestion-item';

import {
  getEventValue,
  getTimeoutSeconds,
  debounce,
  capitalise
} from '../../utils/common';
import { Paths } from '../../constants/paths';
import './mal-search.css';

const getFilters = props => ({
  title: props.search,
  id: props.itemId,
  malId: props.id
});

const checkIfItemExistsAlready = query => props =>
  fetchFromServer(`${Paths.graphql.base}${query(getFilters(props))}`);

const searchMyAnimeList = type => search =>
  fetchFromServer(Paths.build(Paths.malSearch, { type, search }));

const Errors = {
  failed: () => 'Mal Search failed to get a response.',
  missing: type => `Mal Search failed to find the ${type}.`,
  exists: type => `${capitalise(type)} already exists.`
};

class MalSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isFirstQuery: true,
      isFetching: false,
      hasSelected: false,
      error: null
    };

    this.queryMal = searchMyAnimeList(props.type);
    this.checkIfExists = checkIfItemExistsAlready(
      DataChecks.checkIfNameExists(props.type)
    );
    this.handleMalSearch = this.handleMalSearch.bind(this);
    this.selectAutocompleteSuggestion = this.selectAutocompleteSuggestion.bind(
      this
    );
  }

  async componentDidMount() {
    if (!this.props.id) return;

    const response = await this.queryMal(this.props.search);
    if (!response) return this.setState({ error: Errors.failed });

    const item = response.find(x => x.id === this.props.id);
    if (!item) return this.setState({ error: Errors.missing });

    this.props.selectMalItem(item);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.hasSelected !== this.state.hasSelected ||
      this.props.search !== prevProps.search
    ) {
      this.fetchMalResults();
    }
  }

  fetchMalResults() {
    debounce(() => {
      this.setState({ isFetching: true }, async () => {
        const alreadyExists = await this.checkIfExists(this.props);
        const results = await this.queryMal(this.props.search);

        const error = !results
          ? Errors.failed
          : alreadyExists ? Errors.exists : null;

        this.setState({
          alreadyExists,
          results,
          error,
          isFetching: false,
          isFirstQuery: false
        });
      });
    }, getTimeoutSeconds(2));
  }

  selectAutocompleteSuggestion(selectedId) {
    const item = this.state.results.find(x => x.id === selectedId);
    this.props.selectMalItem(item);
    this.setState({ hasSelected: !!item });
  }

  handleMalSearch(event) {
    const search = getEventValue(event.target);
    this.props.onUserInput(event);
    if (!search) return this.selectAutocompleteSuggestion(null);
  }

  render() {
    const { search } = this.state;
    const { type } = this.props;
    const malSearchClasses = classNames('mal-search-container', {
      fresh: this.state.isFirstQuery,
      fetching: this.state.isFetching,
      selected: this.state.hasSelected,
      exists: this.state.alreadyExists
    });

    return (
      <div className={malSearchClasses}>
        <AutocompleteInput
          attr="title"
          items={this.state.results}
          filter={search}
          onChange={this.handleMalSearch}
          onSelect={this.selectAutocompleteSuggestion}
          disableLocalFilter={true}
          suggestionTemplate={MalSearchSuggestionItem}
        />
        <span className="mal-search-messages">
          {!!this.state.error && this.state.error(type)}
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
  selectMalItem: PropTypes.func.isRequired
};

export default MalSearch;
