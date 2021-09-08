import * as rt from 'runtypes'

export const LoginSchema = rt.Record({
  username: rt.String,
  password: rt.String
})
export type Login = rt.Static<typeof LoginSchema>
