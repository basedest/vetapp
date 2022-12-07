import {JwtPayload} from "jsonwebtoken";

export type UserRole = "admin" | "user" | "employee" | "manager";

export interface User {
    id       : number
    username : string
    role     : UserRole
}

export interface UserWithPassword extends User {
    password: string
}

export enum RoleIds {
    ADMIN = 1,
    USER = 2,
    EMPLOYEE = 3,
    MANAGER = 4
}

export const idToRole = {
    [RoleIds.ADMIN]    : "admin",
    [RoleIds.USER]     : "user",
    [RoleIds.EMPLOYEE] : "employee",
    [RoleIds.MANAGER]  : "manager"
}

export const roleToId = {
    admin    : RoleIds.ADMIN,
    user     : RoleIds.USER,
    employee : RoleIds.EMPLOYEE,
    manager  : RoleIds.MANAGER
}

export interface UserAuth {
    username: string
    password: string
    role: RoleIds
}

export interface JWTPayloadWithUser extends JwtPayload {
    user: User
}