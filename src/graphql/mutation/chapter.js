import {Strings} from '../../constants/values'
import {historyKeyFieldsWithSeries} from '../common'

const createChapter = chapter => (`
  mutation {
    chapterCreate(record: ${chapter}) {
      record: record {
        ${historyKeyFieldsWithSeries(Strings.chapter)}
      }
    }
  }
`)

const updateChapterById = chapter => (`
  mutation {
    chapterUpdateById(record: ${chapter}) {
      record: record {
        ${historyKeyFieldsWithSeries(Strings.chapter)}
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
  updateChapterById,
  removeChapter
}

export default ChapterML
