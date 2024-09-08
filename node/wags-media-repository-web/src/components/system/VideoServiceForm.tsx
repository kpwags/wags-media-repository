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

import { VideoService } from '@models/System';

const { useForm } = Form;

interface VideoServiceFormProps extends ModalProps {
    videoService?: VideoService;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    colorCode: string | Color;
}

const VideoServiceForm = ({
    videoService,
    open,
    onSaved,
    onClose,
}: VideoServiceFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const queryClient = useQueryClient();

    const [form] = useForm<FormValues>();

    const addVideoService = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Post('system/video-service', {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const updateVideoService = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Put(`system/video-service/${videoService?.videoServiceId}`, {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const saveVideoService = async ({ name, colorCode }: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const color = typeof colorCode === 'string' ? colorCode : colorCode.toHexString();

        const error = videoService
            ? await updateVideoService(name, color)
            : await addVideoService(name, color);

        if (error) {
            setFormError(error);
            setProcessingMessage('');
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['video-services'] });

        onSaved();
    };

    return (
        <Modal
            destroyOnClose
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText={videoService ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={videoService ? 'Edit Video Service' : 'Add Video Service'}
            afterOpenChange={(open) => {
                if (open) {
                    if (videoService) {
                        form.setFieldsValue({
                            name: videoService.name,
                            colorCode: videoService.colorCode,
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

                <Form form={form} onFinish={saveVideoService}>
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

export default VideoServiceForm;
