import * as dotenv from 'dotenv'

async function globalSetup(): Promise<void> {
  // ustawienie zmiennych środowiskowych zdefiniowanych w pliku .env
  dotenv.config({ override: true })
  //console.log('⚠️ URL:', process.env.BASE_URL)
}

export default globalSetup
