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
import { Color } from 'antd/es/color-picker';

import { Api } from '@lib/api';

import { PodcastCategory } from '@models/Podcast';

interface PodcastCategoryFormProps extends ModalProps {
    podcastCategory?: PodcastCategory;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    colorCode: string | Color;
}

const PodcastCategoryForm = ({
    podcastCategory,
    open,
    onSaved,
    onClose,
}: PodcastCategoryFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const [form] = Form.useForm<FormValues>();

    const addPodcastCategory = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Post('podcasts/categories', {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const updatePodcastCategory = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Put(`podcasts/categories/${podcastCategory?.podcastCategoryId}`, {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const savePodcast = async ({ name, colorCode }: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const color = typeof colorCode === 'string' ? colorCode : colorCode.toHexString();

        const error = podcastCategory
            ? await updatePodcastCategory(name, color)
            : await addPodcastCategory(name, color);

        if (error) {
            setFormError(error);
            setProcessingMessage('');
            return;
        }

        onSaved();
    };

    return (
        <Modal
            destroyOnClose
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText={podcastCategory ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={podcastCategory ? 'Edit Podcast Category' : 'Add Podcast Category'}
            afterOpenChange={(open) => {
                if (open) {
                    if (podcastCategory) {
                        form.setFieldsValue({
                            name: podcastCategory.name,
                            colorCode: podcastCategory.colorCode,
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

                <Form form={form} onFinish={savePodcast}>
                    <Form.Item
                        name="name"
                        label="Name"
                        required
                    >
                        <Input />
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

export default PodcastCategoryForm;
