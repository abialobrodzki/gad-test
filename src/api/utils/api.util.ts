import { prepareRandomComment } from '@_src/ui/factories/comment.factory'
import { testUser1 } from '@_src/ui/test-data/user.data'
import { APIRequestContext } from '@playwright/test'

//strategie refaktor: przeniesiono interfejsy na początek pliku
export interface ArticlePayload {
  title: string
  body: string
  date: string
  image?: string
}

export interface CommentPayload {
  article_id: number
  body: string
  date: string
}

export interface Headers {
  [key: string]: string
}

//strategie refaktor: zmienne pod interfejsami
export const apiLinks = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
  loginUrl: '/api/login',
}

//funkcja uzyskania access tokena
export async function getAuthorizationHeader(request: APIRequestContext): Promise<Headers> {
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  }
  const responseLogin = await request.post(apiLinks.loginUrl, {
    data: userData,
  })
  const responseLoginJson = await responseLogin.json()

  return { Authorization: `Bearer ${responseLoginJson.access_token}` }
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
