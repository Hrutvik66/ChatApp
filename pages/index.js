import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, doc, setDoc, Timestamp } from '../lib/firebase';
import Spinner from '../components/Spinner';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const Router = useRouter();

  useEffect(() => {
    const setData = async () => {
      await setDoc(doc(db, 'users', user?.uid), {
        email: user?.email,
        lastseen: Timestamp.now(),
        photoURL: user?.photoURL,
        userName: user?.displayName,
      });
    };

    if (user) setData();
  }, [user]);

  if (loading) return <Spinner />;
  if (user) Router.push('/Home');

  const login = () => {
    Router.push('/Login');
  };
  return (
    <div>
      <Head>
        <title>Chat-app</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="flex h-screen flex-col bg-gradient-to-tr from-[#3C22B6] to-[#3CE0E0]">
        {/* Navbar */}
        <div className="sticky top-0 flex justify-between bg-opacity-50 p-5">
          <h1 className="flex font-semibold text-white">
            CHAT<p className="font-extrabold text-blue-800">APP</p>
          </h1>
          <div className="flex space-x-10 text-sm">
            <p className=' hover:font-bold cursor-pointer' onClick={login}>ChatApp Web</p>
            <p className=' hover:font-bold cursor-pointer'>Android</p>
          </div>
        </div>
        {/* Body */}
        <div className="flex items-center justify-around p-3">
          <div className="space-y-3">
            <p className="text-3xl font-bold text-white">
              Simple, Reliable Messaging
            </p>
            <p className="text- text-sm">Message now .</p>
            <button
              className="w-[8rem] rounded-md bg-white p-2 py-[0.7rem] text-blue-800 transition duration-1000 ease-in-out hover:bg-transparent hover:text-white hover:ring hover:ring-white focus:outline-none"
              onClick={login}
            >
              Try Web Free
            </button>
          </div>
          <Image src="/Chat app image.png" alt="me" height={500} width={400} />
        </div>
      </main>
    </div>
  );
};

export default Home;
