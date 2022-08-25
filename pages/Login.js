import { LockClosedIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import { useEffect } from 'react';
import { auth, provider,db } from '../lib/firebase';
import { setDoc,doc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from 'next/router';
import { onAuthStateChanged, signInWithRedirect } from 'firebase/auth';

const Login = () => {

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setData(user);
        toast.success("User registered successfully");
        router.push("/Home");
      }
    });
  }, []);

  const signIn = async() => {
    await signInWithRedirect(auth, provider);
  };
  

  const setData = async (data) => {
    await setDoc(doc(db, "users", data?.uid), {
      email: data?.email,
      photoURL: data?.photoURL,
      userName: data?.displayName,
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-8 bg-slate-200">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col space-y-3">
        <div className="space-y-3">
          <LockClosedIcon className="mx-auto h-12 w-12 text-green-400" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="flex flex-col space-y-3">
          {/* <input
          type="text"
          name="userName"
          className="input"
          placeholder="Username"
        />
        <input type="text" name="email" className="input" placeholder="Email" />
        <input
          type="password"
          name="password"
          className="input"
          placeholder="Password"
        />
        <input
          type="password"
          name="cPassword"
          className="input"
          placeholder="Confirm Password"
        />
        <button
          type="submit"
          className="transform rounded-md bg-blue-700 p-2 text-white transition duration-300 ease-out hover:scale-[102%] focus:ring focus:ring-blue-300"
        >
          Log In
        </button>
        <hr /> */}
          <h1 className="flex justify-center text-2xl font-semibold text-white">
            CHAT<p className="font-extrabold text-blue-800">APP</p>
          </h1>
          <button
            type="button"
            className="flex w-full content-center justify-center rounded-md border-[1.5px] border-black bg-white p-2 transition delay-100 duration-1000 ease-in-out hover:scale-[105%] hover:border-violet-700 focus:ring focus:ring-blue-300"
            onClick={signIn}
          >
            <img src="../../google.png" alt="google" className="mr-5 h-5 w-5" />
            Login with Google
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
