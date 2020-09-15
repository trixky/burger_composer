import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'

class Checkout extends Component {
	// state = {
	// 	ingredients: null,
	// 	totalPrice: 0
	// }

	// componentWillMount() {
	// 	const query = new URLSearchParams(this.props.location.search);
	// 	const ingredients = {};
	// 	let price = 0;

	// 	for (let param of query.entries()) {
	// 		if (param[0] === 'price') {
	// 			price = param[1];
	// 		} else {
	// 			ingredients[param[0]] = +param[1]
	// 		}
	// 	}
	// 	this.setState({ ingredients, totalPrice: price });
	// }

	onCheckoutCancelled = _ => {
		this.props.history.goBack();
	}

	onCheckoutContinued = _ => {
		this.props.history.replace('/checkout/contact-data');
	}

	render() {
		return (
			<div>
				<CheckoutSummary
					ingredients={this.props.ings}
					onCheckoutCancelled={this.onCheckoutCancelled}
					onCheckoutContinued={this.onCheckoutContinued}
				/>
				<Route
					path={this.props.match.path + '/contact-data'}
					component={ContactData} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients
	}
}

export default connect(mapStateToProps)(Checkout);