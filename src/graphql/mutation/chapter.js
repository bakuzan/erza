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

const updateChapterById = chapter => (`
  mutation {
    chapterUpdateById(record: ${chapter}) {
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
          _id
          title
        }
      }
    }
  }
`)

const ChapterML = {
  createChapter,
  updateChapterById,
  removeChapter
}

export default ChapterML
