import Loadable from 'react-loadable';
import { SimpleLoading, Loading } from 'meiko/Loadable';

// function DebugLoadingComponent(props) {
//   console.log('DEBUG LOADABLE', props);
//   if (props.error) {
//     return (
//       <div>
//         Error! <button onClick={props.retry}>Retry</button>
//       </div>
//     );
//   } else {
//     return <SimpleLoading {...props} />;
//   }
// }

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
