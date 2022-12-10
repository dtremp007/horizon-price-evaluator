import { google } from 'googleapis'

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

export async function getAuthToken() {
  if (typeof window !== 'undefined') {
    throw new Error('NO SECRETS ON CLIENT!')
  }


  const { private_key } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY || '{ private_key: null }')
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      private_key,
      client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
    },
  })
  const authToken = await auth.getClient()
  return authToken
}
