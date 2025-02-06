import { prepareRandomArticle } from '@_src/factories/article.factory'
import { prepareRandomComment } from '@_src/factories/comment.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'
import { testUser1 } from '@_src/test-data/user.data'

test.describe('Verify comments CRUD operations @crud @GAD-R08-04', () => {
  let articleId: number
  let headers: { [key: string]: string }

  test.beforeAll('create an article', async ({ request }) => {
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

    //create article
    const articlesUrl = '/api/articles'

    const randomArticleData = prepareRandomArticle(undefined, undefined, true)
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: new Date().toISOString(),
      image: randomArticleData.image,
    }

    //przekazywanie tokena
    headers = { Authorization: `Bearer ${responseLoginJson.access_token}` }
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    })

    const article = await responseArticle.json()
    articleId = article.id
  })

  test('should not create an comment without a logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const commentsUrl = '/api/comments'

    const randomCommentData = prepareRandomComment()
    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: '2025-02-04T23:17:34.716Z',
    }

    // Act
    const response = await request.post(commentsUrl, {
      data: commentData,
    })

    //Assert
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })
  test('should create an comment with logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 201

    // Act
    const commentsUrl = '/api/comments'

    const randomCommentData = prepareRandomComment()
    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: new Date().toISOString(),
    }

    // Arrange
    const response = await request.post(commentsUrl, {
      headers,
      data: commentData,
    })

    //Assert
    const actualResponseStatus = response.status()
    expect(
      actualResponseStatus,
      `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode)

    const comment = await response.json()
    expect.soft(comment.body).toEqual(commentData.body)
  })
})
