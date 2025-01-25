import { ArticlesPage } from '@_src/pages/articles.page'
import { CommentsPage } from '@_src/pages/comments.page'
import { HomePage } from '@_src/pages/home.page'
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
  homePageLink: Locator

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
    this.homePageLink = this.page.getByRole('link', { name: '🦎 GAD' })
  }

  async clickCommentsButton(): Promise<CommentsPage> {
    await this.commentsButton.click()
    return new CommentsPage(this.page)
  }

  async clickArticlesButton(): Promise<ArticlesPage> {
    await this.articlesButton.click()
    return new ArticlesPage(this.page)
  }

  async clickHomePageLink(): Promise<HomePage> {
    await this.homePageLink.click()
    return new HomePage(this.page)
  }
}
