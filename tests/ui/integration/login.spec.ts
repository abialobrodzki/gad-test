import { expect, test } from '@_src/ui/fixtures/merge.fixture'
import { LoginUserModel } from '@_src/ui/models/user.model'
import { testUser1 } from '@_src/ui/test-data/user.data'

test.describe('Verify login', () => {
  test('login with correct credentials @GAD-R02-01', async ({ loginPage }) => {
    // Arrange
    const expectedWelcomeTitle = 'Welcome'

    // Act
    const welcomePage = await loginPage.login(testUser1)

    const title = await welcomePage.getTitle()

    // Assert
    expect(title).toContain(expectedWelcomeTitle)
  })

  test('reject login with incorrect password @GAD-R02-01', async ({ loginPage }) => {
    // Arrange
    const expectedLoginTitle = 'Login'
    const expectedErrorMessage = 'Invalid username or password'
    const loginUserData: LoginUserModel = {
      userEmail: testUser1.userEmail,
      userPassword: 'incorrectPassword',
    }

    // Act
    await loginPage.login(loginUserData)

    // Assert
    await expect.soft(loginPage.loginError).toHaveText(expectedErrorMessage)
    const title = await loginPage.getTitle()
    expect.soft(title).toContain(expectedLoginTitle)
  })
})
