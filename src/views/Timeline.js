import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { MultiSelect } from 'mko';
import Timeline from 'components/Timeline';
import ContentTypeFilters from 'components/ContentTypeFilters';
import { ButtonisedNavLink } from 'components/Buttonised';
import erzaGQL from 'erzaGQL';
import { getTimeline } from 'erzaGQL/query';
import Paths from 'constants/paths';
import Strings from 'constants/strings';
import Enums from 'constants/enums';
import { capitalise } from 'utils';

import 'styles/nano/timeline';

const TIMELINE_PAGE_BASE_URL = `${Paths.base}${Paths.timeline}`;

const { Ongoing, Onhold, Completed } = Enums.status;
const STATUS_OPTIONS = [Ongoing, Onhold, Completed].map((value) => ({
  value,
  text: value
}));

async function handleFetch(setItems, variables) {
  const response = await erzaGQL({
    query: getTimeline,
    variables
  });

  setItems(response.seriesTimeline || []);
}

function TimelinePage({ match, isAdult }) {
  const [status, setStatus] = useState([Completed]);
  const [items, setItems] = useState([]);
  const { type: activeType } = match.params;

  const onTimelineUpdate = useCallback(
    ([from, to]) => {
      handleFetch(setItems, {
        type: capitalise(activeType),
        isAdult,
        from,
        to,
        status
      });
    },
    [activeType, isAdult, status]
  );

  if (!activeType) {
    return <Redirect to={`${TIMELINE_PAGE_BASE_URL}${Strings.anime}`} />;
  }

  return (
    <div className="timeline-page">
      <div className="timeline-page__options">
        <ContentTypeFilters baseUrl={TIMELINE_PAGE_BASE_URL} />
        <MultiSelect
          id="status"
          name="status"
          label="Status"
          placeholder="Filter on status"
          values={status}
          options={STATUS_OPTIONS}
          onUpdate={(v) => setStatus(v)}
        />
      </div>
      <Timeline
        className="timeline-page__timeline"
        items={items}
        onUpdate={onTimelineUpdate}
      >
        {(item) => (
          <ButtonisedNavLink
            className="series-timeline-link"
            to={`${Paths.base}${Paths[activeType].view}${item.id}`}
          >
            {item.displayText}
          </ButtonisedNavLink>
        )}
      </Timeline>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAdult: state.isAdult
});

export default connect(mapStateToProps)(TimelinePage);
