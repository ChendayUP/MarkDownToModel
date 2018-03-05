import React from 'react';
import MarkDownMapper from './MarkDownMapper';
import MustacheMapper from './MustacheMapper';
import Mustache from 'mustache';
import FileSaver from 'file-saver';
class MarkDownGenerator {
    constructor(markdown,model) {
        this.markdown = markdown;
        this.model = model;
    }

    output() {
        // let array = []
        // try {
        //     array.push(this.markdown2model());
        // } catch (e) {
        //     console.log(e.name);     // 'MyError'
        //     console.log(e.message);  // 'Default Message'
        //     let tArray = ["Comment":"------error-----"]
        //     array.push(tArray)
        // }

        let result = ""
        // 代码生成
        if (this.markdown.length === 0) {
            return;
        }
        let array = this.markdown2model()
        this.writeFile(array)
        if (array.length > 0) {
            result = Mustache.render(this.model, array[1]);
        } else {
            result = "识别为空"
        }
   

        return result
    }

    writeFile(array) {
        array.forEach(function(element) {
            let content = Mustache.render(this.model, element);
            // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            // saveAs(blob, "file.swift");//saveAs(blob,filename)
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, element["APIName"] + ".swift");
       }, this); 
	
	}

    markdown2model() {
        // 生成markdown json数据
        let markClass = new MarkDownMapper(this.markdown);
        /* 生成的数据
            {
                Comment:
                APIName:
                Variables:name,type,defaultValue
                APIModel:
                URL:
                originalJson:
                models:
        */
        let markObject = markClass.renderObject();

        let newObject = Array()
        //------------------ models生成 -----------------------------------
        markObject.forEach(function(element) {
            let newElement = element
            let models = this.getModels(element["originalJson"],element["APIModel"])
            newElement["models"] = models["models"]
            newObject.push(newElement)
       }, this);
     
        // 发送数据
        return newObject

    }

    getModels(json,modelName) {
         // 生成json数据
         let aclass = new MustacheMapper(json,modelName);
         let renderObject = aclass.renderObject();
         return renderObject
    }
}

export default MarkDownGenerator;