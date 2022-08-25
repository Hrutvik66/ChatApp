//React
import { useEffect, useState } from 'react';
//Heroicons
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
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
  getDoc
} from '../lib/firebase';
//React-firebase
import { useAuthState } from 'react-firebase-hooks/auth';
//Components
import Friends from './Friends';
//Toastify
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from 'next/router';
import Image from 'next/image';
//Profile
import Profile from '../public/Profile.png';
//lib
import getRecipientUser from '../lib/getRecipientUser';

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const [searchedUserInfo, setSearchedUserInfo] = useState([]);
  const [chats, setChats] = useState([]);

  
  useEffect(() => {
    const getChats = async () => {
      if (user) {
        const chatRef = collection(db, 'chats');
        const q = query(chatRef, where('users', 'array-contains', user?.email));
        const querySnapshot = await getDocs(q);

        const data = [
          ...new Set(
            querySnapshot?.docs?.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
          ),
        ];
        setChats(data);
      } else {
        router.push('/Login')
      }
    };
    getChats();
  }, [user]);
  

  const createChat = async () => {
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
        toast.error("Invalid Email");
        return false;
      }
      return true;
    };

    //Chat already exist between users
    const isChatExist = () => {
      for (var i = 0; i < chats.length; i++){
        const receiver = getRecipientUser(chats[i].users, user);
        if (input === receiver) {
          return true;
        }
      }
      return false;
    };
    // ! isUser exist in database Error
    const isUserExists = async () => {
      const ref = doc(db, "users",input);
      const userRef = await getDoc(ref);
      if (!userRef.exists) {
        toast.error("User does not exist");
        return false;
      } else return true;
    };
    
    //checking of all conditions

    if (checkEmail() && isUserExists()) {
      if (isChatExist()) {
        toast.error("Chat already exist.");
      } else {
        const newChatRef = doc(collection(db, "chats"));
        await setDoc(newChatRef, {
          users: [user?.email, input],
        });
        toast.success("Chat created successfully 🎉");
      }
    } else {
      toast.error("User not exist on application.");
    }
  };

  return (
    <div className="h-screen space-y-5 bg-slate-200 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Image
          src={user ? user?.photoURL : Profile}
          alt="Profile-image"
          className="cursor-pointer rounded-full hover:opacity-50"
          width={40}
          height = {40}
          onClick={() => {
            auth.signOut();
            router.push('/');
          }}
        />
        <div className="flex items-center space-x-4 text-gray-700">
          <ChatBubbleOvalLeftEllipsisIcon
            className="h-9 w-9 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out  hover:bg-white hover:shadow-2xl"
            onClick={createChat}
          />
          <EllipsisVerticalIcon className="h-7 w-7 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out hover:bg-white hover:shadow-2xl" />
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
              <MagnifyingGlassIcon className="h-11 w-11 rounded-lg p-2 transition duration-500 ease-in-out hover:scale-125 hover:text-red-500" />
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
        {chats?.map((chat) => {
          return (
            <Friends key={chat.id} id={chat.id} users={chat.users} />
          );
        })}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Sidebar;
