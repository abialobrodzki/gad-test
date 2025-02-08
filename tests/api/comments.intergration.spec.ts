import { expect, test } from '@_src/fixtures/merge.fixture'
import { getAuthorizationHeader, prepareArticlePayload, prepareCommentPayload } from '@_src/utils/api.util'

test.describe('Verify comments CRUD operations @crud @GAD-R08-04', () => {
  let articleId: number
  let headers: { [key: string]: string }

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)

    //create article
    const articlesUrl = '/api/articles'
    const articleData = prepareArticlePayload()

    //przekazywanie tokena
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
    const commentData = prepareCommentPayload(articleId)

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
    const commentData = prepareCommentPayload(articleId)

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
