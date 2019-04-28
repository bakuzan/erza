import { toaster } from 'mko';

import erzaGQL from 'erzaGQL';
import { getSingleObjectProperty } from 'utils';

import { startingGraphqlRequest, finishGraphqlRequest } from './helpers';
import redirectPostAction from './redirectPostAction';

export function mutateSeriesWithHistory(
  query,
  editItem,
  { type, updateInState, mapSeries }
) {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { entities, lastLocation } = getState();
    const seriesInState = entities[type].byId[editItem.id];

    const { ratings, notes } = editItem;
    const history = Object.keys(ratings).map((number) => ({
      number: Number(number),
      rating: ratings[number] || 0,
      note: notes[number] || ''
    }));
    const series = mapSeries(seriesInState, editItem);

    const updatedSeries = {
      ...seriesInState,
      ...series
    };

    dispatch(updateInState(updatedSeries));

    const response = await erzaGQL({
      query,
      variables: {
        series,
        history
      }
    });

    dispatch(finishGraphqlRequest());
    const data = getSingleObjectProperty(response);

    if (!data || !data.success) {
      // TODO handle error
      return null;
    }

    toaster.success(
      'Saved!',
      `Successfully saved '${data.data.title}' ${type}.`
    );

    return redirectPostAction(type, lastLocation);
  };
}
