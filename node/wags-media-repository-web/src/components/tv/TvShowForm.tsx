import { useState } from 'react';
import {
    Alert,
    Col,
    Select,
    Form,
    Input,
    InputNumber,
    Modal,
    ModalProps,
    Rate,
    Spin,
    Row,
} from 'antd';

import useVideoGenres from '@hooks/useVideoGenres';
import useVideoServices from '@hooks/useVideoServices';

import { Api } from '@lib/api';

import { TelevisionShow } from '@models/Tv';

const { TextArea } = Input;

interface MovieFormProps extends ModalProps {
    tvShow?: TelevisionShow;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    title: string;
    imdbLink: string;
    coverImageUrl: string;
    rating: number;
    thoughts: string;
    sortOrder: number;
    seasonEpisodeCount: number;
    currentSeasonEpisode: number;
    statusId: number;
    genres: number[];
    services: number[];
}

const MovieForm = ({
    tvShow,
    open,
    onSaved,
    onClose,
}: MovieFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const { videoGenres, error: genresError, isLoading: isGenresLoading } = useVideoGenres();
    const { videoServices, error: servicesError, isLoading: isServicesLoading } = useVideoServices();

    const loadingMessage = isGenresLoading || isServicesLoading ? 'Loading...' : processingMessage;
    const genresErrorMessage = genresError ? genresError.message : null;
    const servicesErrorMessage = servicesError ? servicesError.message : null;
    const errorMessage = genresErrorMessage || servicesErrorMessage || formError;

    const [form] = Form.useForm<FormValues>();

    const addTvShow = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('tv', {
            data: {
                title: values.title,
                imdbLink: values.imdbLink,
                coverImageUrl: values.coverImageUrl,
                rating: values.rating,
                thoughts: values.thoughts,
                sortOrder: values.sortOrder,
                statusId: values.statusId,
                seasonEpisodeCount: values.seasonEpisodeCount,
                currentSeasonEpisode: values.currentSeasonEpisode,
                genres: values.genres,
                services: values.services,
            }
        });

        return error;
    };

    const updateTvShow = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`tv/${tvShow?.televisionShowId}`, {
            data: {
                title: values.title,
                imdbLink: values.imdbLink,
                coverImageUrl: values.coverImageUrl,
                rating: values.rating,
                thoughts: values.thoughts,
                sortOrder: values.sortOrder,
                statusId: values.statusId,
                seasonEpisodeCount: values.seasonEpisodeCount,
                currentSeasonEpisode: values.currentSeasonEpisode,
                genres: values.genres,
                services: values.services,
            }
        });

        return error;
    };

    const saveMovie = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = tvShow
            ? await updateTvShow(values)
            : await addTvShow(values);

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
            okText={tvShow ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={tvShow ? 'Edit TV Show' : 'Add TV Show'}
            afterOpenChange={(open) => {
                if (open) {
                    if (tvShow) {
                        form.setFieldsValue({
                            title: tvShow.title,
                            imdbLink: tvShow.imdbLink,
                            coverImageUrl: tvShow.coverImageUrl,
                            rating: tvShow.rating,
                            thoughts: tvShow.thoughts,
                            sortOrder: tvShow.sortOrder,
                            statusId: tvShow.statusId,
                            seasonEpisodeCount: tvShow.seasonEpisodeCount,
                            currentSeasonEpisode: tvShow.currentSeasonEpisode,
                            genres: tvShow.genres.map((g) => g.videoGenreId),
                            services: tvShow.services.map((s) => s.videoServiceId),
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
                    onFinish={saveMovie}
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
                                { label: 'Personal List', value: 1 },
                                { label: 'Joint List', value: 2 },
                                { label: 'Currently Watching', value: 3 },
                                { label: 'In-Between Seasons', value: 4 },
                                { label: 'Finished', value: 5 },
                                { label: 'Could Not Finish', value: 6 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="imdbLink"
                        label="IMDb Link"
                    >
                        <Input placeholder="Enter IMDb Link" />
                    </Form.Item>

                    <Form.Item
                        name="coverImageUrl"
                        label="Poster Image URL"
                    >
                        <Input placeholder="Enter URL" />
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
                            options={(videoGenres ?? []).map((vg) => ({ key: vg.videoGenreId, label: vg.name, value: vg.videoGenreId }))} />
                    </Form.Item>

                    <Form.Item
                        name="services"
                        label="Services(s)"
                    >
                        <Select
                            placeholder="Select Service"
                            mode="multiple"
                            options={(videoServices ?? []).map((vs) => ({ key: vs.videoServiceId, label: vs.name, value: vs.videoServiceId }))} />
                    </Form.Item>

                    <Row justify="space-between" gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="currentSeasonEpisode"
                                label="Current Episode/Season"
                                className="full-width"
                            >
                                <InputNumber placeholder="Enter Current" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="seasonEpisodeCount"
                                label="Total Episodes/Seasons"
                                className="full-width"
                            >
                                <InputNumber placeholder="Enter Total" />
                            </Form.Item>
                        </Col>
                    </Row>

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

export default MovieForm;
