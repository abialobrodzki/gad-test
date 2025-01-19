import { Locator, Page } from '@playwright/test'

export class MainMenuComponent {
  commentsButton: Locator
  articlesButton: Locator
  flashpostsButton: Locator
  gamesButton: Locator
  usersButton: Locator
  statisticsButton: Locator
  addArticleButton: Locator
  uploadButton: Locator
  addCommentButton: Locator
  homePage: Locator

  constructor(private page: Page) {
    this.commentsButton = this.page.getByTestId('open-comments')
    this.articlesButton = this.page.getByTestId('open-articles')
    this.flashpostsButton = this.page.getByTestId('open-flashposts')
    this.gamesButton = this.page.getByTestId('open-games')
    this.usersButton = this.page.getByTestId('open-users')
    this.statisticsButton = this.page.getByTestId('open-stats')
    this.addArticleButton = this.page.getByRole('button', { name: 'Add Article' })
    this.uploadButton = this.page.getByRole('button', { name: 'Upload' })
    this.addCommentButton = this.page.locator('#add-new-comment')
    this.homePage = this.page.getByRole('link', { name: '🦎 GAD' })
  }
}
