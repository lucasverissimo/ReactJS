import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import Routes from './routes';
import history from './services/history';

export default function App() {
 return ( 
     <Provider store={store}>
        <BrowserRouter history={history}>
            <Routes />
        </BrowserRouter>   
    </Provider>
 );
}