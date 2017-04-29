import { tagFields } from './common'

const getAll = `
  {
    tagMany {
      ${tagFields}
    }
  }
`;

const TagQl = {
  getAll
};

export default TagQl
