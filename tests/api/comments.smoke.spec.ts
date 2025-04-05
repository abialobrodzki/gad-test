import { apiUrls } from '@_src/api/utils/api.util'
import { expect, test } from '@_src/ui/fixtures/merge.fixture'

test.describe('Verify comments API endpoint @GAD-R08-02 @smoke', () => {
  //testy atomowe - wariant podzielony
  test.describe('verify each condition in separate test', () => {
    test('GET comments returns status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200

      // Act
      const response = await request.get(apiUrls.commentsUrl)

      // Assert
      //sprawdzenie statusu response
      expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
    })

    test('GET comments should return at least one comment @predefined_data', async ({ request }) => {
      // Arrange
      const expectedMinCommentsCount = 1

      // Act
      const response = await request.get(apiUrls.commentsUrl)
      const responseJson = await response.json()

      // Assert
      //sprawdzenie ilości zwracanych elementów
      expect(responseJson.length, `Expected comment count: "${expectedMinCommentsCount}"`).toBeGreaterThanOrEqual(
        expectedMinCommentsCount,
      )
    })

    test('GET comments return comment object @predefined_data', async ({ request }) => {
      // Arrange
      const expectedRequiredFields = ['id', 'article_id', 'user_id', 'body', 'date']

      // Act
      const response = await request.get(apiUrls.commentsUrl)
      const responseJson = await response.json()
      const comment = responseJson[0]

      // Assert
      //sprawdzenie elementów obiektu w pętli
      expectedRequiredFields.forEach((key) => {
        expect.soft(comment, `Expected key "${key}" should be in object`).toHaveProperty(key)
      })
      //sprawdzenie elementów obiektu 'z palca'
      expect.soft(comment, `Expected key "article_id" should be in object`).toHaveProperty('article_id')
      expect.soft(comment, `Expected key "body" should be in object`).toHaveProperty('body')
      expect.soft(comment, `Expected key "date" should be in object`).toHaveProperty('date')
      expect.soft(comment, `Expected key "id" should be in object`).toHaveProperty('id')
      expect.soft(comment, `Expected key "user_id" should be in object`).toHaveProperty('user_id')
    })
  })

  //refaktoryzacja testów jako jeden duży test - wariant połączony
  test('GET comments should return an object with required fields @predefined_data', async ({ request }) => {
    // Arrange
    const response = await request.get(apiUrls.commentsUrl)

    await test.step('GET comments return status code 200', async () => {
      const expectedStatusCode = 200

      expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
    })

    const responseJson = await response.json()
    await test.step('GET comments should return at least one comment', async () => {
      const expectedMinCommentsCount = 1

      expect(responseJson.length, `Expected comment count: "${expectedMinCommentsCount}"`).toBeGreaterThanOrEqual(
        expectedMinCommentsCount,
      )
    })

    const expectedRequiredFields = ['id', 'article_id', 'user_id', 'body', 'date']
    const comment = responseJson[0]

    expectedRequiredFields.forEach(async (key) => {
      await test.step(`response object contains required field: "${key}"`, async () => {
        expect.soft(comment, `Expected key "${key}" should be in object`).toHaveProperty(key)
      })
    })
  })
})
