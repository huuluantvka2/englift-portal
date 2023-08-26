import { IAudit } from "./common"

export interface WordCreate {
    content: string,
    trans: string,
    example: string,
    phonetic: string,
    image: string,
    position: string,
    active: true,
    lessonId: string
}

export interface WordUpdate {
    id?: string,
    content: string,
    trans: string,
    example: string,
    phonetic: string,
    image: string,
    position: string,
    active: true,
}

export interface WordItem extends IAudit {
    id: string,
    audio: string,
    content: string,
    trans: string,
    example: string,
    phonetic: string,
    image: string,
    position: string,
    active: true,
    lessonId: string
}