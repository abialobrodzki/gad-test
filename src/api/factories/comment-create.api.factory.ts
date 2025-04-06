import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory'
import { CommentPayload } from '@_src/api/models/comment.api.model'
import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { expect } from '@_src/ui/fixtures/merge.fixture'
import { APIRequestContext, APIResponse } from '@playwright/test'

export async function createCommentWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleId: number,
  commentData?: CommentPayload,
): Promise<APIResponse> {
  //tworzenie komentarza
  const commentDataFinal = commentData || prepareCommentPayload(articleId)

  //przekazywanie tokena
  const responseComment = await request.post(apiUrls.commentsUrl, {
    headers,
    data: commentDataFinal,
  })

  //sprawdzenie czy komentarz został utworzony
  const commentJson = await responseComment.json()

  const expectedStatusCode = 200
  await expect(async () => {
    const responseCommentCreated = await request.get(`${apiUrls.commentsUrl}/${commentJson.id}`)
    expect(
      responseCommentCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
    ).toBe(expectedStatusCode)
  }).toPass({ timeout: 2_000 })

  return responseComment
}
