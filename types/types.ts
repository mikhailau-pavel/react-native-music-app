import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum HomePropsRoutes {
  HOME = 'Home',
  PLAYLIST = 'Playlist',
  PLAYER = 'Player',
  WELCOME = 'Welcome',
  LOGIN = 'Login',
}

export enum TopsPropsRoutes {
  TOPS = 'TopsMain',
}

export enum ProfilePropsRoutes {
  PROFILE = 'Profile',
}

export type AuthParams = {
  response_type: 'code';
  client_id: string;
  scope: string;
  code_challenge_method: 'S256';
  code_challenge: string;
  redirect_uri: string;
};

export type RootStackParamList = {
  Home: { loginAttempt: boolean } | undefined;
  Profile: undefined;
  Playlist: { playlistId: string; playlistCover: string; playlistTitle: string; type: string };
  Player: TrackItemData[] | undefined;
  NotFound: undefined;
  Welcome: undefined;
  Login: undefined;
};

export type TopsStackParamList = {
  TopsMain: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, HomePropsRoutes.HOME>;
export type PlaylistScreenProps = NativeStackScreenProps<RootStackParamList, HomePropsRoutes.PLAYLIST>;
export type PlayerScreenProps = NativeStackScreenProps<RootStackParamList, HomePropsRoutes.PLAYER>;
export type NotFoundScreenProps = NativeStackScreenProps<RootStackParamList>;


export type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, HomePropsRoutes.WELCOME>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, HomePropsRoutes.LOGIN>;

export type TopsMainScreenProps = NativeStackScreenProps<
  TopsStackParamList,
  TopsPropsRoutes.TOPS
>;

export type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  ProfilePropsRoutes.PROFILE
>;

export type PlaylistItemData = {
  title: string;
  id: string;
  imageURL: string;
  playlistId: string;
};

export type TrackItemData = {
  title: string;
  artist: string;
  imageURL: string;
  trackId: string;
  previewUrl: string;
};

export type PlaylistItemProps = {
  item: PlaylistItemData;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
};

export type TrackItemProps = {
  item: TrackItemData;
  index: number;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

export type CurrentUserPlaylist = {
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

export type SelectedPlaylistTracksResponse = {
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
    preview_url: string;
  };
};

export type CurrentAlbumTracksResponse = {
  name: string;
  id: string;
  preview_url: string;
};

export type TopsResponseDataItem = {
  name: string;
  images: { url: string }[];
  album: {
    images: { url: string }[];
  };
  uri?: string;
};

export type TopsListItem = {
  title: string;
  imageUrl: string;
};

export type ProfileScreenUserData = {
  name: string;
  followersCount: number;
  imageUrl: string;
};
