//reactjs
import { useEffect, useRef, useState } from 'react';
//Component
import Avatar from './Avatar';
import Message from './Message';
//firebase
import {
  query,
  doc,
  collection,
  where,
  getDocs,
  db,
  auth,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
  deleteDoc,
} from '../lib/firebase';
//Heroicon
import {
  DotsVerticalIcon,
  EmojiHappyIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from '@heroicons/react/outline';
//Nextjs
import { useRouter } from 'next/router';
//react firebase hook
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
//toast
import { toast } from 'react-toastify';
//Timeago react
import TimeAgo from 'timeago-react';
//Recoil
import { useRecoilState } from 'recoil';
import { emojiState } from '../lib/atom/emojiState';
//nextjs
import dynamic from 'next/dynamic';
import Spinner from './Spinner';

// importing chat without ssr
const Emojipicker = dynamic(() => import('./Emojipicker'), {
  ssr: false,
});

const Chatwindow = ({ email, messages }) => {
  const [user, loading] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState([]);
  const [message, setMessage] = useState('');
  const endOfMessageRef = useRef(null);
  const Router = useRouter();
  const [emojiClick, setEmojiClick] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useRecoilState(emojiState);

  if (loading) return <Spinner />;
  if (!user) {
    Router.push('/');
  }

  const ref = doc(db, 'chats', Router.query.id);
  const messagesRef = query(
    collection(ref, 'messages'),
    orderBy('timestamp', 'asc')
  );
  const [messageSnapshot] = useCollection(messagesRef);
  useEffect(() => {
    scrollToBottom();
  }, [messageSnapshot]);

  const deleteChat = async () => {
    messageSnapshot?.docs.map(async (message) => {
      await deleteDoc(doc(ref, 'messages', message.id));
    });
  };

  useEffect(() => {
    const getUserData = async () => {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserInfo([doc.data()]);
      });
    };
    getUserData();
  }, [email]);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setEmojiClick((prev) => !prev);
  };

  const SendMessage = async (e) => {
    e.preventDefault();
    let emojis = '';
    chosenEmoji.forEach((emoji) => (emojis += emoji.emoji));
    const CompleteMessage =
      (message ? message : '') + (chosenEmoji ? emojis : '');
    console.log(CompleteMessage);
    if (CompleteMessage === '') {
      toast.error('Please, write a message to send');
    } else {
      const docRef = doc(db, 'users', user.uid);

      // Update the timestamp field with the value from the server
      const updateUserTime = await updateDoc(
        docRef,
        {
          lastseen: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      const ref = doc(db, 'chats', Router.query.id);
      const newDoc = doc(collection(ref, 'messages'));
      await setDoc(newDoc, {
        timestamp: serverTimestamp(),
        message: CompleteMessage,
        user: user.email,
        photoURL: user.photoURL,
      });

      setMessage('');
      setChosenEmoji([]);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="sticky top-0 mb-4 flex items-center justify-between p-2">
        <div className="flex space-x-10">
          <Avatar email={email} />
          <div>
            <p className="font-bold">{userInfo[0]?.userName}</p>
            <p className="text-[10px] font-semibold">
              last active: {'  '}
              {<TimeAgo datetime={userInfo[0]?.lastseen?.toDate()} />}
            </p>
          </div>
        </div>
        <TrashIcon
          onClick={deleteChat}
          className="h-7 w-7 cursor-pointer rounded-full p-1 transition duration-500 ease-in-out hover:bg-white hover:text-red-600 hover:shadow-2xl"
        />
      </div>
      {/* Whole middle part with input */}
      <div className="mr-2 flex h-[90%] flex-col justify-between rounded-lg bg-white">
        {/* Middle Chat */}
        <div className="overflow-y-auto p-5">
          {messageSnapshot
            ? messageSnapshot?.docs.map((message) => {
                return (
                  <Message
                    key={message.id}
                    user={message.data().user}
                    // ref={ref}
                    message={{
                      ...message.data(),
                      timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                  />
                );
              })
            : JSON.parse(messages).map((message) => {
                return (
                  <Message
                    key={message.id}
                    user={message.user}
                    // ref={ref}
                    message={message}
                  />
                );
              })}
          {emojiClick && <Emojipicker />}
          <div ref={endOfMessageRef}></div>
        </div>
        {/* Input */}
        <div className=" sticky bottom-0 mb-2 flex items-center space-x-3 p-2">
          <div className="w-[100%] text-black">
            <span className="absolute inset-y-0 left-0 flex items-center">
              <button
                type="submit"
                className="focus:shadow-outline focus:outline-none"
              >
                <EmojiHappyIcon
                  className="ml-3 h-11 w-11 rounded-lg p-2 transition duration-500 ease-in-out hover:scale-125 hover:text-blue-700"
                  onClick={handleClick}
                />
              </button>
            </span>
            <input
              type="text"
              name="message"
              value={message}
              className="input w-full bg-gray-200 pl-14 transition duration-500 ease-in-out"
              placeholder="Type a message"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <PaperAirplaneIcon
            className="h-8 w-8 rotate-45 transition duration-500 ease-in-out hover:scale-125 hover:text-green-400"
            onClick={SendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatwindow;
