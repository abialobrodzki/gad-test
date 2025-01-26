import { AddCommentModel } from '@_src/models/comment.model'
import { ArticlePage } from '@_src/pages/article.page'
import { Locator, Page } from '@playwright/test'

export class AddCommentView {
  addNewHeader: Locator
  bodyInput: Locator
  saveButton: Locator

  constructor(private page: Page) {
    this.addNewHeader = this.page.getByRole('heading', { name: 'Add New Comment' })
    this.bodyInput = this.page.locator('#body')
    this.saveButton = this.page.getByRole('button', { name: 'Save' })
  }

  async createComment(commentData: AddCommentModel): Promise<ArticlePage> {
    await this.bodyInput.fill(commentData.body)
    await this.saveButton.click()

    return new ArticlePage(this.page)
  }
}
