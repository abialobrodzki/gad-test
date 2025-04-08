import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory'
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'

test.describe('Verify comments CREATE operations @crud @create @comment @api', () => {
  let articleId: number
  let headers: Headers

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)
    const responseArticle = await createArticleWithApi(request, headers)
    const article = await responseArticle.json()

    articleId = article.id
  })

  test('should not create a comment without a logged-in user @GAD-R08-04', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const commentData = prepareCommentPayload(articleId)

    // Act
    const response = await request.post(apiUrls.commentsUrl, {
      data: commentData,
    })

    //Assert
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })

  //testy zależne z tworzeniem komentarza
  test.describe.configure({ mode: 'serial' })
  test.describe('CREATE operations - serial', () => {
    test('should create an article with logged-in user @GAD-R08-04', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201
      headers = await getAuthorizationHeader(request)

      // Act
      const commentData = prepareCommentPayload(articleId)
      const responseComment = await createCommentWithApi(request, headers, articleId, commentData)

      // Assert
      const actualResponseStatus = responseComment.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)
      //sprawdzenie utworzonego komentarza
      const commentJson = await responseComment.json()
      expect.soft(commentJson.body).toEqual(commentData.body)
    })
  })

  //testy niezależne z tworzeniem komentarza
  test.describe('CREATE operations', () => {
    test('should create a comment with logged-in user @GAD-R08-04', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201

      // Act
      const commentData = prepareCommentPayload(articleId)
      const responseComment = await createCommentWithApi(request, headers, articleId, commentData)

      // Assert
      const actualResponseStatus = responseComment.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)
      //sprawdzenie utworzonego komentarza
      const commentJson = await responseComment.json()
      expect.soft(commentJson.body).toEqual(commentData.body)
    })
  })
})
