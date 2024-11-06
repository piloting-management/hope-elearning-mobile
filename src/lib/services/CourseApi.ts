import { makeApiRequest } from '../makeApiRequest';
import { Course, Page, SearchParams } from '../models';
import { buildQueryParams } from '../utils';
import { validateApiResponse } from '../validateApiResponse';
import { getSession } from './SessionApi';

export async function getCourseBySlug(slug: string, signal?: AbortSignal) {
  const url = `/content/courses/${slug}`;

  const resp = await makeApiRequest({
    url,
    options: {
      signal,
    },
  });

  await validateApiResponse(resp);

  return (await resp.json()) as Course;
}

export async function getCourses(params: SearchParams, signal?: AbortSignal) {
  const query = buildQueryParams(params);

  const url = `/content/courses${query}`;

  const resp = await makeApiRequest({
    url,
    options: {
      signal,
    },
  });

  await validateApiResponse(resp);

  return (await resp.json()) as Page<Course>;
}

export async function courseEnroll(
  courseId: string,
  token: string,
  signal?: AbortSignal,
) {
  const url = `/content/courses/${courseId}/enroll`;

  const resp = await makeApiRequest({
    url,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    },
    token, // Token'ı makeApiRequest'e geçiyoruz
  });

  await validateApiResponse(resp);

  return await resp.json(); // Başarılı durumda cevap döndürülebilir
}

export async function getEnrolledCourses(token: string) {
  const url = '/profile/enrollments';

  const resp = await makeApiRequest({
    url,
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Cookie: `access_token=${token}`,
      },
    },
  });

  await validateApiResponse(resp);
  return await resp.json();
}

export async function enrollCourse(courseId: number) {
  const session = await getSession();

  if (!session.token || !session.cookie) {
    throw new Error('User not authenticated');
  }

  const url = `/enrollments/${courseId}`;

  const resp = await makeApiRequest({
    url,
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token}`,
        Cookie: session.cookie,
        'Content-Type': 'application/json',
      },
    },
  });

  await validateApiResponse(resp);

  // Handle case where there's no content in the response (e.g., 201 Created)
  if (resp.status === 201 || resp.status === 204) {
    console.log('Course enrollment succeeded with no response body.');
    return { success: true }; // Return a success flag or object
  }

  // Otherwise, return the parsed JSON
  return await resp.json();
}
