import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum PropsRoutes {
  HOME = 'Home',
  LOGIN = 'Login',
  PROFILE = 'Profile',
  PLAYLIST = 'Playlist',
  PLAYER = 'Player',
}

export enum TopsPropsRoutes {
  TOPS = 'Tops',
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
  Login: undefined;
  Profile: undefined;
  Playlist: { playlistId: string; playlistCover: string; playlistTitle: string };
  Player: TrackItemData[] | undefined;
  NotFound: undefined;
};

export type RootTopsStackParamList = {
  Tops: undefined;
}

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.HOME>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.LOGIN>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.PROFILE>;
export type PlaylistScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.PLAYLIST>;
export type PlayerScreenProps = NativeStackScreenProps<RootStackParamList, PropsRoutes.PLAYER>;
export type NotFoundScreenProps = NativeStackScreenProps<RootStackParamList>;

export type TopsMainScreenProps = NativeStackScreenProps<RootTopsStackParamList, TopsPropsRoutes.TOPS>;


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
  backgroundColor: string;
  textColor: string;
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

export type CurrentPlaylistTracksResponse = {
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
