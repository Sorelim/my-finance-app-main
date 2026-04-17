import { compare } from "bcrypt"

import {
  ILoginUserRepository,
  LoginUserParams,
  LoginUserReturnTypes,
} from "@/controllers/login-user/protocols"
import prisma from "@/database/prisma"

export class LoginUserRepository implements ILoginUserRepository {
  async loginUser(params: LoginUserParams): Promise<LoginUserReturnTypes> {
    const user = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    })

    if (!user) {
      throw new Error("Пользователь не найден")
    }

    // Check if password matches
    const checkPassword = await compare(params.password, user.password)

    if (!checkPassword) {
      throw new Error("Неверный пароль")
    }

    const { id } = user

    return {
      id,
      success: true,
    }
  }
}
