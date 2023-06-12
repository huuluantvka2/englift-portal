export const metadata = {
    title: 'Người dùng',
    description: 'Admin Tieng Anh Tot',
}
const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="layout-content">{children}</div>
    )
}

export default UserLayout