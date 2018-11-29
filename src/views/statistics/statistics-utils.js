import { Utils } from 'meiko';

import { SatellizerFlags } from 'constants/strings';

const getYYYYMMDate = (date) => {
  const d = Utils.Date.DateFormat.formatDateForInput(date);
  return d
    .split('-')
    .slice(0, 2)
    .join('-');
};

const getFlagObject = (activeTab) => (
  breakdownType = SatellizerFlags.breakdownType.month,
  detailGroup = ''
) => ({
  activeTab,
  breakdownType,
  detailGroup
});

const getRepeatedFlags = getFlagObject(SatellizerFlags.activeTab.repeat);
const getHistoryFlags = getFlagObject(SatellizerFlags.activeTab.history);

export function getStaticFlags(props) {
  const { date, season, repeatTab = false } = props.location.state || {};
  const hasSeason = !!season;

  if (repeatTab) {
    return getRepeatedFlags();
  } else if (hasSeason) {
    const seasonMonth = SatellizerFlags.seasonMonths.get(season.season);
    const detailGroup = `${season.year}-${seasonMonth}`;

    return getHistoryFlags(SatellizerFlags.breakdownType.season, detailGroup);
  } else {
    const maybeDate = !date ? undefined : getYYYYMMDate(date);

    return getHistoryFlags(SatellizerFlags.breakdownType.month, maybeDate);
  }
}

export function getDynamicProps(state, props) {
  return {
    isAdult: state.isAdult,
    contentType: props.match.params.type
  };
}
