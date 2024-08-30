import { ReactNode } from 'react';
import { Popconfirm } from 'antd';
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined';

type ConfirmationProps = {
    text: ReactNode | string;
    yesButton?: string;
    noButton?: string;
    children: ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
}

const Confirmation = ({
    text,
    children,
    onConfirm,
    yesButton = 'Yes',
    noButton = 'No',
    onCancel,
}: ConfirmationProps): JSX.Element => (
    <Popconfirm
        title={text}
        icon={<ExclamationCircleOutlined className="ant-error" />}
        okText={yesButton}
        okButtonProps={{
            danger: true,
        }}
        cancelText={noButton}
        cancelButtonProps={{
            danger: true,
        }}
        onConfirm={onConfirm}
        onCancel={onCancel}
    >
        {children}
    </Popconfirm>
);

export default Confirmation;
