'use client'
import { UserLogin } from '@/model/user';
import { useLoginAdminMutation } from '@/redux/services/authApi';
import { setAccessToken } from '@/redux/services/commonService';
import { showMessage } from '@/utils/message';
import { validateMessages } from '@/utils/validate';
import { Button, Card, Form, Input } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '../../public/image/logo1.png';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/components/authContext';
const Login = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    useEffect(() => {
        console.log('isAuthenticated', authContext.isAuthenticated())
        authContext.isAuthenticated() ? router.push('/users') : router.push('/login')
    }, [])
    const [useLoginAdmin, { isLoading }] = useLoginAdminMutation()
    const onFinish = (values: UserLogin) => {
        useLoginAdmin(values).unwrap().
            then(result => {
                if (result.success === true) {
                    setAccessToken(result.data?.accessToken as string)
                    showMessage('success', 'Đăng nhập thành công')
                    router.push('/users')
                } else {
                    showMessage('error', result.message)
                }
            }).catch(err => showMessage('error', err?.data?.message))
    };

    return (
        <div className="login bg-primary-black center-all">
            <Card hoverable style={{ position: 'relative', width: 450, height: 'auto' }}>
                <Image style={{ position: 'absolute', left: '175px', top: '-60px' }} alt='logo' width={100} height={100} src={Logo} />
                <h1 className='text-center'>Tiếng Anh Tốt Admin</h1>
                <Form
                    labelAlign='left'
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    name="nest-messages"
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    validateMessages={validateMessages}
                >
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button loading={isLoading} className='submit-button' style={{ marginTop: '1rem' }} htmlType="submit">
                        Đăng nhập
                    </Button>
                </Form>
            </Card>
        </div>
    )
}

export default Login