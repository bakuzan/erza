import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Elm from 'react-elm-components'
import {Main} from '../../satellizer/build/static/js/main.d8f183c8.js'

function setupPorts(ports) {
}

const Statistics = (props) => (
  <div>
    <div id="satellizer"></div>
    <script>
      var node = document.getElementById('satellizer');
      Elm.Main.embed(node, props)
    </script>
  </div>
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
