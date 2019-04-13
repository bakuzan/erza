import updatePrePost from './animePost';
import baseValidator from './baseCreation';
import { Strings } from 'constants/values';

const animeValidator = baseValidator(Strings.anime, updatePrePost);

export default animeValidator;
