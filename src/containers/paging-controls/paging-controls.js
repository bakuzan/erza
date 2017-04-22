import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import {nextPage, prevPage, setItemsPerPage} from '../../actions/paging'

const PagingControls = ({ listType, filters, paging, goBackAPage, goForwardAPage, changeItemsPerPage }) => {
  const { pageInfo: { totalCount, hasNextPage, hasPrevPage }, itemsPerPage, page } = paging;
  const finalPage = Math.ceil(totalCount / itemsPerPage) - 1;
  return (
    <div className="flex-row">
      <div className="button-group centered flex-grow">
        <button type="button"
                className="button ripple"
                onClick={() => goBackAPage(listType, filters)}
                disabled={!hasPrevPage}
        >
        Previous
        </button>
        <div className="center-contents padding-5">
        {
          `${page + 1}/${finalPage + 1}`
        }
        </div>
        <button type="button"
                className="button ripple"
                onClick={() => goForwardAPage(listType, filters)}
                disabled={!hasNextPage}
        >
        Next
        </button>
      </div>
      <div className="has-float-label select-container">
        <select className="select-box"
                name="itemsPerPage"
                value={itemsPerPage}
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
  );
}

PagingControls.propTypes = {
  changeItemsPerPage: PropTypes.func.isRequired,
  goForwardAPage: PropTypes.func.isRequired,
  goBackAPage: PropTypes.func.isRequired,
  paging: PropTypes.object.isRequired,
  listType: PropTypes.string.isRequired
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
)(PagingControls)
