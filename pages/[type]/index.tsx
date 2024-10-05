import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { withLayout } from '../../layout/Layout';
import { firstLevelMenu } from '../../helpers/helpers';
import { ParsedUrlQuery } from 'querystring';
import { API } from '../../helpers/api';
import Link from 'next/link';
import styles from "../styles/Type.module.css"; // стили импортируем

function Type({ firstCategory }: TypeProps): JSX.Element {

	const courses = [
		{
		  category: 'Аналитика',
		  description: 'Курсы по аналитике данных, инструментам и методам обработки информации.',
		  services: ['Google Analytics', 'Power BI', 'Tableau'],
		  books: ['Data Science from Scratch', 'Python for Data Analysis'],
		},
		{
		  category: 'Бизнес',
		  description: 'Курсы для развития бизнес-навыков, создания стартапов и управления проектами.',
		  services: ['Trello', 'Slack', 'Asana'],
		  books: ['Lean Startup', 'Business Model Generation'],
		},
		{
		  category: 'Программирование',
		  description: 'От базовых языков до продвинутых технологий разработки.',
		  services: ['GitHub', 'Stack Overflow', 'VSCode'],
		  books: ['Clean Code', 'You Don’t Know JS'],
		},
		// Добавляем другие категории по аналогии...
	 ];

	return (
		<div className={styles.wrapper}>
      <section className={styles.intro}>
			<div className={styles.introType}>Type: {firstCategory}</div>
        <h1>OnTop — найди лучший курс для своего роста</h1>
        <p>Выбирайте из сотен курсов по аналитике, бизнесу, дизайну и другим направлениям. Мы собрали лучшие материалы, сервисы и книги для вашего профессионального развития.</p>
        <Link href="/" legacyBehavior>
          <a className={styles.backButton}>Назад на главную</a>
        </Link>
      </section>

      <section className={styles.courses}>
        {courses.map((course, index) => (
          <div key={index} className={styles.courseCard}>
            <h2>{course.category}</h2>
            <p>{course.description}</p>
            <h3>Сервисы:</h3>
            <ul>
              {course.services.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
            <h3>Книги:</h3>
            <ul>
              {course.books.map((book, idx) => (
                <li key={idx}>{book}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

export default withLayout(Type);

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: firstLevelMenu.map(m => '/' + m.route),
		fallback: true
	};
};

export const getStaticProps: GetStaticProps<TypeProps> = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true
		};
	}
	const firstCategoryItem = firstLevelMenu.find(m => m.route == params.type);
	if (!firstCategoryItem) {
		return {
			notFound: true
		};
	}
	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
		firstCategory: firstCategoryItem.id
	});
	return {
		props: {
			menu,
			firstCategory: firstCategoryItem.id
		}
	};
};

interface TypeProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
}