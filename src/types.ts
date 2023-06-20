import { ServeInit } from './deps.ts'

export interface Context extends Request {
  reponse: any
  // 请求params
  params?: Record<string, unknown>
  data?: Record<string, unknown>
  // 发送
  send: (body: unknown) => void
}

export interface NextFunction {
  (): void
}

export interface CallBack {
  (ctx: Context, next: NextFunction): void
}

export interface MethodFunc {
  (path: string | CallBack, ...funcs: CallBack[]): void
}

export interface Listen {
  (options: ServeInit, listenCallback?: () => void): void
}

export interface Route {
  path: string
  callback: CallBack
  isMiddleWare: boolean
}

export interface Routers {
  [key: string]: Route[]
}

export interface App {
  get: MethodFunc, 
  post: MethodFunc, 
  put: MethodFunc, 
  delete: MethodFunc, 
  patch: MethodFunc, 
  use: MethodFunc,
  listen: Listen,
  routers: Routers,
  [key: string]: MethodFunc | Listen | Routers
}