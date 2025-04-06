import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory'
import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory'
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory'
import { CommentPayload } from '@_src/api/models/comment.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { APIResponse } from '@playwright/test'

test.describe('Verify comments CRUD operations @crud', () => {
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

  //testy zależne z usuwaniem komentarza
  test.describe.configure({ mode: 'serial' })
  test.describe('CRUD operations - serial', () => {
    let commentId: number
    let responseComment: APIResponse
    let commentData: CommentPayload

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeader(request)
    })
    test('should create an article with logged-in user @GAD-R08-04', async ({ request }) => {
      // Arrange
      commentData = prepareCommentPayload(articleId)
      responseComment = await request.post(apiUrls.commentsUrl, {
        headers,
        data: commentData,
      })
      const expectedStatusCode = 201

      // Assert
      const actualResponseStatus = responseComment.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)
      //sprawdzenie utworzonego komentarza
      const commentJson = await responseComment.json()
      expect.soft(commentJson.body).toEqual(commentData.body)

      commentId = commentJson.id
    })

    test('should not delete an article with non logged-in user @GAD-R08-06', async ({ request }) => {
      // Assert comment exist
      let expectedStatusCode = 200
      await expect(async () => {
        const responseCommentCreated = await request.get(`${apiUrls.commentsUrl}/${commentId}`)
        expect(
          responseCommentCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })

      // Arrange
      expectedStatusCode = 401

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
      const responseCommentNotDeletedGet = await request.get(`${apiUrls.commentsUrl}/${commentId}`)

      expect(
        responseCommentNotDeletedGet.status(),
        `expected status code ${expectedNotDeletedCommentStatusCode}, and received ${responseCommentNotDeletedGet.status()}`,
      ).toBe(expectedNotDeletedCommentStatusCode)
    })

    test('should delete an article with logged-in user @GAD-R08-06', async ({ request }) => {
      // Assert comment exist
      let expectedStatusCode = 200
      await expect(async () => {
        const responseCommentCreated = await request.get(`${apiUrls.commentsUrl}/${commentId}`)
        expect(
          responseCommentCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })

      // Arrange
      expectedStatusCode = 200

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
      const responseCommentDeletedGet = await request.get(`${apiUrls.commentsUrl}/${commentId}`, { headers })

      expect(
        responseCommentDeletedGet.status(),
        `expected status code ${expectedDeletedCommentStatusCode}, and received ${responseCommentDeletedGet.status()}`,
      ).toBe(expectedDeletedCommentStatusCode)

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
  test.describe('CRUD operations', () => {
    let responseComment: APIResponse
    let commentData: CommentPayload

    test.beforeEach('create comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId)
      responseComment = await request.post(apiUrls.commentsUrl, {
        headers,
        data: commentData,
      })

      // Assert comment exist
      const commentJson = await responseComment.json()

      const expectedStatusCode = 200
      await expect(async () => {
        const responseCommentCreated = await request.get(`${apiUrls.commentsUrl}/${commentJson.id}`)
        expect(
          responseCommentCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
        ).toBe(expectedStatusCode)
      }).toPass({ timeout: 2_000 })
    })

    test('should create a comment with logged-in user @GAD-R08-04', async () => {
      // Arrange
      const expectedStatusCode = 201

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
      const responseCommentDeletedGet = await request.get(`${apiUrls.commentsUrl}/${comment.id}`, { headers })

      expect(
        responseCommentDeletedGet.status(),
        `expected status code ${expectedDeletedCommentStatusCode}, and received ${responseCommentDeletedGet.status()}`,
      ).toBe(expectedDeletedCommentStatusCode)

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
      const responseCommentNotDeletedGet = await request.get(`${apiUrls.commentsUrl}/${comment.id}`)

      expect(
        responseCommentNotDeletedGet.status(),
        `expected status code ${expectedNotDeletedCommentStatusCode}, and received ${responseCommentNotDeletedGet.status()}`,
      ).toBe(expectedNotDeletedCommentStatusCode)
    })
  })
})
