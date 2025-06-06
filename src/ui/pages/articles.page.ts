import { MainMenuComponent } from '@_src/ui/components/main-menu.components'
import { ArticlePage } from '@_src/ui/pages/article.page'
import { BasePage } from '@_src/ui/pages/base.page'
import { AddArticleView } from '@_src/ui/views/add-article.view'
import { Page } from '@playwright/test'

export class ArticlesPage extends BasePage {
  url = '/articles.html'
  mainMenu = new MainMenuComponent(this.page)
  addArticleButtonLogged = this.page.locator('#add-new')
  searchInput = this.page.getByTestId('search-input')
  goSearchButton = this.page.getByTestId('search-button')
  noResultText = this.page.getByTestId('no-results')

  constructor(page: Page) {
    super(page)
  }

  async gotoArticle(title: string): Promise<ArticlePage> {
    await this.page.getByText(title).click()

    return new ArticlePage(this.page)
  }

  async clickAddArticleButtonLogged(): Promise<AddArticleView> {
    await this.addArticleButtonLogged.click()

    return new AddArticleView(this.page)
  }

  async searchArticle(phrase: string): Promise<ArticlesPage> {
    await this.searchInput.fill(phrase)
    await this.goSearchButton.click()

    return this
  }
}
