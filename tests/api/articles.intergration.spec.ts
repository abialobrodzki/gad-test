import { prepareRandomArticle } from '@_src/factories/article.factory'
import { expect, test } from '@_src/fixtures/merge.fixture'

test.describe('Verify articles CRUD operations @api', () => {
  test('should not create an article without a logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401
    const articlesUrl = '/api/articles'

    const randomArticleData = prepareRandomArticle()
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2025-02-04T23:17:34.716Z',
      image: '',
    }

    // Act
    //request POST z opcjonalnymi parametrami
    const response = await request.post(articlesUrl, {
      data: articleData,
    })

    //Assert
    expect(response.status(), `Expected status code: "${expectedStatusCode}"`).toBe(expectedStatusCode)
  })
})
