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

import { BookGenre } from '@models/Book';

const { useForm } = Form;

interface BookGenreFormProps extends ModalProps {
    genre?: BookGenre;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    colorCode: string | Color;
}

const BookGenreForm = ({
    genre,
    open,
    onSaved,
    onClose,
}: BookGenreFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const queryClient = useQueryClient();

    const [form] = useForm<FormValues>();

    const addGenre = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Post('book/genre', {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const updateGenre = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Put(`book/genre/${genre?.bookGenreId}`, {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const saveGenre = async ({ name, colorCode }: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const color = typeof colorCode === 'string' ? colorCode : colorCode.toHexString();

        const error = genre
            ? await updateGenre(name, color)
            : await addGenre(name, color);

        if (error) {
            setFormError(error);
            setProcessingMessage('');
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['book-genres'] });

        onSaved();
    };

    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText={genre ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={genre ? 'Edit Genre' : 'Add Genre'}
            afterOpenChange={(open) => {
                if (open) {
                    if (genre) {
                        form.setFieldsValue({
                            name: genre.name,
                            colorCode: genre.colorCode,
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

                <Form form={form} onFinish={saveGenre}>
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

export default BookGenreForm;
