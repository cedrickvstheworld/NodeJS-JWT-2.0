import UserModel from '../models/user'

export default class User {

  public async create(username: string, password: string) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(
        {
          username
        }
      )
      .then((user) => {
        if (user) {
          return reject('username already exists')
        }
        const new_user = new UserModel()
        new_user.username = username
        new_user.password = new_user.encryptPassword(password)
        new_user.save()
          .then((user) => {
            resolve(user)
          })
      })
    })
  }

  public async signin(username: string, password: string) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(
        {
          username
        }
      )
      .then((user) =>{
        const error = "username or password incorrect"
        if (user) {
          if (user.comparePassword(password, user.password)) {
            return resolve(user)
          }
        }
        return reject({error})
      })
    })
  }

}