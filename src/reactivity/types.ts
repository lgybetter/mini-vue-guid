import { ReactiveFlags } from './reactive'

export interface IValue extends Object {
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
}

export interface IHandler {
  get: (target: Object, key: string) => any
  set: (target: Object, key: string, value: any) => boolean
}

export interface IProxyTarget {
  [key: string | number]: any
}