import React, {Component, PropTypes} from 'react'
import {getEventValue, getTimeoutSeconds, debounce} from '../../utils/common'

const searchMyAnimeList = type => search => {
  // TODO query endpoint here
}

class MalSearch extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
    
    this.queryMal = searchMyAnimeList(props.type);
    this.handleMalSearch = this.handleMalSearch.bind(this);
  }
  
  handleMalSearch(event) {
    this.props.onUserChange(event);
    const search = getEventValue(event);
    debounce(() => {
      this.queryMal(search)
          .then(response => this.setState({ results: response }));
    }, getTimeoutSeconds(2))
  }
  
  render() {
    return (
      <div className="mal-search">
        <InputSearch
          search={search}
          onChange={this.handleMalSearch}
        />
        {
          !!this.state.results.length &&
          <ul className="list column one">
            this.state.results.map(item => ({
              <li key={item.id}>
                { item.title }
              </li>
            }))
          </ul>
        }
      </div>
    )
  }
}

MalSearch.propTypes = {
  search: PropTypes.string,
  onUserInput: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default MalSearch
