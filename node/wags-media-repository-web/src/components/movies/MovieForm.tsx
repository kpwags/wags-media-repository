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

import useVideoGenres from '@hooks/useVideoGenres';
import useVideoServices from '@hooks/useVideoServices';

import { Api } from '@lib/api';

import { Movie } from '@models/Movie';

const { TextArea } = Input;

interface MovieFormProps extends ModalProps {
    movie?: Movie;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    title: string;
    imdbLink: string;
    posterImageUrl: string;
    dateWatched: Date;
    rating: number;
    thoughts: string;
    sortOrder: number;
    statusId: number;
    genres: number[];
    services: number[];
}

const MovieForm = ({
    movie,
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

    const addMovie = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('movie', {
            data: {
                title: values.title,
                imdbLink: values.imdbLink,
                posterImageUrl: values.posterImageUrl,
                dateWatched: values.dateWatched,
                rating: values.rating,
                thoughts: values.thoughts,
                sortOrder: values.sortOrder,
                statusId: values.statusId,
                genres: values.genres,
                services: values.services,
            }
        });

        return error;
    };

    const updateMovie = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`movie/${movie?.movieId}`, {
            data: {
                title: values.title,
                imdbLink: values.imdbLink,
                posterImageUrl: values.posterImageUrl,
                dateWatched: values.dateWatched,
                rating: values.rating,
                thoughts: values.thoughts,
                sortOrder: values.sortOrder,
                statusId: values.statusId,
                genres: values.genres,
                services: values.services,
            }
        });

        return error;
    };

    const saveMovie = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = movie
            ? await updateMovie(values)
            : await addMovie(values);

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
            okText={movie ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={movie ? 'Edit Movie' : 'Add Movie'}
            afterOpenChange={(open) => {
                if (open) {
                    if (movie) {
                        form.setFieldsValue({
                            title: movie.title,
                            imdbLink: movie.imdbLink,
                            posterImageUrl: movie.posterImageUrl,
                            rating: movie.rating,
                            thoughts: movie.thoughts,
                            sortOrder: movie.sortOrder,
                            statusId: movie.statusId,
                            genres: movie.genres.map((g) => g.videoGenreId),
                            services: movie.services.map((s) => s.videoServiceId),
                        });

                        if (movie.dateWatched) {
                            form.setFieldsValue({
                                dateWatched: dayjs(movie.dateWatched),
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
                                { label: 'Watched', value: 3 },
                                { label: 'Could Not Finish', value: 4 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="imdbLink"
                        label="IMDb Link"
                    >
                        <Input placeholder="Enter IMDb Link" />
                    </Form.Item>

                    <Form.Item
                        name="posterImageUrl"
                        label="Poster Image URL"
                    >
                        <Input placeholder="Enter URL" />
                    </Form.Item>

                    <Form.Item
                        name="dateWatched"
                        label="Date Watched"
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
