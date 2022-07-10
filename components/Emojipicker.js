//Emoji picker
import Picker from 'emoji-picker-react';
//react
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { emojiState } from '../lib/atom/emojiState';
//Recoil

const Emojipicker = () => {
  const [chosenEmoji, setChosenEmoji] = useRecoilState(emojiState);
  const onEmojiClick = (event,emojiObject) => {
    setChosenEmoji([...chosenEmoji,emojiObject]);
  };
  return (
    <div>
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default Emojipicker;
