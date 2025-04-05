import { expect, test } from '@_src/ui/fixtures/merge.fixture'

test.describe('Verify article', () => {})

test('Non logged user can access created article @GAD-R06-01 @predefined_data', async ({ articlePage }) => {
  // Arrange
  const expectedArticleTitle = 'How to write effective test cases'

  // Act
  await articlePage.goto('?id=1')

  // Assert
  await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle)
})
