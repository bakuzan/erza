import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { SelectBox } from 'mko';
import { selectPagingForType } from 'reducers/paging';
import { setItemsPerPage } from 'actions/paging';
import { pageSizes } from 'constants/values';

import './PagingControls.scss';

const PagingControls = ({
  className,
  listType,
  filters,
  pageSizeOptions = pageSizes.default,
  paging,
  changeItemsPerPage
}) => {
  const { pageInfo, size } = paging;
  const PAGE_SIZE_OPTIONS = pageSizeOptions.map((x) => ({ value: x, text: x }));

  return (
    <div className={classNames('paging-controls', className)}>
      <div className="paging-controls__content-wrapper flex flex--grow flex--row">
        {!!pageInfo.total && (
          <div className="paging-controls__item-count">{`Found ${
            pageInfo.total
          } item(s)`}</div>
        )}
      </div>
      <SelectBox
        containerClassName="paging-controls__control"
        id="itemsPerPage"
        name="itemsPerPage"
        text="items per page"
        value={size}
        onChange={(e) => changeItemsPerPage(e, listType)}
        options={PAGE_SIZE_OPTIONS}
      />
    </div>
  );
};

PagingControls.propTypes = {
  changeItemsPerPage: PropTypes.func.isRequired,
  paging: PropTypes.object.isRequired,
  listType: PropTypes.string.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number)
};

const mapStateToProps = (state, ownProps) => ({
  paging: selectPagingForType(state, ownProps)
});

const mapDispatchToProps = {
  changeItemsPerPage: setItemsPerPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagingControls);
