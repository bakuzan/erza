import PropTypes from 'prop-types';
import React from 'react';

import { nano } from 'mko';
import { ButtonisedNavLink } from 'components/Buttonised';
import Grid from 'components/Grid';
import Paths from 'constants/paths';

import media from 'styles/nano/media';

const containerStyle = nano.rule({
  display: 'flex',
  width: '100%'
});

const gridStyle = nano.rule({
  gridTemplateColumns: 'repeat(auto-fit, 25%)',
  gridAutoRows: '1fr',
  ...media.get('sm')({
    gridTemplateColumns: 'repeat(auto-fit, 33%)'
  }),
  ...media.get('xxs')({
    gridTemplateColumns: 'repeat(auto-fit, 50%)'
  })
});

const itemStyle = nano.rule({
  display: 'inline-block'
});

const TagListItem = ({ item }) => (
  <li className="tag-item">
    <ButtonisedNavLink
      className={itemStyle}
      to={`${Paths.base}${Paths.tagManagement}${item.id}`}
    >
      {item.name}
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
