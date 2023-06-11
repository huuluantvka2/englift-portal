import { message } from "antd";

export const showMessage = (type: 'success' | 'error' | 'warning', content, duration: number = 2) => {
    message[type](content, duration);
};
