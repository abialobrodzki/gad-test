import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api'
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { ArticlePayload } from '@_src/api/models/article.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { APIResponse } from '@playwright/test'

test.describe('Verify articles DELETE operations @crud @delete @article @api', () => {
  //testy zależne z usuwaniem artykułu
  test.describe.configure({ mode: 'serial' })
  test.describe('DELETE operations - serial', () => {
    let headers: Headers
    let articleId: number

    test.beforeAll('should login and create article', async ({ request }) => {
      headers = await getAuthorizationHeader(request)

      const articleData = prepareArticlePayload()
      const responseArticle = await createArticleWithApi(request, headers, articleData)
      const articleJson = await responseArticle.json()

      articleId = articleJson.id
    })

    test('should not delete an article with non logged-in user @GAD-R08-05', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401

      // Act
      //brak przekazywania tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticle = await request.delete(`${apiUrls.articlesUrl}/${articleId}`, {})

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticle.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted article
      const expectedNotDeletedArticleStatusCode = 200
      await expectGetResponseStatus(request, `${apiUrls.articlesUrl}/${articleId}`, expectedNotDeletedArticleStatusCode)
    })

    test('should delete an article with logged-in user @GAD-R08-05', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200

      // Act
      //przekazywanie tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticle = await request.delete(`${apiUrls.articlesUrl}/${articleId}`, {
        headers,
      })

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticle.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check deleted article response
      const expectedDeletedArticleStatusCode = 404
      await expectGetResponseStatus(request, `${apiUrls.articlesUrl}/${articleId}`, expectedDeletedArticleStatusCode)

      // Assert check article deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiUrls.articlesUrl}/${articleId}`, {
        headers,
      })
      const actualStatusCode = retrieveResponse.status()
      const retrieveResponseJSON = await retrieveResponse.json()

      // Assert
      expect(
        actualStatusCode,
        `Expected status code ${expectedDeletedArticleStatusCode}, and received ${actualStatusCode} !`,
      ).toBe(expectedDeletedArticleStatusCode)
      expect(retrieveResponseJSON).toEqual(expectedReturnObject)
    })
  })

  //testy niezależne z usuwaniem artykułu
  test.describe('DELETE operations', () => {
    let articleData: ArticlePayload
    let headers: Headers
    let responseArticle: APIResponse

    test.beforeEach('should login and create article', async ({ request }) => {
      headers = await getAuthorizationHeader(request)
      articleData = prepareArticlePayload()
      responseArticle = await createArticleWithApi(request, headers, articleData)
    })

    test('should delete an article with logged-in user @GAD-R08-05', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200
      const articleJson = await responseArticle.json()
      const articleId = articleJson.id

      // Act
      //przekazywanie tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticleDelete = await request.delete(`${apiUrls.articlesUrl}/${articleId}`, {
        headers,
      })

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticleDelete.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check deleted article response
      const expectedDeletedArticleStatusCode = 404
      await expectGetResponseStatus(request, `${apiUrls.articlesUrl}/${articleId}`, expectedDeletedArticleStatusCode)

      // Assert check article deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiUrls.articlesUrl}/${articleId}`, {
        headers,
      })
      const actualStatusCode = retrieveResponse.status()
      const retrieveResponseJSON = await retrieveResponse.json()

      // Assert
      expect(
        actualStatusCode,
        `Expected status code ${expectedDeletedArticleStatusCode}, and received ${actualStatusCode} !`,
      ).toBe(expectedDeletedArticleStatusCode)
      expect(retrieveResponseJSON).toEqual(expectedReturnObject)
    })

    test('should not delete an article with non logged-in user @GAD-R08-05', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401
      const articleJson = await responseArticle.json()
      const articleId = articleJson.id

      // Act
      //brak przekazywania tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticleDelete = await request.delete(`${apiUrls.articlesUrl}/${articleId}`, {})

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticleDelete.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted article
      const expectedNotDeletedArticleStatusCode = 200
      await expectGetResponseStatus(request, `${apiUrls.articlesUrl}/${articleId}`, expectedNotDeletedArticleStatusCode)
    })
  })
})
