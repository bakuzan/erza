import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AnimeList from 'components/ListComponents/AnimeList';
import BasePagedList from './BasePagedList';
import { Strings } from 'constants/values';
import { addEpisodes } from 'actions/anime';

const PagedAnimeList = ({ items, filters, addEpisodes }) => (
  <BasePagedList
    type={Strings.anime}
    list={AnimeList}
    items={items}
    filters={filters}
    addHistoryToItem={addEpisodes}
  />
);

PagedAnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object
};

const mapDispatchToProps = {
  addEpisodes
};

export default connect(
  () => ({}),
  mapDispatchToProps
)(PagedAnimeList);
