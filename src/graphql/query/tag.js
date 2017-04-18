import { tagFields } from './common'

const getAll = `
  query allTags {
    tags {
      ${tagFields}
    }
  }
`;

const TagQl = {
  getAll
};

export default TagQl
