import { expect, test } from '@_src/fixtures/merge.fixture'
import {
  CommentPayload,
  Headers,
  apiLinks,
  getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util'
import { APIResponse } from '@playwright/test'

test.describe('Verify comments CRUD operations @crud', () => {
  let articleId: number
  let headers: Headers

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request)
    //create article
    const articleData = prepareArticlePayload()

    //przekazywanie tokena
    const responseArticle = await request.post(apiLinks.articlesUrl, {
      headers,
      data: articleData,
    })

    const article = await responseArticle.json()
    articleId = article.id
  })

  test('should not create a comment without a logged-in user @GAD-R08-04', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const commentData = prepareCommentPayload(articleId)

    // Act
    const response = await request.post(apiLinks.commentsUrl, {
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
      responseComment = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentData,
      })
      //dodanie oczekiwania na 5 sek - 'ulep' xD
      await new Promise((resolve) => setTimeout(resolve, 5000))
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
      // Arrange
      const expectedStatusCode = 401

      // Act
      const responseCommentNotDeleted = await request.delete(`${apiLinks.commentsUrl}/${commentId}`, {})

      // Assert
      const actualResponseStatus = responseCommentNotDeleted.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted comment response
      const expectedNotDeletedCommentStatusCode = 200
      const responseCommentNotDeletedGet = await request.get(`${apiLinks.commentsUrl}/${commentId}`)

      expect(
        responseCommentNotDeletedGet.status(),
        `expected status code ${expectedNotDeletedCommentStatusCode}, and received ${responseCommentNotDeletedGet.status()}`,
      ).toBe(expectedNotDeletedCommentStatusCode)
    })

    test('should delete an article with logged-in user @GAD-R08-06', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200

      // Act
      const responseCommentDeleted = await request.delete(`${apiLinks.commentsUrl}/${commentId}`, {
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
      const responseCommentDeletedGet = await request.get(`${apiLinks.commentsUrl}/${commentId}`, { headers })

      expect(
        responseCommentDeletedGet.status(),
        `expected status code ${expectedDeletedCommentStatusCode}, and received ${responseCommentDeletedGet.status()}`,
      ).toBe(expectedDeletedCommentStatusCode)

      // Assert check comment deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiLinks.commentsUrl}/${commentId}`, {
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
      responseComment = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentData,
      })
      //dodanie oczekiwania na 5 sek - 'ulep' xD
      await new Promise((resolve) => setTimeout(resolve, 5000))
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
      const responseCommentDeleted = await request.delete(`${apiLinks.commentsUrl}/${comment.id}`, {
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
      const responseCommentDeletedGet = await request.get(`${apiLinks.commentsUrl}/${comment.id}`, { headers })

      expect(
        responseCommentDeletedGet.status(),
        `expected status code ${expectedDeletedCommentStatusCode}, and received ${responseCommentDeletedGet.status()}`,
      ).toBe(expectedDeletedCommentStatusCode)

      // Assert check comment deleted
      const expectedReturnObject = {}
      const retrieveResponse = await request.get(`${apiLinks.commentsUrl}/${comment.id}`, {
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
      const responseCommentNotDeleted = await request.delete(`${apiLinks.commentsUrl}/${comment.id}`, {})

      // Assert
      const actualResponseStatus = responseCommentNotDeleted.status()
      expect(
        actualResponseStatus,
        `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode)

      // Assert check not deleted comment response
      const expectedNotDeletedCommentStatusCode = 200
      const responseCommentNotDeletedGet = await request.get(`${apiLinks.commentsUrl}/${comment.id}`)

      expect(
        responseCommentNotDeletedGet.status(),
        `expected status code ${expectedNotDeletedCommentStatusCode}, and received ${responseCommentNotDeletedGet.status()}`,
      ).toBe(expectedNotDeletedCommentStatusCode)
    })
  })
})
