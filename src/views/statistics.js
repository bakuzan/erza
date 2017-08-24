import React, {PropTypes} from 'react'
import {connect} from 'react-redux'


const Statistics = ({ isFetching, isAdult, type }) => (
	<div></div>
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
