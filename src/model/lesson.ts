import { IAudit } from "./common"

export interface LessonCreate {
    name: string,
    author?: string,
    description: string,
    prior: number,
    image?: string,
    active: true,
    courseId: string
}

export interface LessonUpdate {
    name: string,
    author?: string,
    description: string,
    prior: number,
    image?: string,
    active: true,
}

export interface LessonItem extends IAudit {
    id: string,
    name: string,
    author?: string,
    description: string,
    prior: number,
    image?: string,
    active: true,
    courseId: string
}