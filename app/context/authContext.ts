import { createContext } from 'react';

export const initialAuthData: AuthContextData = {
  isSignedIn: false,
};

export const initialAuthContext: AuthContextType = {
  authData: initialAuthData,
  setAuthData: (): void => {},
};

export type AuthContextData = {
  isSignedIn: boolean;
};

type AuthContextType = {
  authData: AuthContextData;
  setAuthData: (input: AuthContextData) => void;
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);
