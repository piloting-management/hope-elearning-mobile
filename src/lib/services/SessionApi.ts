import auth from '@react-native-firebase/auth';

export async function getSession(): Promise<{
  token: string | null;
  cookie: string | null;
  userId: string | null;
}> {
  try {
    const currentUser = auth().currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken();
      const userId = currentUser.uid;
      const cookie = `access_token=${token}`; // Cookie olarak token ekliyoruz
      return { token, cookie, userId };
    } else {
      throw new Error('User not authenticated');
    }
  } catch (error) {
    console.error('Error fetching session token:', error);
    return { token: null, cookie: null, userId: null };
  }
}
