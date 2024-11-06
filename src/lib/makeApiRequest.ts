import { API_URL } from '@env';

interface MakeApiRequestProps {
  url: string;
  options?: RequestInit;
  token?: string; // Token opsiyonel parametre
}

export async function makeApiRequest({
  url,
  options = {},
  token, // Token parametresi opsiyonel olarak geliyor
}: MakeApiRequestProps): Promise<Response> {
  let requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Token varsa header'a ekle
    },
  };

  const requestUrl = `${API_URL}${url}`;

  // Log isteğin tam URL'sini ve methodunu
  console.log(`API Request URL: ${requestUrl}`);
  console.log('Request Options:', requestOptions);

  try {
    const response = await fetch(requestUrl, requestOptions);

    // Response durumu başarılı mı?
    console.log(`API Response Status: ${response.status}`);
    const contentType = response.headers.get('content-type');
    if (response.status === 201 || response.status === 204 || !contentType) {
      // Eğer 201 Created veya 204 No Content dönerse ve body boşsa JSON parse etmeye çalışma
      console.log('No content in the response body or not a JSON response.');
      return response; // Yanıtı direkt döndür
    }

    // Yanıtın içeriğini (örneğin JSON ise) loglayın
    if (response.ok) {
      const responseBody = await response.clone().json(); // Yanıtı klonlayarak birden fazla kez kullanabiliriz
      console.log('API Response Body:', responseBody);
    } else {
      console.log(`API Error Response Status: ${response.status}`);
      console.log('API Error Response Body:', await response.clone().text());
    }

    // Eğer access token expired ise, refresh token ile yeni bir access token al
    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh token...');
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (refreshResponse.ok) {
        const { accessToken } = await refreshResponse.json();
        console.log('New Access Token:', accessToken);

        // Yeni token ile header'ı güncelle ve isteği yeniden yap
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        console.log('Retrying request with new access token...');
        const retryResponse = await fetch(requestUrl, requestOptions);

        // Yanıtın durumunu ve içeriğini logla
        console.log(`Retry API Response Status: ${retryResponse.status}`);
        const retryResponseBody = await retryResponse.clone().json();
        console.log('Retry API Response Body:', retryResponseBody);

        return retryResponse;
      } else {
        console.log('Failed to refresh token:', await refreshResponse.text());
      }
    }

    return response;
  } catch (error) {
    // Hata olduğunda logla
    console.error('API Request Failed:', error);
    throw error; // Hatayı tekrar fırlat, böylece üst katmanda da yakalanabilir
  }
}
