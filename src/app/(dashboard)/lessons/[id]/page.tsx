"use client"
import UploadImage from "@/components/uploadImage"
import WordsComponent from "@/components/word/wordComponent"
import { LessonCreate, LessonItem, LessonUpdate } from "@/model/lesson"
import { useGetLessonByIdMutation, useUpdateLessonByIdMutation } from "@/redux/services/lessonApi"
import { ContentWrapper, HeaderPageWrapper } from "@/styles/UI/styled"
import { showSwalMessage, showSwalModal } from "@/utils/func"
import { validateMessages } from "@/utils/validate"
import { SaveOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, Row, Spin, Switch } from "antd"
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
export const LessonDetail = ({ params }) => {
    const [getLessonById, { isLoading }] = useGetLessonByIdMutation()
    const [updateLessonById] = useUpdateLessonByIdMutation()
    const [lesson, setLesson] = useState<LessonItem>()
    const [form] = Form.useForm<LessonUpdate>();
    useEffect(() => {
        loadData(params.id)
    }, [params.id])

    const loadData = async (id) => {
        const result = await getLessonById(id).unwrap()
        if (result.success) {
            setLesson(result.data)
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
                            const result = await updateLessonById({ id: params.id, data: values }).unwrap()
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
        const lessonData: any = { ...lesson }
        let data: LessonUpdate = {
            active: lessonData.active,
            description: lessonData.description,
            image: url,
            name: lessonData.name,
            prior: lessonData.prior,
        }
        await updateLessonById({ id: lesson?.id as string, data }).unwrap()
        form.setFieldValue('image', url)
        showSwalMessage('Thành công', 'Cập nhật ảnh thành công', 'success')
    }

    return (
        (isLoading || !lesson || !lesson.id) ? <Spin className="spin-wrapper" /> : (
            <>
                <ContentWrapper>
                    <HeaderPageWrapper>
                        <Col className="d-flex justify-start align-center" span={8}><h2 className="header-title">{lesson?.name}</h2></Col>
                        <Col span={16}></Col>
                    </HeaderPageWrapper>

                    <Form
                        layout='vertical'
                        form={form}
                        initialValues={{
                            name: lesson.name,
                            description: lesson.description,
                            prior: lesson.prior,
                            image: lesson.image,
                            active: lesson.active,
                            author: lesson.author
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
                                    <DatePicker defaultValue={dayjs(lesson.createdAt)} disabled placeholder="Ngày tạo" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={6} className="mb-2">
                                <Form.Item label="Ngày cập nhật">
                                    <DatePicker defaultValue={dayjs(lesson.updatedAt)} disabled placeholder="Ngày cập nhật" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12} className="mb-2">
                                <Form.Item name="description" label="Mô tả">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col span={6} className="mb-2" >
                                <Form.Item label="Tên tác giả" name="author">
                                    <Input name="author" placeholder="Nhập tên tác giả" />
                                </Form.Item>
                                <Form.Item label="Trạng thái" name="active">
                                    <Switch defaultChecked={lesson.active} onChange={(e) => { form.setFieldValue('active', e) }} />
                                </Form.Item>
                            </Col>

                            <Col span={3} className="mb-2">
                                <Form.Item name="image" label="Hình ảnh">
                                    <UploadImage oldImage={lesson.image} type={2} handleChangeImage={handleChangeImage} />
                                </Form.Item>
                            </Col>

                            <Col span={24} style={{ marginTop: 12 }}>
                                <Button htmlType="submit" className="bg-green" icon={<SaveOutlined />} style={{ marginRight: 4 }}>Lưu</Button>
                            </Col>
                        </Row>
                    </Form>
                </ContentWrapper>
                <ContentWrapper>
                    <WordsComponent id={params.id} />
                </ContentWrapper>
            </>
        )
    )
}

export default LessonDetail