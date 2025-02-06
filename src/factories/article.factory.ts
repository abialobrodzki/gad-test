import { AddArticleModel } from '@_src/models/article.model'
import { faker } from '@faker-js/faker/locale/en'

export function prepareRandomArticle(titleLength?: number, bodyParagraphs = 5, imageTrue?: boolean): AddArticleModel {
  let title: string
  let image: string

  if (titleLength) title = faker.string.alpha(titleLength)
  else title = faker.lorem.sentence()

  // const body = faker.lorem.paragraph(5)
  const body = faker.lorem.paragraphs(bodyParagraphs)

  if (imageTrue) image = faker.image.url()
  else image = ''
  // console.log(image);

  const newArticle: AddArticleModel = { title: title, body: body, image: image }

  return newArticle
}
