import React from 'react';
import LoadingSpinner from './loading-spinner/loading-spinner';
import LoadingBouncer from './loading-bouncer/loading-bouncer';

export const SimpleLoading = props => props.pastDelay && <LoadingBouncer />;

export function Loading(props) {
  if (props.error) return <div>An Error was encountered loading the page!</div>;
  if (props.pastDelay) return <LoadingSpinner size="fullscreen" />;
  return null;
}
