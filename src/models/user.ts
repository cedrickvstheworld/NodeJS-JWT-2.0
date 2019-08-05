import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import {UserModelInterface} from '../types/user'

const Schema = mongoose.Schema

const schema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

schema.methods.encryptPassword = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync())
}

schema.methods.comparePassword = (password: string, hashed_password: string): boolean => {
  return bcrypt.compareSync(password, hashed_password)
}

export default mongoose.model<UserModelInterface>('User', schema)