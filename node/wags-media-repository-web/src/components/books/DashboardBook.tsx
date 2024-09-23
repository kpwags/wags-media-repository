import {
    Button,
    Progress,
    Space,
    Typography,
} from 'antd';
import dayjs from 'dayjs';

import { Book } from '@models/Book'
import StarRating from '@components/StarRating';

const { Text } = Typography;

type DashboardBookProps = {
    mode: 'current' | 'recent';
    book: Book;
    onUpdateProgress?: (book: Book) => void;
}

const DashboardBook = ({
    mode,
    book,
    onUpdateProgress,
}: DashboardBookProps): JSX.Element => (
    <Space direction="horizontal" size={24} align="start" className={`currently-reading ${mode === 'recent' ? 'recently-read' : ''}`}>
        <img
            src={book.coverImageUrl}
            alt={`${book.fullTitle} by ${book.author}`}
            width={mode === 'current' ? 150 : 133}
            height={mode === 'current' ? 225 : 200}
        />
        <Space direction="vertical" size={16} className="details">
            <Text>
                <Text strong>{book.fullTitle}</Text><br />
                {book.author}
            </Text>
            {mode === 'current' ? (
                <>
                    <Progress type="circle" percent={book.progress} />
                    <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => {
                            if (onUpdateProgress) {
                                onUpdateProgress(book);
                            }
                        }}
                    >
                        Update Progress
                    </Button>
                </>
            ) : (
                <>
                    <Text><Text strong>Finished:</Text> {dayjs(book.dateCompleted).format('M/D/YYYY')}</Text>
                    <StarRating rating={book.rating} />
                </>
            )}
        </Space>
    </Space>
);

export default DashboardBook;