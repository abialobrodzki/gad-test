import { prepareRandomArticle } from '@_src/factories/article.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'
import { testUser1 } from '@_src/test-data/user.data'

test.describe('Verify articles CRUD operations @api @GAD-R08-03', () => {
  test('should not create an article without a logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const articlesUrl = '/api/articles'

    const randomArticleData = prepareRandomArticle()
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2025-02-04T23:17:34.716Z',
      image: '',
    }

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

    //login
    const loginUrl = '/api/login'
    const userData = {
      email: testUser1.userEmail,
      password: testUser1.userPassword,
    }
    const responseLogin = await request.post(loginUrl, {
      data: userData,
    })
    const responseLoginJson = await responseLogin.json()

    // Act
    const articlesUrl = '/api/articles'

    const randomArticleData = prepareRandomArticle(undefined, undefined, true)
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: new Date().toISOString(),
      image: randomArticleData.image,
    }

    //przekazywanie tokena
    const headers = { Authorization: `Bearer ${responseLoginJson.access_token}` }
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    })

    //Assert
    //poprawiona obsługa błędów
    const actualResponseStatus = responseArticle.status()
    expect(
      actualResponseStatus,
      `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    //sprawdzenie utworzonego artykułu
    const article = await responseArticle.json()
    expect.soft(article.title).toEqual(articleData.title)
    expect.soft(article.body).toEqual(articleData.body)
  })
})
