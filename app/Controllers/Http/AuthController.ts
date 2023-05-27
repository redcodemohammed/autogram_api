import { prisma } from '@ioc:Adonis/Addons/Prisma'
import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { ValidationException } from '@ioc:Adonis/Core/Validator'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import LoginUserValidator from 'App/Validators/LoginUserValidator'
import Errors from 'Global/Errors'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    try {
      const { email, name, password } = await request.validate(CreateUserValidator)

      // check if the email is used before
      const isUsed = await prisma.user.findUnique({ where: { email } })
      if (isUsed !== null) {
        return response.badRequest(Errors.auth.emailIsNotUniqueError)
      } else {
        // create a new user
        await prisma.user.create({
          data: {
            email,
            name,
            password: await Hash.make(password),
          },
        })

        const token = await auth.use('api').attempt(email, password)

        return { token }
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        Logger.error('validation error')
        response.badRequest({ ...Errors.server.validationError, ...error })
      } else response.badGateway(Errors.server.unknownError)
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LoginUserValidator)
      //find the new user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (user === null) {
        return response.badRequest(Errors.auth.userNotFoundError)
      }

      const token = await auth.use('api').attempt(email, password)

      return { token }
    } catch (error) {
      if (error instanceof ValidationException) {
        Logger.error('validation error')
        response.badRequest({ ...Errors.server.validationError, ...error })
      } else response.badGateway(Errors.server.unknownError)
    }
  }
}
