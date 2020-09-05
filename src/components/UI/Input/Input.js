import React from 'react'

import './Input.css'

const input = props => {
	let inputElement = null;
	const inputClasses = ["InputElement"]

	if (props.invalid && props.shoudValidate && props.touched) {
		inputClasses.push('Invalid')
	}

	switch (props.elementType) {
		case ('input'):
			inputElement = <input
				className={inputClasses.join(' ')}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />
			break;
		case ('textarea'):
			inputElement = <textarea
				className={inputClasses.join(' ')}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />
			break;
		case ('select'):
			inputElement = (
				<select
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}>
					{props.elementConfig.options.map(options => (
						<option key={options.value} value={options.value}>
							{options.displayValue}
						</option>
					))}
				</ select>
			);
			break;
		default:
			inputElement = <input
				className={inputClasses.join(' ')}
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed} />

	}

	return (
		<div className="Input">
			<label className="Label"> {props.label}</label>
			{inputElement}
		</div>
	)
}

export default input