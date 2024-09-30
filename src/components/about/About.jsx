import React, { useContext } from 'react'
import "./about.css"
import { StoreContext } from '../../lib/store'

function About() {
    const context = useContext(StoreContext);
    const appVersion = context.appVersion;
    return (
        <div className='about'>
            <div className="title">
                <h2>About</h2>
            </div>
            <div className="content">
                <img src="" alt="" />
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Provident tenetur earum a dolores qui cupiditate unde eos
                    autem hic ducimus iure obcaecati necessitatibus laborum,
                    praesentium, ullam nobis natus iste. Sit!
                </p>
            </div>
            <div className="version">
                <p>App Version: {appVersion}</p>
            </div>
        </div>
    )
}

export default About