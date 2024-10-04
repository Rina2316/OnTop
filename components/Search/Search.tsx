import React, { forwardRef, InputHTMLAttributes, useState, KeyboardEvent } from 'react';
import { SearchProps } from './Search.props';
import styles from './Search.module.css';
import GlassIcon from './glass.svg';
import cn from 'classnames';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useRouter } from 'next/router';

export const Search = forwardRef<HTMLInputElement, SearchProps>(({ className, ...props }, ref): JSX.Element => {
	const [search, setSearch] = useState<string>(''); // Состояние для хранения поискового запроса
	const router = useRouter();

	const goToSearch = () => {
		// Перенаправление на страницу поиска с параметрами
		router.push({
			pathname: '/search',
			query: {
				q: search, // Передача поискового запроса
			},
		});
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			goToSearch(); // Запуск поиска по нажатию клавиши Enter
		}
	};

	return (
		<form className={cn(className, styles.search)} {...props} role="search" onSubmit={(e) => e.preventDefault()}>
			<Input
				ref={ref} // Передаем реф
				className={styles.input}
				placeholder="Поиск..."
				value={search}
				onChange={(e) => setSearch(e.target.value)} // Обновление состояния при вводе текста
				onKeyDown={handleKeyDown} // Обработка нажатий клавиш
			/>
			<Button
				appearance="primary"
				className={styles.button}
				onClick={goToSearch} // Запуск поиска по нажатию кнопки
				aria-label="Искать по сайту"
			>
				<GlassIcon />
			</Button>
		</form>
	);
});

Search.displayName = 'Search'; // Указываем имя компонента для удобства отладки
