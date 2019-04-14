import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { SelectBox } from 'mko';
import { Button } from 'components/Buttonised';
import { selectPagingForType } from 'reducers/paging';
import { nextPage, prevPage, setItemsPerPage } from 'actions/paging';
import { pageSizes } from 'constants/values';

import './PagingControls.scss';

const PagingControls = ({
  listType,
  filters,
  pageSizeOptions = pageSizes.default,
  paging,
  goBackAPage,
  goForwardAPage,
  changeItemsPerPage
}) => {
  const { pageInfo, itemsPerPage, page } = paging;
  const finalPage = Math.ceil(pageInfo.totalCount / itemsPerPage) - 1;
  const PAGE_SIZE_OPTIONS = pageSizeOptions.map((x) => ({ value: x, text: x }));

  return (
    <div className="paging-controls flex flex--row">
      <div className="flex flex--grow">
        <div className="button-group button-group--center flex flex--grow">
          <Button
            aria-label="Previous Page"
            onClick={() => goBackAPage(listType, filters)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <div className="center-contents padding-5">
            {`${page + 1}/${finalPage + 1}`}
          </div>
          <Button
            aria-label="Next Page"
            onClick={() => goForwardAPage(listType, filters)}
            disabled={page === finalPage || !pageInfo.totalCount}
          >
            Next
          </Button>
        </div>
        {!!pageInfo.totalCount && (
          <div className="paging-controls__item-count">{`Found ${
            pageInfo.totalCount
          } item(s)`}</div>
        )}
      </div>
      <SelectBox
        id="itemsPerPage"
        name="itemsPerPage"
        text="items per page"
        value={itemsPerPage}
        onChange={(e) => changeItemsPerPage(e, listType)}
        options={PAGE_SIZE_OPTIONS}
      />
    </div>
  );
};

PagingControls.propTypes = {
  changeItemsPerPage: PropTypes.func.isRequired,
  goForwardAPage: PropTypes.func.isRequired,
  goBackAPage: PropTypes.func.isRequired,
  paging: PropTypes.object.isRequired,
  listType: PropTypes.string.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number)
};

const mapStateToProps = (state, ownProps) => ({
  paging: selectPagingForType(state, ownProps)
});

const mapDispatchToProps = {
  goBackAPage: prevPage,
  goForwardAPage: nextPage,
  changeItemsPerPage: setItemsPerPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagingControls);
