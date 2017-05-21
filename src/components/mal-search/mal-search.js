import React, {Component, PropTypes} from 'react'
import {fetchFromServer} from '../../graphql/fetch'
import AutocompleteInput from '../autocomplete-input/autocomplete-input'
import LoadingSpinner from '../loading-spinner/loading-spinner';
import {getEventValue, getTimeoutSeconds, debounce} from '../../utils/common'

const searchMyAnimeList = type => search => fetchFromServer(`/api/mal-search/${type}?search=${search}`);

class MalSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isFetching: false
    }

    this.queryMal = searchMyAnimeList(props.type);
    this.handleMalSearch = this.handleMalSearch.bind(this);
    this.selectAutocompleteSuggestion = this.selectAutocompleteSuggestion.bind(this);
  }

  selectAutocompleteSuggestion(selectedId) {
    const item = this.state.results.find(x => x.id === selectedId);
    this.props.selectMalItem(item);
  }

  handleMalSearch(event) {
    this.props.onUserInput(event);
    const search = getEventValue(event);
    debounce(() => {
      this.setState({ isFetching: true })
      this.queryMal(search).then(response => this.setState({ results: response, isFetching: false }));
    }, getTimeoutSeconds(2))
  }

  render() {
    const { search } = this.props;
    return (
      <div className="mal-search-container">
        <AutocompleteInput
          attr="title"
          items={this.state.results}
          filter={search}
          onChange={this.handleMalSearch}
          onSelect={this.selectAutocompleteSuggestion}
        />
        {
          this.state.isFetching &&
          <LoadingSpinner />
        }
      </div>
    );
  }
}

MalSearch.propTypes = {
  type: PropTypes.string.isRequired,
  search: PropTypes.string,
  onUserInput: PropTypes.func.isRequired,
  selectMalItem: PropTypes.func.isRequired
}

export default MalSearch
