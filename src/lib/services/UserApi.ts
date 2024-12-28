import { makeApiRequest } from '../makeApiRequest';
import { getSession as fetchSession } from './SessionApi';

/**
 * Öğrenci durumlarını almak için API isteği.
 * @returns Enum değerlerini içeren bir dizi
 */
export async function getTitleList() {
  const session = await fetchSession();

  if (!session.token || !session.cookie) {
    throw new Error('User not authenticated');
  }

  const url = '/admin/users/title-list';
  try {
    const response = await makeApiRequest({
      url,
      options: {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.token}`,
          Cookie: session.cookie,
          'Content-Type': 'application/json',
        },
      },
    });

    if (!response.ok) {
      throw new Error('Öğrenci durumu listesi alınamadı.');
    }

    return await response.json(); // Enum değerlerini döndürüyoruz
  } catch (error) {
    console.error('Öğrenci durumu listesi API isteği sırasında hata:', error);
    throw error;
  }
}

/**
 * Öğrenci durumunu güncellemek için API isteği.
 * @param title Seçilen öğrenci durumu
 */
export async function updateTitle(title: string) {
  const session = await fetchSession();

  if (!session.token || !session.cookie) {
    throw new Error('User not authenticated');
  }

  const url = '/admin/users/title-status';
  try {
    const response = await makeApiRequest({
      url,
      options: {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.token}`,
          Cookie: session.cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: title,
        }),
      },
    });

    if (!response.ok) {
      throw new Error('Öğrenci durumu güncellenemedi.');
    }

    return await response.json();
  } catch (error) {
    console.error(
      'Öğrenci durumu güncelleme API isteği sırasında hata:',
      error
    );
    throw error;
  }
}

/**
 * Kullanıcının oturum bilgilerini alır.
 * (Bu, oturum ve cihaz bilgilerini örneklemek için bir utility'dir.)
 */
export async function getSession() {
  // Örnek session bilgisi
  const session = {
    token: 'kullanıcı-tokeni', // Kullanıcı oturum tokeni
    deviceId: 'cihaz-id', // Cihaz ID'si
  };

  // Gerçek uygulamada bu bilgileri AsyncStorage veya bir başka oturum yönetimi aracından alabilirsiniz.
  return session;
}
