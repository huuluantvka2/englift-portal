"use client"
import UpdateEditIcon from "@/components/updateEditIcon";
import UploadImage from "@/components/uploadImage";
import { PaginationData } from "@/model/common";
import { CommonModels } from "@/model/constants";
import { LessonCreate, LessonItem } from "@/model/lesson";
import { useCreateLessonMutation, useDeleteLessonMutation, useGetLessonsMutation } from "@/redux/services/lessonApi";
import { ActiveStatus, ContentWrapper, HeaderPageWrapper } from "@/styles/UI/styled";
import { StatusOption } from "@/utils/common";
import { BASE_URL } from "@/utils/constants";
import { formatDateString, showSwalMessage, showSwalModal } from "@/utils/func";
import { showMessage } from "@/utils/message";
import { validateMessages } from "@/utils/validate";
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Modal, Row, Select, Switch, Table, Tooltip } from "antd";
import type { TableProps } from 'antd/es/table';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoImage from '../../public/image/noImage.png';
const LessonsComponent = (props: { id: string }) => {
    const columns: any = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: 150,
            render: (value: string) => {
                return (
                    <Tooltip placement="top" arrow={true} rootClassName="custom-toolip-inner" title={<img width={250} src={value ? (BASE_URL + value) : NoImage.src} alt="avatar" />}>
                        <Avatar size={"large"} src={<img src={value ? (BASE_URL + value) : NoImage.src} alt="avatar" />} />
                    </Tooltip>)
            }
        },
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            sorter: true,
            width: 300,
            render: (value: string, record) => <b className="text-blue"><a onClick={() => handleEdit(record.id)}>{value}</a></b>,
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'prior',
            sorter: true,
            width: 170,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            width: 150,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 300,
        },
        {
            title: 'Tổng từ vựng',
            dataIndex: 'totalWords',
            width: 170,
            sorter: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            width: 200,
            render: (value: boolean) => {
                return (
                    <ActiveStatus className={value ? 'bg-label' : 'bg-black-gradient'}>{value ? 'Hoạt động' : 'Không hoạt động'}</ActiveStatus>
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (value: string) => {
                return <span>{formatDateString(value)}</span>
            },
            sorter: true,
            width: 150
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: (value: string) => {
                return <span>{formatDateString(value)}</span>
            },
            sorter: true,
            width: 170
        },
        {
            width: 100,
            fixed: 'right',
            render: (value, record) => (
                <UpdateEditIcon handleDelete={() => handleDelete(record.id)} handleEdit={() => handleEdit(record.id)} />
            ),
        },
    ];
    const [lessons, setLessons] = useState<PaginationData<LessonItem>>({ items: [], totalRecord: 0 })
    const [filter, setFilter] = useState({
        limit: 10,
        page: 1,
        search: "",
        sort: null,
        active: null,
    })
    const [showModel, setShowModel] = useState<boolean>(false)
    const [getLessons, { isLoading }] = useGetLessonsMutation()
    const [createLesson, { isLoading: isLoadingCreate }] = useCreateLessonMutation()
    const [deleteLesson, { isLoading: isLoadingDelete }] = useDeleteLessonMutation()
    const [form] = Form.useForm<LessonCreate>();

    const router = useRouter();
    useEffect(() => {
        loadData()
    }, [filter.limit, filter.page, filter.sort])

    const loadData = async () => {
        let data: any = await getLessons({ id: props.id, query: filter }).unwrap()
        if (data.success) {
            setLessons(data.data)
        } else showMessage('error', data.message)
    }

    const changePagination = (page: number, limit: number) => {
        setFilter((prev) => {
            return {
                ...prev,
                page, limit
            }
        })
    }
    const changeSearch = (e) => {
        setFilter((prev) => {
            return {
                ...prev,
                search: e.target.value,
                page: 1
            }
        })
    }
    const handleSearch = () => {
        loadData()
    }

    const keyPress = (e) => {
        if (e.keyCode === 13) loadData()
    }

    const onChange: TableProps<LessonItem>['onChange'] = (pagination, filters, sorter: any, extra) => {
        if (extra.action === 'sort') {
            let sort = null
            if (sorter.order === 'ascend') sort = CommonModels.lessonOrder[`${sorter.field}AZ`]
            else if (sorter.order === 'descend') sort = CommonModels.lessonOrder[`${sorter.field}ZA`]
            setFilter((prev) => {
                return {
                    ...prev,
                    sort, page: 1
                }
            })
        }
    };

    //#region handle action
    const handleDelete = (id) => {
        showSwalModal('Xóa bài học', 'Bạn có chắn chắn muốn xóa bài học này?', 'question').then(async res => {
            if (res.isConfirmed === true) {
                try {
                    const result = await deleteLesson(id).unwrap()
                    if (result.success) {
                        showSwalMessage('Xóa bản ghi', 'Xóa bản ghi thành công', 'success')
                        loadData()
                    }
                    else showSwalMessage('Xóa bản ghi', result.message as string, 'error')
                } catch (err: any) {
                    showSwalMessage('Xóa bản ghi', err?.data.message as string, 'error')
                }
            }
        }).catch(err => console.log(err))
    }

    const handleEdit = (id) => {
        router.push(`/lessons/${id}`)
    }

    const handleCloseModal = () => {
        form.resetFields()
        setShowModel(false)
    }
    //#endregion

    const handleChangeImage = (url: string) => {
        form.setFieldValue('image', url)
    }
    const handleAddNewLesson = async (values: LessonCreate) => {
        values.courseId = props.id
        const result = await createLesson(values).unwrap()
        if (result.success) {
            setShowModel(false)
            form.resetFields()
            showSwalMessage('Thêm mới', 'Thêm mới bài học thành công', 'success')
            loadData()
        }
        else showSwalMessage('Thêm mới', 'Thêm mới bài học thất bại', 'error')
    }
    //#region upload image
    return (
        <ContentWrapper>
            <HeaderPageWrapper>
                <Col className="d-flex justify-start align-center" span={4}><h2 className="header-title">Bài học</h2></Col>
                <Col span={20} className="text-align-right">
                    <Input onKeyDown={keyPress} value={filter.search} onChange={changeSearch} className="my-2" style={{ width: 300 }} placeholder="Tìm kiếm theo tên bài học" />
                    <Select
                        defaultValue={'--'}
                        placeholder="Trạng thái"
                        className="my-2 text-align-left"
                        style={{ width: 150 }}
                        onChange={(value) => setFilter((prev: any) => { return { ...prev, active: value === '--' ? null : value, page: 1 } })}
                        options={StatusOption}
                    />
                    <Button onClick={handleSearch} className="bg-green my-2" icon={<SearchOutlined />}>Tìm kiếm</Button>
                    <Button onClick={() => setShowModel(true)} className="bg-insert my-2" icon={<SearchOutlined />}>Thêm mới</Button>
                </Col>
            </HeaderPageWrapper>
            <Table
                showSorterTooltip={false}
                rowKey={'id'}
                columns={columns}
                dataSource={lessons.items}
                loading={isLoading || isLoadingDelete}
                onChange={onChange}
                scroll={{ x: 1500 }}
                pagination={{ total: lessons.totalRecord, showSizeChanger: true, onChange: changePagination, showTotal: () => `Tổng số: ${lessons.totalRecord}` }}
            />
            <Modal
                title="Tạo bài học"
                open={showModel}
                onCancel={handleCloseModal}
                footer={null}
                maskClosable={false}
            >
                <Form
                    labelAlign='left'
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    name="nest-messages"
                    onFinish={handleAddNewLesson}
                    initialValues={{ active: true, prior: 1 }}
                    style={{ maxWidth: 600 }}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Form.Item name="name" label="Tên bài học" rules={[{ required: true, type: 'string' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="author" label="Tác giả">
                        <Input />
                    </Form.Item>
                    <Form.Item name="prior" label="Độ ưu tiên" rules={[{ required: true }]}>
                        <Input value={1} type="number" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="image" label="Hình ảnh">
                                <UploadImage oldImage="" type={2} handleChangeImage={handleChangeImage} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="active" label="Trạng thái">
                                <Switch defaultChecked={true} onChange={(e) => { form.setFieldValue('active', e) }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button loading={isLoadingCreate} className="bg-green" style={{ marginTop: '1rem' }} htmlType="submit">
                        Lưu
                    </Button>
                </Form>
            </Modal>
        </ContentWrapper>

    )
}
export default LessonsComponent