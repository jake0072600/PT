let Drama=(function () {
    class Drama2 {
        constructor(bs,bl,url,view) {

            this.bs=bs;
            this.bl=bl;

            this.config={
                cp:new THREE.Vector3(-315.8587785271629, 2212.774893373222, 2497.0657701015602),
                models:{},

                shadow:{
                    blur: 1.7,
                    darkness: 2.5
                }
            };

            bs.o3d.scene.background = new THREE.Color( 0xeeeeee );
            bs.o3d.renderer.shadowMap.enabled = true;

            this.tmpLights=[];

            this.controls;

            this.scene;
            this.models={};
            this.cubes={
                Bridge2:null
            }
            this.bokehPass=null;
            this.fxaaPass=null;

            this.$e=this.bs.$e;
            this.camera=this.bs.o3d.camera;
            this.element=this.bs.o3d.renderer.domElement;

            this.dm=null;
            this.sc=null;
            // the render target that will show the shadows in the plane texture
            this.rt = new THREE.WebGLRenderTarget( 1700,2800 );
            this.rt.texture.generateMipmaps = false;

            // the render target that we will use to blur the first render target
            this.rtb = new THREE.WebGLRenderTarget( 1700,2800 );
            this.rtb.texture.generateMipmaps = false;
            //this.rtb.texture.rotation=Math.PI/2;

            // like MeshDepthMaterial, but goes from black to transparent
            let depthMaterial = new THREE.MeshDepthMaterial();
            depthMaterial.userData.darkness = { value: this.config.shadow.darkness };
            depthMaterial.onBeforeCompile = function ( shader ) {

                shader.uniforms.darkness = depthMaterial.userData.darkness;
                shader.fragmentShader = `
						uniform float darkness;
						${shader.fragmentShader.replace(
                    'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
                    'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
                )}
					`;

            };
            depthMaterial.depthTest = false;
            depthMaterial.depthWrite = false;
            this.depthMaterial=depthMaterial;

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
                view:"main",
                onceReady:false
            };

            this.eventOptions={
                resize:this._resize.bind(this)
            }

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


            this.shaderMaterial={
                m1:new THREE.ShaderMaterial({
                    uniforms:{size1:{value:0.0}},
                    vertexShader: document.getElementById( 'vertexshader' ).textContent,
                    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

                    skinning:true,
                    clipping:true,
                    flatShading:true
                }),
                hbm:new THREE.ShaderMaterial( THREE.HorizontalBlurShader ),
                vbm:new THREE.ShaderMaterial( THREE.VerticalBlurShader  )
            };
            this.shaderMaterial.hbm.depthTest = false;
            this.shaderMaterial.vbm.depthTest = false;

            this.messageScroll = null;

            this._initCubes();

            bl.load(url,(scene)=>{
                this.scene=scene[0];
                for(let i=1;i<scene.length;i++){
                    let n=scene[i].model.userData.name;
                    let m=scene[i].model;
                    this.models[n]=scene[i];

                    let mm = m.getObjectByName("model_0");
                    mm.castShadow=true;
                    mm.geometry.computeBoundingBox();
                    this.models[n].max=mm.geometry.boundingBox.max;

                    if(mm.userData.envMap){
                        mm.material.envMap=this.cubes[mm.userData.envMap]?this.cubes[mm.userData.envMap]:null;
                        mm.material.envMapIntensity=mm.userData.envMapIntensity;
                    }

                }

                this._init();
                this._animate();

            });
        }

        _init(){
            this._initDom();
            this._initConfiguration();
            this._initBasic();
            this._initStage();
            this._initProcessing();

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

        _initCubes(){
            let r = './res/cube/Bridge2/';
            let urls = [ r + 'posx.jpg', r + 'negx.jpg',
                r + 'posy.jpg', r + 'negy.jpg',
                r + 'posz.jpg', r + 'negz.jpg' ];

            let tc = new THREE.CubeTextureLoader().load( urls );
            tc.encoding = THREE.sRGBEncoding;
            this.cubes.Bridge2=tc;
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

            controls.minDistance = 100*10;
            controls.maxDistance = 500*10;

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

            $(window).on("resize",this.eventOptions.resize);
        }
        _resize(){
            let pixelRatio = this.bs.o3d.renderer.getPixelRatio();

            this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.bs.width * pixelRatio );
            this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.bs.height * pixelRatio );
        }

        _initStage(){
            let camera=this.camera;
            let controls=this.controls;
            let m=this.scene.model;
            let ta=this.tweenAnimate;
            ta.mainInOut=new TimelineMax({paused:true,onStart:()=>{},onUpdate:()=>{this.status.taPlaying=true;},onComplete:()=>{this.status.taPlaying=false;this._viewMainDomToggle(true);/*this._initTestHouse_todo()*/;this._initOnceComplete();}});
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
                this.scene.model.updateWorldMatrix();
                let p=child.getWorldPosition();
                let s=child.scale.x;

                let m;
                if(child.isMesh){
                    child.geometry.computeBoundingBox();
                    m=child.geometry.boundingBox.max;
                }else{
                    m = child.userData.max;
                }

                let max=m.clone().multiply(new THREE.Vector3(0.75,1,0.75));
                let cp = p.clone().add(max.multiplyScalar(4*s));
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
                //child.material=this.shaderMaterial.m1;
            }
        }

        _initStageDom(child,view){
            if(child.name==="main"){
                //正式版本删除
                //this._initTestGround_todo(child);
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
            if(child.type==="SpotLight"){
                child.castShadow = true;
                child.shadow.mapSize.width = 1024;
                child.shadow.mapSize.height = 1024;
                child.shadow.camera.far = child.position.y;
                this.tmpLights.push(child);
            }

            if(child.name==="main"){
                child.geometry.computeBoundingBox();
                let box = child.geometry.boundingBox;
                this.controls.maxPan=box.max;
                this.controls.minPan=box.min;
                child.castShadow = true;
                //console.log(box);
            }else if(child.name.split("_")[0]==="item"){

                let name=child.userData.model;

                if(name && this.models[name]){
                    let m=this.models[name].model;
                    child.add(m.clone());
                    child.userData.max=this.models[name].max;
                }else{
                    child.castShadow = true;
                }
            }else if(child.name==="main_dm"){
                child.position.y=0;
                child.receiveShadow =true;

                this.dm=child;

/*                this.dm=new THREE.Mesh(child.geometry.clone());
                this.dm.name="blur";
                this.dm.rotation.copy(child.rotation);
                this.dm.position.copy(child.position);
                this.dm.position.y+=0.1;
                this.dm.visible=false;
                //this.dm.material=child.material.clone();
                let material=new THREE.MeshBasicMaterial( {
                    map: this.rt.texture,
                    opacity: 1,
                    transparent: false,
                    color:0xffffff
                } );
                child.material=material;
                this.bs.o3d.scene.add(this.dm);*/

                //this.dm2=child;
            }else if(child.name==="shadow_camera"){
                this.sc=child;
            }
        }

        _initProcessing(){
/*            let w=this.bs.width;
            let h=this.bs.height;
            this.bokehPass = new THREE.BokehPass( bs.o3d.scene, bs.o3d.camera, {
                focus:200.0,
                aperture:5*0.00001,
                maxblur:1.0,
                width: w, height: h
            } );
            this.bs.addPass(this.bokehPass);*/

/*            this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
            let pixelRatio = this.bs.o3d.renderer.getPixelRatio();
            this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.bs.width * pixelRatio );
            this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.bs.height * pixelRatio );

            this.bs.addPass(this.fxaaPass);*/
        }

        _viewMainClick(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

            this._viewMainDomToggle(false);
            this.roofInOutPlay();
            this._viewItemDomToggle(true);
            this.status.view="items";
        }
        _viewItemClick(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

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

        //--todo 盒子生成方法
        _initTestBox_todo(){
            this._initBoxList1();
            this._initBoxList2();
            this._initBoxList3();
            this._initBoxList4();
        }
        _initBoxList1(){
            this._initBoxList(
                [new THREE.Vector3( -484.969,23.250, -37.449 ),
                new THREE.Vector3( -624.108,23.250, -37.449 ),
                new THREE.Vector3( -637.668,23.250, -43.949 ),
                new THREE.Vector3( -646.721,23.250, -55.627 ),
                new THREE.Vector3( -646.721,23.250, -123.447 ),
                new THREE.Vector3( -640.215,23.250, -139.960 ),
                new THREE.Vector3( -625.625,23.250, -146.417 ),
                new THREE.Vector3( -402.484,23.250, -146.417 ),
                new THREE.Vector3( -389.073,23.250, -156.431 ),
                new THREE.Vector3( -381.333,23.250, -169.369 ),
                new THREE.Vector3( -381.333,23.250, -322.486 )
            ],8);
        }
        _initBoxList2(){
            this._initBoxList(
                [new THREE.Vector3( -880.697,23.250, -35.236 ),
                new THREE.Vector3( -1012.438,23.250, -35.236 ),
                new THREE.Vector3( -1031.351,23.250, -41.047 ),
                new THREE.Vector3( -1037.919,23.250, -51.040 ),
                new THREE.Vector3( -1040.137,23.250, -57.301 ),
                new THREE.Vector3( -1040.137,23.250, -121.449 ),
                new THREE.Vector3( -1035.214,23.250, -137.854 ),
                new THREE.Vector3( -1023.029,23.250, -146.024 ),
                new THREE.Vector3( -849.619,23.250, -146.024 ),
                new THREE.Vector3( -836.007,23.250, -151.470 ),
                new THREE.Vector3( -829.868,23.250, -165.887 ),
                new THREE.Vector3( -829.868,23.250, -284.805 )
            ],8);
        }
        _initBoxList3(){
            this._initBoxList(
                [new THREE.Vector3( -884.857,23.250, 122.595 ),
                    new THREE.Vector3( -1017.954,23.250, 122.595 ),
                    new THREE.Vector3( -1036.123,23.250, 131.660 ),
                    new THREE.Vector3( -1038.861,23.250, 141.352 ),
                    new THREE.Vector3( -1038.861,23.250, 210.618 ),
                    new THREE.Vector3( -1035.335,23.250, 222.689 ),
                    new THREE.Vector3( -1023.781,23.250, 231.302 ),
                    new THREE.Vector3( -849.895,23.250, 231.302 ),
                    new THREE.Vector3( -837.283,23.250, 237.321 ),
                    new THREE.Vector3( -829.617,23.250, 254.106 ),
                    new THREE.Vector3( -829.617,23.250, 370.410 )
                ],8);
        }
        _initBoxList4(){
            this._initBoxList(
                [new THREE.Vector3( -477.924,23.250, 121.471 ),
                    new THREE.Vector3( -626.664,23.250, 121.471 ),
                    new THREE.Vector3( -643.027,23.250, 132.314 ),
                    new THREE.Vector3( -647.370,23.250, 141.428 ),
                    new THREE.Vector3( -647.370,23.250, 212.436 ),
                    new THREE.Vector3( -639.637,23.250, 222.845 ),
                    new THREE.Vector3( -624.398,23.250, 231.611 ),
                    new THREE.Vector3( -404.017,23.250, 231.611 ),
                    new THREE.Vector3( -388.839,23.250, 236.609 ),
                    new THREE.Vector3( -380.871,23.250, 257.577 ),
                    new THREE.Vector3( -380.871,23.250, 406.031 )
                ],8);
        }
        _initBoxList(points,count){
            let o3dml=new O3DMovementList({
                points:points,
                mesh:new THREE.Mesh(new THREE.BoxBufferGeometry(6,6,6),new THREE.MeshBasicMaterial({color:0x3e96ff})),
                count:count,
                randomRotation:true
            });

            bs.addModel(o3dml.list);
        }

        _initTrucks(){

        }
        _initTruck1(){

        }

        _initOnceComplete(){
            if(this.status.onceReady) return;
            this.status.onceReady=true;

            this._initTestBox_todo()

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

        _blurShadow( amount ) {
            let dm=this.dm;
            let sc=this.sc;
            if(!dm||!sc) return;

            let scene=this.bs.o3d.scene;

            let renderer=this.bs.o3d.renderer;

            let horizontalBlurMaterial=this.shaderMaterial.hbm;
            let verticalBlurMaterial=this.shaderMaterial.vbm;

            let renderTarget=this.rt;
            let renderTargetBlur=this.rtb;

            dm.visible = true;

            // blur horizontally and draw in the renderTargetBlur
            dm.material = horizontalBlurMaterial;
            dm.material.uniforms.tDiffuse.value = renderTarget.texture;
            horizontalBlurMaterial.uniforms.h.value = amount * 1 / 1400;

            renderer.setRenderTarget( renderTargetBlur );
            renderer.render( dm, sc );

            // blur vertically and draw in the main renderTarget
            dm.material = verticalBlurMaterial;
            dm.material.uniforms.tDiffuse.value = renderTargetBlur.texture;
            verticalBlurMaterial.uniforms.v.value = amount * 1 / 850;

            renderer.setRenderTarget( renderTarget );
            renderer.render( dm, sc );

            dm.visible = false;
        }

        _renderBlurShadow(){
            let dm=this.dm;
            let sc=this.sc;
            if(!dm||!sc) return;

            let renderer=this.bs.o3d.renderer;
            let renderTarget=this.rt;
            let renderTargetBlur=this.rtb;
            let scene=this.bs.o3d.scene;

            let initialBackground = scene.background;
            scene.background = new THREE.Color(0xffffff);

            //sc.visible=false;
            scene.overrideMaterial = this.depthMaterial;

            renderer.setRenderTarget( renderTarget );
            renderer.render( scene, sc );

            scene.overrideMaterial = null;
            //sc.visible = true;

            this._blurShadow( this.config.shadow.blur );
            // a second pass to reduce the artifacts
            // (0.4 is the minimum blur amout so that the artifacts are gone)
            this._blurShadow( this.config.shadow.blur * 0.4 );

            renderer.setRenderTarget( null );
            scene.background = initialBackground;

            //renderer.render(scene,this.camera);
        }

        _animate(){
            let self = this;

            let step=()=>{
                this.animateObject = window.requestAnimationFrame(step);

                //this._renderBlurShadow();

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

                if(this.bokehPass) this.bokehPass.uniforms.focus.value=this.camera.position.y*1.5;

                //this.bokehPass.unif

                this.shaderMaterial.m1.uniforms.size1.value+=0.001;
                if(this.shaderMaterial.m1.uniforms.size1.value>=1.0)
                    this.shaderMaterial.m1.uniforms.size1.value=0.0;
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
