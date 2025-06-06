import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'

test.describe('Verify articles CREATE operations @crud @create @article @api', () => {
  test('should not create an article without a logged-in user @GAD-R08-03', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const articleData = prepareArticlePayload()

    // Act
    //request POST z opcjonalnymi parametrami
    const response = await request.post(apiUrls.articlesUrl, {
      data: articleData,
    })

    // Assert
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })

  //testy zależne z tworzeniem artykułu
  test.describe.configure({ mode: 'serial' })
  test.describe('CREATE operations - serial', () => {
    test('should create an article with logged-in user @GAD-R08-03', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201
      const headers = await getAuthorizationHeader(request)

      // Act
      const articleData = prepareArticlePayload()
      const responseArticle = await createArticleWithApi(request, headers, articleData)

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
  })

  //testy niezależne z tworzeniem artykułu
  test.describe('CREATE operations', () => {
    test('should create an article with logged-in user @GAD-R08-03', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201
      const headers = await getAuthorizationHeader(request)

      // Act
      const articleData = prepareArticlePayload()
      const responseArticle = await createArticleWithApi(request, headers, articleData)

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
  })
})
