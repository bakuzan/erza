import { SatellizerFlags } from 'constants/strings';
import { formatDateForInput } from 'utils/common';

const getYYYYMMDate = (date) => {
  const d = formatDateForInput(date);
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
const getAiringFlags = getFlagObject(SatellizerFlags.activeTab.airing);

export function getStaticFlags(props) {
  const { date, season, repeatTab = false } = props.location.state || {};
  const hasSeason = !!season;

  if (repeatTab) {
    return getRepeatedFlags();
  } else if (hasSeason) {
    const seasonMonth = SatellizerFlags.seasonMonths.get(season.season);
    const detailGroup = `${season.year}-${seasonMonth}`;

    return getHistoryFlags(SatellizerFlags.breakdownType.season, detailGroup);
  } else if (date) {
    return getHistoryFlags(
      SatellizerFlags.breakdownType.month,
      getYYYYMMDate(date)
    );
  } else {
    return getAiringFlags(SatellizerFlags.breakdownType.month, undefined);
  }
}

export function getDynamicProps(state, props) {
  return {
    isAdult: state.isAdult,
    contentType: props.match.params.type
  };
}
