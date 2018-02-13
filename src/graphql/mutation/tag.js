
const createTag = tag => (`
  mutation {
    tagCreate(record: ${tag}) {
      record {
        _id
        name
        isAdult
      }
    }
  }
`)

const updateTag = tag => (`
  mutation {
    tagUpdateById(record: ${tag}) {
      record {
        _id
        name
        isAdult
      }
    }
  }
`)

const deleteTag = tagId => (`
  mutation {
    tagRemoveById(_id: "${tagId}") {
      record {
        name
      }
    }
  }
`)

const TagML = {
  createTag,
  updateTag,
  deleteTag
}

export default TagML
