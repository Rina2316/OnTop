import { createContext, PropsWithChildren, useState, useEffect } from 'react';
import { MenuItem } from '../interfaces/menu.interface';
import { TopLevelCategory } from '../interfaces/page.interface';

export interface IAppContext {
    menu: MenuItem[];
    firstCategory: TopLevelCategory;
    searchQuery?: string;  // Состояние для поискового запроса
    searchResults?: MenuItem[]; // Состояние для хранения результатов поиска
    setMenu?: (newMenu: MenuItem[]) => void;
    setSearchQuery?: (query: string) => void;  // Метод для обновления поискового запроса
}

export const AppContext = createContext<IAppContext>({
    menu: [],
    firstCategory: TopLevelCategory.Courses,
    searchQuery: '',
    searchResults: [], // Начальные результаты поиска
    setSearchQuery: () => {}, // Функция по умолчанию
});

export const AppContextProvider = ({ menu, firstCategory, children }: PropsWithChildren<IAppContext>): JSX.Element => {
    const [menuState, setMenuState] = useState<MenuItem[]>(menu);
    const [searchQuery, setSearchQuery] = useState<string>('');  // Состояние для поискового запроса
    const [searchResults, setSearchResults] = useState<MenuItem[]>([]); // Состояние для результатов поиска

    const updateMenu = (newMenu: MenuItem[]) => {
        setMenuState(newMenu);
    };

    // Функция для обновления результатов поиска на основе поискового запроса
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults(menuState); // Если запрос пустой, возвращаем все элементы
        } else {
            const filteredResults = menuState.map(menuItem => ({
                ...menuItem,
                pages: menuItem.pages.filter(page => 
                    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    page.category.toLowerCase().includes(searchQuery.toLowerCase())
                )
            })).filter(menuItem => menuItem.pages.length > 0); // Фильтруем только те меню, которые имеют совпадения

            setSearchResults(filteredResults); // Обновляем результаты поиска
        }
    }, [searchQuery, menuState]);

    return (
        <AppContext.Provider value={{ 
            menu: menuState, 
            firstCategory, 
            searchQuery, 
            searchResults, // Передаем результаты поиска в контекст
            setMenu: updateMenu, 
            setSearchQuery // Передаем метод для обновления поискового запроса
        }}>
            {children}
        </AppContext.Provider>
    );
};
