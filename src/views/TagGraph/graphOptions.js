import getTheme from 'constants/elmThemes';

export function getGraphOptions(themeKey) {
  const theme = getTheme(themeKey, { prependHash: true });

  const activeNodeColour = {
    border: theme.primaryBackgroundHover,
    background: theme.primaryBackgroundHover
  };

  return {
    // configure: {
    //   showButton: true
    // },
    height: '600px',
    nodes: {
      shape: 'dot',
      scaling: {
        min: 10,
        max: 75
      },
      font: {
        size: 60,
        face: "'Lucida Console', 'Courier New', monospace",
        background: '#fff',
        color: '#000'
      },
      color: {
        border: theme.primaryColour,
        background: theme.primaryBackground,
        highlight: activeNodeColour,
        hover: activeNodeColour
      }
    },
    edges: {
      color: {
        color: theme.neutralColour,
        highlight: theme.contrast,
        hover: theme.contrast,
        inherit: false
      },
      smooth: {
        type: 'continuous'
      }
    },
    interaction: {
      hideEdgesOnDrag: true,
      tooltipDelay: 250,
      hover: true,
      hoverConnectedEdges: true,
      selectable: true,
      selectConnectedEdges: true,
      multiselect: false,
      navigationButtons: true
    },
    physics: {
      barnesHut: {
        gravitationalConstant: -10000,
        centralGravity: 0.05,
        springLength: 1000,
        springConstant: 0,
        avoidOverlap: 1
      }
    }
  };
}
