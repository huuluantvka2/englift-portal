import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2"

export const generateRequest = (obj: Object) => {
    let str = '?'
    for (let [key, value] of Object.entries(obj)) {
        if (value != null && value != undefined) str += `${key}=${value}&`
    }
    if (str.length > 1) return str.substring(0, str.length - 1)
    else return ""
}
export const formatDateString = (date: string) => {
    let d = new Date(date)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}

export const showSwalModal = (title: string, description: string, icon: SweetAlertIcon, buttonOkText: string = 'Ok', buttonCancelText: string = 'Hủy'): Promise<SweetAlertResult> => {
    return Swal.fire({
        title: title,
        html: description,
        icon: icon,
        showCancelButton: true,
        confirmButtonText: buttonOkText,
        cancelButtonText: buttonCancelText,
        allowEnterKey: true,
        allowEscapeKey: true,
    })
}

export const showSwalMessage = (title: string, description: string, icon?: SweetAlertIcon): Promise<SweetAlertResult> => {
    return Swal.fire(title, description, icon)
}