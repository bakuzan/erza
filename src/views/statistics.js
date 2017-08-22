import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Elm from 'react-elm-components'

import {Main} from '../../build/static/js/satellizer'
import '../../build/static/css/satellizer.css'

const Statistics = (props) => (
  <Elm src={Main} />
)

Statistics.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  type: ownProps.params.type
})

export default connect(
  mapStateToProps
)(Statistics)
