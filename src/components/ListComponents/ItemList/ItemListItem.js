import PropTypes from 'prop-types';
import React from 'react';

import { withButtonisation } from 'mko';
import {
  ButtonisedNavButton,
  ButtonisedNewTabLink,
  ButtonIcon
} from 'components/Buttonised';
import SeriesImageContainer from 'components/SeriesImageContainer';
import MalLink from 'components/MalLink';
import { Paths } from 'constants/paths';
import { Enums, Icons } from 'constants/values';
import { formatDateTimeForDisplay } from 'utils';
import { getUniquePropertiesForItemType } from 'utils/data';

const SpanIcon = (props) => <span {...props} />;
const ButtonisedSpan = withButtonisation(SpanIcon);

const ItemListItem = ({ type, item, addAction }) => {
  const { current, total } = getUniquePropertiesForItemType(type);
  const hasMalId = !!item.malId;
  const hasLink = !!item.link;
  const iconStatusProps = item.isRepeat
    ? { icon: Icons.clockwise, [`aria-label`]: 'Is Repeat' }
    : item.status === Enums.status.Onhold
    ? { icon: Icons.pause, [`aria-label`]: 'On hold' }
    : item.status === Enums.status.Completed
    ? { icon: Icons.tick, [`aria-label`]: item.status }
    : null;

  return (
    <li className={`${type}-item list-item`}>
      <div>
        <time dateTime={item.updatedAt}>
          {formatDateTimeForDisplay(item.updatedAt)}
        </time>
        <h4>{item.title}</h4>
        <div className="flex flex--row start-center-contents list-item__increment-data">
          {!!addAction && (
            <ButtonIcon
              btnStyle="primary"
              btnSize="small"
              className="list-item__plus-button"
              icon="+"
              aria-label={`Add ${item.title} ${current}s`}
              onClick={() => addAction(item.id)}
              disabled={
                item.status === Enums.status.Completed && !item.isRepeat
              }
            />
          )}
          <span>{`${item[current]}/${item[total] || '??'}`}</span>
          {!!iconStatusProps && (
            <ButtonisedSpan
              btnSize="small"
              className="bold"
              {...iconStatusProps}
              title={item.status}
            />
          )}
        </div>
        <div className="button-group fixed-width">
          <ButtonisedNavButton
            to={`${Paths.base}${Paths[type].view}${item.id}`}
            className="ripple"
          >
            View
          </ButtonisedNavButton>
          <ButtonisedNavButton
            to={`${Paths.base}${Paths[type].edit}${item.id}`}
            className="ripple"
          >
            Edit
          </ButtonisedNavButton>
        </div>
      </div>
      <div className="flex-spacer" />
      {(hasMalId || hasLink) && (
        <div className="mal-image">
          {hasMalId && (
            <MalLink type={type} malId={item.malId} title={item.title} />
          )}
          {hasLink && (
            <ButtonisedNewTabLink
              href={item.link}
              btnSize="small"
              icon={Icons.link}
              title="Open content link"
              aria-label={`Open content link for ${item.title} in new tab.`}
            />
          )}
        </div>
      )}
      <SeriesImageContainer src={item.image} alt={`Cover for ${item.title}`} />
    </li>
  );
};

ItemListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  addAction: PropTypes.func
};

export default ItemListItem;
