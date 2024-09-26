import { useState } from 'react';
import {
    Alert,
    ColorPicker,
    Form,
    Input,
    Modal,
    ModalProps,
    Spin,
} from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { Color } from 'antd/es/color-picker';

import { Api } from '@lib/api';

import { LinkCategory } from '@models/Link';

const { useForm } = Form;

interface LinkCategoryFormProps extends ModalProps {
    linkCategory?: LinkCategory;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    colorCode: string | Color;
}

const LinkCategoryForm = ({
    linkCategory,
    open,
    onSaved,
    onClose,
}: LinkCategoryFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const queryClient = useQueryClient();

    const [form] = useForm<FormValues>();

    const addLinkCategory = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Post('link/category', {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const updateLinkCategory = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Put(`link/category/${linkCategory?.linkCategoryId}`, {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const saveLink = async ({ name, colorCode }: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const color = typeof colorCode === 'string' ? colorCode : colorCode.toHexString();

        const error = linkCategory
            ? await updateLinkCategory(name, color)
            : await addLinkCategory(name, color);

        if (error) {
            setFormError(error);
            setProcessingMessage('');
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['link-categories'] });

        onSaved();
    };

    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText={linkCategory ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={linkCategory ? 'Edit Link Category' : 'Add Link Category'}
            afterOpenChange={(open) => {
                if (open) {
                    if (linkCategory) {
                        form.setFieldsValue({
                            name: linkCategory.name,
                            colorCode: linkCategory.colorCode,
                        });
                    }

                    setProcessingMessage('');
                } else {
                    form.resetFields();
                    setFormError('');
                    setProcessingMessage('Loading...');
                }
            }}
        >
            <Spin spinning={processingMessage !== ''} tip={processingMessage}>
                {formError !== '' ? <Alert type="error" message={formError} /> : null}

                <Form form={form} onFinish={saveLink}>
                    <Form.Item
                        name="name"
                        label="Name"
                        required
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>

                    <Form.Item
                        name="colorCode"
                        label="Color"
                        required
                    >
                        <ColorPicker format="hex" showText />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default LinkCategoryForm;
