let Drama=(function () {
    class Drama2 {
        constructor(bs,bl,url,view) {

            this.bs=bs;
            this.bl=bl;

            this.controls;

            this.scene;

            this.$e=this.bs.$e;
            this.camera=this.bs.o3d.camera;
            this.element=this.bs.o3d.renderer.domElement;


            this.animateObject=null;

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2( 1, 1 );
            this.items = [];

            this.tweenAnimate={
                mainInOut:null,
                roofInOut:null,
                cameraReset: {},
                itemsInOut:{}
            };

            this.status={
                taPlaying:false,
                itemLooking:false,
                itemTarget:null,
                view:"main"
            };

            this.view=view;
            this.view.roof={};

/*            this.view={
                roof:{},
                main:{
                    $dom:null,
                    obj:null
                },
                items:{
                }
            };*/

            this.pipelineMaterial={
                m1:new THREE.ShaderMaterial({
                    uniforms:{size1:{value:0.0}},
                    vertexShader: document.getElementById( 'vertexshader' ).textContent,
                    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

                    skinning:true,
                    clipping:true,
                    flatShading:true
                })
            };

            this.config={
                cp:new THREE.Vector3(-27.961879846389554,177.48931420497712,189.2656287815755)
            };

            this.messageScroll = null;

            bl.load(url,(scene)=>{
                this.scene=scene;
                this._init();
                this._animate();
            });
        }

        _init(){
            this._initDom();
            this._initConfiguration();
            this._initBasic();
            this._initStage();

            this._initEvents();
        }

        _initDom(){
            let $im=$(
                "<div class='item-message'>" +
                    "<div id='item-message-story' class='item-message-story'>" +
                        "<div class='item-message-story-text'></div>"+
                    "</div>"+
                    "<div class='item-message-close'><img src='./icon/close.png'/></div>"+
                "</div>"
            );
            this.$im=$im;
            this.$im.appendTo(this.$e);

            this.messageScroll=new IScroll("#item-message-story",{mouseWheel:true});
        }
        _initConfiguration(){
            let bs=this.bs;
            let camera=this.camera;
            bs.normalControlsToggle(false);
            //bs.normalLightOpen();

            bs.setModel(this.scene.model);
            camera.position.copy(this.config.cp);
            camera.lookAt(this.scene.model.position);

            this.bs.o3d.controls.enableRotate=false;
            this.bs.o3d.controls.enableZoom=false;

        }
        _initBasic(){
            let controls = this.controls = new THREE.MapControls(this.camera,this.element);
            controls.enableRotate = false;

            controls.screenSpacePanning = false;

            controls.minDistance = 100;
            controls.maxDistance = 500;

            controls.maxPolarAngle = Math.PI / 2;
            controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            controls.dampingFactor = 0.08;
        }

        _initEvents(){
            //this.bs.$e.on("click",this._onMouseDown.bind(this));
            let $md=this.view.main.$dom;
            $md.find(".view-icon").on("mouseup touchend",this._viewMainClick.bind(this));
            $md.find(".view-t").on("mouseup touchend",this._viewMainClick.bind(this));

            let items=this.view.items;
            for(let a in items){
                let $md=items[a].$dom;
                $md.find(".view-icon-item").on("mouseup touchend",this._viewItemClick.bind(this));
                $md.find(".view-t").on("mouseup touchend",this._viewItemClick.bind(this));
            }

            this.$im.find(".item-message-close").on("mouseup touchend",this._viewItemMessageClose.bind(this));

            document.addEventListener('touchmove', function (e) { e.preventDefault(); },  false);
        }

        _initStage(){
            let camera=this.camera;
            let controls=this.controls;
            let m=this.scene.model;
            let ta=this.tweenAnimate;
            ta.mainInOut=new TimelineMax({paused:true,onStart:()=>{},onUpdate:()=>{this.status.taPlaying=true;},onComplete:()=>{this.status.taPlaying=false;this._viewMainDomToggle(true);/*this._initTestHouse_todo()*/;this._initTestBox_todo();if(this.do_callback) this.do_callback();}});
            ta.roofInOut=new TimelineMax({paused:true,onStart:()=>{this._roofHideOrShow()},onUpdate:()=>{this.status.taPlaying=true;},onComplete:()=>{this.status.taPlaying=false;if(this.do_callback) this.do_callback();},onReverseComplete:()=>{this.status.taPlaying=false;this._roofHideOrShow(false)}});
            let cp=this.config.cp;
            ta.cameraReset.cameraTA=new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,paused:true,onStart:()=>{this.status.itemLooking=false,this.bs.o3d.controls.autoRotate=false;},onUpdate:()=>{this.status.taPlaying=true;},
                onComplete:()=>{
                this.status.itemLooking=false;
                this.status.taPlaying=false;
                this.bs.normalControlsToggle(false);
                this.bs.o3d.controls.autoRotate=false;
                this.controls.enabled=true;
                this.dispatchEvent({type:"cameraReset",message:""})
            }});
            ta.cameraReset.targetTA=new TweenMax(controls.target,1,{x:0,y:0,z:0,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}});

            let view=this.view;
            m.updateWorldMatrix();
            m.traverse((child)=>{
                this._initStageConfig(child);
                this._initStageDom(child,view);
                this._initTweenAnimate(child,ta,view);
            });

            ta.mainInOut.play()
            ta.roofInOut.play();
        }

        _initTweenAnimate(child,ta,view){
            let camera=this.camera;
            let controls=this.controls;

            if(child.name==="qiangmian"){
                ta.mainInOut.from(child.position,1,{y:-800})
            }else if(child.name.split("_")[0]==="roof"){
                view.roof[child.name]=child;
                ta.roofInOut.from(child.position,0.33,{y:200});
            }else if(child.name.split("_")[0]==="item"){
                this.items.push(child);
                let p=child.getWorldPosition();
                child.geometry.computeBoundingBox();
                let cp = p.clone().add(child.geometry.boundingBox.max.multiplyScalar(4.5));
                this.tweenAnimate.itemsInOut[child.name]={
                    cp:cp,
                    ct:p,
                    cameraTA:new TweenMax(camera.position,1,{x:cp.x,y:cp.y/4*3,z:cp.z,paused:true,onStart:()=>{
                            this.status.itemLooking=false;
                            this.bs.normalControlsToggle(false);
                            this.bs.o3d.controls.autoRotate=false;
                        },onUpdate:()=>{this.status.taPlaying=true;},
                        onComplete:()=>{
                            this.status.taPlaying=false;
                            this.status.itemLooking=true;
                            this.status.itemTarget=p.clone();
                            this.controls.enabled=false;
                            this.bs.normalControlsToggle(true);
                            this.bs.o3d.controls.autoRotate=true;
                            this.bs.o3d.controls.target.copy(p);
                            this.bs.o3d.controls.autoRotateSpeed=0.25;
                            this.dispatchEvent({type:"itemChange",message:child.name})
                        }}),
                    targetTA:new TweenMax(controls.target,1,{x:p.x,y:p.y,z:p.z,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}})
                }
            }else if(child.name.split("_")[0]==="guanxian"){
                //console.log(child.name);
                //child.material=this.pipelineMaterial.m1;
            }
        }

        _initStageDom(child,view){
            if(child.name==="main"){
                //正式版本删除
                this._initTestGround_todo(child);
                //----------------------------------
                let title=view.main.title;
                let dt2=view.main.title2?"<div class='view-title2'>"+view.main.title2+"</div>":"";
                let $dom=$(
                    "<div class='view view-main'>" +
                        "<div class='view-line'>" +
                            "<div class='view-icon'><img src='./icon/door.png'/></div>"+
                            "<div class='view-t'>" +
                                "<div class='view-title'>"+title+"</div>"+
                                dt2+
                            "</div>"+
                        "</div>"+
                    "</div>"
                );
                $dom.appendTo(this.$e);

                view.main.$dom=$dom;
                view.main.obj=child;

            }else if(child.name.split("_")[0]==="item"){
                let id=this.getRandomId();
                let title=view.items[child.name].title;
                let dt2=view.items[child.name].title2?"<div class='view-title2'>"+view.items[child.name].title2+"</div>":"";
                //child.userData.id=id;
                let $dom=$(
                    "<div class='view view-item view-"+child.name+"'>" +
                        "<div class='view-line'>" +
                            "<div data-name='"+child.name+"' class='view-icon-item'>&bull;</div>"+
                            "<div class='view-t'>" +
                            "<div data-name='"+child.name+"' class='view-title-item'>"+title+"</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"
                );
                Object.assign(view.items[child.name],{
                    id:id,
                    name:child.name,
                    obj:child,
                    $dom:$dom
                });
                $dom.appendTo(this.$e);
            }
        }

        _initStageConfig(child){
            if(child.name==="main"){
                child.geometry.computeBoundingBox();
                let box = child.geometry.boundingBox;
                this.controls.maxPan=box.max;
                this.controls.minPan=box.min;
                //console.log(box);
            }
        }

        _viewMainClick(event){
            event.preventDefault();

            this._viewMainDomToggle(false);
            this.roofInOutPlay();
            this._viewItemDomToggle(true);
            this.status.view="items";
        }
        _viewItemClick(event){
            event.preventDefault();

            let t=event.target;
            let n = t.dataset.name;
            this.lookItem(n);
            this._viewItemMessageShow(n);
            this._viewItemDomToggle(false);
        }
        _viewItemMessageShow(name){
            let item=this.view.items[name];
            let $imst=$(this.$im.find(".item-message-story-text"));
            $imst.html(item.text);
            this.$im.fadeIn();

            this.messageScroll.refresh();
        }

        _viewItemMessageClose(event){
            event.preventDefault();

            this.exitLookItem();
            this._viewItemMessageHide();
            this._viewItemDomToggle(true)
        }
        _viewItemMessageHide(){
            let item=this.view.items[name];
            let $imst=$(this.$im.find(".item-message-story-text"));
            //$imst.empty();
            this.$im.fadeOut();
        }

        _viewMainDomToggle(show){
            if(show)
                this.view.main.$dom.fadeIn();
            else
                this.view.main.$dom.fadeOut();
        }
        _viewItemDomToggle(show){
            let fn=show?"fadeIn":"fadeOut";

            let items = this.view.items;
            for(let a in items){
                items[a].$dom[fn]();
            }
        }

        _initTestGround_todo(scene){
            // ground

            let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
            mesh.rotation.x = - Math.PI / 2;
            scene.add( mesh );

            let grid = new THREE.GridHelper( 800, 40, 0x000000, 0x000000 );
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            scene.add( grid );
        }
        _initTestHouse_todo(){
            this.bl.load('./res/other/json/car1.json',(res)=>{

                let o3dml1=new O3DMovementList({
                    points:[new THREE.Vector3( 0,0, -100 ),
                        new THREE.Vector3( -140,0, -100 ),
                        new THREE.Vector3( -140,0, 200 ),
                        new THREE.Vector3( -140,0, 300 )],
                    mesh:res.model,
                    //mesh:new THREE.Mesh(new THREE.BoxBufferGeometry(10,10,10),new THREE.MeshBasicMaterial({color:0xff0000})),
                    count:1,
                    animations:res.animations,
                    speed:1.5,
                    scale:0.1
                });
                let o3dml2=new O3DMovementList({
                    points:[new THREE.Vector3( 0,0, 130 ),
                        new THREE.Vector3( 150,0, 130 ),
                        new THREE.Vector3( 150,0, 0 ),
                        new THREE.Vector3( 150,0, -130 ),
                        new THREE.Vector3( 150,0, -260 )
                    ],
                    mesh:res.model,
                    //mesh:new THREE.Mesh(new THREE.BoxBufferGeometry(10,10,10),new THREE.MeshBasicMaterial({color:0xff0000})),
                    count:1,
                    animations:res.animations,
                    speed:1.2,
                    scale:0.1
                });

                this.bs.addModel(o3dml1.list);
                this.bs.addModel(o3dml2.list);
            });
        }
        _initTestBox_todo(){
            let o3dml=new O3DMovementList({
                points:[new THREE.Vector3( -52.345,3, 11.052 ),
                    new THREE.Vector3( -52.345,3, -47.442 ),
                    new THREE.Vector3( -5,3, -47.442 ),
                    new THREE.Vector3( 38.518,3, -47.442 ),
                    new THREE.Vector3( 38.518,3, 3.563 )],
                mesh:new THREE.Mesh(new THREE.BoxBufferGeometry(6,6,6),new THREE.MeshBasicMaterial({color:0x3e96ff})),
                count:8,
            });

            bs.addModel(o3dml.list);
        }


        getRandomId(randomLength){
            return THREE.Math.generateUUID();
        }

        //根据object进行3d到2d映射
        _v3tov2ByObj(obj){
            this.scene.model.updateWorldMatrix()
            let wp=obj.getWorldPosition(new THREE.Vector3());
            let v=wp.project(this.camera);
            let hw = this.bs.width / 2;
            let hh = this.bs.height / 2;
            return new THREE.Vector2(Math.round(v.x * hw + hw),Math.round(-v.y * hh + hh));;
        }
        //更新main状态下的UI
        _viewMainDomUpdate(){
            let r=this._v3tov2ByObj(this.view.main.obj);
            this.view.main.$dom.css({left:r.x,top:r.y});
        }
        //更新Items状态下的UI
        _viewItemsDomUpdate(){
            let items=this.view.items;
            for(let a in items){
                let r=this._v3tov2ByObj(items[a].obj);
                items[a].$dom.css({left:r.x,top:r.y});
            }
        }

        _animate(){
            let self = this;

            let step=()=>{
                this.animateObject = window.requestAnimationFrame(step);

                if(!this.status.taPlaying){
                    if(this.status.itemLooking){
                        this.bs.o3d.controls.update();
                    }else{
                        this.controls.update();
                    }
                }


                if(this.status.view==="main"){
                    this._viewMainDomUpdate();
                }else if(this.status.view==="items"){
                    this._viewItemsDomUpdate();
                }

                this.pipelineMaterial.m1.uniforms.size1.value+=0.001;
                if(this.pipelineMaterial.m1.uniforms.size1.value>=1.0)
                    this.pipelineMaterial.m1.uniforms.size1.value=0.0;
            }

            window.requestAnimationFrame(step);
        }

        //房顶元素显示或消失
        _roofHideOrShow(show){
            let roof=this.view.roof;
            for(let a in roof){
                roof[a].visible=show;
            }
        }

        _onMouseDown( event ) {

            event.preventDefault();

            let mouse=this.mouse;
            let r=this.raycaster;
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            r.setFromCamera( mouse, this.camera );

            let intersection = r.intersectObject( this.scene.model.children );

            if ( intersection.length > 0 ) {
                console.log(intersection[ 0 ].object.name);
            }
        }

        lookItem(name){
            if(this.status.taPlaying) return;
            this.tweenAnimate.itemsInOut[name].cameraTA.restart();
            this.tweenAnimate.itemsInOut[name].targetTA.restart()
        }
        exitLookItem(){
            console.log(111);
            if(this.status.taPlaying) return;
            this.tweenAnimate.cameraReset.cameraTA.restart();
            this.tweenAnimate.cameraReset.targetTA.restart();
        }


        roofInOutPlay(play){
            if(this.status.taPlaying) return;

            if(play)
                this.tweenAnimate.roofInOut.play();
            else
                this.tweenAnimate.roofInOut.reverse();

        }
    }



    Object.assign( Drama2.prototype, THREE.EventDispatcher.prototype);

    return Drama2;
})()
