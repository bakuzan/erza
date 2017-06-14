import {Strings} from '../../constants/values'
import {historyKeyFields} from '../common'

const createChapter = chapter => (`
  mutation {
    chapterCreate(record: ${chapter}) {
      record: record {
        ${historyKeyFields(Strings.chapter)}
      }
    }
  }
`)

const removeChapter = id => (`
  mutation {
    chapterRemoveById(_id: "${id}") {
      record {
        chapter
        series {
          title
        }
      }
    }
  }
`)

const ChapterML = {
  createChapter,
  removeChapter
}

export default ChapterML
