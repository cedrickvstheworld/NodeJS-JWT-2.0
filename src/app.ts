require('dotenv').config({path: __dirname + '/../.env'})
import express from 'express'
import {Request, Response, Application, NextFunction} from 'express'
import mongoose from 'mongoose'
const fingerprint = require('express-fingerprint')
import morgan from 'morgan'

// routes
import indexRouter from './routes/index'

class Main {
  private app: Application
  private port: number
  private databaseUrlString: string | any

  constructor() {
    this.app = express()
    this.port = 5000
    this.databaseUrlString = process.env.DB_URL_STRING
    this.initializeApp()
  }

  private auth(request: Request, response: Response, next: NextFunction) {
    const {auth_key} = request.headers
    if (!auth_key || auth_key !== process.env.SERVER_SECRET) {
      return response.sendStatus(401)
    }
    next()
  }

  private connectToDatabase() {
    mongoose.connect(this.databaseUrlString, {useNewUrlParser: true})
      .then(() => {
        console.log('DB connection is fine')
      })
    mongoose.set('useFindAndModify', false)
  }

  private parentRoutes() {
    this.app.use(this.auth)
    this.app.use('', indexRouter.preparedRoutes())
  }

  public startServer() {
    this.app.listen(this.port, (): void => {
      console.log(`server listening on port ${this.port} . . .`)
    })
  }

  private initializeApp() {
    this.connectToDatabase()
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: false}))
    this.app.use(fingerprint({
      parameters: [
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip
      ]
    }))
    this.parentRoutes()
  }

}


const application: Main = new Main()
application.startServer()
