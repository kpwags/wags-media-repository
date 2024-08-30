import { ReactNode } from 'react';
import { ConfigProvider } from 'antd';

type AppContainerProps = {
    children: ReactNode;
}

const AppContainer = ({ children }: AppContainerProps): JSX.Element => (
    <ConfigProvider theme={{
        token: {
            colorError: '#a9011c'
        }
    }}>
        {children}
    </ConfigProvider>
);

export default AppContainer;