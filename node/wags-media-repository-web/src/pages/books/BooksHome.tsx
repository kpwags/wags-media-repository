import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Button,
    Form,
    Grid,
    Input,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Typography
} from 'antd';

import AppContext from '@contexts/AppContext';

import useBookGenres from '@hooks/useBookGenres';
import useBookSeries from '@hooks/useBookSeries';
import useDocumentTitle from '@hooks/useDocumentTitle';

import { Api } from '@lib/api';
import { BookStatus } from '@lib/constants';
import { sortByDate, sortByTitle } from '@lib/sorting';

import { BookColumns } from '@components/books/BookColumns';
import BookForm from '@components/books/BookForm';

import { Book } from '@models/Book';
import { getMaxValue } from '@lib/arrays';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const BooksHome = ({ status }: { status: BookStatus }): JSX.Element => {
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ title: string, genreId: number, typeId: number, seriesId: number }>({ title: '', genreId: 0, typeId: 0, seriesId: 0 });
    const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [maxSortOrder, setMaxSortOrder] = useState<number>(10);

    const { setSidebarItem } = useContext(AppContext);

    const { bookGenres, error: genresError, isLoading: isGenresLoading } = useBookGenres();
    const { bookSeries, error: seriesError, isLoading: isSeriesLoading } = useBookSeries();

    const screens = useBreakpoint();
    const navigate = useNavigate();

    const loadingMessage = isGenresLoading || isSeriesLoading ? 'Loading...' : processingMessage;
    const genresErrorMessage = genresError ? genresError.message : null;
    const servicesErrorMessage = seriesError ? seriesError.message : null;
    const errorMessage = genresErrorMessage || servicesErrorMessage || fetchError;
    const isLargeScreen = screens.lg || screens.xl || screens.xxl;

    const fetchBooks = async (): Promise<[Book[] | null, string | null]> => await await Api.Get<Book[]>('book');

    const loadBooks = useCallback(async () => {
        const [data, error] = await fetchBooks();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        setMaxSortOrder(getMaxValue((data ?? []).map((d) => d.sortOrder ?? 0)) + 10);

        if (status === BookStatus.ToRead) {
            setAllBooks((data ?? []).filter((game) => game.bookStatusId === status).sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)));
        } else if (status === BookStatus.CurrentlyReading) {
            setAllBooks((data ?? []).filter((game) => game.bookStatusId === status).sort((a, b) => sortByTitle(a.title, b.title)) ?? []);
        } else {
            setAllBooks((data ?? []).filter((game) => game.bookStatusId === status).sort((a, b) => sortByDate((a?.dateCompleted ?? new Date(1900, 0, 1)).toString(), (b?.dateCompleted ?? new Date(1900, 0, 1)).toString())) ?? []);
        }

        setProcessingMessage('');
    }, [status]);

    const deleteBook = async (id: number) => {
        setProcessingMessage('Deleting Book...');
        const [, error] = await Api.Delete(`book/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadBooks();
    };

    const changeSidebar = useCallback(() => {
        switch (status) {
            case BookStatus.ToRead:
                setSidebarItem('books-backlog');
                break;

            case BookStatus.CurrentlyReading:
                setSidebarItem('books-reading');
                break;

            case BookStatus.Finished:
                setSidebarItem('books-finished');
                break;

            case BookStatus.Abandoned:
                setSidebarItem('books-abandoned');
                break;

            default:
                break;
        }
    }, [setSidebarItem, status]);

    const filterBooksByTitle = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            title: filterText.trim(),
        });
    };

    const filterBooksByGenre = (genreId: number) => {
        setActiveFilters({
            ...activeFilters,
            genreId: genreId ?? 0,
        });
    };

    const filterBooksByType = (typeId: number) => {
        setActiveFilters({
            ...activeFilters,
            typeId: typeId ?? 0,
        });
    };

    const filterBooksBySeries = (seriesId: number) => {
        setActiveFilters({
            ...activeFilters,
            seriesId: seriesId ?? 0,
        });
    };

    useEffect(() => {
        loadBooks();
        changeSidebar();
    }, [loadBooks, changeSidebar]);

    useEffect(() => {
        if (activeFilters.genreId === 0 && activeFilters.typeId === 0 && activeFilters.seriesId === 0 && activeFilters.title.trim() === '') {
            setBooks(allBooks);
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.typeId === 0 && activeFilters.seriesId === 0 && activeFilters.title.trim() !== '') {
            setBooks(allBooks.filter((b) => b.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
            return;
        }

        if (activeFilters.genreId > 0 && activeFilters.typeId === 0 && activeFilters.seriesId === 0 && activeFilters.title.trim() === '') {
            setBooks(allBooks.filter((bg) => bg.genres.map((g) => g.bookGenreId).includes(activeFilters.genreId)));
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.typeId > 0 && activeFilters.seriesId === 0 && activeFilters.title.trim() === '') {
            setBooks(allBooks.filter((bt) => bt.bookTypeId === activeFilters.typeId));
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.typeId === 0 && activeFilters.seriesId > 0 && activeFilters.title.trim() === '') {
            setBooks(allBooks.filter((bs) => bs.bookSeriesId === activeFilters.seriesId));
            return;
        }

        setBooks(allBooks.filter((b) => b.genres.map((g) => g.bookGenreId).includes(activeFilters.genreId)
            && b.bookTypeId === activeFilters.typeId
            && b.bookSeriesId === activeFilters.seriesId
            && b.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
    }, [allBooks, activeFilters]);

    const tableColumns = BookColumns(
        status,
        isLargeScreen ?? false,
        (book) => {
            setBookToEdit(book);
            setShowFormModal(true);
        },
        (bookId) => deleteBook(bookId)
    );

    const pageTitle = (): string => {
        switch (status) {
            case BookStatus.ToRead:
                return 'Books Backlog';
            case BookStatus.CurrentlyReading:
                return 'Books In Progress';
            case BookStatus.Finished:
                return 'Books Read';
            case BookStatus.Abandoned:
                return 'Books Abandoned';
            default:
                return "How the hell did you get here?";
        }
    };

    useDocumentTitle(pageTitle());

    return (
        <>
            <Spin spinning={loadingMessage !== ''} tip={loadingMessage}>
                <Space direction="vertical" size={24} className="full-width">
                    <Title level={1}>{pageTitle()}</Title>

                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                    <Row justify="space-between" align="bottom" className="filter-actions">
                        <Space direction="vertical" size={8} className="table-filter">
                            <Text strong>Filters</Text>
                            <Form.Item label="Title">
                                <Input
                                    placeholder="Enter Title"
                                    onChange={(e) => {
                                        filterBooksByTitle(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Genre">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Genre"
                                    onChange={(e) => {
                                        filterBooksByGenre(e);
                                    }}
                                    allowClear
                                    options={(bookGenres ?? []).map((bg) => ({ key: bg.bookGenreId, label: bg.name, value: bg.bookGenreId }))} />
                            </Form.Item>
                            <Form.Item label="Type">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Type"
                                    onChange={(e) => {
                                        filterBooksByType(e);
                                    }}
                                    allowClear
                                    options={[
                                        { label: 'Fiction', value: 1 },
                                        { label: 'Non-Fiction', value: 2 },
                                        { label: 'Reference', value: 3 },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item label="Series">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Series"
                                    onChange={(e) => {
                                        filterBooksBySeries(e);
                                    }}
                                    allowClear
                                    options={(bookSeries ?? []).map((bs) => ({ key: bs.bookSeriesId, label: bs.name, value: bs.bookSeriesId }))} />
                            </Form.Item>
                        </Space>

                        <Space direction="horizontal" size={16}>
                            <Button onClick={() => navigate('/books/genres')}>
                                Genres
                            </Button>
                            <Button onClick={() => navigate('/books/series')}>
                                Series
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => setShowFormModal(true)}
                            >
                                Add New Book
                            </Button>
                        </Space>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={books}
                        rowKey="bookId"
                        pagination={false}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <BookForm
                book={bookToEdit ?? undefined}
                nextSortOrder={maxSortOrder}
                open={showFormModal}
                onClose={() => {
                    setBookToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadBooks();
                    setBookToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </>
    );
}

export default BooksHome;
