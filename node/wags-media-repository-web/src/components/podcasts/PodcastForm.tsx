import { useState } from 'react';
import {
    Alert,
    Select,
    Form,
    Input,
    Modal,
    ModalProps,
    Spin,
} from 'antd';

import usePodcastCategories from '@hooks/usePodcastCategories';

import { Api } from '@lib/api';

import { Podcast } from '@models/Podcast';

interface PodcastFormProps extends ModalProps {
    podcast?: Podcast;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    name: string;
    link: string;
    coverImageUrl: string;
    podcastCategoryId: number;
}

const PodcastForm = ({
    podcast,
    open,
    onSaved,
    onClose,
}: PodcastFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const { podcastCategories, isLoading, error } = usePodcastCategories();

    const loadingMessage = isLoading ? 'Loading...' : processingMessage;
    const errorMessage = error ? error.message : formError;

    const [form] = Form.useForm<FormValues>();

    const addPodcast = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('podcasts', {
            data: {
                name: values.name,
                link: values.link,
                coverImageUrl: values.coverImageUrl,
                podcastCategoryId: values.podcastCategoryId,
            }
        });

        return error;
    };

    const updatePodcast = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`podcasts/${podcast?.podcastId}`, {
            data: {
                name: values.name,
                link: values.link,
                coverImageUrl: values.coverImageUrl,
                podcastCategoryId: values.podcastCategoryId,
            }
        });

        return error;
    };

    const savePodcast = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = podcast
            ? await updatePodcast(values)
            : await addPodcast(values);

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
            okText={podcast ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={podcast ? 'Edit Podcast' : 'Add Podcast'}
            afterOpenChange={(open) => {
                if (open) {
                    if (podcast) {
                        form.setFieldsValue({
                            name: podcast.name,
                            link: podcast.link,
                            coverImageUrl: podcast.coverImageUrl,
                            podcastCategoryId: podcast.podcastCategoryId,
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
            <Spin spinning={loadingMessage !== ''} tip={loadingMessage}>
                {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                <Form
                    form={form}
                    onFinish={savePodcast}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        required
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>

                    <Form.Item
                        name="podcastCategoryId"
                        label="Category"
                        required
                    >
                        <Select
                            placeholder="Select Category"
                            options={(podcastCategories ?? []).map((pc) => ({ key: pc.podcastCategoryId, label: pc.name, value: pc.podcastCategoryId }))} />
                    </Form.Item>

                    <Form.Item
                        name="link"
                        label="Link"
                        required
                    >
                        <Input placeholder="Enter Podcast URL" />
                    </Form.Item>

                    <Form.Item
                        name="coverImageUrl"
                        label="Image URL"
                        required
                    >
                        <Input placeholder="Enter Image URL" />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default PodcastForm;
