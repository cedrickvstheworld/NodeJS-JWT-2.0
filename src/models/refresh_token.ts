import mongoose from 'mongoose'
import { RefreshToken } from '../types/token';
const Schema = mongoose.Schema

const schema = new Schema({
  refresh_token: {
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

const ModelSchema =  mongoose.model<RefreshToken>('Refresh_token', schema)

export default ModelSchema