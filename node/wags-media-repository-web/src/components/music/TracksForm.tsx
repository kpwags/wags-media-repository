import { useState } from 'react';
import {
    Alert,
    Button,
    Col,
    Input,
    Modal,
    ModalProps,
    Row,
    Spin,
    InputNumber,
    Typography,
    Space,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { Api } from '@lib/api';

import { getMaxValue } from '@lib/arrays';

import { MusicAlbum } from '@models/Music';

const { Text } = Typography;

interface TracksFormProps extends ModalProps {
    album?: MusicAlbum;
    onSaved: () => void;
    onClose: () => void;
}

type TrackField = {
    key: string;
    trackNumber: number;
    trackName: string;
}

const TracksForm = ({
    album,
    open,
    onSaved,
    onClose,
}: TracksFormProps): JSX.Element => {
    const [tracks, setTracks] = useState<TrackField[]>([{ key: uuidv4(), trackNumber: 1, trackName: '' }]);
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const onTrackNumberChange = (trackNumber: number | null, key: string) => {
        const track = tracks.find((t) => t.key === key);

        if (track) {
            const updatedTracks: TrackField[] = [];

            tracks.forEach((t) => {
                if (t.key === key) {
                    const newTrack: TrackField = {
                        key: track.key,
                        trackNumber: trackNumber ?? track.trackNumber,
                        trackName: track.trackName,
                    };

                    updatedTracks.push(newTrack);
                } else {
                    updatedTracks.push(t);
                }
            });

            setTracks(updatedTracks.sort((a, b) => a.trackNumber - b.trackNumber));
        }
    };

    const onTrackNameChange = (name: string, key: string) => {
        const track = tracks.find((t) => t.key === key);

        if (track) {
            const newTrack: TrackField = {
                key: track.key,
                trackNumber: track.trackNumber,
                trackName: name,
            }

            const updatedTracks = [
                ...tracks.filter((t) => t.key !== key),
                newTrack,
            ];

            setTracks(updatedTracks.sort((a, b) => a.trackNumber - b.trackNumber));
        }
    };

    const saveTracks = async () => {
        setProcessingMessage('Saving...');
        setFormError('');

        const [, error] = await Api.Put(`music/tracks/${album?.musicAlbumId}`, {
            data: {
                tracks: tracks.map((t) => ({
                    trackNumber: t.trackNumber,
                    title: t.trackName,
                })),
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
            onOk={() => saveTracks()}
            onCancel={() => onClose()}
            okText="Save"
            cancelText="Cancel"
            forceRender
            title={(
                <Space direction="vertical" size={4}>
                    <Text strong>Edit Tracks</Text>
                    <Text style={{ fontWeight: 400 }}>{album?.artist} - {album?.title}</Text>
                </Space>
            )}
            afterOpenChange={(open) => {
                if (open) {
                    if (album) {
                        if (album.tracks.length > 0) {
                            setTracks(album.tracks.map((t) => ({
                                key: uuidv4(),
                                trackName: t.title,
                                trackNumber: t.trackNumber,
                            })));
                        } else {
                            setTracks([{ key: uuidv4(), trackNumber: 1, trackName: '' }]);
                        }
                    }

                    setProcessingMessage('');
                } else {
                    setTracks([{ key: uuidv4(), trackNumber: 1, trackName: '' }]);
                    setFormError('');
                    setProcessingMessage('Loading...');
                }
            }}
        >
            <Spin spinning={processingMessage !== ''} tip={processingMessage}>
                {formError !== '' ? <Alert type="error" message={formError} /> : null}

                {tracks.map((track) => (
                    <Row key={track.key} justify="space-around" gutter={[8, 8]} className="track-field">
                        <Col xs={24} md={4}>
                            <InputNumber
                                value={track.trackNumber}
                                onChange={(e) => {
                                    onTrackNumberChange(e, track.key);
                                }}
                            />
                        </Col>
                        <Col xs={24} md={16}>
                            <Input
                                value={track.trackName}
                                onChange={(e) => {
                                    onTrackNameChange(e.target.value, track.key);
                                }}
                            />
                        </Col>
                        <Col xs={24} md={4}>
                            <Button
                                type="primary"
                                htmlType="button"
                                danger
                                onClick={() => {
                                    setTracks(tracks.filter((t) => t.key !== track.key));
                                }}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                ))}

                <Row justify="start" gutter={[8, 8]} className="track-field">
                    <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => {
                            setTracks([
                                ...tracks,
                                {
                                    key: uuidv4(),
                                    trackNumber: getMaxValue(tracks.map((t) => t.trackNumber)) + 1,
                                    trackName: '',
                                }
                            ])
                        }}
                    >
                        Add New Track
                    </Button>
                </Row>
            </Spin>
        </Modal>
    );
};

export default TracksForm;