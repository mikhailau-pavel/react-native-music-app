import { storage } from '@/scripts/asyncStorage';

enum UserRequestUrls {
  CURRENT_USER = 'https://api.spotify.com/v1/me',
}

export const getUserData = async () => {
  const token = await storage.getData('access_token');
  const payload = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  try {
    const response = await fetch(UserRequestUrls.CURRENT_USER, payload);
    const data = await response.json();
    return data.id;
  } catch (err) {
    throw new Error(`Error message: ${err}`);
  }
};
