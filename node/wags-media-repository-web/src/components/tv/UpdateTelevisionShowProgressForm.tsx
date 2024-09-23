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

import { TelevisionShow } from '@models/Tv';

interface UpdateTelevisionShowProgressFormProps extends ModalProps {
    tvShow?: TelevisionShow;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    currentSeasonEpisode: number;
}

const UpdateTelevisionShowProgressForm = ({
    tvShow,
    open,
    onClose,
    onSaved,
}: UpdateTelevisionShowProgressFormProps): JSX.Element => {
    const [showProgress, setShowProgress] = useState<number>(calculateProgress(tvShow?.currentSeasonEpisode, tvShow?.seasonEpisodeCount));
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const [form] = Form.useForm<FormValues>();

    useEffect(() => {
        setShowProgress(calculateProgress(tvShow?.currentSeasonEpisode, tvShow?.seasonEpisodeCount));
    }, [tvShow]);

    const saveProgress = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const [, error] = await Api.Put(`tv/update-progress/${tvShow?.televisionShowId}`, {
            data: {
                currentSeasonEpisode: values.currentSeasonEpisode,
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
                    if (tvShow) {
                        form.setFieldsValue({
                            currentSeasonEpisode: tvShow.currentSeasonEpisode,
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
                        src={tvShow?.coverImageUrl}
                        alt={tvShow?.title}
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
                                if (changedValues.currentSeasonEpisode) {
                                    setShowProgress(calculateProgress(changedValues.currentSeasonEpisode, tvShow?.seasonEpisodeCount))
                                }
                            }}
                            initialValues={{
                                pageNumber: 1,
                            }}
                        >
                            <Form.Item
                                name="currentSeasonEpisode"
                                label="Current Season/Episode"
                                required
                            >
                                <InputNumber placeholder="Enter Current Season/Episode" />
                            </Form.Item>

                            <Row justify="center">
                                <Progress
                                    type="circle"
                                    percent={showProgress}
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

export default UpdateTelevisionShowProgressForm;
