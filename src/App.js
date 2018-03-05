
/* global console */
import React from 'react';
// import Display from './Display';
// import ButtonPanel from './ButtonPanel';
import JSONForm from './Input/JSONForm';
import './App.css';
import Mustache from 'mustache';
import MarkDownGenerator from './DataOperate/MarkDownGenerator'

class App extends React.Component {
	constructor(props) {
		super(props);
		let jsonValue = ""
		// let jsonValue = `
		// 获取登录短信验证码
		// --------------------------
		
		// **地址**
		
		// appapi/doctor/getSmsCode
		
		// 参数
		
		// 参数|是否必填|类型|默认值|说明|
		// ----|---------|------|-------|--------|
		// phone|是|string|-|手机号|
		
		// **结果**
		
		// \`\`\`
		// {
		// 	"error_code": 0,
		// 	"error_msg": ''
		// }
		// \`\`\`
		
		// 手机号登录
		// --------------------------
		
		// **地址**
		
		// appapi/doctor/login
		
		// 参数
		
		// 参数|是否必填|类型|默认值|说明|
		// ----|---------|------|-------|--------|
		// phone|是|string|-|手机号|
		// code|是|string|-|短信验证码|
		
		// **结果**
		
		// \`\`\`
		// {
		// 	"data": {
		// 		"sessionid": "cbv3ho4mpnpo0g7akp0uhuice2"
		// 	},
		// 	"api_version": null,
		// 	"error_code": 0,
		// 	"error_msg": ""
		// }
		// \`\`\`
		
		// 注册
		// --------------------------
		
		// \`注:发送短信请求上面的短信接口\`
		
		// **地址**
		
		// appapi/doctor/register
		
		// 参数
		
		// 参数|是否必填|类型|默认值|说明|
		// ----|---------|------|-------|--------|
		// phone|是|string|-|-|
		// code|是|string|-|-|
		// pwd|是|string|-|-|
		// repwd|是|string|-|-|
		
		
		// **结果**
		
		// \`\`\`
		// {
		// 	"data": {
		// 		"sessionid": "cbv3ho4mpnpo0g7akp0uhuice2"
		// 	},
		// 	"api_version": null,
		// 	"error_code": 0,
		// 	"error_msg": ""
		// }
		// \`\`\`
		// `
		let modelValue = `
		import ObjectMapper
		import CloudDoctorPublic
		import Foundation

		{{{Error}}}
		// {{{Comment}}}
		extension API {
			static func {{{APIName}}}({{#variables}}{{{name}}}: {{{type}}} {{#haveDefault}}= {{{defaultValue}}}{{/haveDefault}},{{/variables}} callback: @escaping ({{{APIModel}}}) -> Void) {
				let config = RequestConfig<{{{APIModel}}}>(URLPath: "{{{URL}}}")
				{{#variables}}
				config["{{{name}}}"] = {{{name}}}
				{{/variables}}
				addRequestHeader(config)
				NetworkManager().request(config, callback: callback)
			}
		}

		/*
		{{{originalJson}}}
		*/
		
		{{#models}}
		// MARK:
		class {{{modelName}}} : {{{superClass}}} {
			
			{{#properties}}var {{name}} = {{{defaultValue}}}
			{{/properties}}
			
			override func mapping(map: Map) {
		
				super.mapping(map: map)
				{{#properties}}{{name}} <- map["{{mapperKey}}"]
				{{/properties}}
				
			}
		} 
		
		{{/models}}
   		`;
		let outputValue = 'json model output';

		this.state = {
			squares: [
				jsonValue, modelValue, outputValue
			], //Array(9).fill("qqqq"),
			// total: null, next: null, operation: null
			typeShowName: {
				'string': 'String',
				'number': 'Int',
				'object': '[model]',
				'boolean': 'Bool'
			},
			defaultValue: {
				'string': '',
				'number': '-1',
				'boolean': 'false',
				'object': '[]'
			}
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		// this.handleClick(0,"sssssssss") console.log("DidMount:")
		// console.log(this.state.squares)
		this.handleClick(0, this.state.squares[0]);
	}

	componentWillUnmount() {
		// console.log("WillUnMount:")
	}
	/*
	handleJSONToMustache(json, mustache) {
		try {
			let parsed = JSON.parse(json);
			console.log(typeof (parsed));
			let result = [];
			for (var x in parsed) {
				console.log(x);
				let type = typeof (parsed[x]);
				result.push({
					'type': this.state.typeShowName[type],
					'typename': x,
					'strong': true,
					'image': true,
					'uitype': 'Label',
					'defaultValue': this.state.defaultValue[type]
				});
			}

			let dic = {
				'properties': result,
				'name': '',
				'json': json
			};

			JSON.stringify(result);
			console.log(JSON.stringify(result));

			let string = Mustache.render(mustache, dic);

			console.log('mustache is ' + string);
			return string;

		} catch (ex) {
			alert(ex.name + '\n' + ex.message);
			console.log(ex.message); //t is not defined
			console.log(ex.name); //ReferenceError
		}

	}
	*/

	handleClick(key, value) {
		// console.log("key is " + key +", value is "+value)
		const squares = this
			.state
			.squares
			.slice();
		squares[key] = value;
		// squares[1] = value if (key === 0) {   squares[2] = value }

		// squares[2] = this.handleJSONToMustache(squares[0], squares[1]);


		// squares[2] = this.handleJSONToMustache(squares[0], squares[1]);
		let outvalue = new MarkDownGenerator(squares[0], squares[1]).output()
		squares[2] = outvalue
		// console.log("squares[2] is " + squares[2]) console.log("squares is " +
		// squares)
		this.setState({ squares: squares });
	}

	renderJSONForm(i) {
		// console.log("app form is " + this.state.squares[i])
		return (<JSONForm
			data={this.state.squares[i]}
			onClick={(value) => this.handleClick(i, value)} />);

	}

	readFile(evt) {
		let files = evt.target.files; // FileList object

		let reader = new FileReader();

		// Closure to capture the file information.
		// reader.onload = (function (theFile) {
		// 	return function (e) {
		// 		// Render thumbnail.
		// 		console.log(e.target.result)
		// 		alert(e.target.result)
		// 		// this.handleClick(0,e.target.result)
		// 	};
		// })(files[0]);readAsDataURL
		// reader.onload = {(e) => this.handleClick(0,e.target.result)};
		// reader.onload = function(e) {
		// 	// this.handleClick(0,e.target.result)
		// 	alert(e.target.result)
		// };
		reader.onload = () => this.handleClick(0,reader.result)

		// Read in the image file as a data URL.
		reader.readAsText(files[0]);


	}

	render() {
		// console.log("render") console.log(this.state.squares)    var data = { "name":
		// " xiaohua ",     "msg": {         "sex": " female ",         "age": " 22 ",
		// "hobit": " reading "     },    "subject": ["Ch","En","Math","physics"] } var
		// tpl = '<p>{{name}}</p>';  var html = Mustache.render(tpl, data);
		// 在form中提前输入数据,在最后一个form中输出数据 left form获取数据,right form输入数据 reacjs 数据传递
		return (
			<div className='App'>

				<h1>
					Json convert to model
				</h1>
				<div className='convertButton'>
					{/* <input type="file" id="files" name="files[]" multiple />
				<output id="list"></output> */}
					<input id="upload" ref="upload" type="file" accept="md/*"
						onChange={(event) => {
							this.readFile(event)
						}}
						onClick={(event) => {
							event.target.value = null
						}}
					/>
				</div>

				<div className='formstyle'>
					<div className="leftForm">
						{this.renderJSONForm(0)}
						{this.renderJSONForm(1)}
					</div>
					<div className="rightForm">
						{this.renderJSONForm(2)}
					</div>

				</div>

				{/* /* <ButtonPanel
          clickHandler={this.handleClick}
        /> */}

			</div>
		);
	}
}
export default App;
