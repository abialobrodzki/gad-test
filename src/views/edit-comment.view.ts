import { AddCommentModel } from '@_src/models/comment.model'
import { Locator, Page } from '@playwright/test'

export class EditCommentView {
  bodyInput: Locator
  updateButton: Locator

  constructor(private page: Page) {
    this.bodyInput = this.page.locator('#body')
    this.updateButton = this.page.getByTestId('update-button')
  }

  async updateComment(commentData: AddCommentModel): Promise<void> {
    await this.bodyInput.fill(commentData.body)
    await this.updateButton.click()
  }
}
