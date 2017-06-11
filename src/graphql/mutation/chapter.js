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

const ChapterML = {
  createChapter
}

export default ChapterML
