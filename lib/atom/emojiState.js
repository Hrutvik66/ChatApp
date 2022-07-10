import { atom } from 'recoil';

export const emojiState = atom({
  key: 'emojiState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
