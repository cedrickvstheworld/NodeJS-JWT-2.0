import mongoose from 'mongoose'
const Schema = mongoose.Schema

// types
import {AccessToken} from '../types/token'

const schema = new Schema({
  access_token: {
    type: String,
    required: true
  },
  fingerprint: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

export default mongoose.model<AccessToken>('Access_token', schema)
