import { MainMenuComponent } from '@_src/ui/components/main-menu.components'
import { ArticlesPage } from '@_src/ui/pages/articles.page'
import { BasePage } from '@_src/ui/pages/base.page'
import { CommentPage } from '@_src/ui/pages/comment.page'
import { AddCommentView } from '@_src/ui/views/add-comment.view'
import { Locator, Page } from '@playwright/test'

interface ArticleComment {
  body: Locator
  link: Locator
}

export class ArticlePage extends BasePage {
  url = '/article.html'
  mainMenu = new MainMenuComponent(this.page)
  articleTitle = this.page.getByTestId('article-title')
  articleBody = this.page.getByTestId('article-body')
  deleteIcon = this.page.getByTestId('delete')
  addCommentButton = this.page.locator('#add-new')

  alertPopup = this.page.getByTestId('alert-popup')

  constructor(page: Page) {
    super(page)
  }

  async deleteArticle(): Promise<ArticlesPage> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept()
    })
    this.deleteIcon.click()

    return new ArticlesPage(this.page)
  }

  async clickAddCommentButton(): Promise<AddCommentView> {
    await this.addCommentButton.click()

    return new AddCommentView(this.page)
  }

  getArticleComment(body: string): ArticleComment {
    //obiekt z lokatorami wewnętrznymi (inna strategia agregacji lokatorów w obiekcie)
    const commentContainer = this.page.locator('.comment-container').filter({ hasText: body })

    return {
      body: commentContainer.locator(':text("comment:") + span'),
      link: commentContainer.locator("[id^='gotoComment']"),
    }
  }

  //wyizolowana metoda kliknięcia w link
  async clickCommentLink(commentContainer: ArticleComment): Promise<CommentPage> {
    await commentContainer.link.click()

    return new CommentPage(this.page)
  }
}
