import { prepareRandomArticle } from '@_src/ui/factories/article.factory'
import { pageObjectTest } from '@_src/ui/fixtures/page-object.fixture'
import { AddArticleModel } from '@_src/ui/models/article.model'
import { ArticlePage } from '@_src/ui/pages/article.page'

interface ArticleCreatorContext {
  articlePage: ArticlePage
  articleData: AddArticleModel
}

interface ArticleFixtures {
  createRandomArticle: ArticleCreatorContext
  randomArticle: (articleData?: AddArticleModel) => Promise<ArticleCreatorContext>
}

export const articleTest = pageObjectTest.extend<ArticleFixtures>({
  createRandomArticle: async ({ addArticleView }, use) => {
    const articleData = prepareRandomArticle()
    const articlePage = await addArticleView.createArticle(articleData)
    await use({ articlePage, articleData })
  },
  //fixture pozwalający na dynamiczne tworzenie obiektów
  randomArticle: async ({ addArticleView }, use) => {
    const create = async (articleData?: AddArticleModel): Promise<ArticleCreatorContext> => {
      const finalArticleData = articleData ?? prepareRandomArticle()
      const articlePage = await addArticleView.createArticle(finalArticleData)
      return { articlePage, articleData: finalArticleData }
    }
    await use(create)
  },
})
