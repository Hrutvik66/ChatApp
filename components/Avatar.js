import Image from 'next/image';
import { useEffect, useState } from 'react';
//Firebase
import { getDocs, db, query, collection, where } from '../lib/firebase';

const Avatar = ({ email }) => {
  const [userInfo, setUserInfo] = useState([]);
  useEffect(() => {
    const getUserData = async () => {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserInfo([doc.data().photoURL]);
      });
    };
    getUserData();
  }, [email]);
  return (
    <div className="hover:bg-gray-600">
      {userInfo ? (
        <img src={userInfo} alt="me" className="h-10 w-10 rounded-full" />
      ) : (
        <Image
          src="/Profile.png"
          alt="me"
          height={40}
          width={40}
          className="rounded-full"
          priority="true"
        />
      )}
    </div>
  );
};

export default Avatar;
