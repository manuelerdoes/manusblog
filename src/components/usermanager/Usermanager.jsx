import React, { useState } from 'react'
import "./usermanager.css"

function Usermanager({ user }) {
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
                <h2>{user.name}</h2>
                <p>email: max@muster.ch</p>
                <div className="changeavatar">

                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload new avatar pic
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <button>Save</button>
                </div>
            </div>
            <div className="useraction">
                <div className="changepassword">
                    <input type="password" placeholder='Password' name='password' />
                    <button>Change Password</button>
                </div>
                <div className="changemail">
                    <input type="text" placeholder='Email' name='email' />
                    <button>Change Email</button>
                </div>
                <div className="logout">
                    <button>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Usermanager