import { Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { Text } = Typography;

type DateDisplayProps = {
    date: string | Date | Dayjs;
    includeTime?: boolean;
    format?: string;
}

const DateDisplay = ({
    date,
    includeTime = false,
    format = includeTime ? 'M/D/YYYY h:mm a' : 'M/D/YYYY',
}: DateDisplayProps): JSX.Element => (
    <Text>{dayjs(date).format(format)}</Text>
);

export default DateDisplay;
