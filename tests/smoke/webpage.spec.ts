import { expect, test } from '@_src/fixtures/merge.fixture'

test.describe('Verify service main pages', () => {
  test('home page title @GAD-R01-01', async ({ homePage }) => {
    // Arrange
    const expectedHomePageTitle = 'GAD'
    // const homePage = new HomePage(page)

    // Act
    // await homePage.goto()
    const title = await homePage.getTitle()

    // Assert
    expect(title).toContain(expectedHomePageTitle)
  })

  test('articles page title @GAD-R01-02', async ({ articlesPage }) => {
    // Arrange
    const expectedArticlesTitle = 'Articles'
    // const articlesPage = new ArticlesPage(page)

    // Act
    // await articlesPage.goto()
    const title = await articlesPage.getTitle()

    // Assert
    expect(title).toContain(expectedArticlesTitle)
  })

  test('comments page title @GAD-R01-02', async ({ commentsPage }) => {
    // Arrange
    const expectedCommentsTitle = 'Comments'
    // const commentsPage = new CommentsPage(page)

    // Act
    // await commentsPage.goto()
    const title = await commentsPage.getTitle()

    // Assert
    expect(title).toContain(expectedCommentsTitle)
  })

  test('home page title simple', async ({ page }) => {
    await page.goto('')
    await expect(page).toHaveTitle(/GAD/)
  })
})
