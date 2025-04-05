import { expect, test } from '@_src/fixtures/merge.fixture'
import { ArticlePayload, Headers, apiLinks, getAuthorizationHeader, prepareArticlePayload } from '@_src/utils/api.util'
import { APIResponse } from '@playwright/test'

test.describe('Verify articles CRUD operations @crud', () => {
  test('should not create an article without a logged-in user @GAD-R08-03', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const articleData = prepareArticlePayload()

    // Act
    //request POST z opcjonalnymi parametrami
    const response = await request.post(apiLinks.articlesUrl, {
      data: articleData,
    })

    // Assert
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })

  //testy zależne z usuwaniem artykułu
  test.describe.configure({ mode: 'serial' })
  test.describe('CRUD operations - serial', () => {
    let articleId: number
    let headers: Headers

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request)
    })

    test('should create an article with logged-in user @GAD-R08-03', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201

      // Act
      const articleData = prepareArticlePayload()
      //przekazywanie tokena
      const responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      })

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticle.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)
      //sprawdzenie utworzonego artykułu
      const articleJson = await responseArticle.json()
      expect.soft(articleJson.title).toEqual(articleData.title)
      expect.soft(articleJson.body).toEqual(articleData.body)

      articleId = articleJson.id
    })

    test('should not delete an article with non logged-in user @GAD-R08-05', async ({ request }) => {
      // Assert article exist
      let expectedStatusCode = 200
      await expect(async () => {
        const responseArticleCreated = await request.get(`${apiLinks.articlesUrl}/${articleId}`)
        expect(
          responseArticleCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })

      // Arrange
      expectedStatusCode = 401

      // Act
      //brak przekazywania tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticle = await request.delete(`${apiLinks.articlesUrl}/${articleId}`, {})

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticle.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted article
      const responseArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`)
      const expectedNotDeletedArticleStatusCode = 200
      expect(
        responseArticleGet.status(),
        `expected status code ${expectedNotDeletedArticleStatusCode}, and received ${responseArticleGet.status()}`,
      ).toBe(expectedNotDeletedArticleStatusCode)
    })

    test('should delete an article with logged-in user @GAD-R08-05', async ({ request }) => {
      // Assert article exist
      let expectedStatusCode = 200
      await expect(async () => {
        const responseArticleCreated = await request.get(`${apiLinks.articlesUrl}/${articleId}`)
        expect(
          responseArticleCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })

      // Arrange
      expectedStatusCode = 200

      // Act
      //przekazywanie tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticle = await request.delete(`${apiLinks.articlesUrl}/${articleId}`, {
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
      const responseArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`)
      const expectedDeletedArticleStatusCode = 404
      expect(
        responseArticleGet.status(),
        `expected status code ${expectedDeletedArticleStatusCode}, and received ${responseArticleGet.status()}`,
      ).toBe(expectedDeletedArticleStatusCode)

      // Assert check article deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiLinks.articlesUrl}/${articleId}`, {
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
  test.describe('CRUD operations', () => {
    let responseArticle: APIResponse
    let headers: Headers
    let articleData: ArticlePayload

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request)
    })

    test.beforeEach('create an article', async ({ request }) => {
      articleData = prepareArticlePayload()
      //przekazywanie tokena
      responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      })

      // Assert article exist
      const articleJson = await responseArticle.json()

      const expectedStatusCode = 200
      await expect(async () => {
        const responseArticleCreated = await request.get(`${apiLinks.articlesUrl}/${articleJson.id}`)
        expect(
          responseArticleCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })
    })

    test('should create an article with logged-in user @GAD-R08-03', async () => {
      // Arrange
      const expectedStatusCode = 201

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticle.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)
      //sprawdzenie utworzonego artykułu
      const articleJson = await responseArticle.json()
      expect.soft(articleJson.title).toEqual(articleData.title)
      expect.soft(articleJson.body).toEqual(articleData.body)
    })

    test('should delete an article with logged-in user @GAD-R08-05', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200
      const articleJson = await responseArticle.json()
      const articleId = articleJson.id

      // Act
      //przekazywanie tokena z dla zapytania z przekazywaną ścieżką - id
      const responseArticleDelete = await request.delete(`${apiLinks.articlesUrl}/${articleId}`, {
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
      const responseArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`)
      const expectedDeletedArticleStatusCode = 404
      expect(
        responseArticleGet.status(),
        `expected status code ${expectedDeletedArticleStatusCode}, and received ${responseArticleGet.status()}`,
      ).toBe(expectedDeletedArticleStatusCode)

      // Assert check article deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiLinks.articlesUrl}/${articleId}`, {
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
      const responseArticleDelete = await request.delete(`${apiLinks.articlesUrl}/${articleId}`, {})

      // Assert
      //poprawiona obsługa błędów
      const actualResponseStatus = responseArticleDelete.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted article
      const responseArticleGet = await request.get(`${apiLinks.articlesUrl}/${articleId}`)
      const expectedNotDeletedArticleStatusCode = 200
      expect(
        responseArticleGet.status(),
        `expected status code ${expectedNotDeletedArticleStatusCode}, and received ${responseArticleGet.status()}`,
      ).toBe(expectedNotDeletedArticleStatusCode)
    })
  })
})
