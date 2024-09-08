import { useState } from 'react';
import {
    Alert,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    ModalProps,
    Select,
    Spin,
} from 'antd';
import dayjs from 'dayjs';

import useLinkCategories from '@hooks/useLinkCategories';

import { Api } from '@lib/api';

import { Link } from '@models/Link';

interface LinkFormProps extends ModalProps {
    link?: Link;
    currentIssueNumber?: number;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    title: string;
    author: string;
    url: string;
    linkDate: Date;
    readingLogIssueNumber: number;
    linkTypeId: number;
    linkCategoryId: number;
}

const LinkForm = ({
    link,
    currentIssueNumber,
    open,
    onSaved,
    onClose,
}: LinkFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const { linkCategories, isLoading, error } = useLinkCategories();

    const loadingMessage = isLoading ? 'Loading...' : processingMessage;
    const errorMessage = error ? error.message : formError;

    const [form] = Form.useForm<FormValues>();

    const addLink = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('link', {
            data: {
                linkTypeId: values.linkTypeId,
                linkCategoryId: values.linkCategoryId,
                title: values.title,
                author: values.author,
                url: values.url,
                linkDate: values.linkDate,
                readingLogIssueNumber: values.readingLogIssueNumber,
            }
        });

        return error;
    };

    const updateLink = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`link/${link?.linkId}`, {
            data: {
                linkTypeId: values.linkTypeId,
                linkCategoryId: values.linkCategoryId,
                title: values.title,
                author: values.author,
                url: values.url,
                linkDate: values.linkDate,
                readingLogIssueNumber: values.readingLogIssueNumber,
            }
        });

        return error;
    };

    const saveLink = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = link
            ? await updateLink(values)
            : await addLink(values);

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
            okText={link ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={link ? 'Edit Link' : 'Add Link'}
            afterOpenChange={(open) => {
                if (open) {
                    if (link) {
                        form.setFieldsValue({
                            linkTypeId: link.linkTypeId,
                            linkCategoryId: link.linkCategoryId,
                            title: link.title,
                            author: link.author,
                            url: link.url,
                            linkDate: dayjs(link.linkDate),
                            readingLogIssueNumber: link.readingLogIssueNumber,
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
                    onFinish={saveLink}
                    layout="vertical"
                    initialValues={{
                        linkDate: dayjs(),
                        readingLogIssueNumber: currentIssueNumber,
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        required
                    >
                        <Input placeholder="Enter Title" />
                    </Form.Item>

                    <Form.Item
                        name="author"
                        label="Author"
                        required
                    >
                        <Input placeholder="Enter Author" />
                    </Form.Item>

                    <Form.Item
                        name="url"
                        label="URL"
                        required
                    >
                        <Input placeholder="Enter URL" />
                    </Form.Item>

                    <Form.Item
                        name="linkDate"
                        label="Date"
                        required
                    >
                        <DatePicker placeholder="Enter Date" format="M/D/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="readingLogIssueNumber"
                        label="Issue #"
                        required
                    >
                        <InputNumber placeholder="Enter Issue Number" />
                    </Form.Item>

                    <Form.Item
                        name="linkTypeId"
                        label="Type"
                        required
                    >
                        <Select
                            placeholder="Select Type"
                            options={[
                                { label: 'Link', value: 1 },
                                { label: 'Podcast', value: 2 },
                                { label: 'Video', value: 3 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="linkCategoryId"
                        label="Category"
                        required
                    >
                        <Select
                            placeholder="Select Category"
                            options={(linkCategories ?? []).map((lc) => ({ key: lc.linkCategoryId, label: lc.name, value: lc.linkCategoryId }))} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default LinkForm;
