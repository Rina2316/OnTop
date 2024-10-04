import { GetStaticProps } from 'next'; 
import React, { useRef, useState } from 'react';
import { Button, Htag, Input, P, Tag } from '../components';
import { withLayout } from '../layout/Layout';
import axios from 'axios';
import { MenuItem } from '../interfaces/menu.interface';
import { API } from '../helpers/api';
import Image from 'next/image';
import main from "./main.jpg"
import styles from "./styles/index.module.css";
import { Search } from '../components';

function Home({ menu }: HomeProps): JSX.Element {
  const [rating, setRating] = useState<number>(5);

  // Создаем реф для поиска
  const searchRef = useRef<HTMLInputElement>(null);

  // Функция для скролла и фокуса
  const handleFindCourse = () => {
    if (searchRef.current) {
      // Скроллим к элементу
      searchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Устанавливаем фокус на инпут
      searchRef.current.focus();
    }
  };
  

  return (
    <div className={styles.wrapper}>
      <section style={{ textAlign: 'center', padding: '2rem 0' }} className={styles.firstBlock}>
        <Htag tag='h1'>OnTop — найди лучший курс для своего роста</Htag>
        <P size='l'>
          Выбирайте из сотен курсов по аналитике, бизнесу, дизайну и другим направлениям. Мы собрали лучшие материалы, сервисы и книги для вашего профессионального развития.
        </P>
        <Button appearance='primary' arrow='right' className={styles.button} onClick={handleFindCourse}>
          Найти курс
        </Button>
      </section>

      <section style={{ textAlign: 'center', padding: '2rem 0', background: '#f5f5f5' }} className={styles.firstBlock}>
        <div className={styles.logo}>
          <Image
            src={main}
            alt="Главное фото"
            fill
            priority
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <Htag tag='h2'>Почему OnTop?</Htag>
        <P>На платформе представлены только курсы с подтверждённым качеством, отобранные нашими экспертами.</P>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Tag size='m' color='green'>100+ курсов</Tag>
          <Tag size='m' color='red'>Проверенные материалы</Tag>
          <Tag size='m' color='primary'>Новые программы ежемесячно</Tag>
        </div>
      </section>

      <section style={{ padding: '2rem 0' }} className={styles.firstBlock}>
        <Htag tag='h3'>Отзывы пользователей</Htag>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ width: '30%', textAlign: 'center' }}>
            <P>«Курс по аналитике помог мне повысить навыки и получить новую должность!»</P>
            <Tag size='s' color='green'>Иван Петров</Tag>
          </div>
          <div style={{ width: '30%', textAlign: 'center' }}>
            <P>«Благодаря курсам по бизнесу, я смог запустить свой стартап!»</P>
            <Tag size='s' color='green'>Мария Иванова</Tag>
          </div>
          <div style={{ width: '30%', textAlign: 'center' }}>
            <P>«Отличные материалы по дизайну, много практики!»</P>
            <Tag size='s' color='green'>Александр Смирнов</Tag>
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '2rem 0' }} className={styles.firstBlock}>
        <Htag tag='h2'>Попробуйте сейчас</Htag>
        {/* Передаем реф в компонент Search */}
        <Search ref={searchRef} />
        <Button appearance='primary' arrow='right' className={styles.button} onClick={handleFindCourse}>
          Найти
        </Button>
      </section>
    </div>
  );
}

export default withLayout(Home);

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
