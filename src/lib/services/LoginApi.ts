import { makeApiRequest } from '../makeApiRequest';

/**
 * Kullanıcıyı doğrulamak için NestJS API'ye istek atar.
 * @param token Firebase tarafından alınan kullanıcı tokeni
 * @param uid Kullanıcı Firebase UID'si
 * @param email Kullanıcı e-posta adresi
 * @param deviceId Kullanıcı cihaz ID'si
 */
export async function verifyUserWithApi(
  uid: string,
  email: string,
  deviceId: string,
  isDeviceApproved?: boolean, // Opsiyonel parametre
) {
  const url = '/auth/verify-login'; // Mevcut uç noktayı kullanıyoruz
  try {
    console.log('Kullanıcı doğrulama isteği yapılıyor...');

    // API'ye gönderilecek body oluşturuluyor
    const requestBody: Record<string, any> = {
      uid, // Firebase UID'sini gönderiyoruz
      email, // Kullanıcı email opsiyonel olarak ekleniyor
      deviceId, // Cihaz ID'sini gönderiyoruz
    };

    // Eğer isDeviceApproved varsa, body'ye ekleniyor
    if (isDeviceApproved !== undefined) {
      requestBody.isDeviceApproved = isDeviceApproved;
    }

    const response = await makeApiRequest({
      url,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    });

    if (!response.ok) {
      throw new Error('Kullanıcı doğrulama isteği başarısız oldu.');
    }

    return await response.json(); // API yanıtını döndürüyoruz
  } catch (error) {
    console.error('Kullanıcı doğrulama API isteği sırasında hata:', error);
    throw error; // Hata durumunda çağıran fonksiyona hata fırlatıyoruz
  }
}
