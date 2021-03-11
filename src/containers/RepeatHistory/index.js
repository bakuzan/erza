import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Grid from 'components/Grid';
import RepeatItem from './RepeatItem';

import { loadRepeatHistory } from 'actions/utils/series';

import './RepeatHistory.scss';

function RepeatHistory({ type, seriesId, loadData, ...props }) {
  useEffect(() => {
    loadData(type, seriesId);
  }, [type, seriesId]);

  if (!props.data || !props.data.hasRepeats) {
    return null;
  }

  const {
    items,
    seriesTotalParts,
    timesCompleted,
    warningMessages
  } = props.data;
  const hasWarnings = warningMessages.length > 0;

  return (
    <div className="series-repeat-history">
      <h4 className="series-repeat-history__title">Repeat History</h4>
      {hasWarnings && (
        <Grid items={warningMessages}>
          {(item) => (
            <li key={item} className="series-repeat-history__warning">
              {item}
            </li>
          )}
        </Grid>
      )}
      <Grid items={items} noItemsText={false}>
        {(item) => (
          <RepeatItem
            key={item.repeatInstanceKey}
            {...item}
            seriesTotalParts={seriesTotalParts}
            timesCompleted={timesCompleted}
          />
        )}
      </Grid>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  const { repeatHistory } = state.entities;

  return {
    data: repeatHistory[ownProps.type][ownProps.seriesId]
  };
}

const mapDispatchToProps = {
  loadData: loadRepeatHistory
};

RepeatHistory.propTypes = {
  type: PropTypes.string.isRequired,
  seriesId: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(RepeatHistory);
