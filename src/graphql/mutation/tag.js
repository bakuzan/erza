
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

const TagML = {
  createTag
}

export default TagML
