import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

const SECRET_KEY = process.env.SECRET

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Доступ запрещен. Токен не предоставлен." })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY as string) as JwtPayload
    req.body.userId = decoded.id
    next()
  } catch (error) {
    return res.status(403).json({ message: "Недействительный или просроченный токен." })
  }
}
