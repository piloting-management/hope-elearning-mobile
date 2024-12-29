import { makeApiRequest } from '../makeApiRequest';
import { Subject, Page, SearchParams } from '../models';
import { buildQueryParams } from '../utils';
import { validateApiResponse } from '../validateApiResponse';

export async function getSubjects(
  params: SearchParams,
  signal?: AbortSignal
): Promise<Page<Subject>> {
  const query = buildQueryParams(params);
  const url = `/content/subjects${query}`;

  const resp = await makeApiRequest({
    url,
    options: {
      signal,
    },
  });

  await validateApiResponse(resp);

  const data = await resp.json();

  const contents = Array.isArray(data) ? data : data.contents;

  if (!contents || !Array.isArray(contents)) {
    throw new Error(
      'API response does not contain "contents" or it is not an array.'
    );
  }

  const enhancedContents = contents.map((subject) => ({
    id: subject.id,
    name: subject.name,
    slug: subject.slug,
    categoryId: subject.category.id,
    category: subject.category,
  }));

  return {
    contents: enhancedContents,
    currentPage: 1,
    totalPage: 1,
    pageSize: enhancedContents.length,
    totalElements: enhancedContents.length,
  };
}
