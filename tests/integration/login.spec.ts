import { expect, test } from '@_src/fixtures/merge.fixture'
import { LoginUserModel } from '@_src/models/user.model'
import { testUser1 } from '@_src/test-data/user.data'

test.describe('Verify login', () => {
  test('login with correct credentials @GAD-R02-01', async ({ loginPage }) => {
    // Arrange
    const expectedWelcomeTitle = 'Welcome'
    // const loginPage = new LoginPage(page)

    // Act
    // await loginPage.goto()
    const welcomePage = await loginPage.login(testUser1)

    const title = await welcomePage.getTitle()

    // Assert
    expect(title).toContain(expectedWelcomeTitle)
  })

  test('reject login with incorrect password @GAD-R02-01', async ({ loginPage }) => {
    // Arrange
    const expectedLoginTitle = 'Login'
    const expectedErrorMessage = 'Invalid username or password'

    // const loginPage = new LoginPage(page)
    const loginUserData: LoginUserModel = {
      userEmail: testUser1.userEmail,
      userPassword: 'incorrectPassword',
    }

    // Act
    // await loginPage.goto()
    await loginPage.login(loginUserData)

    // Assert
    await expect.soft(loginPage.loginError).toHaveText(expectedErrorMessage)
    const title = await loginPage.getTitle()
    expect.soft(title).toContain(expectedLoginTitle)
  })
})
