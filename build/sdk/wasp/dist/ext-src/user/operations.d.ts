import { type UpdateCurrentUser, type UpdateUserById, type GetPaginatedUsers, type UpdateUserStatus, type GetUserStatus } from 'wasp/server/operations';
import type { User, UserStatus } from 'wasp/entities';
import { type SubscriptionStatus } from '../payment/plans';
export declare const updateUserById: UpdateUserById<{
    id: string;
    data: Partial<User>;
}, User>;
export declare const updateCurrentUser: UpdateCurrentUser<Partial<User>, User>;
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
export declare const getPaginatedUsers: GetPaginatedUsers<GetPaginatedUsersInput, GetPaginatedUsersOutput>;
type UpdateUserStatusPayload = Partial<UserStatus>;
export declare const updateUserStatus: UpdateUserStatus<UpdateUserStatusPayload, UserStatus>;
export declare const getUserStatus: GetUserStatus<void, UserStatus[]>;
export {};
