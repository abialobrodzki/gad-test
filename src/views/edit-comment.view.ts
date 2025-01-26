import { AddCommentModel } from '@_src/models/comment.model'
import { CommentPage } from '@_src/pages/comment.page'
import { Locator, Page } from '@playwright/test'

export class EditCommentView {
  bodyInput: Locator
  updateButton: Locator

  constructor(private page: Page) {
    this.bodyInput = this.page.locator('#body')
    this.updateButton = this.page.getByTestId('update-button')
  }

  async updateComment(commentData: AddCommentModel): Promise<CommentPage> {
    await this.bodyInput.fill(commentData.body)
    await this.updateButton.click()

    return new CommentPage(this.page)
  }
}
