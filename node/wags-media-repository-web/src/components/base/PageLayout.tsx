import { ReactNode, useContext, useEffect, useState } from 'react';
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

import AppContext from '@contexts/AppContext';

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

type PageLayoutProps = {
    children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

    const { currentSidebarItem } = useContext(AppContext);

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
                    key: 'books-backlog',
                    label: 'Backlog',
                    onClick: () => navigateToPage('/books/backlog'),
                },
                {
                    key: 'books-reading',
                    label: 'Currently Reading',
                    onClick: () => navigateToPage('/books/current'),
                },
                {
                    key: 'books-finished',
                    label: 'Finished',
                    onClick: () => navigateToPage('/books/finished'),
                },
                {
                    key: 'books-abandoned',
                    label: 'Abandoned',
                    onClick: () => navigateToPage('/books/abandoned'),
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
                    onClick: () => navigateToPage('/movies/personal'),
                },
                {
                    key: 'movies-joint',
                    label: 'Joint List',
                    onClick: () => navigateToPage('/movies/joint'),
                },
                {
                    key: 'movies-watched',
                    label: 'Watched',
                    onClick: () => navigateToPage('/movies/watched'),
                },
                {
                    key: 'movies-abandoned',
                    label: 'Abandoned',
                    onClick: () => navigateToPage('/movies/abandoned'),
                },
            ],
        });

        menu.push({
            key: 'music',
            icon: <CustomerServiceOutlined />,
            label: 'Music',
            onClick: () => navigateToPage('/music'),
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
                    onClick: () => navigateToPage('/tv/personal'),
                },
                {
                    key: 'tv-joint',
                    label: 'Joint List',
                    onClick: () => navigateToPage('/tv/joint'),
                },
                {
                    key: 'tv-watching',
                    label: 'Currently Watching',
                    onClick: () => navigateToPage('/tv/watching'),
                },
                {
                    key: 'tv-between',
                    label: 'Between Seasons',
                    onClick: () => navigateToPage('/tv/between-seasons'),
                },
                {
                    key: 'tv-watched',
                    label: 'Watched',
                    onClick: () => navigateToPage('/tv/watched'),
                },
                {
                    key: 'tv-abandoned',
                    label: 'Abandoned',
                    onClick: () => navigateToPage('/tv/abandoned'),
                },
            ],
        });

        menu.push({
            key: 'video-games',
            icon: <RocketOutlined />,
            label: 'Video Games',
            children: [
                {
                    key: 'video-games-backlog',
                    label: 'Backlog',
                    onClick: () => navigateToPage('/video-games/backlog'),
                },
                {
                    key: 'video-games-playing',
                    label: 'Currently Playing',
                    onClick: () => navigateToPage('/video-games/playing'),
                },
                {
                    key: 'video-games-finished',
                    label: 'Finished',
                    onClick: () => navigateToPage('/video-games/finished'),
                },
            ],
        });

        menu.push({
            key: 'system',
            icon: <ControlOutlined />,
            label: 'System',
            children: [
                {
                    key: 'video-genres',
                    label: 'Video Genres',
                    onClick: () => navigateToPage('/system/video-genres'),
                },
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

    useEffect(() => {
        setSidebarCollapsed(!isLargeScreen);
    }, [isLargeScreen]);

    const getOpenedKeys = (): string[] => {
        const keys: string[] = [];

        if (document.location.href.toLocaleLowerCase().includes('books')) {
            keys.push('books');
        }

        if (document.location.href.toLocaleLowerCase().includes('movies')) {
            keys.push('movies');
        }

        if (document.location.href.toLocaleLowerCase().includes('tv')) {
            keys.push('tv');
        }

        if (document.location.href.toLocaleLowerCase().includes('video-games')) {
            keys.push('video-games');
        }

        if (document.location.href.toLocaleLowerCase().includes('video-genres')
            || document.location.href.toLocaleLowerCase().includes('video-services')) {
            keys.push('system');
        }

        return keys;
    };

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
                        defaultOpenKeys={getOpenedKeys()}
                        selectedKeys={[currentSidebarItem]}
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