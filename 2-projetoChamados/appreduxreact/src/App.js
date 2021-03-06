import React from 'react';
import './App.css';

import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Routes from './routes/routes';
import Header from './components/Header';
import Footer from './components/Footer';

import history from './services/history';
import store from './store';


export default function App() {
 return (
   <Provider store={store}>
    <Router history={history}>
        <div className="container-global">
          <Header />
          <div className="container">
            <Routes />
          </div>
        </div>
        <Footer />
    </Router>
   </Provider>
 );
}

/*

API RODANDO NO JSON SERVER
COMANDO PARA RODAR JSON SERVER:
npx json-server server.json -p 3333

*/