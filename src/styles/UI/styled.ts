import { Row } from "antd";
import styled from "styled-components";

export const UpdateEditIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    svg{
        margin:0 4px;
        cursor:pointer;
    }
`
export const ActiveStatus = styled.span`
    padding: 8px 16px;
    color: #ffffff;
    border-radius: 12px;
    white-space:nowrap !important;
`
export const HeaderPageWrapper = styled(Row)`
    padding-bottom: 20px;
`
export const ContentWrapper = styled.div`
    min-height:360px;
    padding:24px;
    margin-top:24px;
    background-color:#ffffff;
`