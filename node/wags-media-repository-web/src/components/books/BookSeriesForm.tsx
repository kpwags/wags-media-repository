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

import { BookSeries } from '@models/Book';

const { useForm } = Form;

interface BookSeriesFormProps extends ModalProps {
    series?: BookSeries;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    colorCode: string | Color;
}

const BookSeriesForm = ({
    series,
    open,
    onSaved,
    onClose,
}: BookSeriesFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const queryClient = useQueryClient();

    const [form] = useForm<FormValues>();

    const addSeries = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Post('book/series', {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const updateSeries = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Put(`book/series/${series?.bookSeriesId}`, {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const saveSeries = async ({ name, colorCode }: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const color = typeof colorCode === 'string' ? colorCode : colorCode.toHexString();

        const error = series
            ? await updateSeries(name, color)
            : await addSeries(name, color);

        if (error) {
            setFormError(error);
            setProcessingMessage('');
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['book-series'] });

        onSaved();
    };

    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText={series ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={series ? 'Edit Series' : 'Add Series'}
            afterOpenChange={(open) => {
                if (open) {
                    if (series) {
                        form.setFieldsValue({
                            name: series.name,
                            colorCode: series.colorCode,
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

                <Form form={form} onFinish={saveSeries}>
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

export default BookSeriesForm;
