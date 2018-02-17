import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Paths } from '../../constants/paths';

const RelatedSeriesList = ({ seriesType, title, items }) => (
  <div className="related-series-container">
    <h4>{`${items.length} ${title}`}</h4>
    <ul className="list column one">
      {items.map(x => (
        <li key={x._id}>
          <NavLink to={`${Paths.base}${Paths[seriesType].view}${x._id}`}>
            {x.title}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

RelatedSeriesList.defaultProps = {
  items: []
};

RelatedSeriesList.propTypes = {
  seriesType: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string
    })
  ).isRequired
};

export default RelatedSeriesList;
