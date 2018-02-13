import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import MangaList from '../../components/list-components/manga-list';
import BasePagedList from './base-paged-list';
import { Strings } from '../../constants/values';
import { addChapters } from '../../actions/manga';

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

export default connect(() => ({}), mapDispatchToProps)(PagedMangaList);
