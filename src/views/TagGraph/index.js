import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Network } from 'vis-network/standalone';

import { capitalise } from 'ayaka/capitalise';
import { useAsync } from 'meiko/hooks/useAsync';
import LoadingBouncer from 'meiko/LoadingBouncer';

import ContentTypeFilters from 'components/ContentTypeFilters';
import Paths from 'constants/paths';

import erzaQuery from 'erzaGQL';
import { getTagGraph } from 'erzaGQL/query';
import { getGraphOptions } from './graphOptions';

const graphId = 'tag-graph';

function Graph({ data, themeKey }) {
  const network = useRef();
  const graph = data.tagGraph;

  useEffect(() => {
    const container = document.getElementById(graphId);
    const options = getGraphOptions(themeKey);

    network.current = new Network(container, graph, options);
  }, [graph, network, themeKey]);

  return <div id={graphId} />;
}

function TagGraph({ isAdult, type, themeValue }) {
  const state = useAsync(
    async () =>
      await erzaQuery({ query: getTagGraph, variables: { type, isAdult } }),
    [getTagGraph, isAdult, type]
  );

  return (
    <div>
      <Helmet>
        <title>{`${type} Tag Graph`}</title>
      </Helmet>
      <ContentTypeFilters baseUrl={`${Paths.base}${Paths.tagGraph}`}>
        <NavLink
          className="erza-link"
          to={`${Paths.base}${Paths.tagManagement}`}
        >
          To tag management
        </NavLink>
      </ContentTypeFilters>
      {state.loading ? (
        <LoadingBouncer />
      ) : state.error ? (
        <div>
          <p>Failed to load data to generate the tag graph.</p>
          <NavLink to={Paths.base}>Return to home</NavLink>
        </div>
      ) : (
        <Graph data={state.value} themeKey={themeValue} />
      )}
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  const { type } = ownProps.match.params;

  return {
    isAdult: state.isAdult,
    type: capitalise(type),
    themeValue: state.theme ? state.theme.value : null
  };
}

export default connect(mapStateToProps)(TagGraph);
