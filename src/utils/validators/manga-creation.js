import updatePrePost from './manga-post'
import baseValidator from './base-creation'
import {Strings} from '../../constants/values'

const mangaValidator = baseValidator(Strings.manga, updatePrePost);

export default mangaValidator
