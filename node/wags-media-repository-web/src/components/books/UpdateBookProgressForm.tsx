import { useEffect, useState } from 'react';
import {
    Alert,
    Col,
    Form,
    InputNumber,
    Modal,
    ModalProps,
    Progress,
    Row,
    Spin,
} from 'antd';

import calculateProgress from '@lib/calculateProgress';
import { Api } from '@lib/api';

import { Book } from '@models/Book';

interface UpdateBookProgressFormProps extends ModalProps {
    book?: Book;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    pageNumber: number;
}

const UpdateBookProgressForm = ({
    book,
    open,
    onClose,
    onSaved,
}: UpdateBookProgressFormProps): JSX.Element => {
    const [bookProgress, setBookProgress] = useState<number>(calculateProgress(book?.currentPage, book?.pageCount));
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const [form] = Form.useForm<FormValues>();

    useEffect(() => {
        setBookProgress(calculateProgress(book?.currentPage, book?.pageCount));
    }, [book]);

    const saveProgress = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const [, error] = await Api.Put(`book/update-progress/${book?.bookId}`, {
            data: {
                currentPage: values.pageNumber
            },
        });

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
            maskClosable={false}
            open={open}
            onOk={() => form.submit()}
            onCancel={() => onClose()}
            okText="Save"
            cancelText="Cancel"
            forceRender
            title="Update Progress"
            afterOpenChange={(open) => {
                if (open) {
                    if (book) {
                        form.setFieldsValue({
                            pageNumber: book.currentPage,
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
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <img
                        src={book?.coverImageUrl}
                        alt={`${book?.fullTitle} by ${book?.author}`}
                        width={150}
                        height={225}
                    />
                </Col>
                <Col xs={24} md={16}>
                    <Spin spinning={processingMessage !== ''} tip={processingMessage}>
                        {formError !== '' ? <Alert type="error" message={formError} /> : null}
                        <Form
                            form={form}
                            onFinish={saveProgress}
                            layout="vertical"
                            onValuesChange={(changedValues: Partial<FormValues>) => {
                                if (changedValues.pageNumber) {
                                    setBookProgress(calculateProgress(changedValues.pageNumber, book?.pageCount))
                                }
                            }}
                            initialValues={{
                                pageNumber: 1,
                            }}
                        >
                            <Form.Item
                                name="pageNumber"
                                label="Current Page"
                                required
                            >
                                <InputNumber placeholder="Enter Current Page" />
                            </Form.Item>

                            <Row justify="center">
                                <Progress
                                    type="circle"
                                    percent={bookProgress}
                                    size={80}
                                />
                            </Row>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Modal>
    );
};

export default UpdateBookProgressForm;
