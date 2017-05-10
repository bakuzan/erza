import {Enums} from '../../constants/values'

const updatePrePost = anime => {
    const updates = {};
    //update the item history.
    //anime = ItemService.itemHistory(anime, updateHistory, 'anime', episodeRating);

    // END
    if (anime.episode === anime.series_episodes && anime.series_episodes !== 0) {
        if (anime.end === undefined || anime.end === null) {
            updates.end = Date.now();
        }
    } else if (anime.isRepeat === false) {
        //in the event the 'complete-ness' of an entry needs to be undone.
        //this will undo the end date.
        updates.end = null;
    }

    // STATUS
    if(anime.end !== undefined && anime.end !== null) {
        updates.status = Enums.anime.status.completed;
    }

    // IS REPEAT
    if (anime.isRepeat && anime.episode === anime.series_episodes) {
        updates.timesCompleted += 1;
        updates.isRepeat = false;
    }
    
    return Object.assign({}, anime, updates);
}

export default updatePrePost
