import {
  type UpdateCurrentUser,
  type UpdateUserById,
  type GetPaginatedUsers,
  type UpdateUserStatus,
  type GetUserStatus,
} from 'wasp/server/operations';
import type { User, UserStatus } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type SubscriptionStatus } from '../payment/plans';
import { BiUnderline } from 'react-icons/bi';

export const updateUserById: UpdateUserById<{ id: string; data: Partial<User> }, User> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const updatedUser = await context.entities.User.update({
    where: {
      id,
    },
    data,
  });

  return updatedUser;
};

export const updateCurrentUser: UpdateCurrentUser<Partial<User>, User> = async (user, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: user,
  });
};

type GetPaginatedUsersInput = {
  skip: number;
  cursor?: number | undefined;
  emailContains?: string;
  isAdmin?: boolean;
  subscriptionStatus?: SubscriptionStatus[];
};
type GetPaginatedUsersOutput = {
  users: Pick<User, 'id' | 'email' | 'username' | 'lastActiveTimestamp' | 'subscriptionStatus' | 'paymentProcessorUserId'>[];
  totalPages: number;
};

export const getPaginatedUsers: GetPaginatedUsers<GetPaginatedUsersInput, GetPaginatedUsersOutput> = async (
  args,
  context
) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(401);
  }

  const allSubscriptionStatusOptions = args.subscriptionStatus as Array<string | null> | undefined;
  const hasNotSubscribed = allSubscriptionStatusOptions?.find((status) => status === null) 
  let subscriptionStatusStrings = allSubscriptionStatusOptions?.filter((status) => status !== null) as string[] | undefined

  const queryResults = await context.entities.User.findMany({
    skip: args.skip,
    take: 10,
    where: {
      AND: [
        {
          email: {
            contains: args.emailContains || undefined,
            mode: 'insensitive',
          },
          isAdmin: args.isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: subscriptionStatusStrings,
              },
            },
            {
              subscriptionStatus: {
                equals: hasNotSubscribed,
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      lastActiveTimestamp: true,
      subscriptionStatus: true,
      paymentProcessorUserId: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const totalUserCount = await context.entities.User.count({
    where: {
      AND: [
        {
          email: {
            contains: args.emailContains || undefined,
            mode: 'insensitive',
          },
          isAdmin: args.isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: subscriptionStatusStrings,
              },
            },
            {
              subscriptionStatus: {
                equals: hasNotSubscribed,
              },
            },
          ],
        },
      ],
    },
  });
  const totalPages = Math.ceil(totalUserCount / 10);

  return {
    users: queryResults,
    totalPages,
  };
};

type UpdateUserStatusPayload = Partial<UserStatus>

export const updateUserStatus: UpdateUserStatus<UpdateUserStatusPayload, 
  UserStatus> = async ({ status, location, pushSubscription }, context) => {
  if (!context.user) {
    throw new HttpError(401)
  }
  // Due to how Prisma works, we have to extract the user id, to be used in where.
  const userId = context.user.id;
  const updateTime = new Date();

  return context.entities.UserStatus.upsert({
    where: { userId },
    update: {
      // Update 'status' and 'startedAt' only if status is defined
      ...(status !== undefined && { status, statusStartedAt:updateTime }),
      // same for location and subscription
      ...(location !== undefined && { location, locationUpdatedAt: updateTime}),
      ...(pushSubscription !== undefined && { pushSubscription, pushSubscriptionUpdatedAt: updateTime}),
      // Ensure updatedAt is always current 
      updatedAt: updateTime,
    },
    create: {
      userId,
    },
  });
}

export const getUserStatus: GetUserStatus<void, UserStatus[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.UserStatus.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });
};
