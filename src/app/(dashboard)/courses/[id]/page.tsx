"use client"
import LessonsComponent from "@/components/lesson/lessonComponent"
import UploadImage from "@/components/uploadImage"
import { CourseCreateUpdate, CourseItem } from "@/model/course"
import { useGetCourseByIdMutation, useUpdateCourseByIdMutation } from "@/redux/services/courseApi"
import { ContentWrapper, HeaderPageWrapper } from "@/styles/UI/styled"
import { formatDateString, showSwalMessage, showSwalModal } from "@/utils/func"
import { validateMessages } from "@/utils/validate"
import { SaveOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Spin, Switch } from "antd"
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
export const CourseDetail = ({ params }) => {
    const [getCourseById, { isLoading }] = useGetCourseByIdMutation()
    const [updateCourseById] = useUpdateCourseByIdMutation()
    const [course, setCourse] = useState<CourseItem>()
    const [form] = Form.useForm<CourseCreateUpdate>();
    useEffect(() => {
        loadData(params.id)
    }, [params.id])

    const loadData = async (id) => {
        const result = await getCourseById(id).unwrap()
        if (result.success) {
            setCourse(result.data)
        }
    }
    const onFinish = (values) => {
        console.log(values)
        showSwalModal('Cập nhật', 'Bạn có muốn cập nhật bản ghi?', 'question').then(async res => {
            if (res.isConfirmed) {
                Swal.fire({
                    title: 'Vui Lòng chờ...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    icon: 'info',
                    didOpen: async () => {
                        try {
                            const result = await updateCourseById({ id: params.id, data: values }).unwrap()
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
    const handleChangeImage = async (url: string) => {
        const courseData: any = { ...course }
        let data: CourseCreateUpdate = {
            active: courseData.active,
            description: courseData.description,
            image: url,
            name: courseData.name,
            prior: courseData.prior
        }
        await updateCourseById({ id: course?.id as string, data }).unwrap()
        form.setFieldValue('image', url)
        showSwalMessage('Thành công', 'Cập nhật ảnh thành công', 'success')
    }

    return (
        (isLoading || !course || !course.id) ? <Spin className="spin-wrapper" /> : (
            <>
                <ContentWrapper>
                    <HeaderPageWrapper>
                        <Col className="d-flex justify-start align-center" span={8}><h2 className="header-title">{course?.name}</h2></Col>
                        <Col span={16}></Col>
                    </HeaderPageWrapper>

                    <Form
                        layout='vertical'
                        form={form}
                        initialValues={{
                            name: course.name,
                            description: course.description,
                            prior: course.prior,
                            image: course.image,
                            active: course.active,
                        }}
                        validateMessages={validateMessages}
                        onFinish={onFinish}
                    >
                        <Row gutter={16}>
                            <Col span={6} className="mb-2" >
                                <Form.Item label="Tên khóa học" name="name" rules={[{ required: true }]}>
                                    <Input name="name" placeholder="Nhập tên khóa học" />
                                </Form.Item>
                            </Col>

                            <Col span={6} className="mb-2">
                                <Form.Item label="Độ ưu tiên" name="prior" required>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>

                            <Col span={6} className="mb-2">
                                <Form.Item label="Ngày tạo">
                                    <DatePicker defaultValue={dayjs(course.createdAt)} disabled placeholder="Ngày tạo" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={6} className="mb-2">
                                <Form.Item label="Ngày cập nhật">
                                    <DatePicker defaultValue={dayjs(course.updatedAt)} disabled placeholder="Ngày cập nhật" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12} className="mb-2">
                                <Form.Item name="description" label="Mô tả">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col span={3} className="mb-2">
                                <Form.Item name="image" label="Hình ảnh">
                                    <UploadImage oldImage={course.image} type={1} handleChangeImage={handleChangeImage} />
                                </Form.Item>
                            </Col>
                            <Col span={3} className="mb-2">
                                <Form.Item label="Trạng thái" name="active">
                                    <Switch defaultChecked={course.active} onChange={(e) => { form.setFieldValue('active', e) }} />
                                </Form.Item>
                            </Col>

                            <Col span={24} style={{ marginTop: 12 }}>
                                <Button htmlType="submit" className="bg-green" icon={<SaveOutlined />} style={{ marginRight: 4 }}>Lưu</Button>
                            </Col>
                        </Row>
                    </Form>
                </ContentWrapper>
                <ContentWrapper>
                    <LessonsComponent id={params.id} />
                </ContentWrapper>
            </>
        )
    )
}

export default CourseDetail