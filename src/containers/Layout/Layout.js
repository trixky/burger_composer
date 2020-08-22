import React, { Fragment, Component } from 'react';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

import './Layout.css'

class Layout extends Component {
	state = {
		showSideDrawer: false
	}

	sideDrawerClosedHandler = _ => {
		this.setState({ showSideDrawer: false })
	}
	
	drawerToggleClicked = _ => {
		this.setState((prevState) => ({
			showSideDrawer: !prevState.showSideDrawer
		}))
	}

	render() {
		return (
			<Fragment>
				<Toolbar drawerToggleClicked={this.drawerToggleClicked} />
				<SideDrawer
					open={this.state.showSideDrawer}
					closed={this.sideDrawerClosedHandler} />
				<main className='main-content'>
					{this.props.children}
				</main>
			</Fragment>
		)
	}
}

export default Layout;