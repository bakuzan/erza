import PropTypes from 'prop-types';
import React from 'react';

import { nano } from 'meiko/styles/nano';
import { ButtonisedNavLink } from 'components/Buttonised';
import Grid from 'components/Grid';
import Paths from 'constants/paths';

import media from 'styles/nano/media';

const containerStyle = nano.rule({
  display: 'flex',
  width: '100%'
});

const gridStyle = nano.rule({
  gridAutoRows: 'max-content',
  gridTemplateColumns: 'repeat(auto-fill, minmax(25%, 1fr))',
  ...media.get('xxs')({
    gridTemplateColumns: 'repeat(auto-fill, minmax(50%, 1fr))'
  })
});

const itemStyle = nano.rule({
  display: 'inline-block',
  whiteSpace: 'pre-line'
});

const TagListItem = ({ item }) => (
  <li className="tag-item">
    <ButtonisedNavLink
      className={itemStyle}
      to={`${Paths.base}${Paths.tagManagement}${item.id}`}
      title={item.name}
      aria-label={item.name}
    >
      <span aria-hidden={true}>{item.name}</span>
    </ButtonisedNavLink>
  </li>
);

const TagList = (props) => (
  <Grid {...props} containerClassName={containerStyle} className={gridStyle}>
    {(item) => <TagListItem key={item.id} item={item} />}
  </Grid>
);

TagList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TagList;
