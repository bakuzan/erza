import React from 'react';
import {Link} from 'react-router';
import {Strings} from '../../constants/values';
import {Paths} from '../../constants/paths';
import './home.css';

const Home = () => (
  <div>
    <ul className="site-map-list list column one">
      <li>
        <div className="group-title">Anime</div>
        <div className="group-content">
          <p>
            <Link to={`${Paths.base}${Paths.anime.create}`}>
              Create an Anime
            </Link>
            <span>Enter details about a new anime entry.</span>
          </p>
          <p>
            <Link to={`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`}>
              Browse Anime
            </Link>
            <span>Search anime with a variable of filters and conditions</span>
          </p>
        </div>
      </li>
      <li>
        <div className="group-title">History</div>
        <div className="group-content">
          <p>
            <Link to={`${Paths.base}${Paths.history}anime`}>
              Recent anime history
            </Link>
            <span>View anime history by data range.</span>
          </p>
          <p>
            <Link to={`${Paths.base}${Paths.history}manga`}>
              Recent manga history
            </Link>
            <span>View manga history by data range.</span><span style={{ color: 'red' }}>NOT YET IMPLEMENTED</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
)

export default Home;
