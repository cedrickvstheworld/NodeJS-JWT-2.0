import accessToken from '../models/access_token'
import refreshToken from '../models/refresh_token'
import jwt from 'jsonwebtoken'
import Jwt from '../auth/jwt'

export default class Token {
  private Jwt: Jwt

  constructor() {
    this.Jwt = new Jwt()
  }

  // save access token
  public async saveAccessToken(token: string, fingerprint: string) {
    return new Promise((resolve, reject) => {
      // upsert doc
      accessToken.findOneAndUpdate(
        {
          fingerprint
        },
        {
          access_token: token,
          fingerprint
        },
        {
          upsert: true,
          new: true
        }
      )
      .then((docs: any) => {
        resolve(docs)
      })
      .catch((error: string) => {
        reject(error)
      })
    })
  }

  // save refresh token
  public async saveRefreshToken(token: string, fingerprint: string) {
    return new Promise((resolve, reject) => {
      // upsert doc
      refreshToken.findOneAndUpdate(
        {
          fingerprint
        },
        {
          refresh_token: token,
          fingerprint
        },
        {
          upsert: true,
          new: true
        }
      )
      .then((docs: any) => {
        resolve(docs)
      })
      .catch((error: string) => {
        reject(error)
      })
    })
  }

  // verify access token
  public async verifyAccessToken(access_token: string, fingerprint: string, access_token_secret: string | any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(access_token, access_token_secret, (error: any) => {
        if (error) {
          return reject(false)
        }
        accessToken.findOne(
          {
            access_token,
            fingerprint
          }
        )
        .then((docs) => {
          if (docs) {
            return resolve(true)
          }
          return reject(false)
        })
        .catch((error) => {
          reject(error)
        })
      })
    })
  }

  // refresh access token via refresh token
  public async refreshAccessToken(refresh_token: string, fingerprint: string, refresh_token_secret: string | any) {
    return new Promise((resolve, reject) => {
      jwt.verify(refresh_token, refresh_token_secret, (error: any) => {
        if (error) {
          accessToken.findOneAndDelete(
            {
              fingerprint
            }
          )
          .then(() => {
            refreshToken.findOneAndDelete(
              {
                fingerprint
              }
            )
            .then(() => {
              console.log('tokens deleted')
            })
          })
          return reject(false)
        }
        refreshToken.findOne(
          {
            refresh_token,
            fingerprint
          }
        )
        .then((docs: any) => {
          if (docs) {
            return this.saveAccessToken(this.Jwt.getAccessToken(docs.username), fingerprint)
              .then((result) => {
                return resolve(result)
              })
          }
          return reject(false)
        })
        .catch(() => {
          reject(false)
        })
      })
    })
  }

}