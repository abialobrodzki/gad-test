import { expect, test } from '@_src/fixtures/merge.fixture'
import { getAuthorizationHeader, prepareArticlePayload } from '@_src/utils/api.util'

test.describe('Verify articles CRUD operations @crud @GAD-R08-03', () => {
  test('should not create an article without a logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const articlesUrl = '/api/articles'
    const articleData = prepareArticlePayload()

    // Act
    //request POST z opcjonalnymi parametrami
    const response = await request.post(articlesUrl, {
      data: articleData,
    })

    //Assert
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })

  test('should create an article with logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 201
    const headers = await getAuthorizationHeader(request)

    // Act
    const articlesUrl = '/api/articles'
    const articleData = prepareArticlePayload()

    //przekazywanie tokena
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    })

    //Assert
    //poprawiona obsługa błędów
    const actualResponseStatus = responseArticle.status()
    expect(
      actualResponseStatus,
      `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    //sprawdzenie utworzonego artykułu
    const article = await responseArticle.json()
    expect.soft(article.title).toEqual(articleData.title)
    expect.soft(article.body).toEqual(articleData.body)
  })
})
