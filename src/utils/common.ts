export const RenderTypeLogin = (type: number) => {
    switch (type) {
        case 1: return 'Hệ thống'
        case 2: return 'Google'
        default: 'Không rõ'
    }
}

export const StatusOption = [
    {
        label: 'Tất cả trạng thái',
        value: '--',
    },
    {
        label: 'Hoạt động',
        value: true,
    },
    {
        label: 'Không hoạt động',
        value: false,
    }
]

export const TypeLoginOption = [
    {
        label: 'Tất cả loại tài khoản',
        value: '--',
    },
    {
        label: 'Hệ thống',
        value: 1,
    },
    {
        label: 'Google',
        value: 2,
    }
]