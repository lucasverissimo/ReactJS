import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './header.css';

export default function Header() {

    const reserves = useSelector(state => state.reserve);

    return (
        <header className="container">
            <Link to="/">
                <img className="logo" src={logo} alt="Logo do projeto" />
            </Link>
            <Link className="reserva" to="/reservas">
                <div>
                    <strong>Minhas reservas</strong>
                    <span>{reserves.length} Reservas</span>
                </div>
            </Link>
        </header>
    );
}