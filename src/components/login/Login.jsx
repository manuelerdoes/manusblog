import React, { useState, useEffect } from 'react';
import './login.css';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import upload from '../../lib/upload';

function Login({ setShowUserstuff }) {
  const [avatar, setAvatar] = useState({ file: null, url: '' });
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [username, setUsername] = useState(''); // Track username input
  const [usernameAvailable, setUsernameAvailable] = useState(null); // Check if username is available
  const [checkingUsername, setCheckingUsername] = useState(false); // Show loading while checking

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
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginError(false);
      setShowUserstuff(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email } = Object.fromEntries(formData);
    await sendPasswordResetEmail(auth, email).then(() => {
      alert('Password Reset Email Sent!');
      setForgotPassword(false);
    }).catch(error => {
      alert(error.message);
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!usernameAvailable) return; // Prevent submission if username is taken

    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      let imgUrl = '';
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      }

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
      });

      setRegisterSuccess(true);
      setRegisterError(false);
    } catch (error) {
      setErrorMessage(error.message);
      setRegisterError(true);
    } finally {
      setLoading(false);
    }
  };

  // Debounced username availability check
  useEffect(() => {
    if (username.trim() === '') {
      setUsernameAvailable(null);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      setUsernameAvailable(querySnapshot.empty);
      setCheckingUsername(false);
    };

    const debounceCheck = setTimeout(checkUsername, 500); // 500ms debounce

    return () => clearTimeout(debounceCheck);
  }, [username]);

  return (
    <div className='login'>
      {!forgotPassword ? (
        <div className='item'>
          <h2>Welcome back,</h2>
          <form onSubmit={handleLogin}>
            <input type='text' placeholder='Email' name='email' />
            <input type='password' placeholder='Password' name='password' />
            <button disabled={loading}>{loading ? 'loading' : 'Sign In'}</button>
          </form>
          <span className='forgotpassword' onClick={() => setForgotPassword(true)}>
            forgot password
          </span>
        </div>
      ) : (
        <div className='item'>
          <h2>Reset Password</h2>
          <form onSubmit={sendPasswordReset}>
            <input type='text' placeholder='Email' name='email' />
            <button>Send</button>
          </form>
        </div>
      )}
      <div className='separator'></div>
      <div className='item'>
        <h2>Create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor='file'>
            <img src={avatar.url || './avatar.png'} alt='' />
            Upload avatar pic
          </label>
          <input type='file' id='file' style={{ display: 'none' }} onChange={handleAvatar} />
          <input
            type='text'
            placeholder='Username'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
          />
          {checkingUsername ? (
            <span>Checking username...</span>
          ) : usernameAvailable === false ? (
            <span className='error'>Username is taken</span>
          ) : usernameAvailable === true ? (
            <span className='success'>Username is available</span>
          ) : null}
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button disabled={loading || usernameAvailable === false}>
            {loading ? 'loading' : 'Register'}
          </button>
          {registerSuccess && (
            <div className='registersuccess'>
              <h3>Registered successfully!</h3>
            </div>
          )}
          {registerError && (
            <div className='registererror'>
              <h3>Could not create user!</h3>
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;