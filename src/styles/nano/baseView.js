import { nano } from 'meiko/styles/nano';
import { darken } from 'utils';
import media from './media';

nano.put('.series-view', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
});

nano.put('.series-view__title', {
  margin: `5px`
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

const imageContainerWidth = 235;

nano.put('.view-content', {
  display: 'grid',
  gridTemplateColumns: `minmax(auto, ${imageContainerWidth}px) auto`,
  gridGap: `15px 0`,
  ...media.get('xs')({ gridTemplateColumns: '1fr' }),
  ...media.get('xxs')({ gridTemplateColumns: '1fr' })
});

nano.put('.series-view-grid', {
  display: `grid`,
  gridTemplateColumns: `1fr 1fr`,
  gridAutoRows: `1fr`,
  maxWidth: `600px`,
  padding: '5px',
  margin: 0,
  listStyleType: 'none',
  li: {
    padding: '0 5px'
  }
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
