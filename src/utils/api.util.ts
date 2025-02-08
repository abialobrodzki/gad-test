import { prepareRandomArticle } from '@_src/factories/article.factory'
import { prepareRandomComment } from '@_src/factories/comment.factory'
import { testUser1 } from '@_src/test-data/user.data'
import { APIRequestContext } from '@playwright/test'

interface Headers {
  [key: string]: string
}

//funkcja uzyskania access tokena
export async function getAuthorizationHeader(request: APIRequestContext): Promise<Headers> {
  const loginUrl = '/api/login'
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  }
  const responseLogin = await request.post(loginUrl, {
    data: userData,
  })
  const responseLoginJson = await responseLogin.json()

  return { Authorization: `Bearer ${responseLoginJson.access_token}` }
}

interface ArticlePayload {
  title: string
  body: string
  date: string
  image?: string
}

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

interface CommentPayload {
  article_id: number
  body: string
  date: string
}

//funkcja generowania random komentarza
export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment()
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: new Date().toISOString(),
  }
  return commentData
}
