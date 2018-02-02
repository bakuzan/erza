import React from 'react';
import LoadingSpinner from './loading-spinner/loading-spinner';

export const SimpleLoading = props =>
  props.pastDelay && <div>Waiting on server</div>;

export function Loading(props) {
  if (props.error) return <div>An Error was encountered loading the page!</div>;
  if (props.pastDelay) return <LoadingSpinner size="fullscreen" />;
  return null;
}
