import { prepareRandomComment } from '@_src/ui/factories/comment.factory'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { waitForResponse } from '@_src/ui/utils/wait.util'

test.describe('Verify comment', () => {
  test('should return created comment @GAD-R07-06 @logged', async ({ createRandomArticle, page }) => {
    // Arrange
    const expectedCommentCreatedPopup = 'Comment was created'

    const newCommentData = prepareRandomComment()
    let articlePage = createRandomArticle.articlePage
    const addCommentView = await articlePage.clickAddCommentButton()
    const waitParams = {
      page,
      url: '/api/comments',
      method: 'GET' as const,
      status: 200,
      text: newCommentData.body,
    }
    const responsePromise = waitForResponse(waitParams)

    // Act
    articlePage = await addCommentView.createComment(newCommentData)
    const response = await responsePromise

    // Assert
    await expect.soft(articlePage.alertPopup).toHaveText(expectedCommentCreatedPopup)
    expect(response.ok()).toBeTruthy()
  })
})
