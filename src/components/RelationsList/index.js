import PropTypes from 'prop-types';
import React from 'react';

import Grid from 'components/Grid';
import { ButtonisedNavLink } from 'components/Buttonised';

import { Strings } from 'constants/values';

import './RelationsList.scss';

function RelationItem({ id, title, type }) {
  const relationLink = `/erza/${type.toLowerCase()}-view/${id}`;

  return (
    <li className="series-relation-item" style={{ display: 'flex' }}>
      <ButtonisedNavLink className="related-series-link" to={relationLink}>
        {title}
      </ButtonisedNavLink>
    </li>
  );
}

function RelationsList({ type, data }) {
  if (!data || !data.length) {
    return null;
  }

  const adaptionText = type === Strings.anime ? 'Adaption of' : 'Adapted into';
  const related = data.filter((x) => x.type.toLowerCase() === type);
  const adaptions = data.filter((x) => x.type.toLowerCase() !== type);

  const hasRelated = related.length > 0;
  const hasAdaptions = adaptions.length > 0;

  return (
    <div className="series-relations">
      {hasRelated && (
        <React.Fragment>
          <h4 key="title" className="series-relations__title">
            Related
          </h4>
          <Grid key="list" items={related} noItemsText={false}>
            {(item) => <RelationItem key={item.id} {...item} />}
          </Grid>
        </React.Fragment>
      )}
      {hasAdaptions && (
        <React.Fragment>
          <h4 key="title" className="series-relations__title">
            {adaptionText}
          </h4>
          <Grid key="list" items={adaptions} noItemsText={false}>
            {(item) => <RelationItem key={item.id} {...item} />}
          </Grid>
        </React.Fragment>
      )}
    </div>
  );
}

RelationsList.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  )
};

export default RelationsList;
