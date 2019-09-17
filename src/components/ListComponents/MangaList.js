import PropTypes from 'prop-types';
import React from 'react';

import Grid from 'components/Grid';
import ItemListItem from './ItemListItem';
import withAsyncPageLoad from './withAsyncPageLoad';
import { Strings } from 'constants/values';

const MangaList = ({ addAction, startAction, ...props }) => (
  <Grid {...props}>
    {(item) => (
      <ItemListItem
        key={item.id}
        type={Strings.manga}
        item={item}
        addAction={addAction}
        startAction={startAction}
      />
    )}
  </Grid>
);

MangaList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  addAction: PropTypes.func,
  startAction: PropTypes.func
};

export default withAsyncPageLoad(MangaList);
