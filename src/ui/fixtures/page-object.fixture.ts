import { ArticlePage } from '@_src/ui/pages/article.page'
import { ArticlesPage } from '@_src/ui/pages/articles.page'
import { CommentsPage } from '@_src/ui/pages/comments.page'
import { HomePage } from '@_src/ui/pages/home.page'
import { LoginPage } from '@_src/ui/pages/login.page'
import { RegisterPage } from '@_src/ui/pages/register.page'
import { AddArticleView } from '@_src/ui/views/add-article.view'
import { test } from '@playwright/test'

//dodatkowy interfejs 'Pages'
interface Pages {
  addArticleView: AddArticleView
  articlePage: ArticlePage
  articlesPage: ArticlesPage
  commentsPage: CommentsPage
  homePage: HomePage
  loginPage: LoginPage
  registerPage: RegisterPage
}

//obiekt testowy zawierający fixtures
export const pageObjectTest = test.extend<Pages>({
  addArticleView: async ({ articlesPage }, use) => {
    const addArticleView = await articlesPage.clickAddArticleButtonLogged()
    await use(addArticleView)
  },
  articlePage: async ({ page }, use) => {
    const articlePage = new ArticlePage(page)
    await use(articlePage)
  },
  articlesPage: async ({ page }, use) => {
    const articlesPage = new ArticlesPage(page)
    await articlesPage.goto()
    await use(articlesPage)
  },
  commentsPage: async ({ page }, use) => {
    const commentsPage = new CommentsPage(page)
    await commentsPage.goto()
    await use(commentsPage)
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await use(homePage)
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await use(loginPage)
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await use(registerPage)
  },
})
