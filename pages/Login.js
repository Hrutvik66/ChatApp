import { LockClosedIcon } from '@heroicons/react/solid';
import Head from 'next/head';
import { auth, signInWithPopup, provider } from '../lib/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
toast.configure();

const Login = () => {
  const Router = useRouter();
  const signIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      result &&
        Router.push('/Home') &&
        toast.success('User Loged In successfully 🎉🎉');
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-8 bg-slate-200">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LockClosedIcon className="h-8 w-8 text-gray-700 hover:text-green-500" />
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
        <h1 className="flex font-semibold text-white justify-center text-2xl">
            CHAT<p className="font-extrabold text-blue-800">APP</p>
          </h1>
        <button
          className="transform rounded-md border-2 bg-white p-2 text-black transition duration-300 ease-out hover:scale-[102%] focus:ring focus:ring-gray-300"
          onClick={signIn}
        >
          Sign in with Google{' '}
        </button>
      </div>
    </div>
  );
};

export default Login;
