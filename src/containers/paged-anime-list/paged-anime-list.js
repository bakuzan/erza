import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AnimeList from '../../components/anime-list/anime-list'
import {nextPage, prevPage, setItemsPerPage} from '../../actions/list-settings'

class PagedAnimeList extends Component {

  selectPageOfItems({ page, itemsPerPage }, items) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }

  render() {
    const {
      changeItemsPerPage,
      goForwardAPage,
      goBackAPage,
      items,
      paging
    } = this.props;
    const finalPage = Math.ceil(items.length / paging.itemsPerPage) - 1;
    const pagedItems = this.selectPageOfItems(paging, items);

    return (
      <div className="flex-column flex-grow">
        <div className="flex-row">
          <div className="button-group centered flex-grow">
            <button type="button"
                    className="button ripple"
                    onClick={goBackAPage}
                    disabled={paging.page === 0}
            >
            Previous
            </button>
            <button type="button"
                    className="button ripple"
                    onClick={goForwardAPage}
                    disabled={paging.page === finalPage}
            >
            Next
            </button>
          </div>
          <div className="has-float-label select-container">
            <select className="select-box"
                    name="itemsPerPage"
                    selected={paging.itemsPerPage}
                    onChange={(e) => changeItemsPerPage(e)}
            >
              {
                [5, 10, 15, 25].map(item => (
                  <option key={item}
                          value={item}
                  >
                  { item }
                  </option>
                ))
              }
            </select>
            <label>items per page</label>
          </div>
        </div>
        <AnimeList
            items={pagedItems}
        />
      </div>
    );
  }

}

PagedAnimeList.PropTypes = {
  changeItemsPerPage: PropTypes.func.isRequired,
  goForwardAPage: PropTypes.func.isRequired,
  goBackAPage: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  paging: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  paging: state.paging
})

const mapDispatchToProps = ({
  goBackAPage: prevPage,
  goForwardAPage: nextPage,
  changeItemsPerPage: setItemsPerPage
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagedAnimeList)
