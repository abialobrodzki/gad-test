import { randomNewArticle } from '../src/factories/article.factory'
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

    const articleData = randomNewArticle()
    await addArticleView.createArticle(articleData)

    // Assert
    const articlePage = new ArticlePage(page)
    await expect(articlePage.articleTitle).toHaveText(articleData.title)
    await expect(articlePage.articleBody).toHaveText(articleData.body, { useInnerText: true })
  })

  test('reject creating article without title @GAD-R04-01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    const articlesPage = new ArticlesPage(page)
    const addArticleView = new AddArticleView(page)

    const articleData = randomNewArticle()
    articleData.title = ''

    const expectedErrorText = 'Article was not created'

    await loginPage.goto()
    await loginPage.login(testUser1)
    await articlesPage.goto()

    // Act
    await articlesPage.addArticleButtonLogged.click()
    await addArticleView.createArticle(articleData)

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText)
  })

  test('reject creating article without body @GAD-R04-01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    const articlesPage = new ArticlesPage(page)
    const addArticleView = new AddArticleView(page)

    const articleData = randomNewArticle()
    articleData.body = ''

    const expectedErrorText = 'Article was not created'

    await loginPage.goto()
    await loginPage.login(testUser1)
    await articlesPage.goto()

    // Act
    await articlesPage.addArticleButtonLogged.click()
    await addArticleView.createArticle(articleData)

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText)
  })
})
