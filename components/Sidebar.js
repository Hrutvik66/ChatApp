//React
import { useEffect, useState } from 'react';
//Heroicons
import {
  DotsVerticalIcon,
  FlagIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { ChatIcon } from '@heroicons/react/solid';
//Firebase
import {
  auth,
  doc,
  db,
  query,
  collection,
  where,
  setDoc,
  getDocs,
} from '../lib/firebase';
//React-firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
//Components
import Friends from './Friends';
//Toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
toast.configure();

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const [searchedUserInfo, setSearchedUserInfo] = useState([]);
  const Router = useRouter();
  const useChatRef = query(
    collection(db, 'chats'),
    where('users', 'array-contains', user?.email)
  );
  const [chatSnapshot] = useCollection(useChatRef);

  useEffect(() => { }, [chatSnapshot]);
  
  if (!user) {
    Router.push('/');
  }

  const createChat = () => {
    const input = prompt(
      'Please enter a email address of user to chat with user'
    );
    if (!input) {
      toast.error('Please, specify the user :(');
      return null;
    }

    //Email valid condition
    const isEmailValid = (email) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email));
    };
    const checkEmail = () => {
      if (!isEmailValid(input)) {
        return false;
      }
      return true;
    };

    //Chat already exist between users
    const chatAlreadyExist = (recepientEmail) =>
      !!chatSnapshot?.docs.find(
        (chat) =>
          chat.data().users.find((user) => user === recepientEmail)?.length > 0
      );
    // ! isUser exist in database Error
    const isUserExist = async () => {
      const q = query(collection(db, 'users'), where('email', '==', input));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSearchedUserInfo([doc.data()]);
      });
    };
    //new chat
    const newChat = async () => {
      const newChatRef = doc(collection(db, 'chats'));

      await setDoc(newChatRef, {
        users: [user.email, input],
      });
    };
    //checking of all conditions
    if (checkEmail()) {
      if (searchedUserInfo[0]?.email === input) {
        if (!chatAlreadyExist(input)) {
          newChat();
        } else {
          toast.error('Chat already exist :)');
        }
      } else {
        toast.error('No such user exist :(');
      }
    } else {
      toast.error('Invalid Email :(');
    }
  };

  return (
    <div className="space-y-5 p-3 bg-slate-200 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <img
          src={user.photoURL}
          alt="Profile-image"
          className="h-10 w-10 cursor-pointer rounded-full hover:opacity-50"
          onClick={() => {
            auth.signOut();
            Router.push('/');
          }}
        />
        <div className="flex items-center space-x-4 text-gray-700">
          <ChatIcon
            className="h-9 w-9 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out  hover:bg-white hover:shadow-2xl"
            onClick={createChat}
          />
          <DotsVerticalIcon className="h-7 w-7 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out hover:bg-white hover:shadow-2xl" />
        </div>
      </div>
      {/* SearchBar */}
      <div>
        <div className="relative text-black">
          <span className="absolute inset-y-0 left-0 flex items-center">
            <button
              type="submit"
              className="focus:shadow-outline focus:outline-none"
            >
              <SearchIcon className="h-11 w-11 rounded-lg p-2 transition duration-500 ease-in-out hover:scale-125 hover:text-red-500" />
            </button>
          </span>
          <input
            type="search"
            name="search"
            className="input w-full pl-[3.1rem] transition duration-500 ease-in-out"
            placeholder="SEARCH . . ."
          ></input>
        </div>
      </div>
      {/* List of friends */}
      <div className=" rounded-lg bg-white">
        {chatSnapshot?.docs.map((chat) => {
          return (
            <Friends key={chat.id} id={chat.id} users={chat.data().users} />
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
