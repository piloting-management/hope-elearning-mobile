import { makeApiRequest } from '../makeApiRequest';
import { Course, Lesson, Page, SearchParams } from '../models';
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

export async function getLessonBySlug(slug: string, signal?: AbortSignal) {
  const url = `/enrollments/${slug}/lesson`;

  const resp = await makeApiRequest({
    url,
    options: {
      signal,
    },
  });

  await validateApiResponse(resp);

  return (await resp.json()) as Lesson; // Assuming `Lesson` is a defined type
}

export async function getCourses(
  params: SearchParams,
  signal?: AbortSignal
): Promise<Page<Course>> {
  const query = buildQueryParams(params);
  const url = `/content/courses${query}`;

  const resp = await makeApiRequest({
    url,
    options: {
      signal,
    },
  });

  await validateApiResponse(resp);

  const data = await resp.json();

  if (!data.contents || !Array.isArray(data.contents)) {
    throw new Error(
      'API response does not contain "contents" or it is not an array.'
    );
  }

  // Gelen verilerde subject nesnesinden subjectId ekliyoruz
  const enhancedContents = data.contents.map((course: Course) => ({
    ...course,
    subjectId: course.subject?.id || null, // subject varsa id'sini ekliyoruz, yoksa null
  }));

  return {
    ...data,
    contents: enhancedContents,
  };
}

export async function courseEnroll(
  courseId: string,
  token: string,
  signal?: AbortSignal
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
    token,
  });

  await validateApiResponse(resp);

  return await resp.json();
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

  if (resp.status === 201 || resp.status === 204) {
    return { success: true };
  }

  return await resp.json();
}
