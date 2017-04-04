import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import RatingControl from '../../components/rating-control/rating-control';

const AnimeView = ({ item }) => (
  <section>
    <header>
      <h2>{ item.title }</h2>
      <span>{ `${item.episode} / ${item.series_episodes}` }</span>
      <div className="button-group">
        links here for:
          - edit
          - back
          - delete?
      </div>
    </header>
    <div>
      <RatingControl name="rating"
                     value={item.rating}
      />
    </div>
  </section>
);

AnimeView.propTypes = {
  item: PropTypes.object.isRequired
}

const selectItemFromId = (anime, id) => {
  return anime.byId[id];
}

const mapStateToProps = (state, ownProps) => ({
  item: selectItemFromId(state.entities.anime, ownProps.params.id)
})

export default connect(
  mapStateToProps
)(AnimeView)
