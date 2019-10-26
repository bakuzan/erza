import Loadable from 'react-loadable';
import { SimpleLoading, Loading } from 'meiko/Loadable';

export function lazyLoader(loader) {
  return Loadable({
    loader,
    loading: SimpleLoading,
    delay: 300
  });
}

export function routeLazyLoader(loader) {
  return Loadable({ loader, loading: Loading, delay: 300 });
}
