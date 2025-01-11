import { type User, type UserStatus, type GptResponse, type Task, type File, type DailyStats, type PageViewSource, type Logs, type ContactFormMessage } from "@prisma/client";
export { type User, type UserStatus, type GptResponse, type Task, type File, type DailyStats, type PageViewSource, type Logs, type ContactFormMessage, type Auth, type AuthIdentity, } from "@prisma/client";
export type Entity = User | UserStatus | GptResponse | Task | File | DailyStats | PageViewSource | Logs | ContactFormMessage | never;
export type EntityName = "User" | "UserStatus" | "GptResponse" | "Task" | "File" | "DailyStats" | "PageViewSource" | "Logs" | "ContactFormMessage" | never;
