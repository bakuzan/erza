import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Elm from 'react-elm-components'

import {Main} from '../../satellizer/build/static/js/satellizer'
import '../../satellizer/build/static/css/satellizer.css'


function setupPorts(ports) {
  ports.contentType.send("anime");
  ports.isAdult.send(false);
}


const Statistics = ({ isAdult, contentType }) => {
  const flags = { isAdult, contentType }
  return (
    <div id="satellizer">
      <Elm src={Main} flags={flags} ports={setupPorts} />
    </div>
  )
}

Statistics.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  contentType: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  contentType: ownProps.params.type
})

export default connect(
  mapStateToProps
)(Statistics)
