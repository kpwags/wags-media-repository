import { ReactNode, useState } from 'react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppContext from '@contexts/AppContext';

type AppContainerProps = {
    children: ReactNode;
}

const AppContainer = ({ children }: AppContainerProps): JSX.Element => {
    const [sidebarItem, setSidebarItem] = useState<string>('');
    const queryClient = new QueryClient();

    const changeSidebarItem = (key: string) => {
        setSidebarItem(key);
    }

    return (
        <ConfigProvider theme={{
            token: {
                colorError: '#a9011c'
            }
        }}>
            <QueryClientProvider client={queryClient}>
                <AppContext.Provider
                    value={{
                        currentSidebarItem: sidebarItem,
                        setSidebarItem: changeSidebarItem,
                    }}
                >
                    {children}
                </AppContext.Provider>
            </QueryClientProvider>
        </ConfigProvider>
    );
};

export default AppContainer;