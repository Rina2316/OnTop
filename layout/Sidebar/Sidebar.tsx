import { SidebarProps } from './Sidebar.props';
import styles from './Sidebar.module.css';
import cn from 'classnames';
import { Menu } from '../Menu/Menu';

import { Search } from '../../components';
import Image from 'next/image';
import Logo from "../logo.webp";

export const Sidebar = ({ className, ...props }: SidebarProps): JSX.Element => {
	return (
		<div className={cn(className, styles.sidebar)} {...props}>
			<Image
				src={Logo}
				alt="Logo"
				width={100}
				height={100}
				priority
				className={styles.logo}
			/>
			<Search />
			<Menu />
		</div>
	);
};