import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { ArticlePayload } from '@_src/api/models/article.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect } from '@_src/ui/fixtures/merge.fixture'
import { APIRequestContext, APIResponse } from '@playwright/test'

export async function createArticleWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  //tworzenie artykułu
  const articleDataFinal = articleData || prepareArticlePayload()

  //przekazywanie tokena
  const responseArticle = await request.post(apiUrls.articlesUrl, {
    headers,
    data: articleDataFinal,
  })

  //sprawdzenie czy artykuł został utworzony
  const articleJson = await responseArticle.json()

  const expectedStatusCode = 200
  await expect(async () => {
    const responseArticleCreated = await request.get(`${apiUrls.articlesUrl}/${articleJson.id}`)
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode)
  }).toPass({ timeout: 2_000 })

  return responseArticle
}
