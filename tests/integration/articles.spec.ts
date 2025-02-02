import { RESPONSE_TIMEOUT } from '@_pw-config'
import { prepareRandomArticle } from '@_src/factories/article.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'
import { waitForResponse } from '@_src/utils/wait.util'

test.describe('Verify articles', () => {
  test.beforeEach(async ({ addArticleView }) => {
    await expect.soft(addArticleView.addNewHeader).toBeVisible()
  })

  test('reject creating article without title @GAD-R04-01 @GAD-R07-03 @logged', async ({ addArticleView, page }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created'
    const expectedResponseCode = 422
    const articleData = prepareRandomArticle()
    articleData.title = ''
    const responsePromise = waitForResponse(page, '/api/articles')

    // Act
    await addArticleView.createArticle(articleData)
    const response = await responsePromise
    const body = await response.json()
    const errorMessage = await body.error.message

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage)
    expect(response.status()).toBe(expectedResponseCode)
    expect(errorMessage).toContain('One of mandatory field is missing')
  })

  test('reject creating article without body @GAD-R04-01 @GAD-R07-03 @logged', async ({ addArticleView, page }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created'
    const expectedResponseCode = 422
    const articleData = prepareRandomArticle()
    articleData.body = ''
    const responsePromise = waitForResponse(page, '/api/articles')

    // Act
    await addArticleView.createArticle(articleData)
    const response = await responsePromise
    const body = await response.json()
    const errorMessage = await body.error.message

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage)
    expect(response.status()).toBe(expectedResponseCode)
    expect(errorMessage).toContain('One of mandatory field is missing')
  })

  test.describe('title length', () => {
    test('reject creating article with title exceeding 128 signs @GAD-R04-02 @GAD-R07-03 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created'
      const expectedResponseCode = 422
      const articleData = prepareRandomArticle(129)
      const responsePromise = waitForResponse(page, '/api/articles')

      // Act
      await addArticleView.createArticle(articleData)
      const response = await responsePromise
      const body = await response.json()
      const errorMessage = await body.error.message

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage)
      expect(response.status()).toBe(expectedResponseCode)
      expect(errorMessage).toContain('Field validation: "title" longer than "128"')
    })

    test('create article with title with 128 signs @GAD-R04-02 @GAD-R07-03 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const expectedResponseCode = 201
      const articleData = prepareRandomArticle(128)
      const responsePromise = waitForResponse(page, '/api/articles')

      // Act
      const articlePage = await addArticleView.createArticle(articleData)
      const response = await responsePromise

      // Assert
      await expect(articlePage.articleTitle).toHaveText(articleData.title)
      expect(response.status()).toBe(expectedResponseCode)
    })
  })

  test('should return created article from API @GAD-R07-04 @logged', async ({ addArticleView, page }) => {
    // Arrange
    const articleData = prepareRandomArticle()
    const responsePromise = page.waitForResponse(
      (response) => {
        //wypisanie typu żądania, url i kodu statusu
        // console.log(response.request().method(), response.url(), response.status())
        return (
          //zwracanie odpowiedzi o zadanych parametrach
          response.url().includes('/api/articles') && response.request().method() == 'GET' && response.status() == 200
        )
      },
      { timeout: RESPONSE_TIMEOUT },
    )
    // Act
    const articlePage = await addArticleView.createArticle(articleData)
    const response = await responsePromise

    // Assert
    await expect(articlePage.articleTitle).toHaveText(articleData.title)
    expect(response.ok()).toBeTruthy()
  })
})
