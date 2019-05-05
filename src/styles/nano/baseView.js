import { nano } from 'mko';
import { darken } from 'utils';

nano.put('.series-view', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
});

nano.put('.series-view__tag-title', {
  margin: '10px 0 5px'
});

nano.put('.series-view__footer', {
  width: '100%',
  padding: '10px 5px',
  div: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

nano.put('.series-delete__button', {
  backgroundColor: '#f00 !important',
  '&:hover': {
    backgroundColor: `${darken(10, '#f00')} !important`
  }
});

nano.put('.tag-item__link', {
  display: 'inline-flex'
});
