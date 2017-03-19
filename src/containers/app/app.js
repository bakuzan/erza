import React from 'react';
import Header from '../../components/header/header';
import './app.css';

const App = ({ params, children }) => (
  <div className="erza">
    <Header />
    <main>
    { children }
    </main>
  </div>
)

export default App;
