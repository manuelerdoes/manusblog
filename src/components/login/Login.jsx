import React, { useState } from 'react'
import "./login.css"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from 'firebase/firestore';
import upload from "../../lib/upload";

function Login() {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })

  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target)

    const { email, password } = Object.fromEntries(formData);

    try {

      await signInWithEmailAndPassword(auth, email, password);

      setLoginError(false);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target)

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      const imgUrl = await upload(avatar.file)

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
      });

      await setDoc(doc(db, "userblogs", res.user.uid), {
        blogs: [],
      });
      setRegisterSuccess(true);
      setRegisterError(false);
    } catch (error) {
      console.log(error.message)
      setErrorMessage(error.message);
      setRegisterError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder='Email' name='email' />
          <input type="password" placeholder='Password' name='password' />
          <button disabled={loading}>{loading ? "loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload avatar pic
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" placeholder='Username' name='username' />
          <input type="text" placeholder='Email' name='email' />
          <input type="password" placeholder='Password' name='password' />
          <button disabled={loading}>{loading ? "loading" : "Register"}</button>
          {registerSuccess &&
            <div className="registersuccess">
              <h3>Registered successfully!</h3>
            </div>
          }
          {registerError &&
            <div className="registererror">
              <h3>Could not create user!</h3>
              <span>{errorMessage}</span>
            </div>
          }
        </form>
      </div>
    </div>
  )
}

export default Login