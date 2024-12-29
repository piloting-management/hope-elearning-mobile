import { API_URL } from '@env';
import { getUniqueId } from 'react-native-device-info';

interface MakeApiRequestProps {
  url: string;
  options?: RequestInit;
  token?: string;
}

export async function makeApiRequest({
  url,
  options = {},
  token,
}: MakeApiRequestProps): Promise<Response> {
  const deviceId = await getUniqueId();

  // console.log('🚀 ~ deviceId:', deviceId);
  let requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'device-id': deviceId,
    },
  };

  if (token) console.log('🚀 ~ token:', token);

  const requestUrl = `${API_URL}${url}`;

  // console.log(`API Request URL: ${requestUrl}`);
  // console.log('Request Options:', requestOptions);

  try {
    const response = await fetch(requestUrl, requestOptions);
    // console.log('🚀 ~ response:', response);

    // console.log(`API Response Status: ${response.status}`);
    const contentType = response.headers.get('content-type');
    if (response.status === 201 || response.status === 204 || !contentType) {
      return response;
    }

    if (response.ok) {
      await response.clone().json();
    } else {
      console.log(`requestUrl: ${requestUrl}`);
      console.log(`API Error Response Status: ${response.status}`);
      console.log('API Error Response Body:', await response.clone().text());
    }

    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh token...');
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (refreshResponse.ok) {
        const { accessToken } = await refreshResponse.json();
        console.log('New Access Token:', accessToken);

        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        const retryResponse = await fetch(requestUrl, requestOptions);

        await retryResponse.clone().json();

        return retryResponse;
      } else {
        console.log('Failed to refresh token:', await refreshResponse.text());
      }
    }

    return response;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}
