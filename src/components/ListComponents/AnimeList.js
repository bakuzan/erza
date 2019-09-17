import PropTypes from 'prop-types';
import React from 'react';

import Grid from 'components/Grid';
import ItemListItem from './ItemListItem';
import withAsyncPageLoad from './withAsyncPageLoad';
import { Strings } from 'constants/values';

const AnimeList = ({ addAction, startAction, ...props }) => (
  <Grid {...props}>
    {(item) => (
      <ItemListItem
        key={item.id}
        type={Strings.anime}
        item={item}
        addAction={addAction}
        startAction={startAction}
      />
    )}
  </Grid>
);

AnimeList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  addAction: PropTypes.func,
  startAction: PropTypes.func
};

export default withAsyncPageLoad(AnimeList);
