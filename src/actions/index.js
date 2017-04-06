import { ADD_ANIME, UPDATE_ANIME, ANIME_REQUEST, ANIME_LOAD, ANIME_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import toaster from '../utils/toaster'
import {Paths} from '../constants/paths'
import {Strings} from '../constants/values'

// test
const testObj = [
  {
    id: 0,
    title: 'abc',
    status: 2,
    updatedDate: new Date(2017, 0, 1).toISOString(),
    isAdult: false
  },
  {
    id: 1,
    title: 'zab',
    status: 1,
    updatedDate: new Date(2017, 2, 25).toISOString(),
    isAdult: false
  },
  {
    id: 2,
    title: 'mno',
    status: 1,
    updatedDate: new Date(2013, 0, 1).toISOString(),
    isAdult: false
  },
  {
    id: 3,
    title: 'xyz',
    status: 1,
    updatedDate: new Date(2014, 10, 21).toISOString(),
    isAdult: false
  },
  {
    id: 4,
    title: 'jkl',
    status: 1,
    updatedDate: new Date(2016, 11, 31).toISOString(),
    isAdult: false
  },
  {
    id: 5,
    title: 'rst',
    status: 1,
    updatedDate: new Date(2015, 4, 4).toISOString(),
    isAdult: true
  },
  {
    id: 6,
    title: 'Kill La Kill',
    status: 2,
    start: new Date(2013, 9, 8).toISOString().split('T')[0],
    end: new Date(2014, 2, 24).toISOString().split('T')[0],
    rating: 9,
    episode: 24,
    series_episodes: 24,
    isRepeat: false,
    isAdult: false,
    timesCompleted: 2,
    tags: [0, 7],
    owned: true,
    image: 'https://myanimelist.cdn-dena.com/images/anime/8/75514.jpg',
    link: '',
    updatedDate: new Date(2015, 4, 4).toISOString().split('T')[0]
  }
]
// test

const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

let testId = 7;
const getTestId = () => {
  return testId++;
}

const startingAnimeRequest = () => ({
  type: ANIME_REQUEST,
  isFetching: true
})

const loadAnimeData = (data) => ({
  type: ANIME_LOAD,
  data
})

const finishAnimeRequest = () => ({
  type: ANIME_SUCCESS,
  isFetching: false
})

const addAnime = (item) => ({
  type: ADD_ANIME,
  item
})

export const createAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    item.id = getTestId();
    var goToNext = Promise.resolve(item);
    setTimeout(() => {
      goToNext.then(response => {
        dispatch(addAnime(response));
        dispatch(finishAnimeRequest());
        toaster.success('Added!', 'Successfully created anime.');
        return redirectPostAction();
      })
    }, 1000);
  }
}

const updateAnime = (item) => ({
  type: UPDATE_ANIME,
  item
})

export const editAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    dispatch(updateAnime(item));
    setTimeout(() => {
      dispatch(finishAnimeRequest());
      toaster.success('Saved!', 'Successfully edited anime.');
      return redirectPostAction();
    }, 1000)
  }
}

//TEMP UNTIL SERVER-SIDE
const fetchAnimeById = (id) => {
  return Promise.resolve(testObj.find(x => x.id === id));
}
const fetchAnime = () => {
  return Promise.resolve(testObj);
}

export const loadAnime = () => {
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    fetchAnime()
      .then(data => dispatch(loadAnimeData(data)) )
      .then(() => dispatch(finishAnimeRequest()) );
  }
}

export const loadAnimeById = (id) => {
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    fetchAnimeById(id)
      .then(data => dispatch(loadAnimeData([data])) )
      .then(() => dispatch(finishAnimeRequest()) );
  }
}
