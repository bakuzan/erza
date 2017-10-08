import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import {Paths} from '../../../constants/paths'
import {Enums, Icons} from '../../../constants/values'
import {getKeyByValue} from '../../../utils/common'
import {formatDateTimeForDisplay} from '../../../utils/date'
import {getUniquePropertiesForItemType} from '../../../utils/data'

const ItemListItem = ({ type, item, addAction }) => {
  const { current, total } = getUniquePropertiesForItemType(type);
  const hasMalId = !!item.malId;
  const hasLink = !!item.link;
  const statusIcon = item.isRepeat                                ? Icons.clockwise :
                     item.status === Enums.status.onhold    ? Icons.pause     :
                     item.status === Enums.status.completed ? Icons.tick      :
                                                                    null;

  return (
    <li className={`${type}-item`}>
      <div>
        <time dateTime={item.updatedDate}>{ formatDateTimeForDisplay(item.updatedDate) }</time>
        <h4>{ item.title }</h4>
        <div className="flex-row start-center-contents">
            {
              !!addAction &&
              <button
                type="button"
                className="button-icon small rounded primary"
                icon="+"
                onClick={() => addAction(item._id)}
                disabled={item.status === Enums.status.completed && !item.isRepeat}
                ></button>
            }
          <span>{ `${item[current]}/${item[total] || '??'}` }</span>
          {
            !!statusIcon &&
            <span className="button-icon small bold"
                  icon={statusIcon}
                  title={getKeyByValue(Enums.status, item.status)}
                  ></span>
          }
        </div>
        <div className="button-group fixed-width">
          <Link to={`${Paths.base}${Paths[type].view}${item._id}`}
                className="button ripple">
            View
          </Link>
          <Link to={`${Paths.base}${Paths[type].edit}${item._id}`}
                className="button ripple">
            Edit
          </Link>
        </div>
      </div>
      <div className="flex-spacer"></div>
      {
        (hasMalId || hasLink) &&
        <div className="mal-image">
        {
          hasMalId &&
          <a
           href={`https://myanimelist.net/${type}/${item.malId}`}
           className="mal-link"
           target="_blank"
           title="Open MAL entry in new tab."
          >
            <img
              src="https://myanimelist.net/favicon.ico"
              alt="MyAnimelist icon"
            />
          </a>
        }
        {
          hasLink &&
          <a
           href={item.link}
           className="button-icon small"
           icon={Icons.link}
           target="_blank"
           title="Open content link"
          >
          </a>
        }
        </div>
      }
      <div className="series-image-container">
        <img src={item.image} alt={`Cover for ${item.title}`} />
      </div>
    </li>
  );
}

ItemListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  addAction: PropTypes.func
}

export default ItemListItem
