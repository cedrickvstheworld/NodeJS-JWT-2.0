import express from 'express'
import User from '../classes/user'
import Jwt from '../auth/jwt'
import Token from '../classes/token'

// types
import {Request, Response, NextFunction} from 'express'
import {IRequest} from '../types/expressMiddleWares'
import user from '../models/user';

class Router {
  private router: any
  private user: User
  private jwt: Jwt
  private Token: Token

  constructor() {
    this.router = express.Router()
    this.user = new User()
    this.jwt = new Jwt()
    this.Token = new Token()
  }

  private generateTokens(payload: string, fingerprint: string) {
    const auth_token = this.jwt.getAccessToken(payload)
    const refresh_token = this.jwt.getRefreshToken(payload)
    this.Token.saveAccessToken(auth_token, fingerprint)
    this.Token.saveRefreshToken(refresh_token, fingerprint)
    return {access_token: auth_token, refresh_token}
  }

  preparedRoutes() {

    // create new user
    this.router.post('/', (request: IRequest, response: Response) => {
      const {username, password} = request.body
      if (!username || !password) {
        return response.status(400).json({error: 'username and password must be included in the request body'})
      }
      this.user.create(username, password)
        .then((user: any) => {
          const token = this.generateTokens(user.username, request.fingerprint.hash)
          response.status(201).json({access_token: token.access_token, refresh_token: token.refresh_token})
        })
        .catch((error) => {
          response.status(400).json({error})
        })
    })

    // sign in
    this.router.post('/signin', (request: IRequest, response: Response) => {
      const {username, password} = request.body
      if (!username || !password) {
        return response.status(400).json({error: 'username and password must be included in the request body'})
      }
      this.user.signin(username, password)
        .then((user: any) => {
          const token = this.generateTokens(user.username, request.fingerprint.hash)
          response.status(201).json({access_token: token.access_token, refresh_token: token.refresh_token})
        })
        .catch((error) => {
          response.status(400).json({error})
        })
    })
    
    // validate access token
    this.router.get('/', (request: IRequest, response: Response) => {
      const {access_token} = request.headers
      if (!access_token) {
        return response.status(400).json({error: 'access_token must be included in the request headers'})
      }
      // @ts-ignore
      this.Token.verifyAccessToken(access_token, request.fingerprint.hash, process.env.JWT_SECRET_KEY)
        .then(() => {
          response.sendStatus(200)
        })
        .catch(() => {
          response.sendStatus(401)
        })
    })

    // refresh access token
    this.router.post('/refresh', (request: IRequest, response: Response) =>{
      const {refresh_token} = request.headers
      if (!refresh_token) {
        return response.status(400).json({error: 'refresh_token must be included in the request headers'})
      }
      // @ts-ignore
      this.Token.refreshAccessToken(refresh_token, request.fingerprint.hash, process.env.JWT_SECRET_REFRESH_KEY)
        .then((result: any) => {
          response.status(201).json({access_token: result.access_token})
        })
        .catch((error: string) => {
          response.sendStatus(401)
        })
    })

    return this.router
  }

}


export default new Router()
