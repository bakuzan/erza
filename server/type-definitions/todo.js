const gql = require('graphql-tag');

module.exports = gql`
  type TodoTemplate {
    id: Int!
    name: String
    date: Date
    repeatPattern: RepeatPattern
    repeatFor: Int
    repeatWeekDefinition: Int
    instances: [TodoInstance]
  }
  input TodoTemplateInput {
    id: Int
    name: String
    date: Date
    repeatPattern: RepeatPattern
    repeatFor: Int
    repeatWeekDefinition: Int
  }

  type TodoInstance {
    id: Int
    name: String
    date: Date
    todoTemplateId: Int
    template: TodoTemplate
    isRepeated: Boolean
    isLast: Boolean
  }
`;
