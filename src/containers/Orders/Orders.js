import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios_order from '../../axios-orders'
import withErrorHandler from '../../containers/withErrorHandler/withErrorHandler'

class Orders extends Component {
	state = {
		orders: [],
		loading: true
	}

	componentDidMount() {
		axios_order.get('/orders.json')
			.then(res => {
				const fetchedOrders = [];
				for (let key in res.data) {
					fetchedOrders.push({ ...res.data[key], id: key });
				}
				console.log("du coup:")
				console.log(res.data)
				this.setState({ loading: false, orders: fetchedOrders })
			})
			.catch(err => {
				this.setState({ loading: false })
				alert('error: orders not fetched...')
			})
	}

	render() {
		return (
			<div>
				{this.state.orders.map(order => (
					<Order
						key={order.id}
						ingredients={order.ingredients}
						price={+order.price}
					/>
				))}
			</div>
		)
	}
}

export default withErrorHandler(Orders, axios_order);