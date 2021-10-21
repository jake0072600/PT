//如字面意思的一个TextMesh的管理实现
//包含一个简单的three字体管理
//依赖于
//three.js
//THREE.TTFLoader


let TextMesh=(()=>{

    let loader=new THREE.TTFLoader();

    let fonts={

    }

    let TextMeshs={
        length:0
    }

    class TextMesh{
        constructor(fontUrl,text,o3d,options) {

            options=options?options:{};
            this.id=options.id?options.id:THREE.MathUtils.generateUUID();

            if(TextMeshs[this.id]) return;

            this.options=options;
            this.text=text;
            this.o3d=o3d;

            this.textObj=new THREE.Group();
            this.o3d.add(this.textObj);

            if(fonts[fontUrl]){
                this.font=fonts[fontUrl];
                this._initText();

                TextMeshs[this.id]=this;
                TextMeshs.length++;
            }else{
                this._loadFont(fontUrl,()=>{
                    this._initText();

                    TextMeshs[this.id]=this;
                    TextMeshs.length++;
                })
            }

        }

        _loadFont(fontUrl,callback){
            loader.load(fontUrl,(json)=>{
                let font=new THREE.Font(json);
                fonts[fontUrl]=font;
                this.font=fonts[fontUrl];

                if(callback) callback();
            })
        }

        _initText(){
            let options=this.options;
            let text=this.text;
            let textObj=this.textObj;


            let textGeo=this._createTextGeo(text);
            textGeo.computeBoundingBox();

            let mesh=new THREE.Mesh(textGeo,new THREE.MeshBasicMaterial({color:options.color?options.color:0xff0000}));

            let centerOffset = new THREE.Vector3(
                - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x ),
                - 0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y ),
                - 0.5 * ( textGeo.boundingBox.max.z - textGeo.boundingBox.min.z ),
            );

            mesh.position.copy(centerOffset);

            textObj.add(mesh);


        }

        _createTextGeo(text){

            let options=this.options;
            let font=this.font;

            let textGeo=new THREE.TextBufferGeometry(text,{
                font:font,
                size:options.size?options.size:70,
                height:options.height?options.height:30,
                curveSegments:options.curveSegments?options.curveSegments:4,

                bevelThickness:options.bevelThickness?options.bevelThickness:2,
                bevelSize:options.bevelSize?options.bevelSize:1.5,
                bevelEnabled:false
            });

            return textGeo;

        }

        _destroyText(){

            let textObj=this.textObj;
            let mesh=textObj.children[0];

            mesh.geometry.dispose();
            mesh.material.dispose();
            mesh.geometry=null;
            mesh.material=null;

            textObj.remove(mesh);

        }

        setText(text,options){
            options=options?options:{};

            this.text=text;

            for(let a in options){
                if(this.options[a]&&options[a])
                    this.options[a]=options[a];
            }

            this._destroyText();
            this._initText();

        }

        setColor(color){
            let textObj=this.textObj;
            let mesh=textObj.children[0];
            if(!mesh) return;

            this.options.color=color;
            mesh.material.color=new THREE.Color(color);
        }
    }


    return{
        TextMesh:TextMesh,
        TextMeshs:TextMeshs,
        fonts:fonts
    }
})()