import { prisma } from 'wasp/server'

import { updateUserStatus } from '../../../../../src/user/operations'


export default async function (args, context) {
  return (updateUserStatus as any)(args, {
    ...context,
    entities: {
      UserStatus: prisma.userStatus,
    },
  })
}
