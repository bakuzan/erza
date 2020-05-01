import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';

import { getGraphOptions } from './graphOptions';

const graphId = 'tag-graph';

export default function Graph({ data, excludedIds, themeKey, onSelect }) {
  const network = useRef();
  const graph = data.tagGraph;

  useEffect(() => {
    const box = document.getElementById(graphId);
    const opts = getGraphOptions(themeKey);

    const nodes = graph.nodes.filter((x) => !excludedIds.includes(x.id));
    const ctrl = new Network(box, { ...graph, nodes }, opts);

    function handleSelect(event) {
      const canSelect = onSelect && excludedIds.length === 0;
      const { edges } = ctrl.body;

      if (canSelect) {
        onSelect([
          ...event.nodes,
          ...event.edges.reduce(
            (p, key) => [...p, edges[key].fromId, edges[key].toId],
            []
          )
        ]);
      }
    }

    network.current = ctrl;
    network.current.on('select', handleSelect);

    return () => {
      network.current.off('select', handleSelect);
      network.current.destroy();
    };
  }, [excludedIds, graph, network, themeKey, onSelect]);

  return <div id={graphId} className="erz-graph" />;
}
