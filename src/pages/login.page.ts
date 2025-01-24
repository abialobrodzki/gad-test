import { LoginUserModel } from '@_src/models/user.model'
import { BasePage } from '@_src/pages/base.page'
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

  async login(loginUserData: LoginUserModel): Promise<void> {
    await this.userEmailInput.fill(loginUserData.userEmail)
    await this.userPasswordInput.fill(loginUserData.userPassword)
    await this.loginButton.click()
  }
}
