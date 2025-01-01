import { ArticlesPage } from '../../src/pages/articles.page'
import { CommentsPage } from '../../src/pages/comments.page'
import { HomePage } from '../../src/pages/home.page'
import { expect, test } from '@playwright/test'

test.describe('Verify menu main buttons', () => {
  test('comments button navigates to comments page @GAD-R01-03', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page)

    // Act
    await articlesPage.goto()
    await articlesPage.mainMenu.commentsButton.click()
    const commentsPage = new CommentsPage(page)
    const title = await commentsPage.title()

    // Assert
    expect(title).toContain('Comments')
  })

  test('articles button navigates to articles page @GAD-R01-03', async ({ page }) => {
    // Arrange
    const commentsPage = new CommentsPage(page)

    // Act
    await commentsPage.goto()
    await commentsPage.mainMenu.articlesButton.click()
    const articlesPage = new ArticlesPage(page)
    const title = await articlesPage.title()

    // Assert
    expect(title).toContain('Articles')
  })

  test('home page button navigates to main page @GAD-R01-03', async ({ page }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page)

    // Act
    await articlesPage.goto()
    await articlesPage.mainMenu.homePage.click()
    const homePage = new HomePage(page)
    const title = await homePage.title()

    // Assert
    expect(title).toContain('GAD')
  })
})
