import { IAudit } from "./common";

export interface CourseItem extends IAudit {
    id: string,
    name: string,
    description: string,
    prior: number,
    image: string,
    totalLesson: number,
    active: boolean,
}

export interface CourseCreateUpdate {
    name: string,
    description: string,
    prior: number,
    image: string,
    active: boolean,
}