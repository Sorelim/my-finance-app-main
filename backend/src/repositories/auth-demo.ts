import { compare } from "bcrypt"

import {
  AuthDemoParams,
  IAuthDemoRepository,
  ReturnAuthDemo,
} from "@/controllers/auth-demo/protocols"
import prisma from "@/database/prisma"

export class AuthDemoRepository implements IAuthDemoRepository {
  async authDemo(params: AuthDemoParams): Promise<ReturnAuthDemo> {
    const user = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    })

    if (!user) {
      throw new Error("Пользователь не найден")
    }

    const checkPassword = await compare(params.password, user.password)

    if (!checkPassword) {
      throw new Error("Неверный пароль")
    }

    const { id } = user

    return {
      id,
      email: user.email,
      password: user.password,
    }
  }
}
