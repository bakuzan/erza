import {Enums} from '../../constants/values'

const updatePrePost = anime => {
    const updates = {};

    // END
    if (anime.episode === anime.series_episodes && anime.series_episodes !== 0) {
        if (anime.end === undefined || anime.end === null) {
            updates.end = new Date().toISOString();
        }
    } else if (anime.isRepeat === false) {
        //in the event the 'complete-ness' of an entry needs to be undone.
        //this will undo the end date.
        updates.end = null;
    }

    // STATUS
    if(!!anime.end || !!updates.end) {
        updates.status = Enums.anime.status.completed;
    }

    // IS REPEAT
    if (anime.isRepeat && anime.episode === anime.series_episodes) {
        updates.timesCompleted = anime.timesCompleted + 1;
        updates.isRepeat = false;
    }

    return Object.assign({}, anime, updates);
}

export default updatePrePost
