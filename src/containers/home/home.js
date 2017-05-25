import React from 'react';
import {Link} from 'react-router';
import Menu from '../../constants/menu';
import './home.css';

const Home = () => (
  <div>
    <ul className="site-map-list list column one">
      {
        Menu.map(item => (
          <li>
            <div className="group-title">{ item.title }</div>
            <div className="group-content">
              {
                item.children.map(child => (
                  <p>
                    <Link to={child.link}>
                      { child.title }
                    </Link>
                    <span>{ child.description }</span>
                  </p>
                ))
              }
            </div>
          </li>
          ))
      }
    </ul>
  </div>
)

export default Home;
