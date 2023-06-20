import { App, CallBack } from "./types.ts";

export function bindMethodFunc(this: App, type: string, isMiddleWare=false) {
  return (path: string | CallBack, ...funcs: CallBack[]) => {
    // 初始化路由
    this.routers[type] || (this.routers[type] = [])
    // 处理异常
    if (typeof path === 'string') {
      if (funcs.length === 0) {
        funcs = [(_, next) => next()]
      }
    } else {
      // 没有传递请求路径，设置默认路径
      funcs.unshift(path)
      path = '*'
    }
    // 将路径与请求类型匹配
    funcs.forEach(func => {
      this.routers[type].push({
        path: path as string,
        callback: func,
        isMiddleWare
      })
    })
  }
}