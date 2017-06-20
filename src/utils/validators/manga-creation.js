import updatePrePost from './manga-post'
import baseValidator from './base-creation'

const mangaValidator = baseValidator(Strings.manga, updatePrePost);

export default mangaValidator
