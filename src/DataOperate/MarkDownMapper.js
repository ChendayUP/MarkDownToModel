let DeleteVariable = ["sessionid"]
let APIMODELNAME = ""
class MarkDownMapper {
    constructor(markdown) {    //constructor 构造方法
        this.markdown = markdown;
    }
    // 返回生成model数据模型
    renderObject() {
        // 拆分markdown
        // 识别json数据,第偶数个就是json
        let apis = Array()
        let wrapper_result=this.markdown.split("```");
        let count = (wrapper_result.length - 1) / 2
        for (let index = 0; index < count; index++) {
            let element = wrapper_result[index*2];
            let json = wrapper_result[index*2 + 1];
            apis.push(this.getAPI(element,json))
        }
        return apis
    }

    getAPI(variable,json) {
        let renderObj = Array();
         renderObj["originalJson"] = json
         renderObj["URL"] = this.URL(variable)
         renderObj["Comment"] = this.Comment(variable)
         renderObj["APIName"] = this.APIName(renderObj["URL"])

         renderObj["APIModel"] = renderObj["APIName"] + "Response"
         let tvariables = this.variables(variable)
         if (tvariables.length > 0 ){
            renderObj["variables"] = tvariables
         }
         
         return renderObj
    }

    URL(string) {
         // 地址
         let reg = /\s*([a-zA-Z0-9_-]+)\s*\/\s*([a-zA-Z0-9_-]+)\s*\/\s*([a-zA-Z0-9_-]+)\s*/g
         let result = reg.exec(string)
         if (result.length === 4) {
             return result[1] + "/" + result[2] + "/" + result[3]
         } else {
            return result[0]
         }
         
    } 

    Comment(string) {
        // comment 
        /*
        获取登录短信验证码
        --------------------------
        */
        let reg = /([0-9、()\u4e00-\u9fa5]+)\S*[^|]-*[^|]/g
        let result = reg.exec(string)
        return result[1]
    }

    APIName(string) {
        // let reg = /[a-zA-Z0-9_-]+\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/g
        let reg = /\s*[a-zA-Z0-9_-]+\s*\/\s*([a-zA-Z0-9_-]+)\s*\/\s*([a-zA-Z0-9_-]+)\s*/g
        let result = reg.exec(string)
        return this.UpName(result[1]) + this.UpName(result[2])
    }

    // 去掉-_,首字母大写
    UpName(string) {
        // 首字母大写
        // 先判断有没有-_
        let reg = /([a-zA-Z0-9_-]+)[-_]([a-zA-Z0-9_-]+)/g
        let result = reg.exec(string)
        if (result !== null && result.length == 3) {
            return this.UpName(result[1]) + this.UpName(result[2]);
        } else {
            // 首字母大写,其他字母保存原状
            return string.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
        }
    }

    variables(string) {
        // 识别参数
        let array = []
        let reg = /([a-zA-Z0-9_]*)\|(.*)\|([a-zA-Z]*)\|([a-zA-Z0-9-]*)\|/g,
            crt;
        while((crt = reg.exec(string)) !== null){
            if (!DeleteVariable.includes(crt[1])) {
                let temp = []
                temp["name"] = crt[1]
                temp["type"] = this.UpName(crt[3])
                if (!(crt[4].trim() == "-")) {
                    temp["defaultValue"] = crt[4]
                    temp["haveDefault"] = true
                }else {
                    temp["haveDefault"] = false
                }
                array.push(temp)
            }
        };
        return array
    }

}

export default MarkDownMapper;