import { HttpError } from 'wasp/server';
export const updateUserById = async ({ id, data }, context) => {
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
export const updateCurrentUser = async (user, context) => {
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
export const getPaginatedUsers = async (args, context) => {
    var _a;
    if (!((_a = context.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        throw new HttpError(401);
    }
    const allSubscriptionStatusOptions = args.subscriptionStatus;
    const hasNotSubscribed = allSubscriptionStatusOptions === null || allSubscriptionStatusOptions === void 0 ? void 0 : allSubscriptionStatusOptions.find((status) => status === null);
    let subscriptionStatusStrings = allSubscriptionStatusOptions === null || allSubscriptionStatusOptions === void 0 ? void 0 : allSubscriptionStatusOptions.filter((status) => status !== null);
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
export const updateUserStatus = async ({ status, location, pushSubscription }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    // Due to how Prisma works, we have to extract the user id, to be used in where.
    const userId = context.user.id;
    const updateTime = new Date();
    return context.entities.UserStatus.upsert({
        where: { userId },
        update: Object.assign(Object.assign(Object.assign(Object.assign({}, (status !== undefined && { status, statusStartedAt: updateTime })), (location !== undefined && { location, locationUpdatedAt: updateTime })), (pushSubscription !== undefined && { pushSubscription, pushSubscriptionUpdatedAt: updateTime })), { 
            // Ensure updatedAt is always current 
            updatedAt: updateTime }),
        create: {
            userId,
        },
    });
};
export const getUserStatus = async (_args, context) => {
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
//# sourceMappingURL=operations.js.map