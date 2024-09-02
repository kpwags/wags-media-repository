import { ReactNode, useMemo, useState } from 'react';
import { Button, Grid, Layout, Menu, MenuProps, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import HomeOutlined from '@ant-design/icons/lib/icons/HomeOutlined';
import ReadOutlined from '@ant-design/icons/lib/icons/ReadOutlined';
import LinkOutlined from '@ant-design/icons/lib/icons/LinkOutlined';
import VideoCameraOutlined from '@ant-design/icons/lib/icons/VideoCameraOutlined';
import CustomerServiceOutlined from '@ant-design/icons/lib/icons/CustomerServiceOutlined';
import DesktopOutlined from '@ant-design/icons/lib/icons/DesktopOutlined';
import AudioOutlined from '@ant-design/icons/lib/icons/AudioOutlined';
import RocketOutlined from '@ant-design/icons/lib/icons/RocketOutlined';
import MenuOutlined from '@ant-design/icons/lib/icons/MenuOutlined';
import ControlOutlined from '@ant-design/icons/lib/icons/ControlOutlined';

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

type PageLayoutProps = {
    children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

    const navigate = useNavigate();
    const screens = useBreakpoint();

    const navigateToPage = (url: string) => {
        navigate(url);
    };

    const BuildMenu = (): MenuProps['items'] => {
        const menu: MenuProps['items'] = [];

        menu.push({
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigateToPage('/'),
        });

        menu.push({
            key: 'books',
            icon: <ReadOutlined />,
            label: 'Books',
            children: [
                {
                    key: 'books-reading',
                    label: 'Currently Reading',
                },
                {
                    key: 'books-finished',
                    label: 'Finished',
                },
                {
                    key: 'books-backlog',
                    label: 'Backlog',
                },
            ],
        });

        menu.push({
            key: 'links',
            icon: <LinkOutlined />,
            label: 'Links',
            onClick: () => navigateToPage('/links'),
        });

        menu.push({
            key: 'movies',
            icon: <VideoCameraOutlined />,
            label: 'Movies',
            children: [
                {
                    key: 'movies-personal',
                    label: 'Personal List',
                },
                {
                    key: 'movies-joint',
                    label: 'Joint List',
                },
                {
                    key: 'movies-watch',
                    label: 'Watched',
                },
                {
                    key: 'movies-abandoned',
                    label: 'Abandoned',
                },
            ],
        });

        menu.push({
            key: 'music',
            icon: <CustomerServiceOutlined />,
            label: 'Music',
        });

        menu.push({
            key: 'podcasts',
            icon: <AudioOutlined />,
            label: 'Podcasts',
            onClick: () => navigateToPage('/podcasts'),
        });

        menu.push({
            key: 'tv',
            icon: <DesktopOutlined />,
            label: 'TV',
            children: [
                {
                    key: 'tv-personal',
                    label: 'Personal List',
                },
                {
                    key: 'tv-joint',
                    label: 'Joint List',
                },
                {
                    key: 'tv-between',
                    label: 'Between Seasons',
                },
                {
                    key: 'tv-watch',
                    label: 'Watched',
                },
                {
                    key: 'tv-abandoned',
                    label: 'Abandoned',
                },
            ],
        });

        menu.push({
            key: 'video-games',
            icon: <RocketOutlined />,
            label: 'Video Games',
            children: [
                {
                    key: 'video-games-reading',
                    label: 'Currently Reading',
                },
                {
                    key: 'video-games-finished',
                    label: 'Finished',
                },
                {
                    key: 'video-games-backlog',
                    label: 'Backlog',
                },
            ],
        });

        menu.push({
            key: 'system',
            icon: <ControlOutlined />,
            label: 'System',
            children: [
                {
                    key: 'video-services',
                    label: 'Video Services',
                    onClick: () => navigateToPage('/system/video-services'),
                },
            ],
        });

        return menu;
    }

    const isLargeScreen = screens.lg || screens.xl || screens.xxl;

    useMemo(() => {
        setSidebarCollapsed(!isLargeScreen);
    }, [isLargeScreen]);

    return (
        <Layout>
            <Header className="site-header">
                <Space direction="horizontal" size={16}>
                    <Button icon={<MenuOutlined />} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
                    <div className="logo">Wags Media Repository</div>
                </Space>
            </Header>
            <Layout className="main-content-area">
                <Sider
                    collapsed={sidebarCollapsed}
                    collapsible
                    onCollapse={(value) => setSidebarCollapsed(value)}
                    collapsedWidth={0}
                    trigger={null}
                    className="sidebar"
                >
                    <Menu
                        mode="inline"
                        className="sidebar-menu"
                        items={BuildMenu()}
                    />
                </Sider>
                <Layout>
                    <Content className="page-content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default PageLayout;