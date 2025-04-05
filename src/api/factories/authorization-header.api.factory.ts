import { Headers } from '@_src/api/models/headers.api.model'
import { apiUrls } from '@_src/api/utils/api.util'
import { testUser1 } from '@_src/ui/test-data/user.data'
import { APIRequestContext } from '@playwright/test'

//funkcja uzyskania access tokena
export async function getAuthorizationHeader(request: APIRequestContext): Promise<Headers> {
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  }
  const responseLogin = await request.post(apiUrls.loginUrl, {
    data: userData,
  })
  const responseLoginJson = await responseLogin.json()

  return { Authorization: `Bearer ${responseLoginJson.access_token}` }
}
