import {historyKeyFields} from '../common'

const createChapter = chapter => (`
  mutation {
    chapterCreate(record: ${chapter}) {
      record: record {
        ${historyKeyFields('chapter')}
      }
    }
  }
`)

const ChapterML = {
  createChapter
}

export default ChapterML
