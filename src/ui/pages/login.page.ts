import { LoginUserModel } from '@_src/ui/models/user.model'
import { BasePage } from '@_src/ui/pages/base.page'
import { WelcomePage } from '@_src/ui/pages/welcome.page'
import { Page } from '@playwright/test'

export class LoginPage extends BasePage {
  url = '/login/'
  userEmailInput = this.page.getByPlaceholder('Enter User Email')
  userPasswordInput = this.page.getByPlaceholder('Enter Password')
  loginButton = this.page.getByRole('button', { name: 'LogIn' })

  loginError = this.page.getByTestId('login-error')

  constructor(page: Page) {
    super(page)
  }

  async login(loginUserData: LoginUserModel): Promise<WelcomePage> {
    await this.userEmailInput.fill(loginUserData.userEmail)
    await this.userPasswordInput.fill(loginUserData.userPassword)
    await this.loginButton.click()

    return new WelcomePage(this.page)
  }

  // //w tej chwili nie używana metoda
  // async clickLoginButton(): Promise<WelcomePage> {
  //   await this.loginButton.click()

  //   return new WelcomePage(this.page)
  // }

  // //przykłady pod testy pozytywne/negatywne
  // async loginValid(loginUserData: LoginUserModel): Promise<WelcomePage> {
  //   await this.login(loginUserData)
  //   return new WelcomePage(this.page)
  // }

  // async loginInvalid(loginUserData: LoginUserModel): Promise<LoginPage> {
  //   await this.login(loginUserData)
  //   return this
  // }
}
