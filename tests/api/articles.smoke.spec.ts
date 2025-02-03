import { expect, test } from '@_src/fixtures/merge.fixture'

test.describe('Verify articles API endpoint @GAD-R08-01 @api', () => {
  test('GET articles return status code 200', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 200
    const articlesUrl = '/api/articles'

    // Act
    const response = await request.get(articlesUrl)

    // Assert
    //sprawdzenie statusu response
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })

  test('GET articles should return at least one article @predefined_data', async ({ request }) => {
    // Arrange
    const expectedMinArticleCount = 1
    const articlesUrl = '/api/articles'

    // Act
    const response = await request.get(articlesUrl)
    const responseJson = await response.json()

    // Assert
    //sprawdzenie ilości zwracanych elementów
    expect(responseJson.length, `Expected article count: "${expectedMinArticleCount}"`).toBeGreaterThanOrEqual(
      expectedMinArticleCount,
    )
  })

  test('GET articles return article object @predefined_data', async ({ request }) => {
    // Arrange
    const expectedRequiredFields = ['id', 'user_id', 'title', 'body', 'date', 'image']
    const articlesUrl = '/api/articles'

    // Act
    const response = await request.get(articlesUrl)
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
