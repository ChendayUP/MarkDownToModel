
import React from 'react';
// import {
    
// } from 'react-dom';
import './JSONForm.css';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/github';
class JSONForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.data
		};
		// console.log("form data is "+this.props.data)
		this.handleChange = this
			.handleChange
			.bind(this);
	}

	handleChange(newValue) {
		// this.setState({value: event.target.value});
		this.props.onClick(newValue);
	}

	componentWillReceiveProps(nextProps) {
		// console.log("receiveProps")
		this.setState({value: nextProps.data});

	}

	render() {
		//  console.log("render form data is "+this.props.data)
		//  this.setState({value:this.props.data})
		return (
           
			<div className="subFormStyle">
				{/* <textarea
					className="josntextarea"
					name="body"
					onChange={this.handleChange}
					defaultValue={this.state.value}
					value = {this.state.value}>
				</textarea> */}

				<AceEditor
				className = "josnEditor"
				width="100%"
				height = "100%"
				mode="json"
				theme="github"
				onChange={this.handleChange}
				name="UNIQUE_ID_OF_DIV"
				editorProps={{ $blockScrolling: true }}
				defaulValue = {this.state.value}
				value = {this.state.value}/>
				{/* <p>{this.state.value}</p> */}
			</div> 
		);
	}
}

export default JSONForm;