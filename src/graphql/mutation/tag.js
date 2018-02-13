
const createTag = tag => (`
  mutation {
    tagCreate(record: ${tag}) {
      record: record {
        _id
        name
        isAdult
      }
    }
  }
`)

const deleteTag = tagId => (`
  mutation {
    tagRemoveById(_id: ${tagId}) {
      record {
        name
      }
    }
  }
`)

const TagML = {
  createTag,
  deleteTag
}

export default TagML
