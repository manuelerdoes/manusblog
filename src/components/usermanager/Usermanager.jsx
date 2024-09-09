import React, { useState } from 'react'
import "./usermanager.css"
import { useUserStore } from '../../lib/userStore';
import { auth } from '../../lib/firebase';

function Usermanager() {
    
    const { currentUser } = useUserStore();

    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    })

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    return (
        <div className='usermanager'>
            <div className="info">
                <h2>{currentUser.username}</h2>
                <p>email: max@muster.ch</p>
                <div className="changeavatar">

                    <label htmlFor="file">
                        <img src={!avatar.file ? currentUser.avatar || "./avatar.png" : avatar.url || "./avatar.png"} alt="" />
                        Upload new avatar pic
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <button>Save</button>
                </div>
            </div>
            <div className="useraction">
                <div className="changeusername">
                    <input type="text" placeholder='Username' name='username' />
                    <button>Change Username</button>
                </div>
                <div className="changepassword">
                    <input type="password" placeholder='Password' name='password' />
                    <button>Change Password</button>
                </div>
                <div className="changemail">
                    <input type="text" placeholder='Email' name='email' />
                    <button>Change Email</button>
                </div>
                <div className="logout">
                    <button onClick={() => auth.signOut()}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Usermanager