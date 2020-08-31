import React, { Component, Fragment } from 'react'

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios_orders from '../../axios-orders';
import withErrorHandler from '../../containers/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from 'axios';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7,
};

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchaseable: false,
		purchasint: false,
		loading: false
	}

	componentDidMount() {
		axios.get('https://react-my-burger-c654e.firebaseio.com/ingredients.json')
			.then(res => {
				this.setState({ ingredients: res.data })
			})
			.catch(err => { })
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(igKey => (
				ingredients[igKey]
			))
			.reduce((sum, el) => (sum + el), 0);
		this.setState({ purchaseable: sum > 0 })
	}

	AddIngredIentHandler = type => {
		const oldCount = this.state.ingredients[type];
		const updatedCounted = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCounted;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
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
		const oldPrice = this.state.totalPrice;
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

	purchaseContinueHandler = _ => {
		const queryParamas = [];
		for (let i in this.state.ingredients) {
			queryParamas.push(
				encodeURIComponent(i) +
				'=' +
				encodeURIComponent(this.state.ingredients[i]))
		}
		queryParamas.push('price=' + this.state.totalPrice);
		const queryString = queryParamas.join('&');

		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		}
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;
		let burger = <Spinner />;

		if (this.state.ingredients) {
			burger = (
				<Fragment>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						ingredientsAdded={this.AddIngredIentHandler}
						ingredientsRemoved={this.RemoveIngredIentHandler}
						disabled={disabledInfo}
						purchaseable={this.state.purchaseable}
						ordered={this.purchaseHandler}
						price={this.state.totalPrice} />
				</Fragment>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.state.ingredients}
					price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios_orders)