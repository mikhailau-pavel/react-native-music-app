import { NativeStackScreenProps } from '@react-navigation/native-stack';

enum PropsRoutes {
  HOME = 'Home',
  LOGIN = 'Login',
  PROFILE = 'Profile',
  PLAYLIST = 'Playlist',
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
  Home: { loginAttempt: boolean };
  Login: undefined;
  Profile: undefined;
  Playlist: { playlistId: string; playlistCover: string; playlistTitle: string };
  NotFound: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.HOME>;
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.LOGIN>;
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.PROFILE>;
type PlaylistScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.PLAYLIST>;
type NotFoundScreenProps = NativeStackScreenProps<RootStackParamList>;

type PlaylistItemData = {
  title: string;
  id: string;
  imageURL: string;
  playlistId: string;
};

type TrackItemData = {
  title: string;
  artist: string;
  imageURL: string;
  trackId: string;
};

type PlaylistItemProps = {
  item: PlaylistItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

type TrackItemProps = {
  item: TrackItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

type CurrentUserPlaylist = {
  index: number;
  description: string;
  external_url: string;
  href: string;
  id: string;
  images: [
    {
      height: number | null;
      width: number | null;
      url: string;
    },
  ];
  playlistName: string;
  playlistOwnerName: string;
  playlistOwnerLink: string;
  playlistOwnerId: string;
  name: string;
};

type CurrentPlaylistTracksResponse = {
  track: {
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      images: {
        url: string;
      }[];
    };
    id: string;
  };
};

export type {
  AuthParams,
  RootStackParamList,
  HomeScreenProps,
  LoginScreenProps,
  ProfileScreenProps,
  PlaylistScreenProps,
  NotFoundScreenProps,
  PlaylistItemData,
  PlaylistItemProps,
  CurrentUserPlaylist,
  TrackItemData,
  TrackItemProps,
  CurrentPlaylistTracksResponse,
};

export { PropsRoutes };
