import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api'
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { APIResponse } from '@playwright/test'

test.describe('Verify comments DELETE operations @crud @delete @comment @api', () => {
  let articleId: number
  let headers: Headers
  let responseComment: APIResponse

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)
    const responseArticle = await createArticleWithApi(request, headers)

    const article = await responseArticle.json()
    articleId = article.id
  })

  //testy zależne z usuwaniem komentarza
  test.describe.configure({ mode: 'serial' })
  test.describe('DELETE operations - serial', () => {
    let commentId: number

    test.beforeAll('should login and create comment', async ({ request }) => {
      headers = await getAuthorizationHeader(request)

      responseComment = await createCommentWithApi(request, headers, articleId)
      const comment = await responseComment.json()

      commentId = comment.id
    })

    test('should not delete a comment with non logged-in user @GAD-R08-06', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401

      // Act
      const responseCommentNotDeleted = await request.delete(`${apiUrls.commentsUrl}/${commentId}`, {})

      // Assert
      const actualResponseStatus = responseCommentNotDeleted.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted comment response
      const expectedNotDeletedCommentStatusCode = 200
      await expectGetResponseStatus(request, `${apiUrls.commentsUrl}/${commentId}`, expectedNotDeletedCommentStatusCode)
    })

    test('should delete a comment with logged-in user @GAD-R08-06', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200

      // Act
      const responseCommentDeleted = await request.delete(`${apiUrls.commentsUrl}/${commentId}`, {
        headers,
      })

      // Assert
      const actualResponseStatus = responseCommentDeleted.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check deleted comment response
      const expectedDeletedCommentStatusCode = 404
      await expectGetResponseStatus(
        request,
        `${apiUrls.commentsUrl}/${commentId}`,
        expectedDeletedCommentStatusCode,
        headers,
      )

      // Assert check comment deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiUrls.commentsUrl}/${commentId}`, {
        headers,
      })
      const actualStatusCode = retrieveResponse.status()
      const retrieveResponseJSON = await retrieveResponse.json()

      expect(
        actualStatusCode,
        `Expected status code ${expectedDeletedCommentStatusCode}, and received ${actualStatusCode} !`,
      ).toBe(expectedDeletedCommentStatusCode)
      expect(retrieveResponseJSON).toEqual(expectedReturnObject)
    })
  })

  //testy niezależne z usuwaniem komentarza
  test.describe('DELETE operations', () => {
    test.beforeEach('should login and create comment', async ({ request }) => {
      responseComment = await createCommentWithApi(request, headers, articleId)
    })

    test('should delete a comment with logged-in user @GAD-R08-06', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200
      const comment = await responseComment.json()

      // Act
      const responseCommentDeleted = await request.delete(`${apiUrls.commentsUrl}/${comment.id}`, {
        headers,
      })

      // Assert
      const actualResponseStatus = responseCommentDeleted.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check deleted comment response
      const expectedDeletedCommentStatusCode = 404
      await expectGetResponseStatus(
        request,
        `${apiUrls.commentsUrl}/${comment.id}`,
        expectedDeletedCommentStatusCode,
        headers,
      )

      // Assert check comment deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiUrls.commentsUrl}/${comment.id}`, {
        headers,
      })
      const actualStatusCode = retrieveResponse.status()
      const retrieveResponseJSON = await retrieveResponse.json()

      expect(
        actualStatusCode,
        `Expected status code ${expectedDeletedCommentStatusCode}, and received ${actualStatusCode} !`,
      ).toBe(expectedDeletedCommentStatusCode)
      expect(retrieveResponseJSON).toEqual(expectedReturnObject)
    })

    test('should not delete a comment with non logged-in user @GAD-R08-06', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401
      const comment = await responseComment.json()

      // Act
      const responseCommentNotDeleted = await request.delete(`${apiUrls.commentsUrl}/${comment.id}`, {})

      // Assert
      const actualResponseStatus = responseCommentNotDeleted.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted comment response
      const expectedNotDeletedCommentStatusCode = 200
      await expectGetResponseStatus(
        request,
        `${apiUrls.commentsUrl}/${comment.id}`,
        expectedNotDeletedCommentStatusCode,
      )
    })
  })
})
