import React, {useEffect, useRef, useState} from "react";
// import devOptimaLogo from "../../logo/devOptimaLogo.png"
// import inLogo from "../../logo/inLogo.png"
import MenuIcon from '@rsuite/icons/Menu';
import CloseIcon from '@rsuite/icons/Close';
// import { Link } from 'react-scroll'

import './Navbar.scss'

export const Navbar = () => {

	const [activeMobileMenu, setActiveMobileMenu] = useState<boolean>(false);

	const refMenu = useRef<any>(null)


	const handleClickOutsideMenu =  (event: any) => {
		if (refMenu.current && refMenu.current.contains(event.target)) {
			setActiveMobileMenu(true);
		} else if (refMenu.current && !refMenu.current.contains(event.target)) {
			setActiveMobileMenu(false);
		}
	}

	useEffect(() => {
		document.addEventListener('mouseover', handleClickOutsideMenu)
		return () => {
			document.removeEventListener('mouseover', handleClickOutsideMenu)
		}
	}, [refMenu])

	window.addEventListener('scroll', () => {
		// console.log('screenTop', window.scrollY);
		if (window.scrollY) {
			setActiveMobileMenu(false);
		}
	});


	return (
		<div className="navbar">
			<div className="navbar-mobile-btn-open"
			     onClick={ () => {
				     setActiveMobileMenu(!activeMobileMenu)
			     }}
			>
				{
					activeMobileMenu ? <MenuIcon color="white"/> : <MenuIcon color="whitesmoke"/>
				}
			</div>
			<div
				className={`navbar-menu${activeMobileMenu ? ' active' : ''}`}
				ref={refMenu}
			>
				<div className="navbar-menu-items">
					Home
				</div>
			</div>
		</div>
	);
};
