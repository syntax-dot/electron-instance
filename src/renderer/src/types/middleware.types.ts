import type { RouteLocationNormalized } from 'vue-router'
type Next = (name: string) => void
type ForceRedirect = (url: Location) => void
type Redirect = (url: string) => void

export type Middleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: Next,
  force_redirect: ForceRedirect,
  redirect: Redirect
) => Promise<boolean | void>
