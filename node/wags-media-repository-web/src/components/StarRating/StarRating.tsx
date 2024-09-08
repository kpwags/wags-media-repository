import { StarFilled, StarOutlined } from "@ant-design/icons";

type StarRatingProps = {
    rating?: number;
}

const StarRating = ({ rating = 0 }: StarRatingProps): JSX.Element | null => {
    if (rating <= 0 || rating > 5) {
        return null;
    }

    const getStars = () => {
        const starsHtml = [];

        for (let i = 0; i < rating; i += 1) {
            starsHtml.push(
                <StarFilled key={`filled-${i}`} />
            );
        }

        if (rating < 5) {
            for (let i = rating; i < 5; i += 1) {
                starsHtml.push(
                    <StarOutlined key={`unfilled-${i}`} />
                );
            }
        }

        return starsHtml;
    };

    return (<div className="rating">{getStars()}</div>);
};

export default StarRating;