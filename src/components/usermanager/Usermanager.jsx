import React, { useState } from 'react'
import "./usermanager.css"
import { useUserStore } from '../../lib/userStore';
import { auth, db } from '../../lib/firebase';
import { updateCurrentUser } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import upload from "../../lib/upload";


function Usermanager() {

    const { currentUser, fetchUserInfo } = useUserStore();

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

    const handleUpdateAvatar = async () => {
        console.log("handleUpdateAvatar");
        const imgUrl = await upload(avatar.file);

        try {
            // const res = await updateCurrentUser(auth, currentUser);
            await updateDoc(doc(db, "users", currentUser.id), {
                avatar: imgUrl,
            });
            fetchUserInfo();
        } catch (error) {
            console.log(error.message)
        } finally {

        }
    }

    return (
        <div className='usermanager'>
            <div className="info">
                <h2>{currentUser.username}</h2>
                <p>email: max@muster.ch</p>
                <div className="changeavatar">

                    <label htmlFor="file">
                        <img src={!avatar.file ? currentUser.avatar || "./avatar.png"
                            : avatar.url || "./avatar.png"} alt="" />
                        Upload new avatar pic
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <button onClick={handleUpdateAvatar}>Save</button>
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