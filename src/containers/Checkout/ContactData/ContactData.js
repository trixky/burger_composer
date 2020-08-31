import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'

import axios_orders from '../../../axios-orders'

import './ContactData.css'

class ContactData extends Component {
	state = {
		name: '',
		email: '',
		address: {
			street: '',
			postalCode: ''
		},
		loading: false
	}

	orderHandler = event => {
		event.preventDefault();

		this.setState({ loading: true });
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.totalPrice,
			customer: {
				name: 'Mathis Bois',
				address: {
					street: '11 rue de la treille',
					zipCode: '41351',
					country: 'France'
				},
				email: 'test@test.com'
			},
			deliveryMethods: 'fatest'
		}
		axios_orders.post('/orders.json', order)
			.then(_ => {
				this.setState({ loading: false })
				console.log('on passe bien par la')
				this.props.history.push('/');
			})
			.catch(_ => this.setState({ loading: false }));
	}

	render() {
		let form = (
			<form>
				<input type="text" name="name" placeholder="Your Name" />
				<input type="email" name="email" placeholder="Your Mail" />
				<input type="text" name="street" placeholder="Street" />
				<input type="text" name="postal" placeholder="Postal Code" />
				<Button btnType="Success" clicked={this.orderHandler} >ORDER</Button>
			</form>
		)
		if (this.state.loading) {
			form = <Spinner />;
		}
		return (
			<div className="ContactData">
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		)
	}
}

export default ContactData;