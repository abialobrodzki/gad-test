import { Page } from '@playwright/test'

export class ArticlesPage {
  url = '/articles.html'
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.url)
  }

  async title(): Promise<string> {
    await this.page.waitForLoadState()
    return this.page.title()
  }
}
