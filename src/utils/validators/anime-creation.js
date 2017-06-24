import updatePrePost from './anime-post'
import baseValidator from './base-creation'
import {Strings} from '../../constants/values'

const animeValidator = baseValidator(Strings.anime, updatePrePost);

export default animeValidator
