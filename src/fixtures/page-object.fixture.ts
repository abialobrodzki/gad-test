import { ArticlesPage } from '@_src/pages/articles.page'
import { CommentsPage } from '@_src/pages/comments.page'
import { HomePage } from '@_src/pages/home.page'
import { LoginPage } from '@_src/pages/login.page'
import { RegisterPage } from '@_src/pages/register.page'
import { test as baseTest } from '@playwright/test'

//dodatkowy interfejs 'Pages'
interface Pages {
  articlesPage: ArticlesPage
  commentsPage: CommentsPage
  homePage: HomePage
  loginPage: LoginPage
  registerPage: RegisterPage
}

//obiekt testowy zawierający fixtures
export const pageObjectTest = baseTest.extend<Pages>({
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
