import updatePrePost from './mangaPost';
import baseValidator from './baseCreation';
import { Strings } from 'constants/values';

const mangaValidator = baseValidator(Strings.manga, updatePrePost);

export default mangaValidator;
