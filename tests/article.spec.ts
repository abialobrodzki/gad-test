import { ArticlePage } from '../src/pages/article.page'
import { ArticlesPage } from '../src/pages/articles.page'
import { LoginPage } from '../src/pages/login.page'
import { testUser1 } from '../src/test-data/user.data'
import { AddArticleView } from '../src/views/add-articles.view'
import { expect, test } from '@playwright/test'

test.describe('Verify article', () => {
  test('create new article @GAD-R04-01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(testUser1)

    const articlesPage = new ArticlesPage(page)
    await articlesPage.goto()

    // Act
    await articlesPage.addArticleButtonLogged.click()

    const addArticleView = new AddArticleView(page)
    await expect.soft(addArticleView.header).toBeVisible()

    const newArticleTitle = 'test title'
    const newArticleBody = 'body test'

    await addArticleView.titleInput.fill(newArticleTitle)
    await addArticleView.bodyInput.fill(newArticleBody)
    await addArticleView.saveButton.click()

    // Assert
    const articlePage = new ArticlePage(page)
    await expect(articlePage.articleTitle).toHaveText(newArticleTitle)
    await expect(articlePage.articleBody).toHaveText(newArticleBody)
  })
})
