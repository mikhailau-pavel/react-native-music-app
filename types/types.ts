import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthParams = {
  response_type: 'code';
  client_id: string;
  scope: string;
  code_challenge_method: 'S256';
  code_challenge: string;
  redirect_uri: string;
};

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Profile: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export type {
  AuthParams,
  RootStackParamList,
  HomeScreenProps,
  LoginScreenProps,
  ProfileScreenProps,
};
