import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
  RouteRecordName,
} from 'vue-router'
import { Middleware } from '~/types/middleware.types'

class MiddlewareSupport {
  constructor(private readonly router: Router, private readonly global: Middleware[]) {}
  async hook(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) {
    let redirected = false
    const middlewares = (to.meta?.middlewares as Middleware[]) ?? []
    for (const middleware of [...this.global, ...middlewares]) {
      const result_pipeline = await middleware(
        to,
        from,
        (name: RouteRecordName) => {
          redirected = true
          next({ name })
        },
        (url: Location) => (window.location = url),
        (url: string) => this.router.push(url)
      )
      if (result_pipeline === false) break
    }
    if (!redirected) next()
  }
}

export function hookMiddleware(router: Router, ...global: Middleware[]) {
  const middleware = new MiddlewareSupport(router, global)
  router.beforeEach(async (to, from, next) => {
    if (!to.meta.middleware) return next()
    await middleware.hook(to, from, next)
  })
}
