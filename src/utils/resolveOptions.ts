import { validateMethod } from './validateMethod';
const { _ } = Cypress

export const resolveOptions = (...args: any[]) => {

  const o: any = {}
  const userOptions = o

  if (_.isObject(args[0])) {
    _.extend(userOptions, args[0])
  } else if (args.length === 1) {
    o.url = args[0]
  } else if (args.length === 2) {
    if (validateMethod(args[0])) {
      o.method = args[0]
      o.url = args[1]
    } else {
      o.url = args[0]
      o.body = args[1]
    }
  } else if (args.length === 3) {
    o.method = args[0]
    o.url = args[1]
    o.body = args[2]
  }

  return userOptions

}