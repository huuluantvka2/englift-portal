"use client"
import UpdateEditIcon from "@/components/updateEditIcon";
import UploadImage from "@/components/uploadImage";
import { PaginationData } from "@/model/common";
import { CommonModels } from "@/model/constants";
import { WordCreate, WordItem, WordUpdate } from "@/model/word";
import { useCreateWordMutation, useDeleteWordMutation, useGetWordsMutation, useUpdateWordByIdMutation } from "@/redux/services/wordApi";
import { ActiveStatus, ContentWrapper, HeaderPageWrapper } from "@/styles/UI/styled";
import { StatusOption } from "@/utils/common";
import { BASE_URL } from "@/utils/constants";
import { formatDateString, showSwalMessage, showSwalModal } from "@/utils/func";
import { showMessage } from "@/utils/message";
import { validateMessages } from "@/utils/validate";
import { SearchOutlined, DownloadOutlined, ImportOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Modal, Row, Select, Switch, Table, Tooltip } from "antd";
import type { TableProps } from 'antd/es/table';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoImage from '../../public/image/noImage.png';
import SpeakerIcon from '../../public/icon/loudspeaker.svg'
import { getAccessToken } from "@/redux/services/commonService";
import Swal from "sweetalert2";
const WordsComponent = (props: { id?: string }) => {
    const columns: any = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: 130,
            render: (value: string) => {
                return (
                    <Tooltip placement="top" arrow={true} rootClassName="custom-toolip-inner" title={<img width={250} src={value ? (BASE_URL + value) : NoImage.src} alt="avatar" />}>
                        <Avatar size={"large"} src={<img src={value ? (BASE_URL + value) : NoImage.src} alt="avatar" />} />
                    </Tooltip>)
            }
        },
        {
            title: 'Từ vựng',
            dataIndex: 'content',
            sorter: true,
            width: 130,
            render: (value: string, record) => <b className="text-blue"><a onClick={() => handleEdit(record.id)}>{value}</a></b>,
        },
        {
            title: 'Âm thanh',
            dataIndex: 'audio',
            width: 170,
            render: (value: string) => {
                return (
                    value && <img onClick={() => handlePlayMP3(value)} className="pointer" src={SpeakerIcon.src} />
                )
            }
        },
        {
            title: 'Dịch nghĩa',
            dataIndex: 'trans',
            sorter: true,
            width: 170,
        },
        {
            title: 'Phiên âm',
            dataIndex: 'phonetic',
            width: 150,
        },
        {
            title: 'Loại từ',
            dataIndex: 'position',
            width: 170,
        },
        {
            title: 'Ví dụ',
            dataIndex: 'example',
            width: 300,
        },
        {
            title: 'Hán Hàn',
            dataIndex: 'china',
            width: 300,
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
                <UpdateEditIcon hideDelete={props.id ? false : true} handleDelete={() => handleDelete(record.id)} handleEdit={() => handleEdit(record.id)} />
            ),
        },
    ];
    const [words, setWords] = useState<PaginationData<WordItem>>({ items: [], totalRecord: 0 })
    const [filter, setFilter] = useState({
        limit: 10,
        page: 1,
        search: "",
        sort: null,
        active: null,
        lessonId: props.id
    })
    const [showModel, setShowModel] = useState<boolean>(false)
    const [getWords, { isLoading }] = useGetWordsMutation()
    const [createWord, { isLoading: isLoadingCreate }] = useCreateWordMutation()
    const [updateWord, { isLoading: isLoadingUpdate }] = useUpdateWordByIdMutation()
    const [deleteWord, { isLoading: isLoadingDelete }] = useDeleteWordMutation()
    const [form] = Form.useForm<WordCreate | WordUpdate>();

    const router = useRouter();
    useEffect(() => {
        loadData()
    }, [filter.limit, filter.page, filter.sort])

    const loadData = async () => {
        let data: any = await getWords(filter).unwrap()
        if (data.success) {
            setWords(data.data)
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

    const onChange: TableProps<WordItem>['onChange'] = (pagination, filters, sorter: any, extra) => {
        if (extra.action === 'sort') {
            let sort = null
            if (sorter.order === 'ascend') sort = CommonModels.wordOrder[`${sorter.field}AZ`]
            else if (sorter.order === 'descend') sort = CommonModels.wordOrder[`${sorter.field}ZA`]
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
        showSwalModal('Xóa từ vựng', 'Bạn có chắn chắn muốn xóa từ vựng này?', 'question').then(async res => {
            if (res.isConfirmed === true) {
                try {
                    const result = await deleteWord({ id, lessonId: props.id as string }).unwrap()
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
        const wordRecord = words.items.find(x => x.id === id)
        form.setFieldsValue({
            id,
            active: wordRecord?.active,
            content: wordRecord?.content,
            example: wordRecord?.example,
            image: wordRecord?.image,
            phonetic: wordRecord?.phonetic,
            position: wordRecord?.position,
            trans: wordRecord?.trans,
            china:wordRecord?.china
        })
        setShowModel(true)
    }

    const handleCloseModal = () => {
        form.resetFields()
        setShowModel(false)
    }
    //#endregion

    const handleChangeImage = (url: string) => {
        form.setFieldValue('image', url)
    }
    const handleUpdateOrAdd = async (values: WordCreate | WordUpdate) => {
        let data: any = values;
        const isUpate: boolean = form.getFieldValue("id") ? true : false
        if (!isUpate) {
            data.lessonId = props.id
        }
        const result = (isUpate ? await updateWord({ id: form.getFieldValue("id"), data }).unwrap() : await createWord(data).unwrap())
        if (result.success) {
            setShowModel(false)
            form.resetFields()
            showSwalMessage(isUpate ? 'Cập nhật' : 'Thêm mới', isUpate ? 'Cập nhật từ vựng thành công' : 'Thêm mới từ vựng thành công', 'success')
            loadData()
        }
        else showSwalMessage(isUpate ? 'Cập nhật' : 'Thêm mới', isUpate ? 'Cập nhật từ vựng thất bại' : 'Thêm mới từ vựng thất bại', 'error')
    }

    const handlePlayMP3 = (mp3) => {
        let audio = new Audio(mp3)
        audio.play()
    }
    const handleDownloadExcel = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${getAccessToken()}`);
        myHeaders.append("Content-Type", `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            responseType: 'blob'
        };

        fetch(`${BASE_URL}Api/v1/Words/Admin/TempleteImport`, requestOptions)
            .then(response => response.blob())
            .then(result => { downloadExcel(result) }).catch(error => showSwalMessage('Lỗi tải file', 'Xảy ra lỗi khi tải file excel', 'error'));
    }

    const handleClickImport = () => {
        document.getElementById('import-word')?.click()
    }
    const handleUpload = (e) => {
        const file = e.target.files[0];
        showSwalModal('Nhập tệp', 'Bạn có muốn nhập tệp này không', 'question').then(async res => {
            if (res.isConfirmed) {
                Swal.fire({
                    title: 'Vui Lòng chờ...',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    icon: 'info',
                    didOpen: async () => {
                        try {
                            Swal.showLoading()
                            const myHeaders = new Headers();
                            myHeaders.append("Authorization", `Bearer ${getAccessToken()}`);

                            var formdata = new FormData();

                            formdata.append("file", file, file.name);

                            var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: formdata,
                            };
                            fetch(`${BASE_URL}Api/v1/Words/Admin/Import`, requestOptions)
                                .then(response => {
                                    if (response.status === 400) return response.json()
                                    else return response.blob()
                                })
                                .then(result => {
                                    if (result?.statusCode) {
                                        showSwalMessage('Lỗi nhập tệp', result.message, 'error')
                                    } else {
                                        showSwalMessage('Thành công', 'Nhập tệp thành công, vui lòng xong chi tiết ở file excel, từ vựng sẽ được đồng bộ vào hệ thống (có thể mất đến vài phút)', 'success')
                                        downloadExcel(result)
                                    }
                                    Swal.hideLoading()
                                })
                                .catch(error => showSwalMessage('Lỗi tải file', 'Xảy ra lỗi khi tải file excel', 'error'));
                            // const result = await updateCourseById({ id: params.id, data: values }).unwrap()
                            // if (result.success) {
                            //     showSwalMessage('Thành công', 'Cập nhật thành công', 'success')
                            // } else showSwalMessage('Thất bại', result.message as string, 'error')

                        } catch (err: any) {
                            showSwalMessage('Thất bại', err.message, 'error')
                        }
                    }
                }).then
            }
        })

    }

    const downloadExcel = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'words.xlsx';
        link.click();
        URL.revokeObjectURL(url);
    }
    //#region upload image
    return (
        <ContentWrapper>
            <HeaderPageWrapper>
                <Col className="d-flex justify-start align-center" span={4}><h2 className="header-title">Từ vựng</h2></Col>
                <Col span={20} className="text-align-right">
                    <Input onKeyDown={keyPress} value={filter.search} onChange={changeSearch} className="my-2" style={{ width: 300 }} placeholder="Tìm kiếm theo tên từ vựng" />
                    <Select
                        defaultValue={'--'}
                        placeholder="Trạng thái"
                        className="my-2 text-align-left"
                        style={{ width: 150 }}
                        onChange={(value) => setFilter((prev: any) => { return { ...prev, active: value === '--' ? null : value, page: 1 } })}
                        options={StatusOption}
                    />
                    <input onChange={handleUpload} id="import-word" className="hidden" type="file" accept=".xlsx, .xls" />
                    <Button onClick={handleSearch} className="bg-green my-2" icon={<SearchOutlined />}>Tìm kiếm</Button>
                    <Button onClick={handleClickImport} className="bg-blue-gradient my-2" ghost icon={<ImportOutlined />}>Nhập Excel</Button>
                    <Button onClick={handleDownloadExcel} className="my-2" type="primary" ghost icon={<DownloadOutlined />}>Tải mẫu Excel</Button>
                    {props.id && <Button onClick={() => setShowModel(true)} className="bg-insert my-2" icon={<SearchOutlined />}>Thêm mới</Button>}
                </Col>
            </HeaderPageWrapper>
            <Table
                showSorterTooltip={false}
                rowKey={'id'}
                columns={columns}
                dataSource={words.items}
                loading={isLoading}
                onChange={onChange}
                scroll={{ x: 1800 }}
                pagination={{ total: words.totalRecord, showSizeChanger: true, onChange: changePagination, showTotal: () => `Tổng số: ${words.totalRecord}` }}
            />
            <Modal
                title={form.getFieldValue('id') ? 'Sửa từ vựng' : 'Tạo từ vựng'}
                open={showModel}
                onCancel={handleCloseModal}
                footer={null}
                maskClosable={false}
            >
                {showModel && (<Form
                    labelAlign='left'
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    name="nest-messages"
                    onFinish={handleUpdateOrAdd}
                    initialValues={{ active: true }}
                    style={{ maxWidth: 650 }}
                    form={form}
                    validateMessages={validateMessages}
                >

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="content" label="Từ vựng" rules={[{ required: true, type: 'string' }]}>
                                <Input placeholder="Nhập từ vựng" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="trans" label="Dịch nghĩa" rules={[{ required: true, type: 'string' }]}>
                                <Input placeholder="Nhập dịch nghĩa" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="example" label="Ví dụ" rules={[{ required: true, type: 'string' }]}>
                                <Input placeholder="Nhập ví dụ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phonetic" label="Phiên âm" rules={[{ required: false, type: 'string' }]}>
                                <Input placeholder="Nhập phiên âm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="position" label="Loại từ" rules={[{ required: false, type: 'string' }]}>
                                <Input placeholder="Nhập loại từ" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="china" label="Hán Hàn" rules={[{ required: false, type: 'string' }]}>
                                <Input placeholder="Nhập hán hàn" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="image" label="Hình ảnh">
                                <UploadImage oldImage={form.getFieldValue('id') ? form.getFieldValue("image") : ""} type={3} handleChangeImage={handleChangeImage} />
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
                </Form>)}
            </Modal>
        </ContentWrapper>

    )
}
export default WordsComponent