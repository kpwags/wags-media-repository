import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type AppContainerProps = {
    children: ReactNode;
}

const AppContainer = ({ children }: AppContainerProps): JSX.Element => {
    const queryClient = new QueryClient();

    return (
        <ConfigProvider theme={{
            token: {
                colorError: '#a9011c'
            }
        }}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ConfigProvider>
    );
};

export default AppContainer;