import { useState } from 'react';
import {
    Alert,
    DatePicker,
    Select,
    Form,
    Input,
    InputNumber,
    Modal,
    ModalProps,
    Rate,
    Spin,
} from 'antd';
import dayjs from 'dayjs';

import useVideoGameGenres from '@hooks/useVideoGameGenres';
import useVideoGameSystems from '@hooks/useVideoGameSystems';

import { Api } from '@lib/api';

import { VideoGame } from '@models/VideoGame';

const { TextArea } = Input;

interface MovieFormProps extends ModalProps {
    videoGame?: VideoGame;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    statusId: number;
    completionId: number;
    title: string;
    link: string;
    dateStarted?: Date;
    dateCompleted?: Date;
    rating: number;
    thoughts: string;
    coverImageUrl: string;
    sortOrder?: number;
    genres: number[];
    systems: number[];
}

const VideoGameForm = ({
    videoGame,
    open,
    onSaved,
    onClose,
}: MovieFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const { videoGameGenres, error: genresError, isLoading: isGenresLoading } = useVideoGameGenres();
    const { videoGameSystems, error: systemsError, isLoading: isSystemsLoading } = useVideoGameSystems();

    const loadingMessage = isGenresLoading || isSystemsLoading ? 'Loading...' : processingMessage;
    const genresErrorMessage = genresError ? genresError.message : null;
    const servicesErrorMessage = systemsError ? systemsError.message : null;
    const errorMessage = genresErrorMessage || servicesErrorMessage || formError;

    const [form] = Form.useForm<FormValues>();

    const addVideoGame = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('video-game', {
            data: {
                videoGameStatusId: values.statusId,
                videoGameCompletionId: values.completionId,
                title: values.title,
                link: values.link,
                dateStarted: values.dateStarted,
                dateCompleted: values.dateCompleted,
                rating: values.rating,
                thoughts: values.thoughts,
                coverImageUrl: values.coverImageUrl,
                sortOrder: values.sortOrder,
                genres: values.genres,
                systems: values.systems,
            }
        });

        return error;
    };

    const updateVideoGame = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`video-game/${videoGame?.videoGameId}`, {
            data: {
                videoGameStatusId: values.statusId,
                videoGameCompletionId: values.completionId,
                title: values.title,
                link: values.link,
                dateStarted: values.dateStarted,
                dateCompleted: values.dateCompleted,
                rating: values.rating,
                thoughts: values.thoughts,
                coverImageUrl: values.coverImageUrl,
                sortOrder: values.sortOrder,
                genres: values.genres,
                systems: values.systems,
            }
        });

        return error;
    };

    const saveVideoGame = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = videoGame
            ? await updateVideoGame(values)
            : await addVideoGame(values);

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
            okText={videoGame ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={videoGame ? 'Edit Video Game' : 'Add Video Game'}
            afterOpenChange={(open) => {
                if (open) {
                    if (videoGame) {
                        form.setFieldsValue({
                            statusId: videoGame.videoGameStatusId,
                            completionId: videoGame.videoGameCompletionId,
                            title: videoGame.title,
                            link: videoGame.link,
                            rating: videoGame.rating,
                            thoughts: videoGame.thoughts,
                            coverImageUrl: videoGame.coverImageUrl,
                            sortOrder: videoGame.sortOrder,
                            genres: videoGame.genres.map((g) => g.videoGameGenreId),
                            systems: videoGame.systems.map((s) => s.videoGameSystemId),
                        });

                        if (videoGame.dateStarted) {
                            form.setFieldsValue({
                                dateStarted: dayjs(videoGame.dateStarted),
                            })
                        }

                        if (videoGame.dateCompleted) {
                            form.setFieldsValue({
                                dateCompleted: dayjs(videoGame.dateCompleted),
                            })
                        }
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
                    onFinish={saveVideoGame}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        required
                    >
                        <Input placeholder="Enter Title" />
                    </Form.Item>

                    <Form.Item
                        name="statusId"
                        label="Status"
                        required
                    >
                        <Select
                            placeholder="Select Status"
                            options={[
                                { label: 'To Play', value: 1 },
                                { label: 'In Progress', value: 2 },
                                { label: 'Finished', value: 3 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="completionId"
                        label="Completed?"
                        required
                    >
                        <Select
                            placeholder="Select Completion Status"
                            options={[
                                { label: 'N/A', value: 1 },
                                { label: 'Yes', value: 2 },
                                { label: 'No', value: 3 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="link"
                        label="Link"
                    >
                        <Input placeholder="Enter Link" />
                    </Form.Item>

                    <Form.Item
                        name="coverImageUrl"
                        label="Cover Image URL"
                    >
                        <Input placeholder="Enter URL" />
                    </Form.Item>

                    <Form.Item
                        name="dateStarted"
                        label="Date Started"
                    >
                        <DatePicker placeholder="Enter Date" format="M/D/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="dateCompleted"
                        label="Date Completed"
                    >
                        <DatePicker placeholder="Enter Date" format="M/D/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="sortOrder"
                        label="Sort"
                    >
                        <InputNumber placeholder="Enter Sort Order" />
                    </Form.Item>

                    <Form.Item
                        name="genres"
                        label="Genre(s)"
                        required
                    >
                        <Select
                            placeholder="Select Genre"
                            mode="multiple"
                            options={(videoGameGenres ?? []).map((vg) => ({ key: vg.videoGameGenreId, label: vg.name, value: vg.videoGameGenreId }))} />
                    </Form.Item>

                    <Form.Item
                        name="systems"
                        label="System(s)"
                    >
                        <Select
                            placeholder="Select System"
                            mode="multiple"
                            options={(videoGameSystems ?? []).map((vs) => ({ key: vs.videoGameSystemId, label: vs.name, value: vs.videoGameSystemId }))} />
                    </Form.Item>

                    <Form.Item
                        name="rating"
                        label="Rating"
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="thoughts"
                        label="Thoughts"
                    >
                        <TextArea placeholder="Enter Thoughts" rows={8} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default VideoGameForm;
