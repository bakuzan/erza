import { Strings } from '../../constants/values';
import { historyKeyFields } from '../common';

const createEpisode = episode => `
  mutation {
    episodeCreate(record: ${episode}) {
      record: record {
        ${historyKeyFields(Strings.episode)}
      }
    }
  }
`;

const updateEpisodeById = episode => `
  mutation {
    episodeUpdateById(record: ${episode}) {
      record: record {
        ${historyKeyFields(Strings.episode)}
      }
    }
  }
`;

const removeEpisode = id => `
  mutation {
    episodeRemoveById(_id: "${id}") {
      record {
        episode
        series {
          _id
          title
        }
      }
    }
  }
`;

const EpisodeML = {
  createEpisode,
  updateEpisodeById,
  removeEpisode
};

export default EpisodeML;
