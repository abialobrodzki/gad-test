import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { apiLinks } from '@_src/ui/utils/api.util'

test.describe('Verify articles API endpoint @GAD-R08-01 @smoke', () => {
  //testy atomowe - wariant podzielony
  test.describe('verify each condition in separate test', () => {
    test('GET articles return status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200

      // Act
      const response = await request.get(apiLinks.articlesUrl)

      // Assert
      //sprawdzenie statusu response
      expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
    })

    test('GET articles should return at least one article @predefined_data', async ({ request }) => {
      // Arrange
      const expectedMinArticlesCount = 1

      // Act
      const response = await request.get(apiLinks.articlesUrl)
      const responseJson = await response.json()

      // Assert
      //sprawdzenie ilości zwracanych elementów
      expect(responseJson.length, `Expected article count: "${expectedMinArticlesCount}"`).toBeGreaterThanOrEqual(
        expectedMinArticlesCount,
      )
    })

    test('GET articles return article object @predefined_data', async ({ request }) => {
      // Arrange
      const expectedRequiredFields = ['id', 'user_id', 'title', 'body', 'date', 'image']

      // Act
      const response = await request.get(apiLinks.articlesUrl)
      const responseJson = await response.json()
      const article = responseJson[0]

      // Assert
      //sprawdzenie elementów obiektu w pętli
      expectedRequiredFields.forEach((key) => {
        expect.soft(article, `Expected key "${key}" should be in object`).toHaveProperty(key)
      })
      //sprawdzenie elementów obiektu 'z palca'
      expect.soft(article, `Expected key "id" should be in object`).toHaveProperty('id')
      expect.soft(article, `Expected key "user_id" should be in object`).toHaveProperty('user_id')
      expect.soft(article, `Expected key "title" should be in object`).toHaveProperty('title')
      expect.soft(article, `Expected key "body" should be in object`).toHaveProperty('body')
      expect.soft(article, `Expected key "date" should be in object`).toHaveProperty('date')
      expect.soft(article, `Expected key "image" should be in object`).toHaveProperty('image')
    })
  })

  //refaktoryzacja testów jako jeden duży test - wariant połączony
  test('GET articles should return an object with required fields @predefined_data', async ({ request }) => {
    // Arrange
    const response = await request.get(apiLinks.articlesUrl)

    await test.step('GET articles return status code 200', async () => {
      const expectedStatusCode = 200

      expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
    })

    const responseJson = await response.json()
    await test.step('GET articles should return at least one article', async () => {
      const expectedMinArticleCount = 1

      expect(responseJson.length, `Expected article count: "${expectedMinArticleCount}"`).toBeGreaterThanOrEqual(
        expectedMinArticleCount,
      )
    })

    const expectedRequiredFields = ['id', 'user_id', 'title', 'body', 'date', 'image']
    const article = responseJson[0]

    expectedRequiredFields.forEach(async (key) => {
      await test.step(`response object contains required field: "${key}"`, async () => {
        expect.soft(article, `Expected key "${key}" should be in object`).toHaveProperty(key)
      })
    })
  })
})
