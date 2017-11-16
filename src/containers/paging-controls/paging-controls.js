import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import {nextPage, prevPage, setItemsPerPage} from '../../actions/paging'
import {pageSizes} from '../../constants/values'

const PagingControls = ({ listType, filters, pageSizeOptions = pageSizes.default, paging, goBackAPage, goForwardAPage, changeItemsPerPage }) => {
  const { pageInfo, itemsPerPage, page } = paging;
  const finalPage = Math.ceil(pageInfo.totalCount / itemsPerPage[listType]) - 1;
  return (
    <div className="flex-row">
      <div className="button-group centered flex-grow">
        <button type="button"
                className="button ripple"
                onClick={() => goBackAPage(listType, filters)}
                disabled={page === 0}
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
                disabled={page === finalPage}
        >
        Next
        </button>
      </div>
      <div className="has-float-label select-container">
        <select className="select-box"
                name="itemsPerPage"
                value={itemsPerPage[listType]}
                onChange={(e) => changeItemsPerPage(e, listType)}
        >
          {
            pageSizeOptions.map(item => (
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
  listType: PropTypes.string.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number)
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
