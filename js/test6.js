let City=(function (){

    let textureResPath="./res/texture/"
    let tl=new THREE.TextureLoader();

    class City{
        constructor(bs,bl,options) {
            this.bs=bs;
            this.bl=bl;

            this.url=options.url;
            this.start=options.start;

            this.model=null;

            this.boxs={}

            this._load()
        }

        _load(){
            let bs=this.bs;
            let bl=this.bl;
            bl.load("./res/city1.glb",(res)=>{
                //console.log(res);
                let model=res.model;
                bs.setModel(model);
                bs.normalLightOpen();

                this.model=model;

                this.scls = Pipeline.Pipelines;

                this._init();

            })

        }

        _init(){
            let bs=this.bs;
            let bl=this.bl;
            let model=this.model

            let start=this.start;

            bs.o3d.camera.position.copy(start.cp);
            bs.o3d.controls.target.copy(start.tp);
            bs.o3d.controls.update();

            //如需遍历更加严谨，使用traverse
            model.traverse((c)=>{
                this._initLine(c);
                this._initBox(c);
                this._initStart(c);
            });

            Pipeline.setVisibleAll(false);
/*            model.children.map((c)=>{
                this._initLine(c);
            })*/

            bs.o3d.renderer.outputEncoding=3001;
        }

        //创建默认管线
        _initLine(c){
/*            let n=c.name.split("_")[0];
            if(n!=="line") return;*/
            if(!this._checkName(c,"line")) return;

            let cc=c.children;

            let ps=[];

            cc.map((p)=>{
                ps.push(p.position);
            });

            new Pipeline.Pipeline({
                basicPoints:ps,
                scene:ep.scene,
                color:Math.random()*0xffffff,
                radius:3,
                tension:0.1,
                id:c.name
            });
        }

        //创建楼
        _initBox(c){
/*            let n=c.name.split("_")[0];
            if(n!=="box") return;*/
            if(!this._checkName(c,"box")) return;

            let cl=c.userData.closeLight;
            if(!cl) return;

            c.userData.closeLightTexture=tl.load(textureResPath+cl);
            c.userData.openLightTexture=c.material.map.clone();
            c.userData.openLightTexture.needsUpdate=true;
            c.userData.light=true;

            this.boxs[c.name]=c;
        }

        //创建入场演出
        _initStart(c){
            if(!this._checkName(c,"root")) return;

            let r=this.bs.o3d.worldRadius;
            let t1,t2,t3,ts=[];
            let cc=c.children;

            cc.map((ccc)=>{
                if(this._checkName(ccc,"map")){
                    /*                    ccc.userData.rs=ccc.scale.clone();
                    ccc.userData.rp=ccc.position.clone();
                    ccc.scale.multiplyScalar(0.25);
                    ccc.position.y=-r;

                    let rp=ccc.userData.rp;
                    let rs=ccc.userData.rs;
                    t1=new TWEEN.Tween(ccc.position).to({x:rp.x,y:rp.y,z:rp.z},2000);
                    t2=new TWEEN.Tween(ccc.scale).to({x:rs.x,y:rs.y,z:rs.z},1500);*/
                    t3=new TWEEN.Tween({x:1}).to({x:10},6000).onComplete(()=>{
                        //Pipeline.setVisibleAll(true);

                        for(let a in Pipeline.Pipelines){
                            let pp=Pipeline.Pipelines[a];
                            if(pp.isPipeline){
                                pp.setVisible(true);
                                pp.start();
                            }
                        }
                    });

                    //t1.chain(t2);
                    //t2.chain(t3);
                }else{
                    ccc.userData.rp=ccc.position.clone();
                    ccc.position.y=-r;
                    ccc.visible=false;

                    let rp=ccc.userData.rp;
                    ts.push(new TWEEN.Tween(ccc.position).to({x:rp.x,y:rp.y,z:rp.z},1000+Math.random()*5000).delay(0).onStart(()=>{
                        ccc.visible=true;
                    }).easing(TWEEN.Easing.Exponential.InOut).start());
                }
            });

            //t1.start()
            t3.start();
        }

        //名字校验
        _checkName(c,name){
            let n=c.name.split("_")[0];

            if(n!==name) return false;
            else return true;
        }

        toggleBoxLight(id){
            let box=this.boxs[id];
            if(!box) return ;

            let light=box.userData.light

            if(light){
                box.material.map=box.userData.closeLightTexture;
            }

            else{
                box.material.map=box.userData.openLightTexture;
            }

            let lines=box.userData.closeLine;
            lines.map((l)=>{
                Pipeline.Pipelines[l].setEnabled(!light);
            })


            box.userData.light=!box.userData.light;
        }
    }

    return {
        City:City
    }

})()