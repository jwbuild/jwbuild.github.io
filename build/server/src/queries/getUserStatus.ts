import { prisma } from 'wasp/server'

import { getUserStatus } from '../../../../../src/user/operations'


export default async function (args, context) {
  return (getUserStatus as any)(args, {
    ...context,
    entities: {
      UserStatus: prisma.userStatus,
    },
  })
}
