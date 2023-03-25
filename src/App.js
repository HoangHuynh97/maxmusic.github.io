import React from 'react';
import ReactDOM from 'react-dom/client';
import logo from './logo.svg';
import './App.css';
import Header from './Components/Header/Header';
import Menu from './Components/Menu/Menu';
import Bottom from './Components/Bottom/Bottom';
import Login from './Components/Login/Login';

function App() {
    return (
        <div>
            <Header></Header>
            <Menu></Menu>
            <Bottom></Bottom>
        </div>
    );
}

export default App;
