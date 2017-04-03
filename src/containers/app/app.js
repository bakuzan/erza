import React from 'react';
import Header from '../../components/header/header';
import Toaster from '../../components/toaster/toaster';
import './app.css';

const App = ({ params, children }) => (
  <div className="erza">
    <Header />
    <main>
    { children }
    </main>
    <Toaster />
  </div>
)

export default App;
