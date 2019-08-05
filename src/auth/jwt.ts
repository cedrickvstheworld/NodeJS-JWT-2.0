import jwt from 'jsonwebtoken'

export default class Auth {
  secret_key: string | any
  secret_refresh_key: string | any
  
  constructor() {
    this.secret_key = process.env.JWT_SECRET_KEY
    this.secret_refresh_key = process.env.JWT_SECRET_REFRESH_KEY
  }

  private sign(payload: any, expiry: number | string, secret: string) {
    const access_token = jwt.sign(
      {
        user: payload
      },
      secret,
      {
        expiresIn: expiry
      }
    )
    return access_token
  }

  public getAccessToken(payload: any) {
    return this.sign(payload, 300, this.secret_key)
  }

  public getRefreshToken(payload: any) {
    return this.sign(payload, '60d', this.secret_refresh_key)
  }

}