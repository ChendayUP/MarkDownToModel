import React from 'react';
import MustacheMapper from './MustacheMapper';
import Mustache from 'mustache';

class ModelGenerator {
    constructor(json,model) {
        this.json = json;
        this.model = model;
        // super(props);
        // this.state = {
        //     json: this.props.json,
        //     model: this.props.model
        // };
        // this.handleChange = this
        //     .handleChange
        //     .bind(this);
    }

    output() {
        return this.json2model();
    }

    json2model() {
        // this.setState({ json: this.props.json,
        //                 model: this.props.model });
                        
        // 生成json数据
        let aclass = new MustacheMapper(this.json);
        let renderObject = aclass.renderObject();
        // 代码生成
        let result = Mustache.render(this.model, renderObject);
        // 生成model文件
        // let template = Template(this.model)
        // 代码生成
        // let result = template.render(renderObjct)
        // 发送数据
        return result

    }
}

export default ModelGenerator;