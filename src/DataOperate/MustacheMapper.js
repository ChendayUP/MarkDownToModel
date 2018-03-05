let Property = {
    name: "name",
    mapperKey: "mapperKey",
    type: "type",
    defaultValue: "defaultValue",
}

let Model = {
    modelName: "modelName",
    superClass: "superClass",
    properties: "properties",
    property: Property,
}

let File = {
    originalJson: "originalJson",
    models: "models",
    model: Model,
}

let RenderKey = {
    file: File
}

let DeleteKeyName= ["api_version","error_code","error_msg"]

class MustacheMapper {
    constructor(jsonString,modelName) {    //constructor 构造方法
        this.jsonString = jsonString;
        this.modelName = modelName
        this.models = Array()
    }
    // 返回生成model数据模型
    renderObject() {
        let renderObj = Array();
        // renderObj[RenderKey.file.originalJson] = this.jsonString;
        this.jsonString = this.removeSpecialString(this.jsonString);
        let jsonArray = this.jsonObject();
        if (jsonArray == undefined) {
            return renderObj
        };

        this.models.length = 0;
        this.parseModels(jsonArray, this.modelName);
        this.models.reverse()
        this.models = this.mapperKeyAddDataPrefix(this.models)
        renderObj[RenderKey.file.models] = this.models
        return renderObj
    }

    // 处理第一个model,mapperkey前面加上"data."
    mapperKeyAddDataPrefix(model) {
        let copymodel = model[0]
        let properties = copymodel[RenderKey.file.model.properties]
        let news = []
        // for (var pro in properties) {
        //     if (properties.hasOwnProperty(pro)) {
        //         var element = properties[pro];
        //         element[RenderKey.file.model.property.mapperKey] = "data." + element[RenderKey.file.model.property.mapperKey]
        //     }
        // }
        let haveData = false
        for (let pro in properties) {
            if (properties.hasOwnProperty(pro)) {
                let element = properties[pro];
                let keyname = element[RenderKey.file.model.property.mapperKey]
                if (!DeleteKeyName.includes(keyname)) {
                    if (keyname === "data") {
                        haveData = true
                    } else {
                        news.push(element)
                    }
                }

            }
        }

        // 如果有data,把第二model的properties给data
        // 把mapperKey加上"data.
        if (haveData == true) {
            let model2 = model[1]
            let pro2 = model2[RenderKey.file.model.properties]
            for (let pro in pro2) {
                if (pro2.hasOwnProperty(pro)) {
                    var element = pro2[pro];
                    element[RenderKey.file.model.property.mapperKey] = "data." + element[RenderKey.file.model.property.mapperKey]
                }
            }
            news = news.concat(pro2)
        }

        copymodel[RenderKey.file.model.properties] = news
        model[0] = copymodel
  
        model.splice(1, 1)
        return model
    }

    // 解析model属性
    parseModels(jsonArray, modelName) {
        // var properties = Array()
        let properties = this.modelObject(jsonArray)
        properties.reverse()
        let model = Array()
        model[RenderKey.file.model.modelName] = modelName,
        model[RenderKey.file.model.superClass] = "Response",
        model[RenderKey.file.model.properties] = properties,
        
        this.models.push(model)
    }

    modelObject(jsonArray) {
        let properties = Array()
        for(var key in jsonArray){
            var value = jsonArray[key];
            let atype = Object.prototype.toString.call(value)
            if (atype === "[object Object]") { // 如果是object 就进行model解析

                let modelName = this.UpName(key) + "Model"
                this.parseModels(value,modelName)
                let propertyMap = Array()
                propertyMap[RenderKey.file.model.property.name] = key,
                propertyMap[RenderKey.file.model.property.mapperKey] = key,
                propertyMap[RenderKey.file.model.property.type] = modelName,
                propertyMap[RenderKey.file.model.property.defaultValue] = modelName + "?"
                properties.push(propertyMap)

            } else if (atype === "[object Array]") { // 如果是数组, 每个数据是json字典
                if (value.length > 0) {
                    let aObject = value[0]
                    let modelName = this.UpName(key)  + "Model" 
                    this.parseModels(aObject,modelName)
                    let propertyMap = Array()
                    propertyMap[RenderKey.file.model.property.name] = key,
                    propertyMap[RenderKey.file.model.property.mapperKey] = key,
                    propertyMap[RenderKey.file.model.property.type] = modelName,
                    propertyMap[RenderKey.file.model.property.defaultValue] = "["+ modelName + "]()"
                    properties.push(propertyMap)
                }
                
            } else {
                let propertyMap = Array()
                propertyMap[RenderKey.file.model.property.name] = key,
                propertyMap[RenderKey.file.model.property.mapperKey] = key,
                propertyMap[RenderKey.file.model.property.type] = this.mapType(value),
                propertyMap[RenderKey.file.model.property.defaultValue] = this.mapDefaultValue(value),
                properties.push(propertyMap)
            }
        }
        return properties
    }

    // 默认值
    mapDefaultValue(value) {
        let atype = Object.prototype.toString.call(value)
        switch (atype) {
            case "[object String]":
                return "\"\"";
                break;
            case "[object Number]":
                return -1;
                break;
            case "[object Boolean]":
                return false;
                break;
            case "[object Array]":
                return this.mapType(value) + "()";
                break;
            case "[object Object]":
                console.log("warn: object没有处理")
                return "warn: object没有处理";
                break;
            default:
                return "\"\"";
                break;
        }
    }

    mapType(value) {
        let atype = Object.prototype.toString.call(value)
        switch (atype) {
            case "[object String]":
                return "String";
                break;
            case "[object Number]":
                return "Int";
                break;
            case "[object Boolean]":
                return "Bool";
                break;
            case "[object Array]":
                if (value.count > 0) {
                    let ob = value[0]
                    return "[" + this.mapType(ob) + "]";
                } else {
                    return "[Any]"
                }
                break;
            case "[object Object]":
                console.log("warn: object没有处理")
                return "warn: object没有处理";
                break;
            default:
                return "String";
                break;
        }

    }

    // 数据类型
    mapType(value) {
        return "model"
    }

    jsonObject() {
        // 解析json字符串返回object
        let jsonArray
        try {
            jsonArray = JSON.parse(this.jsonString)
        } catch (e) {
            console.log(e.name);     // 'MyError'
            console.log(e.message);  // 'Default Message'
            console.log("json is error:")
            console.log(this.jsonString)
        }

        return jsonArray
    }

    removeSpecialString(string) {
        let str = this.removeHttpString(string)
        str = this.removeCommnent(str)
        return str
    }

    // 移除http
    removeHttpString(string) {
        let text = string.replace(/\"http.*\/\/.*\"/g,"\"\"")
        return text
    }

    // 移除注释
    removeCommnent(string) {
        let text = string.replace(/\/\/.*\n/g," \n ")
        return text
    }

     // 首字母大写
     UpName(string) {
        // 首字母大写
        return string.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }

}

export default MustacheMapper;