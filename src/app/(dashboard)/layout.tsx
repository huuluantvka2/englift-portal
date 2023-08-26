"use client"
import { AuthContext } from "@/components/authContext";
import {
    BookOutlined, UserOutlined, FileWordOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '../../public/image/logo1.png';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Người dùng', '/users', <UserOutlined />),
    getItem('Khóa học', '/courses', <FileWordOutlined />),
    getItem('Từ vựng', '/words', <BookOutlined />),
];


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(true);
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        router.push(e.key)
    };

    return (
        <Layout style={{ minHeight: '100vh' }} hasSider={true}>
            <Sider className="bg-sider" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="d-flex dashboard-logo">
                    <Image style={{borderRadius:'100px'}} alt='logo' width={50} height={50} src={Logo} />
                    {!collapsed && <b>ADMIN</b>}
                </div>
                <Menu onClick={handleMenuClick} theme="dark" defaultSelectedKeys={['/users']} mode="inline" items={items} />
            </Sider>
            <Layout style={{ 'background': '#f0f2f5' }}>
                <Header className="bg-main dashboard-header">TIẾNG HÀN TỐT</Header>
                <Content style={{ margin: '0 16px' }}>
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>©2023 Tieng Han Tot</Footer>
            </Layout>
        </Layout>
    )
}

export default DashboardLayout