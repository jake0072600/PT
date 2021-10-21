//此类用于处理loader问题以及相关loaded表演管理
//依赖于
// GLTFLoader
// DRACOLoader
// OBJLoader
// FBXLoader

//bs BasicStage对象
//config 多场景配置
let Drama=(function () {
    class Drama{
        constructor(bs,config) {
            this.bs = bs;
            this.config = config;

            this.loader={
                dracoLoader:new THREE.DRACOLoader(),
                gltfLoader:new THREE.GLTFLoader(),
                objLoader:new THREE.OBJLoader(),
                jsonLoader:new THREE.ObjectLoader(),
                fbxLoader:new THREE.FBXLoader()
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
                stageIndex:0
            }

            this._init();
        }

        _init(){
            this._loadStageByNow()
        }
        _loadStageByNow(){
            let config=this.config;
            let view=this.view;

            let stage=config.stages[view.stageIndex];
            this._loadStage(stage);
            let preStage=config.stages[view.stageIndex+1];
            if(preStage)
                this._loadStage(preStage,true)
        }
        loadStageByNext(){
            if(this.status.loading) return;
            let config=this.config;
            let view=this.view;
            this.status.loading=true;

            let stage=config.stages[view.stageIndex+1];
            if(!stage) {this.status.loading=false;return;}

            this._doEnter(config.stages[view.stageIndex],()=>{
                view.stageIndex+=1;
                this._loadStageByNow();
            },'leave')

        }
        loadStageByPrev(){
            if(this.status.loading) return;
            let config=this.config;
            let view=this.view;
            this.status.loading=true;

            let stage=config.stages[view.stageIndex-1];
            if(!stage) {this.status.loading=false;return;}

            this._doEnter(config.stages[view.stageIndex],()=>{
                view.stageIndex-=1;
                this._loadStageByNow();
            },'leave')

        }
        loadStageByIndex(index){
            if(this.status.loading) return;
            let config=this.config;
            let view=this.view;
            this.status.loading=true;

            let stage=config.stages[index];
            if(!stage) {this.status.loading=false;return;}

            this._doEnter(config.stages[view.stageIndex],()=>{
                view.stageIndex=index;
                this._loadStageByNow();
            },'leave')

        }

        _doEnter(stage,callback,enterOrLeave){
            if(!stage.model) return;
            if(stage.enter){
                stage.enter.pause().seek(1);
            }
            if(stage.leave) {
                stage.leave.pause().seek(0);
            }

            let enter = stage.options[enterOrLeave];
            if(!enter){
                if(callback) callback();
                return;
            }else{
                switch (enter) {
                    case "randomVector":{
                        this._doEnterRV(stage,callback,enterOrLeave);
                        break;
                    }
                    case "vector":{
                        this._doEnterV(stage,callback,enterOrLeave);
                        break;
                    }
                    case "spin":{
                        this._doEnterS(stage,callback,enterOrLeave);
                        break;
                    }
                }
            }
        }
        _doEnterRV(stage,callback,enterOrLeave){
            if(!stage.model) return;

            let d="from";
            if(enterOrLeave==="enter") d="from";
            if(enterOrLeave==="leave") d="to";

            /*if(!stage.enter){*/
                let r=this.bs.o3d.worldRadius;
                stage[enterOrLeave]=new TimelineMax({paused:true,onComplete:()=>{if(callback) callback();}});
                stage.model.updateMatrixWorld();
                stage.model.traverse((child)=>{
                    if(child.isMesh){
                        let x=Math.random()*r*2-r;
                        let y=Math.random()*r*2-r;
                        let z=Math.random()*r*2-r;
                        let p=new THREE.Vector3(x,y,z)
                        p.add(child.position);
                        stage[enterOrLeave][d](child.position,1,{x:p.x,y:p.y,z:p.z},'enterRV');
                    }
                });
                stage[enterOrLeave].play();
/*            }
            else{
                stage.enter.restart();
            }*/
        }
        _doEnterV(stage,callback,enterOrLeave){
            if(!stage.model) return;

            let d="from";
            if(enterOrLeave==="enter") d="from";
            if(enterOrLeave==="leave") d="to";

            /*if(!stage.enter){*/
                let r=this.bs.o3d.worldRadius;
                let a=['x','y','z'];
                stage[enterOrLeave]=new TimelineMax({paused:true,onComplete:()=>{if(callback) callback();}});
                stage.model.updateMatrixWorld();
                stage.model.traverse((child)=>{
                    if(child.isMesh){
                        let p=new THREE.Vector3();
                        p[a[Math.floor(Math.random()*3)]]=Math.random()*2-1>0?r*2:-r*2;
                        p.add(child.position);
                        stage[enterOrLeave][d](child.position,1,{x:p.x,y:p.y,z:p.z},'enterV');
                    }
                });
                stage[enterOrLeave].play();
/*            }
            else{
                stage.enter.restart();
            }*/
        }
        _doEnterS(stage,callback,enterOrLeave){
            if(!stage.model) return;

            let d="from";
            if(enterOrLeave==="enter") d="from";
            if(enterOrLeave==="leave") d="to";

            /*if(!stage.enter){*/
                let model=stage.model;
                let r=this.bs.o3d.worldRadius;
                stage[enterOrLeave]=new TimelineMax({paused:true,onComplete:()=>{if(callback) callback();}});
                model.updateMatrixWorld();
                let p=new THREE.Vector3();
                p.add(new THREE.Vector3(0,-r*2,0));
                stage[enterOrLeave][d](model.position,1,{x:p.x,y:p.y,z:p.z},'enterS');
                stage[enterOrLeave][d](model.rotation,1,{y:Math.PI*4},'enterS');
                stage[enterOrLeave].play();
/*            }
            else{
                stage.enter.restart();
            }*/
        }
        _doLeave(stage){

        }

        _loadStage(stage,pre){
            let lna=stage.src.split("/");
            let ln=lna[lna.length-1].split(".");
            let n=ln[ln.length-1];

            switch (n) {
                case "gltf":
                case "glb":{
                    this._loadGltfModel(stage,pre);
                    break;
                }
                case "obj":{
                    this._loadObjModel(stage,pre);
                    break;
                }
                case "json":{
                    this._loadJsonModel(stage,pre);
                    break;
                }
                case "fbx":{
                    this._loadFbxModel(stage,pre);
                    break;
                }
                default:{
                    this._loadJsonModel(stage,pre);
                    break;
                }
            }
        }

        _loadGltfModel(stage,pre){
            if(stage.model&&!pre){
                this.bs.setModel(stage.model);
/*                if(stage.animations){
                    this.bs.setMixer(stage.model,stage.animations);
                }*/
                this._doStageOption(stage,()=>{
                    if(stage.animations){
                        this.bs.setMixer(stage.model,stage.animations);
                    }
                });
                return;
            }

            let loader=this.loader.gltfLoader;
            loader.load(stage.src,(gltf)=>{
                stage.model=gltf.scene

                if(gltf.animations.length)
                    stage.animations=gltf.animations;

                if(!pre){
                    this.bs.setModel(stage.model);
                    this._doStageOption(stage,()=>{
                        if(gltf.animations.length){
                            stage.animations=gltf.animations;
                            this.bs.setMixer(gltf.scene,gltf.animations);
                        }
                    });
                }

                this.dispatchEvent({type:"loadCompleteMain",message:""})

                //stage.model=gltf.model;
            },(xhr)=>{this.dispatchEvent({type:"loadProgressesMain",message:xhr.loaded / xhr.total * 100})},()=>{})
        }
        _loadObjModel(stage,pre){
            if(stage.model&&!pre){
                this.bs.setModel(stage.model);
                this._doStageOption(stage);
                return;
            }

            let loader=this.loader.objLoader;
            loader.load(stage.src,(obj)=>{
                stage.model=obj;
                if(!pre){
                    this.bs.setModel(obj);
                    this._doStageOption(stage);
                }
            },()=>{},()=>{})
        }
        _loadFbxModel(stage,pre){
            if(stage.model&&!pre){
                this.bs.setModel(stage.model);
                this._doStageOption(stage);
                return;
            }

            let loader=this.loader.fbxLoader;
            loader.load(stage.src,(obj)=>{
                stage.model=obj;
                if(!pre){
                    this.bs.setModel(obj);
                    this._doStageOption(stage);
                }
            })
        }
        _loadJsonModel(stage,pre){

        }

        _doStageOption(stage,callback){
            let options=stage.options;
            if(options.normalLight)
                this.bs.normalLightOpen();
            else
                this.bs.normalLightClose();

            this._doEnter(stage,callback,'enter')

            this.status.loading=false;

            this.dispatchEvent({type:"stageChange",message:this.view.stageIndex})
        }

    }

    Object.assign( Drama.prototype, THREE.EventDispatcher.prototype);

    return Drama
})()
