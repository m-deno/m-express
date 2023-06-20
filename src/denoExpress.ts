import { App, Routers, CallBack, Context } from './types.ts'
import { serve, ServeInit } from './deps.ts'
import { bindMethodFunc } from './method.ts'

// 请求类型
const methods = ['get', 'post', 'put', 'patch', 'delete']

export function denoExpress(): App {
  const app: App = {
    routers: {} as Routers,
  } as App;
  // app.get = get
  app.use = useHandler
  app.listen = listenHandler
  methods.forEach((method) => {
    // 处理请求类型
    app[method] = bindMethodFunc.call(app, method)
  })
  return app;
}

// use中间件
function useHandler(this: App, path: string | CallBack, ...funcs: CallBack[]) {
  for (const method of methods) {
    const useMiddleware = bindMethodFunc.call(this, method, true)
    useMiddleware(path, ...funcs)
  }
}

function listenHandler(this: App, options: ServeInit, listenCallback?: () => void) {
  // 触发一次回调
  listenCallback?.();
  // 监听请求
  // @ts-ignore context
  serve((ctx: Context) => {
    // 请求类型
    const type = ctx.method.toLowerCase()
    const routes = this.routers[type]
    // 路由不存在，返回错误
    if (!routes) {
      return new Response('Not Found', {
        status: 404
      })
    }
    const routerPath = new URL(ctx.url)
    const routerPathName = routerPath.pathname

    // 添加send
    ctx.send = (body) => {
      ctx.reponse = body
    }

    deep(0)
    // 递归查找路由
    function deep(i: number) {
      if (routes.length <= i) {
        return new Response('Not Found', {
          status: 404
        })
      }
      const route = routes[i]
      // 匹配成功，调用
      if (route.path === routerPathName || route.path === '*' || route.isMiddleWare) {
        route.callback(ctx, () => deep(++i))
      } else {
        deep(++i)
      }
    }
    return responseTo(ctx.reponse)
  }, options);
}

function responseTo(content: any) {
  if (typeof content === 'number') {
    return new Response(content.toString(), {
      headers: {
        'content-type': 'application/json;charset=utf-8'
      }
    })
  }
  if (typeof content === 'string') {
    return new Response(content, {
      headers: {
        'content-type': 'application/json;charset=utf-8'
      }
    })
  }
  if (typeof content === 'object') {
    return new Response(JSON.stringify(content), {
      headers: {
        'content-type': 'application/json;charset=utf-8'
      }
    })
  }
  return new Response('', {
    status: 404
  })
}