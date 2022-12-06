import React from 'react';

export interface UserInterface {
  token: string;
  id: string;
  emoji: string;
}

export interface UserContextInterface {
  user: UserInterface;
  setUser: React.Dispatch<React.SetStateAction<UserInterface>> | (() => void);
}

export const UserContext = React.createContext<UserContextInterface>({
  user: {
    token: ``,
    id: ``,
    emoji: ``,
  },
  setUser: () => {},
});
