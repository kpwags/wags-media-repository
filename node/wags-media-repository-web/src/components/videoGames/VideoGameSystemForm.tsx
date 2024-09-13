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

import { VideoGameSystem } from '@models/VideoGame';

const { useForm } = Form;

interface VideoGameSystemFormProps extends ModalProps {
    system?: VideoGameSystem;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    colorCode: string | Color;
}

const VideoGameSystemForm = ({
    system,
    open,
    onSaved,
    onClose,
}: VideoGameSystemFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const queryClient = useQueryClient();

    const [form] = useForm<FormValues>();

    const addSystem = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Post('video-game/system', {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const updateSystem = async (name: string, color: string): Promise<string | null> => {
        const [, error] = await Api.Put(`video-game/system/${system?.videoGameSystemId}`, {
            data: {
                name,
                colorCode: color,
            }
        });

        return error;
    };

    const saveSystem = async ({ name, colorCode }: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const color = typeof colorCode === 'string' ? colorCode : colorCode.toHexString();

        const error = system
            ? await updateSystem(name, color)
            : await addSystem(name, color);

        if (error) {
            setFormError(error);
            setProcessingMessage('');
            return;
        }

        queryClient.invalidateQueries({ queryKey: ['video-game-systems'] });

        onSaved();
    };

    return (
        <Modal
            destroyOnClose
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText={system ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={system ? 'Edit System' : 'Add System'}
            afterOpenChange={(open) => {
                if (open) {
                    if (system) {
                        form.setFieldsValue({
                            name: system.name,
                            colorCode: system.colorCode,
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

                <Form form={form} onFinish={saveSystem}>
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

export default VideoGameSystemForm;
