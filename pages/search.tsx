import { GetStaticProps } from 'next';
import { withLayout } from '../layout/Layout';
import axios from 'axios';
import { MenuItem } from '../interfaces/menu.interface';
import { API } from '../helpers/api';
import { AppContext } from "../context/app.context";
import { useContext, KeyboardEvent, useState } from 'react';
import { FirstLevelMenuItem, PageItem } from '../interfaces/menu.interface';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SearchList } from '../helpers/helpers';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './styles/search.module.css';
import cn from 'classnames';

function Search(): JSX.Element {
    const { searchQuery, menu, setMenu, firstCategory } = useContext(AppContext);
    const [announceSearch, setAnnounceSearch] = useState<'closed' | 'opened' | undefined>();
    const [openedCategories, setOpenedCategories] = useState<Record<string, boolean>>({});
    const shouldReduceMotion = useReducedMotion();
    const router = useRouter();

    const variants = {
        visible: {
            marginBottom: 20,
            transition: shouldReduceMotion ? {} : {
                when: 'beforeChildren',
                staggerChildren: 0.1
            }
        },
        hidden: { marginBottom: 0 }
    };

    const variantsChildren = {
        visible: {
            opacity: 1,
            height: 29
        },
        hidden: { opacity: shouldReduceMotion ? 1 : 0, height: 0 }
    };

    const openSecondLevel = (secondCategory: string) => {
        setOpenedCategories((prev) => ({
            ...prev,
            [secondCategory]: !prev[secondCategory] // Переключаем состояние для конкретной категории
        }));
        setAnnounceSearch(openedCategories[secondCategory] ? 'closed' : 'opened');
    };

    const openSecondLevelKey = (key: KeyboardEvent, secondCategory: string) => {
        if (key.code === 'Space' || key.code === 'Enter') {
            key.preventDefault();
            openSecondLevel(secondCategory);
        }
    };

    const buildFirstLevel = () => {
        return (
            <ul className={styles.firstLevelList}>
                {SearchList.map(m => (
                    <li key={m.route} aria-expanded={m.id === firstCategory}>
                        <Link href={`/${m.route}`} legacyBehavior>
                            <a>
                                <div className={cn(styles.firstLevel, {
                                    [styles.firstLevelActive]: m.id === firstCategory
                                })}>
                                    {m.icon}
                                    <span>{m.name}</span>
                                </div>
                            </a>
                        </Link>
                        {m.id === firstCategory && buildSecondLevel(m)}
                    </li>
                ))}
            </ul>
        );
    };

    const buildSecondLevel = (menuItem: FirstLevelMenuItem) => {
        return (
            <ul className={styles.secondBlock}>
                {menu.map(m => (
                    <li key={m._id.secondCategory}>
                        <button
                            onKeyDown={(key: KeyboardEvent) => openSecondLevelKey(key, m._id.secondCategory)}
                            className={styles.secondLevel}
                            onClick={() => openSecondLevel(m._id.secondCategory)}
                            aria-expanded={openedCategories[m._id.secondCategory]}
                        >
                            {m._id.secondCategory}
                        </button>
                        <motion.ul
                            layout
                            variants={variants}
                            initial={openedCategories[m._id.secondCategory] ? 'visible' : 'hidden'}
                            animate={openedCategories[m._id.secondCategory] ? 'visible' : 'hidden'}
                            className={styles.secondLevelBlock}
                        >
                            {buildThirdLevel(m.pages, menuItem.route, openedCategories[m._id.secondCategory] ?? false)}
                        </motion.ul>
                    </li>
                ))}
            </ul>
        );
    };

    const buildThirdLevel = (pages: PageItem[], route: string, isOpened: boolean) => {
        return (
            pages.map(p => (
                <motion.li key={p._id} variants={variantsChildren}>
                    <Link href={`/${route}/${p.alias}`} legacyBehavior>
                        <a
                            tabIndex={isOpened ? 0 : -1}
                            className={cn(styles.thirdLevel, {
                                [styles.thirdLevelActive]: `/${route}/${p.alias}` === router.asPath
                            })}
                            aria-current={`/${route}/${p.alias}` === router.asPath ? 'page' : false}
                        >
                            {p.category}
                        </a>
                    </Link>
                </motion.li>
            ))
        );
    };

    return (
        <div className={styles.wrapper}>
            <h1>Результаты поиска: {searchQuery}</h1>
				<p>К сожалению ничего не найдено, вам также может понравится:</p>
            <nav className={styles.menu} role='navigation'>
                {announceSearch && <span role="log" className="visualyHidden">{announceSearch === 'opened' ? 'развернуто' : 'свернуто'}</span>}
                {buildFirstLevel()}
            </nav>
        </div>
    );
}

export default withLayout(Search);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const firstCategory = 0;
    const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
        firstCategory
    });
    return {
        props: {
            menu,
            firstCategory
        }
    };
};

interface HomeProps extends Record<string, unknown> {
    menu: MenuItem[];
    firstCategory: number;
}
