import { Locator, Page } from '@playwright/test'

export class AddArticleView {
  header: Locator
  titleInput: Locator
  bodyInput: Locator
  saveButton: Locator

  constructor(private page: Page) {
    this.header = this.page.getByRole('heading', { name: 'Add New Entry' })
    this.titleInput = this.page.getByTestId('title-input')
    this.bodyInput = this.page.getByTestId('body-text')
    this.saveButton = this.page.getByTestId('save')
  }
}
