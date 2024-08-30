import { useEffect } from 'react';

const useDocumentTitle = (title = ''): void => {
    useEffect(() => {
        document.title = title !== '' ? `${title} - Wags Media Repository` : 'Wags Media Repository';
    }, [title]);
};

export default useDocumentTitle;