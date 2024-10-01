import React from 'react'
import './mobilemenu.css'
import { StoreContext } from '../../lib/store';
import { useContext } from 'react';
import Userinfo from '../userinfo/Userinfo';
import { homepage } from '../../lib/const';

function Mobilemenu() {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const context = useContext(StoreContext);
    const setShowSearch = context.setShowSearch;
    const showSearch = context.showSearch;
    const setShowAbout = context.setShowAbout;
    const showAbout = context.showAbout;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setMenuOpen(false);
    }

    const toggleAbout = () => {
        setShowAbout(!showAbout);
        setMenuOpen(false);
    }

    return (
        <div className='mobilemenu'>
            <div className='mobilesearch' onClick={toggleSearch}>
                <img src="./search.png" alt="" />
            </div>
            <div className="mobiletitle">
                <h2>Manus Blog</h2>
            </div>
            <div className="burger" onClick={toggleMenu}>
                <img src="./more.png" alt="" />
            </div>
            {menuOpen && (
                <div className='dropdownmenu'>
                    <ul>
                        <li><a href={homepage}>Home</a></li>
                        <li onClick={toggleAbout}>About</li>
                        <li onClick={() => setMenuOpen(false)}><Userinfo /></li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Mobilemenu