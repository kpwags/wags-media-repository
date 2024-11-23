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
    Switch,
} from 'antd';
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import dayjs from 'dayjs';

import useBookGenres from '@hooks/useBookGenres';
import useBookSeries from '@hooks/useBookSeries';

import { Api } from '@lib/api';

import { Book } from '@models/Book';

const { TextArea } = Input;

interface BookFormProps extends ModalProps {
    book?: Book;
    nextSortOrder?: number;
    onSaved: () => void;
    onClose: () => void;
}

type FormValues = {
    statusId: number;
    typeId: number;
    seriesId?: number;
    title: string;
    subTitle: string;
    author: string;
    link: string;
    dateStarted?: Date;
    dateCompleted?: Date;
    rating: number;
    thoughts: string;
    bookNotesUrl: string;
    coverImageUrl: string;
    currentPage: number;
    pageCount: number;
    sortOrder?: number;
    isAtLibrary: boolean;
    isPurchased: boolean;
    genres: number[];
    formats: number[];
}

const BookForm = ({
    book,
    nextSortOrder = 10,
    open,
    onSaved,
    onClose,
}: BookFormProps): JSX.Element => {
    const [formError, setFormError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');

    const { bookGenres, error: genresError, isLoading: isGenresLoading } = useBookGenres();
    const { bookSeries, error: seriesError, isLoading: isSeriesLoading } = useBookSeries();

    const loadingMessage = isGenresLoading || isSeriesLoading ? 'Loading...' : processingMessage;
    const genresErrorMessage = genresError ? genresError.message : null;
    const servicesErrorMessage = seriesError ? seriesError.message : null;
    const errorMessage = genresErrorMessage || servicesErrorMessage || formError;

    const [form] = Form.useForm<FormValues>();

    const buildRequest = (values: FormValues) => ({
        bookStatusId: values.statusId,
        bookTypeId: values.typeId,
        bookSeriesId: values.seriesId,
        title: values.title,
        subTitle: values.subTitle ?? '',
        author: values.author,
        link: values.link ?? '',
        dateStarted: values.dateStarted,
        dateCompleted: values.dateCompleted,
        rating: values.rating ?? 0,
        thoughts: values.thoughts ?? '',
        bookNotesUrl: values.bookNotesUrl ?? '',
        coverImageUrl: values.coverImageUrl ?? '',
        currentPage: values.currentPage ?? 1,
        pageCount: values.pageCount ?? 1,
        sortOrder: values.sortOrder,
        isAtLibrary: values.isAtLibrary ?? false,
        isPurchased: values.isPurchased ?? false,
        genres: values.genres ?? [],
        formats: values.formats ?? [],
    })

    const addBook = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Post('book', {
            data: buildRequest(values),
        });

        return error;
    };

    const updateBook = async (values: FormValues): Promise<string | null> => {
        const [, error] = await Api.Put(`book/${book?.bookId}`, {
            data: buildRequest(values),
        });

        return error;
    };

    const saveBook = async (values: FormValues) => {
        setProcessingMessage('Saving...');
        setFormError('');

        const error = book
            ? await updateBook(values)
            : await addBook(values);

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
            okText={book ? 'Save' : 'Add'}
            cancelText="Cancel"
            forceRender
            title={book ? 'Edit Book' : 'Add Book'}
            afterOpenChange={(open) => {
                if (open) {
                    if (book) {
                        form.setFieldsValue({
                            statusId: book.bookStatusId,
                            typeId: book.bookTypeId,
                            seriesId: book.bookSeriesId,
                            title: book.title,
                            subTitle: book.subTitle,
                            author: book.author,
                            link: book.link,
                            rating: book.rating,
                            thoughts: book.thoughts,
                            bookNotesUrl: book.bookNotesUrl,
                            coverImageUrl: book.coverImageUrl,
                            currentPage: book.currentPage,
                            pageCount: book.pageCount,
                            sortOrder: book.sortOrder,
                            isAtLibrary: book.isAtLibrary,
                            isPurchased: book.isPurchased,
                            genres: book.genres.map((g) => g.bookGenreId),
                            formats: book.formats.map((f) => f.bookFormatId),
                        });

                        if (book.dateStarted) {
                            form.setFieldsValue({
                                dateStarted: dayjs(book.dateStarted),
                            })
                        }

                        if (book.dateCompleted) {
                            form.setFieldsValue({
                                dateCompleted: dayjs(book.dateCompleted),
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
                    onFinish={saveBook}
                    layout="vertical"
                    initialValues={{
                        statusId: 1,
                        sortOrder: nextSortOrder,
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
                        name="subTitle"
                        label="SubTitle"
                    >
                        <Input placeholder="Enter SubTitle" />
                    </Form.Item>

                    <Form.Item
                        name="author"
                        label="Author"
                        required
                    >
                        <Input placeholder="Enter Author" />
                    </Form.Item>

                    <Form.Item
                        name="statusId"
                        label="Status"
                        required
                    >
                        <Select
                            placeholder="Select Status"
                            options={[
                                { label: 'To Read', value: 1 },
                                { label: 'In Progress', value: 2 },
                                { label: 'Finished', value: 3 },
                                { label: 'Abandoned', value: 4 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="typeId"
                        label="Type"
                        required
                    >
                        <Select
                            placeholder="Select Type"
                            options={[
                                { label: 'Fiction', value: 1 },
                                { label: 'Non-Fiction', value: 2 },
                                { label: 'Reference', value: 3 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="seriesId"
                        label="Series"
                    >
                        <Select
                            placeholder="Select Series"
                            options={(bookSeries ?? []).map((bs) => ({ key: bs.bookSeriesId, label: bs.name, value: bs.bookSeriesId }))} />
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
                        name="currentPage"
                        label="Current Page"
                    >
                        <InputNumber placeholder="Enter Current Page" />
                    </Form.Item>

                    <Form.Item
                        name="pageCount"
                        label="Page Count"
                    >
                        <InputNumber placeholder="Enter Page Count" />
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
                    >
                        <Select
                            placeholder="Select Genre(s)"
                            mode="multiple"
                            options={(bookGenres ?? []).map((bg) => ({ key: bg.bookGenreId, label: bg.name, value: bg.bookGenreId }))} />
                    </Form.Item>

                    <Form.Item
                        name="formats"
                        label="Format(s)"
                    >
                        <Select
                            placeholder="Select Format(s)"
                            mode="multiple"
                            options={[
                                { label: 'Hardcover', value: 1 },
                                { label: 'Paperback', value: 2 },
                                { label: 'eBook', value: 3 },
                                { label: 'Audiobook', value: 4 },
                            ]} />
                    </Form.Item>

                    <Form.Item
                        name="isAtLibrary"
                        label="Is At Library">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        name="isPurchased"
                        label="Is Purchased">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
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

export default BookForm;
