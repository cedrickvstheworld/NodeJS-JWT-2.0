import { Document } from 'mongoose'

export interface UserModelInterface extends Document {
  username: string
  password: string
  encryptPassword: Function
  comparePassword: Function
}