import { Locator, Page } from '@playwright/test'

export class MainMenuComponent {
  commentsButton: Locator
  articlesButton: Locator
  homePage: Locator

  constructor(private page: Page) {
    this.commentsButton = this.page.getByTestId('open-comments')
    this.articlesButton = this.page.getByTestId('open-articles')
    this.homePage = this.page.getByRole('link', { name: '🦎 GAD' })
  }
}
