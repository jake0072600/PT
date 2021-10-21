//此类用于处理loader问题
//依赖于
// GLTFLoader
// DRACOLoader
// OBJLoader
// FBXLoader

let BasicLoader=(function () {
    class BasicLoader{
        constructor(config){
            let manager=new THREE.LoadingManager();

            this.loader={
                dracoLoader:new THREE.DRACOLoader(manager),
                gltfLoader:new THREE.GLTFLoader(manager),
                objLoader:new THREE.OBJLoader(manager),
                jsonLoader:new THREE.ObjectLoader(manager),
                fbxLoader:new THREE.FBXLoader(manager),
                textureLoader:new THREE.TextureLoader(manager)
            }

            if(config.options.dracoSrc){
                this.loader.dracoLoader.setDecoderPath(config.options.dracoSrc);
                this.loader.gltfLoader.setDRACOLoader(this.loader.dracoLoader);
            }

            this.status={
                loading:false
            }

            this.view={
                loadIndex:0,
                cache:[]
            }

            manager.onStart=(url, itemsLoaded, itemsTotal)=>{
                this.dispatchEvent({type:"basicLoaderStart",message:""})
                //console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
            };
            manager.onError = ( url ) => {
                //console.log( 'There was an error loading ' + url );
            };
            manager.onProgress = ( url, itemsLoaded, itemsTotal )=>{
                this.dispatchEvent({type:"basicLoaderProgress",message:Math.floor(itemsLoaded/itemsTotal*100)})
                //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
            };

            manager.onLoad = ( ) => {
                this.dispatchEvent({type:"basicLoaderComplete",message:""})
                //console.log( 'Loading complete!');
            };
        }

        load(url,callback){
            this._resetView();
            if(url instanceof Array){
                this._loadArray(url,()=>{
                    if(callback) callback(this.view.cache);
                })
            }else if(typeof url==="string"){
                this._loadUrl(url,(rd)=>{
                    if(callback) callback(rd);
                })
            }
        }

        _getFileName(url){
            let ua1=url.split("/");
            let ua2 = ua1[ua1.length-1].split(".");
            return {fileName:ua2[0],lastName:ua2[1]};
        }

        _resetView(){
            let view=this.view;
            view.cache=[];
            view.loadIndex=0;
        }

        _loadArray(urls,callback){
            let view=this.view;

            let url=urls[view.loadIndex];
            this._loadUrl(url,()=>{
                view.loadIndex+=1;
                if(view.loadIndex<urls.length)
                    this._loadArray(urls,callback);
                else{
                    callback();
                    return;
                }
            })
        }

        _loadUrl(url,callback){
            let lna=url.split("/");
            let ln=lna[lna.length-1].split(".");
            let n=ln[ln.length-1];

            switch (n) {
                case "gltf":
                case "glb":{
                    this._loadGltfModel(url,callback);
                    break;
                }
                case "obj":{
                    this._loadObjModel(url,callback);
                    break;
                }
                case "json":{
                    this._loadJsonModel(url,callback);
                    break;
                }
                case "fbx":{
                    this._loadFbxModel(url,callback);
                    break;
                }
                case "jpg":
                case "png":
                case "jpge":{
                    this._loadTexture(url,callback)
                    break;
                }
                default:{
                    this._loadJsonModel(url,callback);
                    break;
                }
            }
        }

        _onLoadProgress(xhr){
            console.log('加载完成的百分比'+(xhr.loaded/xhr.total*100)+'%');
            this.dispatchEvent({type:"basicLoaderProgress",message:Math.floor((xhr.loaded/xhr.total*100))})
        }

        _loadGltfModel(url,callback){
            let loader=this.loader.gltfLoader;
            loader.load(url,(gltf)=>{
                let i=this.view.loadIndex
                let rd={model:gltf.scene,animations:gltf.animations,url:url};
                Object.assign(rd,this._getFileName(url));
                this.view.cache.push(rd);
                callback(rd);
                this.dispatchEvent({type:"loadComplete",message:{loadIndex:i}});
            },(xhr)=>{
                this._onLoadProgress(xhr)
            });
        }
        _loadObjModel(url,callback){
            let loader=this.loader.objLoader;
            loader.load(url,(obj)=>{
                let i=this.view.loadIndex
                let rd={model:obj,animations:[],url:url};
                Object.assign(rd,this._getFileName(url));
                this.view.cache.push(rd);
                callback(rd);
                this.dispatchEvent({type:"loadComplete",message:{loadIndex:i}});
            },(xhr)=>{
                this._onLoadProgress(xhr)
            })
        }
        _loadFbxModel(url,callback){
            let loader=this.loader.objLoader;
            loader.load(url,(obj)=>{
                let i=this.view.loadIndex;
                let rd={model:obj,animations:obj.animations,url:url};
                Object.assign(rd,this._getFileName(url));
                this.view.cache.push(rd);
                callback(rd);
                this.dispatchEvent({type:"loadComplete",message:{loadIndex:i}});
            },(xhr)=>{
                this._onLoadProgress(xhr)
            })
        }
        _loadJsonModel(url,callback){
            let loader=this.loader.jsonLoader;
            loader.load(url,(obj)=>{
                let i=this.view.loadIndex;
                let rd={model:obj,animations:obj.animations,url:url};
                Object.assign(rd,this._getFileName(url));
                this.view.cache.push(rd);
                callback(rd);
                this.dispatchEvent({type:"loadComplete",message:{loadIndex:i}});
            },(xhr)=>{
                this._onLoadProgress(xhr)
            })
        }

        _loadTexture(url,callback){
            let loader=this.loader.textureLoader;
            loader.load(url,(tex)=>{
                let i=this.view.loadIndex
                let rd={model:null,animations:[],url:url,texture:tex};
                Object.assign(rd,this._getFileName(url));
                this.view.cache.push(rd);
                callback(rd);
                this.dispatchEvent({type:"loadComplete",message:{loadIndex:i}});
            })
        }
    }

    Object.assign( BasicLoader.prototype, THREE.EventDispatcher.prototype);

    return BasicLoader;
})();
