import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Timeline from 'components/Timeline';
import ContentTypeFilters from 'components/ContentTypeFilters';
import erzaGQL from 'erzaGQL';
import { getTimeline } from 'erzaGQL/query';
import Paths from 'constants/paths';
import Strings from 'constants/strings';
import { capitalise } from 'utils';

const TIMELINE_PAGE_BASE_URL = `${Paths.base}${Paths.timeline}`;

async function handleFetch(setItems, variables) {
  const response = await erzaGQL({
    query: getTimeline,
    variables
  });

  setItems(response.seriesTimeline || []);
}

function TimelinePage({ match, isAdult }) {
  const [items, setItems] = useState([]);
  const { type: activeType } = match.params;

  const onTimelineUpdate = useCallback(
    ([from, to]) => {
      handleFetch(setItems, {
        type: capitalise(activeType),
        isAdult,
        from,
        to
      });
    },
    [activeType, isAdult]
  );

  if (!activeType) {
    return <Redirect to={`${TIMELINE_PAGE_BASE_URL}${Strings.anime}`} />;
  }

  console.log('RENDER TIMELINE PAGE');
  return (
    <div className="timeline-page">
      <div className="timeline-page__options">
        <ContentTypeFilters baseUrl={TIMELINE_PAGE_BASE_URL} />
      </div>
      <Timeline
        className="timeline-page__timeline"
        items={items}
        onUpdate={onTimelineUpdate}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAdult: state.isAdult
});

export default connect(mapStateToProps)(TimelinePage);
