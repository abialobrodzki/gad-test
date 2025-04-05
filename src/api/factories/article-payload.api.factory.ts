import { ArticlePayload } from '@_src/api/models/article.api.model'
import { prepareRandomArticle } from '@_src/ui/factories/article.factory'

//funkcja generowania random artykułu
export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle(undefined, undefined, true)
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: new Date().toISOString(),
    image: randomArticleData.image,
  }
  return articleData
}
