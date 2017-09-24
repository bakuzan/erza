import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchDailyAnime } from '../../actions/daily-anime'
import { padNumber } from '../../utils/common'
import { mapStateToEntityList } from '../../utils/data'

import './daily-anime.css'


const dummyEvent = value => ({
  target: { name: 'search', value }
})

class DailyAnime extends Component {

  componentDidMount() {
    this.props.fetchDailyAnime()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeKey !== this.props.routeKey) {
      nextProps.fetchDailyAnime()
    }
  }

  render() {
    const { items, onSelect } = this.props
    const hasDailyAnime = !!items.length

    return (
      <div className="daily-anime-container">
        <h5>Watch today</h5>
        <ul className="list column one">
        {
          hasDailyAnime &&
          items.map(item => (
            <li key={item._id}>
              <button
                type="button"
                className="button"
                onClick={() => onSelect(dummyEvent(item.series.title))}>
                { `${item.series.title} #${padNumber(item.episode + 1, 3)}` }
              </button>
            </li>
          ))
        }
        {
          !hasDailyAnime &&
          <li>
            <div>
              No daily anime found.
            </div>
          </li>
        }
        </ul>
      </div>
    )
  }
}


DailyAnime.propTypes = {
  routeKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}


const mapStateToProps = state => ({
  items: mapStateToEntityList(state.entities.dailyAnime)
})

const mapDispatchToState = {
  fetchDailyAnime
}


export default connect(
  mapStateToProps,
  mapDispatchToState
)(DailyAnime)
