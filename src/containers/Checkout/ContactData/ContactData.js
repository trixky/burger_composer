import React, { Component } from 'react';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'

import axios_orders from '../../../axios-orders'
import Input from '../../../components/UI/Input/Input'


import './ContactData.css'

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				validation: {
					required: true
				},
				valide: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street'
				},
				value: '',
				validation: {
					required: true
				},
				valide: false,
				touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'ZIP Code'
				},
				value: '',
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				valide: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country'
				},
				value: '',
				validation: {
					required: true
				},
				valide: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your Email'
				},
				value: '',
				validation: {
					required: true
				},
				valide: false,
				touched: false
			},
			deliveryMethods: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					]
				},
				value: 'fastest',
				validation: {
					required: false
				},
				valide: true,
				touched: false
			}
		},
		formIsValid: false,
		loading: false
	}

	orderHandler = event => {
		event.preventDefault();

		this.setState({ loading: true });
		const formData = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}

		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData
		}

		axios_orders.post('/orders.json', order)
			.then(_ => {
				this.setState({ loading: false })
				this.props.history.push('/');
			})
			.catch(_ => this.setState({ loading: false }));
	}

	checkValidity(value, rules) {
		let isValide = true;

		if (rules.required) {
			isValide = value.trim() !== '' && isValide;
		}

		if (rules.minLength) {
			isValide = value.length >= rules.minLength && isValide;
		}

		if (rules.maxLength) {
			isValide = value.length <= rules.maxLength && isValide;
		}

		return (isValide)
	}

	inputChangedHandler = (event, inputIdentier) => {
		const updatedOrderForm = {
			...this.state.orderForm
		}
		const updatedFormElement = { ...updatedOrderForm[inputIdentier] }

		updatedFormElement.value = event.target.value;
		updatedFormElement.valide = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIdentier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentier].valide && formIsValid
		}

		this.setState({ orderForm: updatedOrderForm, formIsValid });
	}

	render() {
		const formElementsArray = [];

		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			})
		}

		let form = (
			<form onSubmit={this.orderHandler}>
				{/* <Input elementType="..." elementConfig="..." value="..." /> */}
				{formElementsArray.map(formElement => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valide}
						shoudValidate={formElement.config.validation.required}
						touched={formElement.config.touched}
						changed={(event) => this.inputChangedHandler(event, formElement.id)}
					/>
				))}
				<Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
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

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	}
};

export default connect(mapStateToProps)(ContactData);