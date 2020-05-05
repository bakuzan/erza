import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { capitalise } from 'ayaka/capitalise';
import { useAsync } from 'meiko/hooks/useAsync';
import Accordion from 'meiko/Accordion';
import LoadingBouncer from 'meiko/LoadingBouncer';
import List from 'meiko/List';
import Tickbox from 'meiko/Tickbox';

import ContentTypeFilters from 'components/ContentTypeFilters';
import Paths from 'constants/paths';

import erzaQuery from 'erzaGQL';
import { getTagGraph } from 'erzaGQL/query';
import Graph from './Graph';

import './TagGraph.scss';

function TagGraph({ isAdult, type, themeValue }) {
  const [excluded, setExcluded] = useState([]);

  // Reset filter...
  useEffect(() => {
    setExcluded([]);
  }, [isAdult, type]);

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
        <div className="tag-graph flex--row">
          <Accordion heading="Tags" defaultIsCollapsed={false}>
            <List columns={1} className="tag-graph__options">
              <li key="ALL" className="tag-graph__select-all">
                <Tickbox
                  id="all"
                  name="all"
                  text="All selected"
                  checked={excluded.length === 0}
                  onChange={() =>
                    setExcluded((p) =>
                      p.length
                        ? []
                        : state.value.tagGraph.nodes.map((x) => x.id)
                    )
                  }
                />
              </li>
              {state.value.tagGraph.nodes.map((x) => (
                <li key={x.id}>
                  <Tickbox
                    id={x.label}
                    name={x.label}
                    text={
                      <div className="tag-graph__option-content">
                        <div>{x.label}</div>
                        <div>{x.value}</div>
                      </div>
                    }
                    checked={!excluded.includes(x.id)}
                    onChange={() =>
                      setExcluded((p) =>
                        p.includes(x.id)
                          ? p.filter((id) => id !== x.id)
                          : [...p, x.id]
                      )
                    }
                  />
                </li>
              ))}
            </List>
          </Accordion>
          <Graph
            data={state.value}
            excludedIds={excluded}
            themeKey={themeValue}
            onSelect={(nodeIds) =>
              setExcluded(
                state.value.tagGraph.nodes
                  .filter((x) => !nodeIds.includes(x.id))
                  .map((x) => x.id)
              )
            }
          />
        </div>
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
