import { toaster } from 'mko';

import erzaGQL from 'erzaGQL';
import { getSingleObjectProperty } from 'utils';
import { showAlertError } from 'actions/alert';

import { startingGraphqlRequest, finishGraphqlRequest } from './helpers';
import redirectPostAction from './redirectPostAction';

export function mutateSeriesWithHistory(
  query,
  editItem,
  { type, updateInState, mapToInput }
) {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { entities, lastLocation } = getState();
    const seriesInState = entities[type].byId[editItem.id];

    const { ratings, notes } = editItem;

    const updated = mapToInput(seriesInState, editItem);
    const original = mapToInput(seriesInState);

    const history = Array(updated.current - original.current)
      .fill(null)
      .map((n, i) => {
        const number = original.current + 1 + i;
        return {
          number,
          rating: ratings[number] || 0,
          note: notes[number] || ''
        };
      });

    const updatedSeries = {
      ...seriesInState,
      ...updated
    };

    // Optimistic update
    dispatch(updateInState(updatedSeries));

    const response = await erzaGQL({
      query,
      variables: {
        series: updated,
        history
      }
    });

    dispatch(finishGraphqlRequest());
    const data = getSingleObjectProperty(response);

    if (!data || !data.success) {
      // Rollback optimistic update
      dispatch(updateInState(seriesInState));

      if (data && !data.success) {
        dispatch(
          showAlertError({
            message: data && data.errorMessages[0]
          })
        );
      }

      return;
    }

    toaster.success(
      'Saved!',
      `Successfully saved '${data.data.title}' ${type}.`
    );

    return redirectPostAction(type, lastLocation);
  };
}
