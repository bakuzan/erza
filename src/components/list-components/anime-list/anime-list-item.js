import React, {PropTypes} from 'react'
import {Link} from 'react-router-dom'
import {Paths} from '../../../constants/paths'
import {Enums, Icons} from '../../../constants/values'
import {getKeyByValue} from '../../../utils/common'
import {formatDateTimeForDisplay} from '../../../utils/date'

const AnimeListItem = ({ item, addEpisode }) => {
  const hasMalId = !!item.malId;
  const hasLink = !!item.link;
  const statusIcon = item.isRepeat                                ? Icons.clockwise :
                     item.status === Enums.anime.status.onhold    ? Icons.pause     :
                     item.status === Enums.anime.status.completed ? Icons.tick      :
                                                                    null;

  return (
    <li className="anime-item">
      <div>
        <time dateTime={item.updatedDate}>{ formatDateTimeForDisplay(item.updatedDate) }</time>
        <h4>{ item.title }</h4>
        <div className="flex-row start-center-contents">
            {
              !!addEpisode &&
              <button
                type="button"
                className="button-icon small rounded primary"
                icon="+"
                onClick={() => addEpisode(item._id)}
                disabled={item.status === Enums.anime.status.completed && !item.isRepeat}
                ></button>
            }
          <span>{ `${item.episode}/${item.series_episodes || '??'}` }</span>
          {
            !!statusIcon &&
            <span className="button-icon small bold"
                  icon={statusIcon}
                  title={getKeyByValue(Enums.anime.status, item.status)}
                  ></span>
          }
        </div>
        <div className="button-group">
          <Link to={`${Paths.base}${Paths.anime.view}${item._id}`}
                className="button ripple">
            View
          </Link>
          <Link to={`${Paths.base}${Paths.anime.edit}${item._id}`}
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
           href={`https://myanimelist.net/anime/${item.malId}`}
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

AnimeListItem.propTypes = {
  item: PropTypes.object.isRequired,
  addEpisode: PropTypes.func
}

export default AnimeListItem
