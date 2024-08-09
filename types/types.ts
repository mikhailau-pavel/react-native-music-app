import { NativeStackScreenProps } from '@react-navigation/native-stack';

enum PropsRoutes {
  HOME = 'Home',
  LOGIN = 'Login',
  PROFILE = 'Profile',
}

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
  NotFound: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.HOME>;
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.LOGIN>;
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.PROFILE>;
type NotFoundScreenProps = NativeStackScreenProps<RootStackParamList>;


type PlaylistItemData = {
  title: string,
  id: string
}
type PlaylistItemProps = {
  item: PlaylistItemData;
  onPress: ()=> void;
  backgroundColor: string;
  textColor: string;
}

export type {
  AuthParams,
  RootStackParamList,
  HomeScreenProps,
  LoginScreenProps,
  ProfileScreenProps,
  NotFoundScreenProps,
  PlaylistItemData,
  PlaylistItemProps
};

export { PropsRoutes };
