import React, { Fragment } from 'react'

import './SideDrawer.css'
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/BackDrop/Backdrop';

const sideDrawer = props => {
	let attachedClasses = ["SideDrawer", "Close"];
	if (props.open) {
		attachedClasses = ["SideDrawer", "Open"];
	}
	return (
		<Fragment>
			<Backdrop show={props.open} clicked={props.closed}/>
		<div className={attachedClasses.join(' ')}>
			<div className="Logo-SideDrawer">
				<Logo />
			</div>
			<nav>
				<NavigationItems />
			</nav>
		</div>
		</Fragment>
	);
}

export default sideDrawer