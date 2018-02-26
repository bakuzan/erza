import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import fetchFromServer from '../../graphql/fetch';
import AutocompleteInput from '../autocomplete-input/autocomplete-input';
import LoadingSpinner from '../loading-spinner/loading-spinner';
import MalSearchSuggestionItem from './mal-search-suggestion-item';

import { getEventValue, getTimeoutSeconds, debounce } from '../../utils/common';
import { Paths } from '../../constants/paths';
import './mal-search.css';

const searchMyAnimeList = type => search =>
  fetchFromServer(Paths.build(Paths.malSearch, { type, search }));

class MalSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isFirstQuery: true,
      isFetching: false,
      hasSelected: false
    };

    this.queryMal = searchMyAnimeList(props.type);
    this.handleMalSearch = this.handleMalSearch.bind(this);
    this.selectAutocompleteSuggestion = this.selectAutocompleteSuggestion.bind(
      this
    );
  }

  componentDidMount() {
    if (!this.props.id) return;
    this.queryMal(this.props.search).then(response => {
      const item = response.find(x => x.id === this.props.id);
      if (!item) return; // TODO Present warning message that the search couldnt find the entry id you have saved...
      this.props.selectMalItem(item);
    });
  }

  fetchMalResults() {
    debounce(() => {
      this.setState({ isFetching: true });
      this.queryMal(this.props.search).then(response => {
        this.setState({
          results: response,
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
    if (this.state.hasSelected) return;
    this.fetchMalResults();
  }

  render() {
    const { search } = this.props;
    const malSearchClasses = classNames('mal-search-container', {
      fresh: this.state.isFirstQuery,
      fetching: this.state.isFetching,
      selected: this.state.hasSelected
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
        {this.state.isFetching && <LoadingSpinner size="control" />}
      </div>
    );
  }
}

MalSearch.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string.isRequired,
  search: PropTypes.string,
  onUserInput: PropTypes.func.isRequired,
  selectMalItem: PropTypes.func.isRequired
};

export default MalSearch;
