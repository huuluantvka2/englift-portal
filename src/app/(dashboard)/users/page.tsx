"use client"
import UpdateEditIcon from "@/components/updateEditIcon";
import { PaginationData } from "@/model/common";
import { CommonModels } from "@/model/constants";
import { UserItem } from "@/model/user";
import { useDeleteUserMutation, useGetUsersMutation } from "@/redux/services/userApi";
import { ActiveStatus, HeaderPageWrapper } from "@/styles/UI/styled";
import { RenderTypeLogin, StatusOption, TypeLoginOption } from "@/utils/common";
import { formatDateString, showSwalModal } from "@/utils/func";
import { showMessage } from "@/utils/message";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Select, Table } from "antd";
import type { TableProps } from 'antd/es/table';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const User = () => {
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            width: 250,
            fixed: true,
            render: (value: string, record) => <b className="text-blue"><a onClick={() => handleEdit(record.id)}>{value}</a></b>,
        },
        {
            title: 'Tên học viên',
            dataIndex: 'fullName',
            sorter: true,
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            width: 120
        },
        {
            title: 'Loại tài khoản',
            dataIndex: 'typeLogin',
            render: (value: number) => RenderTypeLogin(value),
            width: 150
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            width: 200,
            render: (value: boolean) => {
                console.log(value)
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
            width: 100,
            render: (value, record) => (
                <UpdateEditIcon handleDelete={() => handleDelete(record.id)} handleEdit={() => handleEdit(record.id)} />
            ),
        },
    ];

    const [users, setUsers] = useState<PaginationData<UserItem>>({ items: [], totalRecord: 0 })
    const [filter, setFilter] = useState({
        limit: 10,
        page: 1,
        search: "",
        sort: null,
        active: null,
        typeLogin: null
    })
    const [getUsers, { isLoading }] = useGetUsersMutation()
    const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation()

    const router = useRouter();
    useEffect(() => {
        loadData()
    }, [filter.limit, filter.page, filter.sort, filter.sort])

    const loadData = async () => {
        let data: any = await getUsers(filter).unwrap()
        if (data.success) {
            setUsers(data.data)
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

    const onChange: TableProps<UserItem>['onChange'] = (pagination, filters, sorter: any, extra) => {
        if (extra.action === 'sort') {
            let sort = null
            if (sorter.order === 'ascend') sort = CommonModels.userOrder[`${sorter.field}AZ`]
            else if (sorter.order === 'descend') sort = CommonModels.userOrder[`${sorter.field}ZA`]
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
        showSwalModal('Xóa người dùng', 'Bạn có chắn chắn muốn xóa người dùng này?', 'question').then(async res => {
            if (res.isConfirmed === true) {
                try {
                    const result = await deleteUser(id).unwrap()
                    if (result.success) {
                        showMessage('success', 'Xóa thành công')
                        loadData()
                    }
                    else showMessage('error', result.message)
                } catch (err: any) {
                    showMessage('error', err.message)
                }
            }
        }).catch(err => console.log(err))
    }

    const handleEdit = (id) => {
        router.push(`/users/${id}`)
    }

    //#endregion
    return (
        <>
            <HeaderPageWrapper>
                <Col className="d-flex justify-start align-center" span={4}><h2 className="header-title">Người dùng</h2></Col>
                <Col span={20} className="text-align-right">
                    <Input onKeyDown={keyPress} value={filter.search} onChange={changeSearch} className="my-2" style={{ width: 300 }} placeholder="Tìm kiếm theo email, tên người dùng..." />
                    <Select
                        defaultValue={'--'}
                        placeholder="Trạng thái"
                        className="my-2 text-align-left"
                        style={{ width: 150 }}
                        onChange={(value) => setFilter((prev: any) => { return { ...prev, active: value === '--' ? null : value, page: 1 } })}
                        options={StatusOption}
                    />
                    <Select
                        defaultValue={'--'}
                        placeholder="Loại tài khoản"
                        style={{ width: 170 }}
                        className="my-2 text-align-left"
                        onChange={(value) => setFilter((prev: any) => { return { ...prev, typeLogin: value === '--' ? null : value, page: 1 } })}
                        options={TypeLoginOption}
                    />
                    <Button onClick={handleSearch} className="bg-green" icon={<SearchOutlined />}>Tìm kiếm</Button>
                </Col>
            </HeaderPageWrapper>
            <Table
                showSorterTooltip={false}
                rowKey={'id'}
                columns={columns}
                dataSource={users.items}
                loading={isLoading || isLoadingDelete}
                onChange={onChange}
                scroll={{ x: 800 }}
                pagination={{ total: users.totalRecord, showSizeChanger: true, onChange: changePagination, showTotal: () => `Tổng số: ${users.totalRecord}` }}
            />
        </>
    )
}
export default User