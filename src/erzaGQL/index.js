import {
  addRequestIndicator,
  removeRequestIndicator
} from 'actions/requestIndicator';
import { showAlertError } from 'actions/alert';
import { store } from '../index';

export default async function erzaQuery(payload) {
  const query = payload.query.loc.source.body; // Get the query raw string
  const body = JSON.stringify({ ...payload, query });

  store.dispatch(addRequestIndicator(query));

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body
    });

    const result = await response.json();

    if (result.errors) {
      const error = result.errors[0];
      const { exception = { stacktrace: [] } } = error.extensions;

      store.dispatch(
        showAlertError(
          error.message,
          `Resolver: ${error.path} > ${error.extensions.code}\r\n\r\n
        ${(exception.stacktrace || []).join('\r\n')}`
        )
      );
    }

    store.dispatch(removeRequestIndicator(query));
    return result.data || {};
  } catch (error) {
    const errorDefaultMessage = 'Anonymous Error Message.';
    store.dispatch(
      showAlertError(
        'Server Error',
        `${error.message || errorDefaultMessage}\r\n${error.stack}`
      )
    );
    store.dispatch(removeRequestIndicator(query));

    console.error(error);
    return {};
  }
}
