import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import MangaList from 'components/ListComponents/MangaList';
import BasePagedList from './BasePagedList';
import { Strings } from 'constants/values';
import { addChapters } from 'actions/manga';

const PagedMangaList = ({ items, filters, addChapters }) => (
  <BasePagedList
    type={Strings.manga}
    list={MangaList}
    items={items}
    filters={filters}
    addHistoryToItem={addChapters}
  />
);

PagedMangaList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object
};

const mapDispatchToProps = {
  addChapters
};

export default connect(
  () => ({}),
  mapDispatchToProps
)(PagedMangaList);
