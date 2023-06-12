"use client"

import { UserItem } from "@/model/user"
import { useGetUserByIdMutation, useUpdateUserByIdMutation } from "@/redux/services/userApi"
import { HeaderPageWrapper } from "@/styles/UI/styled"
import { TypeLoginOption } from "@/utils/common"
import { formatDateString, showSwalMessage, showSwalModal } from "@/utils/func"
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin, Switch } from "antd"
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
const { Option } = Select;
export const UserDetail = ({ params }) => {
    const [getUserById, { isLoading }] = useGetUserByIdMutation()
    const [updateUserById] = useUpdateUserByIdMutation()
    const [user, setUser] = useState<UserItem | undefined>(undefined)
    const [form] = Form.useForm();
    useEffect(() => {
        loadData(params.id)
    }, [params.id])

    const loadData = async (id) => {
        const result = await getUserById(id).unwrap()
        if (result.success) {
            setUser(result.data)
        }
        console.log(user)
    }
    const onFinish = (values) => {
        showSwalModal('Cập nhật', 'Bạn có muốn cập nhật?', 'question').then(async res => {
            if (res.isConfirmed) {
                Swal.fire({
                    title: 'Vui Lòng chờ...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    icon: 'info',
                    didOpen: async () => {
                        try {
                            const result = await updateUserById({ id: params.id, data: values }).unwrap()
                            if (result.success) {
                                showSwalMessage('Thành công', 'Cập nhật thành công', 'success')
                            } else showSwalMessage('Thất bại', result.message as string, 'error')

                        } catch (err: any) {
                            showSwalMessage('Thất bại', err.message, 'error')
                        }
                    }
                })
            }
        })
    }
    return (
        (isLoading || !user || !user.id) ? <Spin className="spin-wrapper" /> : (
            <>
                <HeaderPageWrapper>
                    <Col className="d-flex justify-start align-center" span={8}><h2 className="header-title">{user?.fullName}</h2></Col>
                    <Col span={16}></Col>
                </HeaderPageWrapper>

                <Form
                    layout='vertical'
                    form={form}
                    initialValues={{
                        fullName: user?.fullName,
                        active: user?.active,
                        email: user?.email,
                        phoneNumber: user?.phoneNumber,
                        refCode: user?.refCode,
                        typeLogin: +user?.typeLogin,
                        createdAt: user?.createdAt,
                        updatedAt: user?.updatedAt,
                    }}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={6} className="mb-2" >
                            <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                                <Input name="fullName" placeholder="Nhập họ tên" />
                            </Form.Item>
                        </Col>

                        <Col span={6} className="mb-2">
                            <Form.Item label="Email" name="email" required>
                                <Input placeholder="Nhập email" disabled />
                            </Form.Item>
                        </Col>

                        <Col span={6} className="mb-2">
                            <Form.Item label="Số điện thoại" name="phoneNumber">
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>

                        <Col span={6} className="mb-2">
                            <Form.Item label="Mã giới thiệu" name="refCode">
                                <Input placeholder="Nhập mã giới thiệu" />
                            </Form.Item>
                        </Col>

                        <Col span={6} className="mb-2">
                            <Form.Item label="Loại tài khoản" required>
                                <Select disabled defaultValue={+user.typeLogin}
                                    placeholder="Chọn loại tài khoản"
                                >
                                    {TypeLoginOption.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.value}>{item.label}</Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>


                        <Col span={6} className="mb-2">
                            <Form.Item label="Ngày tạo">
                                <DatePicker defaultValue={dayjs(formatDateString(user.createdAt as string))} disabled placeholder="Ngày tạo" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={6} className="mb-2">
                            <Form.Item label="Ngày cập nhật">
                                <DatePicker disabled placeholder="Ngày cập nhật" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={6} className="mb-2">
                            <Form.Item label="Trạng thái" name="active">
                                <Switch defaultChecked={user.active} onChange={(e) => { form.setFieldValue('active', e) }} />
                            </Form.Item>
                        </Col>

                        <Col span={24} style={{ marginTop: 12 }}>
                            <Button htmlType="submit" className="bg-green" icon={<SaveOutlined />} style={{ marginRight: 4 }}>Lưu</Button>
                        </Col>
                    </Row>
                </Form>
            </>
        )
    )
}

export default UserDetail