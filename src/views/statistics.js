import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

function setupPorts(ports) {
}

const Statistics = (props) => (
  <div>
    <div id="satellizer"></div>
    <script src="/static/js/main.d8f183c8.js"></script>
    <script>
      const node = document.getElementById("satellizer");
      const app = Elm.Main.embed(node);
      console.log("Statistics Page");
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
