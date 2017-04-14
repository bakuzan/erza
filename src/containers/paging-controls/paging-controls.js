import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import {nextPage, prevPage, setItemsPerPage} from '../../actions/list-settings'

const PagingControls = ({ totalItems, paging, goBackAPage, goForwardAPage, changeItemsPerPage }) => {
  const finalPage = Math.ceil(totalItems / paging.itemsPerPage) - 1;
  return (
    <div className="flex-row">
      <div className="button-group centered flex-grow">
        <button type="button"
                className="button ripple"
                onClick={goBackAPage}
                disabled={paging.page === 0}
        >
        Previous
        </button>
        <div className="center-contents padding-5">
        {
          `${paging.page + 1}/${finalPage + 1}`
        }
        </div>
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
                value={paging.itemsPerPage}
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
  totalItems: PropTypes.number.isRequired,
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
)(PagingControls)
