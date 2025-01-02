import * as dotenv from 'dotenv'

async function globalSetup(): Promise<void> {
  // ustawienie zmiennych środowiskowych zdefiniowanych w pliku .env
  dotenv.config({ override: true })
  // console.log('⚠️ URL:', process.env.BASE_URL)
  // console.log('⚠️ EMAIL:', process.env.USER_EMAIL)
  // console.log('⚠️ PASSWORD:', process.env.USER_PASSWORD)
}

export default globalSetup
