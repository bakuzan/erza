import { nano } from 'mko';
import { darken } from 'utils';
import media from './media';

nano.put('.series-view', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
});

nano.put('.series-view__header', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...media.get('xxs')({
    flexDirection: `column`,
    alignItems: `flex-start`
  })
});

const smallContent = {
  flexDirection: `column`
};

nano.put('.series-view__content', {
  display: 'flex',
  flexDirection: 'row-reverse',
  ...media.get('xs')(smallContent),
  ...media.get('xxs')(smallContent)
});

nano.put('.view-content', {
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  gridGap: `15px 0`,
  ...media.get('xxs')({ gridTemplateColumns: '1fr' })
});
nano.put('.view-content__inner', {
  padding: `10px 0`
});

nano.put('.series-view__rating.series-view__rating', {
  padding: 0
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
  color: '#fff !important',
  '&:hover': {
    backgroundColor: `${darken(10, '#f00')} !important`
  }
});

nano.put('.tag-item__link', {
  display: 'inline-flex'
});
