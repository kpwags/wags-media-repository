import { useState } from 'react';
import {
    Alert,
    Select,
    Form,
    Input,
    Modal,
    ModalProps,
    Spin,
    Switch,
} from 'antd';
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';

import useMusicGenres from '@hooks/useMusicGenres';

import { Api } from '@lib/api';

import { MusicAlbum } from '@models/Music';

const { TextArea } = Input;

interface AlbumFormProps extends ModalProps {
    album?: MusicAlbum;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    artist: string;
    title: string;
    coverImageUrl: string;
    thoughts: string;
    isTopTen: boolean;
    showOnNowPage: boolean;
    genres: number[];
    formats: number[];
}

const AlbumForm = ({
    album,
    open,
    onSaved,
    onClose,
}: AlbumFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const { musicGenres, isLoading, error } = useMusicGenres();

    const loadingMessage = isLoading ? 'Loading...' : processingMessage;
    const errorMessage = error ? error.message : formError;

    const [form] = Form.useForm<FormValues>();

    const buildReequest = (values: FormValues) => ({
        artist: values.artist,
        title: values.title,
        coverImageUrl: values.coverImageUrl,
        thoughts: values.thoughts,
        isTopTen: values.isTopTen ?? false,
        showOnNowPage: values.showOnNowPage ?? false,
        genres: values.genres ?? [],
        formats: values.formats ?? [],
    })

    const addAlbum = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('music', {
            data: buildReequest(values),
        });

        return error;
    };

    const updateAlbum = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`music/${album?.musicAlbumId}`, {
            data: buildReequest(values),
        });

        return error;
    };

    const saveAlbum = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = album
            ? await updateAlbum(values)
            : await addAlbum(values);

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
            okText={album ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={album ? 'Edit Album' : 'Add Album'}
            afterOpenChange={(open) => {
                if (open) {
                    if (album) {
                        form.setFieldsValue({
                            artist: album.artist,
                            title: album.title,
                            coverImageUrl: album.coverImageUrl,
                            thoughts: album.thoughts,
                            isTopTen: album.isTopTen,
                            showOnNowPage: album.showOnNowPage,
                            genres: album.genres.map((g) => g.musicGenreId),
                            formats: album.formats.map((f) => f.musicFormatId),
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
                    onFinish={saveAlbum}
                    layout="vertical"
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        required
                    >
                        <Input placeholder="Enter Titla" />
                    </Form.Item>

                    <Form.Item
                        name="artist"
                        label="Artist"
                        required
                    >
                        <Input placeholder="Enter Artist" />
                    </Form.Item>

                    <Form.Item
                        name="coverImageUrl"
                        label="Album Art URL"
                    >
                        <Input placeholder="Enter URL" />
                    </Form.Item>

                    <Form.Item
                        name="thoughts"
                        label="Thoughts"
                    >
                        <TextArea placeholder="Enter Thoughts" rows={8} />
                    </Form.Item>

                    <Form.Item
                        name="isTopTen"
                        label="Is Top 10">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="showOnNowPage"
                        label="Show on Now Page">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="genres"
                        label="Genres"
                    >
                        <Select
                            placeholder="Select Genre"
                            allowClear
                            mode="multiple"
                            options={(musicGenres ?? []).map((g) => ({ key: g.musicGenreId, label: g.name, value: g.musicGenreId }))} />
                    </Form.Item>

                    <Form.Item
                        name="formats"
                        label="Format"
                    >
                        <Select
                            placeholder="Select Format"
                            allowClear
                            mode="multiple"
                            options={[
                                { key: 1, label: 'CD', value: 1 },
                                { key: 2, label: 'Digital', value: 2 },
                                { key: 3, label: 'Vinyl', value: 3 },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AlbumForm;
