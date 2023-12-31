"use client"
import UpdateEditIcon from "@/components/updateEditIcon";
import UploadImage from "@/components/uploadImage";
import { PaginationData } from "@/model/common";
import { CommonModels } from "@/model/constants";
import { CourseCreateUpdate, CourseItem } from "@/model/course";
import { useCreateCourseMutation, useDeleteCourseMutation, useGetCoursesMutation } from "@/redux/services/courseApi";
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
import NoImage from '../../../public/image/noImage.png';
const Course = () => {
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
            title: 'Tên khóa học',
            dataIndex: 'name',
            sorter: true,
            width: 300,
            render: (value: string, record) => <b className="text-blue"><a onClick={() => handleEdit(record.id)}>{value}</a></b>,
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'prior',
            sorter: true,
            width: 150,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 300,
        },
        {
            title: 'Tổng bài học',
            dataIndex: 'totalLesson',
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
    const [courses, setCourses] = useState<PaginationData<CourseItem>>({ items: [], totalRecord: 0 })
    const [filter, setFilter] = useState({
        limit: 10,
        page: 1,
        search: "",
        sort: null,
        active: null,
    })
    const [showModel, setShowModel] = useState<boolean>(false)
    const [getCourses, { isLoading }] = useGetCoursesMutation()
    const [createCourse, { isLoading: isLoadingCreate }] = useCreateCourseMutation()
    const [deleteCourse, { isLoading: isLoadingDelete }] = useDeleteCourseMutation()
    const [form] = Form.useForm();

    const router = useRouter();
    useEffect(() => {
        loadData()
    }, [filter.limit, filter.page, filter.sort])

    const loadData = async () => {
        console.log(filter)
        let data: any = await getCourses(filter).unwrap()
        if (data.success) {
            setCourses(data.data)
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

    const onChange: TableProps<CourseItem>['onChange'] = (pagination, filters, sorter: any, extra) => {
        if (extra.action === 'sort') {
            let sort = null
            if (sorter.order === 'ascend') sort = CommonModels.courseOrder[`${sorter.field}AZ`]
            else if (sorter.order === 'descend') sort = CommonModels.courseOrder[`${sorter.field}ZA`]
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
        showSwalModal('Xóa khóa học', 'Bạn có chắn chắn muốn xóa khóa học này?', 'question').then(async res => {
            if (res.isConfirmed === true) {
                try {
                    const result = await deleteCourse(id).unwrap()
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
        router.push(`/courses/${id}`)
    }

    const handleCloseModal = () => {
        form.resetFields()
        setShowModel(false)
    }
    //#endregion

    const handleChangeImage = (url: string) => {
        form.setFieldValue('image', url)
    }
    const handleAddNewCourse = async (values: CourseCreateUpdate) => {
        const result = await createCourse(values).unwrap()
        if (result.success) {
            setShowModel(false)
            form.resetFields()
            showSwalMessage('Thêm mới', 'Thêm mới khóa học thành công', 'success')
            loadData()
        }
        else showSwalMessage('Thêm mới', 'Thêm mới khóa học thất bại', 'error')
    }
    //#region upload image
    return (
        <ContentWrapper>
            <HeaderPageWrapper>
                <Col className="d-flex justify-start align-center" span={4}><h2 className="header-title">Khóa học</h2></Col>
                <Col span={20} className="text-align-right">
                    <Input onKeyDown={keyPress} value={filter.search} onChange={changeSearch} className="my-2" style={{ width: 300 }} placeholder="Tìm kiếm theo tên khóa học" />
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
                dataSource={courses.items}
                loading={isLoading || isLoadingDelete}
                onChange={onChange}
                scroll={{ x: 1200 }}
                pagination={{ total: courses.totalRecord, showSizeChanger: true, onChange: changePagination, showTotal: () => `Tổng số: ${courses.totalRecord}` }}
            />
            <Modal
                title="Tạo khóa học"
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
                    onFinish={handleAddNewCourse}
                    initialValues={{ active: true, prior: 1 }}
                    style={{ maxWidth: 600 }}
                    form={form}
                    validateMessages={validateMessages}
                >
                    <Form.Item name="name" label="Tên khóa học" rules={[{ required: true, type: 'string' }]}>
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
                                <UploadImage oldImage="" type={1} handleChangeImage={handleChangeImage} />
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
export default Course