import {Document} from 'mongoose'

export interface AccessToken extends Document {
  access_token: string
  fingerprint: string
}

export interface RefreshToken extends Document {
  refresh_token: string
  fingerprint: string
}