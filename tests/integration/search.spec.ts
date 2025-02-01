import { expect, test } from '@_src/fixtures/merge.fixture'

test.describe('Verify search component for articles', () => {})

test('Go button should fetch articles @GAD-R07-01', async ({ articlesPage, page }) => {
  // Arrange
  const expectDefaultArticleNumber = 6
  await expect(articlesPage.goSearchButton).toBeInViewport({ ratio: 1 }) //sprawdzenie widoczności przycisku (całego elementu) w widocznej części strony
  const responsePromise = page.waitForResponse('/api/articles*') //oczekiwanie na odpowiedź API z wyrażeniem regularnym

  // Act
  await articlesPage.goSearchButton.click()
  const response = await responsePromise
  const body = await response.json() //odpowiedź w formacie .json

  // Assert
  expect(response.ok()).toBeTruthy() //sprawdzenie czy odpowiedź pozytywna
  expect(body).toHaveLength(expectDefaultArticleNumber)
})
