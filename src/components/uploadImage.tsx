import { showSwalMessage } from "@/utils/func";
import { Upload } from "antd"
import { RcFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAccessToken } from "@/redux/services/commonService";
import { BASE_URL } from "@/utils/constants";
export interface PropsUploadImage {
    oldImage?: string,
    handleChangeImage: any,
    type: number
}

const UploadImage = (props: PropsUploadImage) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(props.oldImage || undefined);
    const [loading, setLoading] = useState(false);
    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            showSwalMessage('Lỗi upload ảnh', 'You can only upload JPG/PNG file!', 'error')
        }
        return isJpgOrPng;
    };
    useEffect(() => {
        setImageUrl(props.oldImage)
    }, [props.oldImage])
    const handleUpload = (e) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${getAccessToken()}`);

        var formdata = new FormData();
        formdata.append("file", e.file, e.file?.name);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };
        setLoading(true)
        fetch(`${BASE_URL}Api/v1/Files/Admin?type=${props.type}`, requestOptions)
            .then(response => response.text())
            .then(async result => {
                let data = JSON.parse(result)
                props.handleChangeImage(data?.data?.url)
                if (imageUrl) {
                    await fetch(`${BASE_URL}Api/v1/Files/Admin?path=${imageUrl}`, { method: 'DELETE', headers: myHeaders })
                }
                setImageUrl(data?.data?.url)
            })
            .catch(error => showSwalMessage('Lỗi upload ảnh', 'Xảy ra lỗi', 'error')).finally(() => setLoading(false));
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );
    return (
        <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
        >{imageUrl ? <img src={`${BASE_URL}${imageUrl}`} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    )
}
export default UploadImage