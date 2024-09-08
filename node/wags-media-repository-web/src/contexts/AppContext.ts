import { createContext } from 'react';

interface AppContextProps {
    currentSidebarItem: string;
    setSidebarItem: (key: string) => void;
}

const AppContext = createContext<AppContextProps>({
    currentSidebarItem: '',
    setSidebarItem: () => { /* just a default */ }
});

export default AppContext;