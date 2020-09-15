import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions'

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios_orders from '../../axios-orders';
import withErrorHandler from '../../containers/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from 'axios';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7,
};

class BurgerBuilder extends Component {
	state = {
		// ingredients: null,
		// totalPrice: 4,
		// purchaseable: false,
		purchasint: false,
		loading: false
	}

	componentDidMount() {
		// axios.get('https://react-my-burger-c654e.firebaseio.com/ingredients.json')
		// 	.then(res => {
		// 		this.setState({ ingredients: res.data })
		// 	})
		// 	.catch(err => { })
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => (
				ingredients[igKey]
			))
			.reduce((sum, el) => (sum + el), 0);
		// this.setState({ purchaseable: sum > 0 })
		return (sum > 0);
	}

	AddIngredIentHandler = type => {
		const oldCount = this.state.ingredients[type];
		const updatedCounted = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCounted;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.props.price;
		const newPrice = oldPrice + priceAddition;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchaseState(updatedIngredients);
	}

	RemoveIngredIentHandler = type => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0)
			return;
		const updatedCounted = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCounted;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.props.price;
		const newPrice = oldPrice - priceDeduction;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = _ => {
		this.setState({ purchasing: true })
	}

	purchaseCancelHandler = _ => {
		this.setState({ purchasing: false })
	}

	// purchaseContinueHandler = _ => {
	// 	const queryParamas = [];
	// 	for (let i in this.props.ingredients) {
	// 		queryParamas.push(
	// 			encodeURIComponent(i) +
	// 			'=' +
	// 			encodeURIComponent(this.state.ingredients[i]))
	// 	}
	// 	queryParamas.push('price=' + this.props.price);
	// 	const queryString = queryParamas.join('&');

	// 	this.props.history.push({
	// 		pathname: '/checkout',
	// 		search: '?' + queryString
	// 	});
	// }

	purchaseContinueHandler = _ => {
		this.props.history.push('/checkout');
	}

	render() {
		console.log('les ings = ')
		console.log(this.props.ings)
		const disabledInfo = {
			...this.props.ings
		}
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		let burger = <Spinner />;

		if (this.props.ings) {
			burger = (
				<Fragment>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientsAdded={this.props.onIngredientAdded}
						ingredientsRemoved={this.props.onIngredientRemoved}
						disabled={disabledInfo}
						purchaseable={this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler}
						price={this.props.price} />
				</Fragment>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ings}
					price={this.props.price}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinue={this.purchaseContinueHandler} />
			)
		}

		if (this.state.loading) {
			orderSummary = <Spinner />;
		}

		return (
			<Fragment>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
		onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
	}
}

export default  connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios_orders))