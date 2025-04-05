import { prepareRandomArticle } from '@_src/ui/factories/article.factory'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { waitForResponse } from '@_src/ui/utils/wait.util'

test.describe('Verify articles', () => {
  test.beforeEach(async ({ addArticleView }) => {
    await expect.soft(addArticleView.addNewHeader).toBeVisible()
  })

  test('reject creating article without title @GAD-R04-01 @GAD-R07-03 @logged', async ({ addArticleView, page }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created'
    const expectedErrorMessageApi = 'One of mandatory field is missing'
    const articleData = prepareRandomArticle()
    articleData.title = ''
    const waitParams = {
      page,
      url: '/api/articles',
      method: 'POST' as const,
      status: 422,
    }
    const responsePromise = waitForResponse(waitParams)

    // Act
    await addArticleView.createArticle(articleData)
    const response = await responsePromise
    const body = await response.json()
    const errorMessage = await body.error.message

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage)
    expect(errorMessage).toContain(expectedErrorMessageApi)
  })

  test('reject creating article without body @GAD-R04-01 @GAD-R07-03 @logged', async ({ addArticleView, page }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created'
    const expectedErrorMessageApi = 'One of mandatory field is missing'
    const articleData = prepareRandomArticle()
    articleData.body = ''
    const waitParams = {
      page,
      url: '/api/articles',
      method: 'POST' as const,
      status: 422,
    }
    const responsePromise = waitForResponse(waitParams)

    // Act
    await addArticleView.createArticle(articleData)
    const response = await responsePromise
    const body = await response.json()
    const errorMessage = await body.error.message

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage)
    expect(errorMessage).toContain(expectedErrorMessageApi)
  })

  test.describe('title length', () => {
    test('reject creating article with title exceeding 128 signs @GAD-R04-02 @GAD-R07-03 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created'
      const expectedErrorMessageApi = 'Field validation: "title" longer than "128"'
      const articleData = prepareRandomArticle(129)
      const waitParams = {
        page,
        url: '/api/articles',
        method: 'POST' as const,
        status: 422,
      }
      const responsePromise = waitForResponse(waitParams)

      // Act
      await addArticleView.createArticle(articleData)
      const response = await responsePromise
      const body = await response.json()
      const errorMessage = await body.error.message

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage)
      expect(errorMessage).toContain(expectedErrorMessageApi)
    })

    test('create article with title with 128 signs @GAD-R04-02 @GAD-R07-03 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const articleData = prepareRandomArticle(128)
      const waitParams = {
        page,
        url: '/api/articles',
        method: 'GET' as const,
        status: 200,
        text: articleData.title,
      }
      const responsePromise = waitForResponse(waitParams)

      // Act
      const articlePage = await addArticleView.createArticle(articleData)
      const response = await responsePromise

      // Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title)
      expect(response.ok()).toBeTruthy()
    })
  })

  test('should return created article from API @GAD-R07-04 @logged', async ({ addArticleView, page }) => {
    // Arrange
    const articleData = prepareRandomArticle()
    const waitParams = {
      page,
      url: '/api/articles',
      method: 'GET' as const,
      status: 200,
      text: articleData.title,
    }
    const responsePromise = waitForResponse(waitParams)

    // Act
    const articlePage = await addArticleView.createArticle(articleData)
    const response = await responsePromise

    // Assert
    await expect(articlePage.articleTitle).toHaveText(articleData.title)
    expect(response.ok()).toBeTruthy()
  })
})
