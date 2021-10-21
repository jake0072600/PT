let Drama=(function () {
    class Drama2 {
        constructor(bs,bl,url,view) {

            this.bs=bs;
            this.bl=bl;

            this.config={
                cp:new THREE.Vector3(-1500, 2000, 2000),
                tp:new THREE.Vector3(0,0,0),
                models:{},

                xMin:0,
                xMin1:0
            };

            bs.o3d.renderer.physicallyCorrectLights =true;
            bs.o3d.scene.background = new THREE.Color( 0xcccccc );
            bs.o3d.scene.fog = new THREE.Fog( 0xffffff, 100, 10000 );
            let tl=new THREE.TextureLoader();


            this.controls;

            this.scene;
            this.models={};
            this.textures={
                huojia:tl.load("./res/texture/huojia.jpg"),
                huojiaall:tl.load("./res/texture/huojiaall.jpg"),
                main:tl.load("./res/texture/cflightmap2-1024.png"),
                ifce20:{
                    t1:tl.load("./res/other/obj/ICFE20/027L4589_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICFE20/027L4589_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICFE20/027L4589_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                icf_ss:{
                    t1:tl.load("./res/other/obj/ICF SS 20-6-90/ICF SS_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICF SS 20-6-90/ICF SS_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICF SS 20-6-90/ICF SS_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                I027L3465:{
                    t1:tl.load("./res/other/obj/027L3465/027L3465_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/027L3465/027L3465_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/027L3465/027L3465_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                Plate_heat_exchanger:{
                    t1:tl.load("./res/other/obj/Plateheatexchanger/1_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/Plateheatexchanger/1_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/Plateheatexchanger/1_DefaultMaterial_Roughness.jpg")
                }
            }
            this.cubes={
                Bridge2:null,
                hdr:null
            }
            this.bokehPass=null;
            this.fxaaPass=null;

            this.$e=this.bs.$e;
            this.camera=this.bs.o3d.camera;
            this.element=this.bs.o3d.renderer.domElement;


            this.animateObject=null;

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2( 1, 1 );
            this.items = [];
            this.labels = {};

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

            //冷凝间 风扇1clone
            this.meshGJ_FSarr = [];
            //冷凝间 风扇2clone
            this.meshGJ_FSarr2 = [];
            //冷凝间 风扇位置1
            this.meshGJ_FSposition_arr = [new THREE.Vector3(1225, 83, 93),
                new THREE.Vector3(1225, 83, 123),
                new THREE.Vector3(1225, 83, 153),
                new THREE.Vector3(1225, 83, 183),
                new THREE.Vector3(1225, 83, -205),
                new THREE.Vector3(1225, 83, -235),
                new THREE.Vector3(1225, 83, -265),
                new THREE.Vector3(1225, 83, -295),

                new THREE.Vector3(878, 83, 93),
                new THREE.Vector3(878, 83, 123),
                new THREE.Vector3(878, 83, 153),
                new THREE.Vector3(878, 83, 183),
                new THREE.Vector3(878, 83, -205),
                new THREE.Vector3(878, 83, -235),
                new THREE.Vector3(878, 83, -265),
                new THREE.Vector3(878, 83, -295),

                new THREE.Vector3(530, 83, 143),
                new THREE.Vector3(530, 83, 173),
                new THREE.Vector3(530, 83, 203),
                new THREE.Vector3(530, 83, 233),
                new THREE.Vector3(530, 83, -105),
                new THREE.Vector3(530, 83, -135),
                new THREE.Vector3(530, 83, -165),
                new THREE.Vector3(530, 83, -195),

                new THREE.Vector3(168, 83, 143),
                new THREE.Vector3(168, 83, 173),
                new THREE.Vector3(168, 83, 203),
                new THREE.Vector3(168, 83, 233),
                new THREE.Vector3(168, 83, -105),
                new THREE.Vector3(168, 83, -135),
                new THREE.Vector3(168, 83, -165),
                new THREE.Vector3(168, 83, -195)
            ];
            //冷凝间 风扇位置2
            this.meshGJ_FSposition_arr2 = [new THREE.Vector3(-465, 109, 71),
                new THREE.Vector3(-495, 109, 71),
                new THREE.Vector3(-525, 109, 71),
                new THREE.Vector3(-555, 109, 71),

                new THREE.Vector3(-902, 109, 71),
                new THREE.Vector3(-932, 109, 71),
                new THREE.Vector3(-962, 109, 71),
                new THREE.Vector3(-992, 109, 71),

                new THREE.Vector3(785, 83, -549),
                new THREE.Vector3(755, 83, -549),
                new THREE.Vector3(725, 83, -549),
                new THREE.Vector3(695, 83, -549)
            ];
            //机柜clone位置
            this.gj_position_arr = [new THREE.Vector3(1238, 83, -250),
                new THREE.Vector3(1238, 83, 138),

                new THREE.Vector3(891, 83, -250),
                new THREE.Vector3(891, 83, 138),

                new THREE.Vector3(543, 83, -150),
                new THREE.Vector3(543, 83, 188),

                new THREE.Vector3(181, 83, -150),
                new THREE.Vector3(181, 83, 188),

                new THREE.Vector3(-510, 110, 60),
                new THREE.Vector3(-947, 110, 60),

                new THREE.Vector3(740, 83, -561)
            ];
            //管线
            this.gs_arr=[];
            //灯光备份
            this.lights=[];

            //罐子控制位置
            this.gzkz_position_arr = [new THREE.Vector3(884, 77, 671.495),
                new THREE.Vector3(1141, 77, 671.495),
                new THREE.Vector3(1015, 77, 671.495)
            ];

            this.zljFSarr=[];

            this.shaderMaterial={
                m1:new THREE.ShaderMaterial({
                    uniforms:{size1:{value:0.0},color:{value:new THREE.Color(0x3e96ff)}},
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
                    let n=scene[i].model.userData.name?scene[i].model.userData.name:scene[i].fileName;
                    this.models[n]=scene[i];

                    let type=scene[i].model.userData.type;
                    switch (type) {
                        case"item":{
                            this._loadItem(scene,i,n);
                            break;
                        }
                        case "truck":{
                            this._loadTruck(scene,i);
                            break;
                        }
                        case "chache":{
                            this._loadChaChe(scene,i);
                            break;
                        }
                    }
                }

                this._init();
                this._animate();

            });
        }

        _loadItem(scene,i,n){
            let m=scene[i].model;
            let mm = m.getObjectByName("model_0");
            mm.geometry.computeBoundingBox();
            this.models[n].max=mm.geometry.boundingBox.max;
            this.models[n].lightIntensity=m.userData.lightIn;

            if(mm.userData.envMap){
                mm.material.envMap=this.cubes[mm.userData.envMap]?this.cubes[mm.userData.envMap]:null;
                mm.material.envMapIntensity=mm.userData.envMapIntensity;
                //this._setNormalEnvMap(mm);
            }
        }
        _setNormalEnvMap(mm){
            //mm.material.envMap = this.cubes.hdr;
			//mm.material.needsUpdate = true;
			//mm.material.envMapIntensity = 0.02;
        }

        _loadTruck(scene,i){
            let m=scene[i].model.getObjectByName("model_1");
            m.material=new THREE.MeshPhongMaterial({color:0xffffff});
        }

        _loadChaChe(scene,i){
            let m=scene[i].model;
            let box = m.getObjectByName("Box");
            box.visible=false;
        }

        _init(){
            this._initDom();
            this._initItemBS();
            this._initConfiguration();
            this._initBasic();
            this._initStage();
            this._initProcessing();

            this._initEvents();
        }

        _initDom(){
            let $itemStage=$("<div class='item-stage'></div>")
            this.$itemStage=$itemStage;
            this.$itemStage.appendTo(this.$e);

            let $img360=$("<img class='item-stage-360' src='./icon/360.png' />");
            this.$img360=$img360;
            this.$img360.appendTo(this.$itemStage);

            let $im=$(
                "<div class='item-message'>" +
                    "<div id='item-message-story' class='item-message-story'>" +
                        "<div class='item-message-story-text'></div>"+
                    "</div>"+
                    "<div class='item-message-toggle item-message-toggle-show'></div>"+
                    "<div class='item-message-close'><img src='./icon/close.png'/></div>"+
                "</div>"
            );
            this.$im=$im;
            this.$im.appendTo(this.$e);

            let $home=$("<div class='home'><img src='./icon/home2.png'/></div>")
            this.$home=$home;
            this.$home.appendTo(this.$e);


            this.messageScroll=new IScroll("#item-message-story",{mouseWheel:true});
        }
        _initItemBS(){
            this.itemBs=new BasicStage({element:this.$itemStage.get(0)});
            this.itemBs.o3d.controls.autoRotate=true;
            this.itemBs.o3d.controls.autoRotateSpeed=0.25;
            this.itemBs.o3d.controls.maxPolarAngle=Math.PI/2;
            this.itemBs.o3d.renderer.outputEncoding=3001;

            let pg=new THREE.PMREMGenerator(this.itemBs.o3d.renderer);
            let texture=pg.fromCubemap(this.cubes.hdr).texture;

            this.itemBs.o3d.scene.environment=texture;
            //this.itemBs.o3d.renderer.outputEncoding=3001;
        }

        _initCubes(){
            let r = './res/cube/Bridge2/';
            let urls = [ r + 'posx.jpg', r + 'negx.jpg',
                r + 'posy.jpg', r + 'negy.jpg',
                r + 'posz.jpg', r + 'negz.jpg' ];

            let tc = new THREE.CubeTextureLoader().load( urls );
            tc.encoding = THREE.sRGBEncoding;
            this.cubes.Bridge2=tc;

            let hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
            let hdrCubeMap = new THREE.HDRCubeTextureLoader()
                .setPath( './res/cube/hdr/' )
                .setDataType( THREE.UnsignedByteType )
                .load( hdrUrls, function () {
  /*                  hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );
                    hdrCubeMap.magFilter = THREE.LinearFilter;
                    hdrCubeMap.needsUpdate = true;*/
                } );
            hdrCubeMap.encoding = 3002;
            this.cubes.hdr=hdrCubeMap;

/*            let pg=new THREE.PMREMGenerator(bs.o3d.renderer);
            let texture=pg.fromCubemap(hdrCubeMap).texture;
            this.cubes.hdr=texture;*/


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

            let pg=new THREE.PMREMGenerator(this.bs.o3d.renderer);
            let texture=pg.fromCubemap(this.cubes.hdr).texture;

            this.bs.o3d.scene.environment=texture;

        }
        _initBasic(){
            let controls = this.controls = new THREE.MapControls(this.camera,this.element);
            controls.maxPolarAngle = Math.PI * 0.5;
            controls.minDistance = 1000;
            controls.maxDistance = 4000;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true
            controls.autoRotateSpeed = 0.1;
            //设置摄像机左右移动范围
            controls.minAzimuthAngle = -Math.PI * (20 / 180);
            controls.maxAzimuthAngle = Math.PI * (5 / 180);
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
            this.$im.find(".item-message-toggle").on("mouseup touchend",this._viewItemMessageToggle.bind(this));

            this.$home.on("mouseup touchend",this._homeClose.bind(this));

            this.$itemStage.on("mousedown touchstart",this._itemStageTouch.bind(this))

            document.addEventListener('touchmove', function (e) { e.preventDefault(); },  false);

            $(window).on("resize",this.eventOptions.resize);
        }

        _itemStageTouch(){
            this.$img360.fadeOut();
        }

        _homeClose(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

            this.$home.fadeOut();
            if(this.status.itemLooking){
                this._viewItemMessageClose(event,()=>{
                    this._roofClose();
                },true);
            }else{
                this._roofClose();
            }
        }
        _roofClose(){
            this._roofHideOrShow(false);
            this.roofInOutPlay(true);
            this._viewMainDomToggle(true);
            this._viewItemDomToggle(false);
            this._viewLabelDomToggle(false);
            this.status.view="main";
        }
        _roofOpen(){
            this._viewMainDomToggle(false);
            this.roofInOutPlay();
            this._viewItemDomToggle(true);
            this._viewLabelDomToggle(true);
            this.status.view="items";
        }

        _resize(){
/*            let pixelRatio = this.bs.o3d.renderer.getPixelRatio();

            this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.bs.width * pixelRatio );
            this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.bs.height * pixelRatio );*/

            if(this.bs.width>768){
                this.$im.css("bottom","auto");
            }
        }

        _initStage(){
            let camera=this.camera;
            let controls=this.controls;
            let m=this.scene.model;
            let ta=this.tweenAnimate;
            ta.mainInOut=new TimelineMax({paused:true,onStart:()=>{this.mainCJ.visible=true;},onUpdate:()=>{this.status.taPlaying=true;},onComplete:()=>{this.status.taPlaying=false;this._viewMainDomToggle(true);this._initOnceComplete();}});
            ta.roofInOut=new TimelineMax({paused:true,delay:1,onStart:()=>{this._roofHideOrShow()},onUpdate:()=>{this.status.taPlaying=true;},onComplete:()=>{this.status.taPlaying=false;},onReverseComplete:()=>{this.status.taPlaying=false;this._roofHideOrShow(false);this.$home.fadeIn();}});

            let view=this.view;
            m.updateWorldMatrix();
            m.traverse((child)=>{
                this._initStageConfig(child);


                //this._initZhiLengJi_todo(child);
            });
            this._initHuojia();
            this._initGuijis();

            this._initICFE20();
            this._initICFSS20690();
            this._init027L3465();
            this._initLGGD();
            this._initGzkz();
            this._initGuanzi();

            m.traverse((child)=>{
                this._initStageDom(child,view);
                this._initTweenAnimate(child,ta,view);
            })


            ta.roofInOut.seek(1.99);
            this._roofHideOrShow(true)
        }

        _initZhiLengJi_todo(child){
            if(child.name==="ZhiLengJi_1"){
                let m=child.userData.model;
                let model=this.models[m].model;
                child.add(model);

                let mc=model.children;
                mc.map((c)=>{
                    if(c.name==="Zhilengji Shan"||c.name==="Zhilengji Shan1"||c.name==="Zhilengji Shan2"||c.name==="Zhilengji Shan2"){
                        this.zljFSarr.push(c);
                    }
                    if(c.name==="GuanDao_Red Zhilengji"||c.name==="Zhilengji GuanDao_Green"||c.name==="Zhilengji GuanDao_Blue"){
                        c.material=this.shaderMaterial.m1.clone();
                        this.gs_arr.push(c);
                        if(c.name==="GuanDao_Red Zhilengji")
                            c.material.uniforms.color.value=new THREE.Color(0xff3e96);
                        else if(c.name==="Zhilengji GuanDao_Green")
                            c.material.uniforms.color.value=new THREE.Color(0x96ff3e);
                        else
                            c.material.uniforms.color.value=new THREE.Color(0x3e96ff);
                    }
                })
            }
        }

        //创建货架
        _initHuojia(){
            this._initHuojia1();
            this._initHuojia2();
        }
        //创建货架1
        _initHuojia1(){
            let scene=this.mainCJ;
            let meshHJ=this.models["huojia"].model.children[0];
            meshHJ.material= new THREE.MeshBasicMaterial({map: this.textures.huojia});
            scene.add(meshHJ);

            let i;
            //第一排货架
            for( i = 0; i < 6; i++)
            {
                let mesh = meshHJ.clone();
                mesh.position.x = -408;
                mesh.position.z = (i * 1) * -100;
                scene.add( mesh );
            }

            //第二排货架
            for(i = 0; i < 5; i++)
            {
                let mesh = meshHJ.clone();
                mesh.position.z = (i + 1) * -100;
                scene.add( mesh );
            }

            //第三排货架
            for(i = 0; i < 8; i++)
            {
                let mesh = meshHJ.clone();
                mesh.position.x = 357;
                mesh.position.z = (i * 1) * -100;
                scene.add( mesh );
            }

            //第四排货架
            for(i = 0; i < 8; i++)
            {
                let mesh = meshHJ.clone();
                mesh.position.x = 700;
                mesh.position.z = (i * 1) * -100;
                scene.add( mesh );
            }

            //其他货架
            let mesh = meshHJ.clone();
            mesh.position.x = -408;
            mesh.position.z = -830;
            scene.add( mesh );
        }
        //创建货架2
        _initHuojia2(){
            let scene=this.mainCJ;
            let meshHJ2=this.models["huojia2"].model.children[0];
            meshHJ2.material= new THREE.MeshBasicMaterial({map: this.textures.huojia});

            scene.add(meshHJ2);

            //其他货架
            var mesh = meshHJ2.clone();
            mesh.position.x = 189;
            mesh.position.z = -1020;
            scene.add( mesh );

            var mesh = meshHJ2.clone();
            mesh.position.x = 570;
            mesh.position.z = 0;
            scene.add( mesh );
        }

        _initGuijis(){
            this._initGuiji();
            this._initFS1();
            this._initFS2();
        }
        //创建柜机风扇
        _initGuiji(){
            let gj_position_arr=this.gj_position_arr;
            let object=this.models["guiji"].model;
            for(let i = 0; i < gj_position_arr.length; i++)
            {
                let mesh = object.children[0].clone();
                this.mainCJ.add( mesh );
                mesh.position.copy(gj_position_arr[i]);

                if(i == 8 || i == 9||i == 10)
                {
                    mesh.rotation.y = 0.5 * Math.PI;
                }
            }
        }
        _initFS1(){
            let meshGJ_FSposition_arr=this.meshGJ_FSposition_arr;
            let object=this.models["fengshan1"].model;
            for(let i = 0; i < meshGJ_FSposition_arr.length; i++)
            {
                let mesh = object.children[0].clone();
                mesh.position.copy(meshGJ_FSposition_arr[i]);
                this.mainCJ.add( mesh );
                this.meshGJ_FSarr.push(mesh);
            }
        }
        _initFS2(){
            let meshGJ_FSposition_arr2=this.meshGJ_FSposition_arr2;
            let object=this.models["fengshan2"].model;
            for(let i = 0; i < meshGJ_FSposition_arr2.length; i++)
            {
                let mesh = object.children[0].clone();
                mesh.position.copy(meshGJ_FSposition_arr2[i]);
                this.mainCJ.add( mesh );
                this.meshGJ_FSarr2.push(mesh);
            }
        }

        _initICFE20(){
            let scene=this.mainCJ;
            let meshICFE20 = this.models.ICFE20.model.children[0];
            meshICFE20.userData.model="ICFE20";
            meshICFE20.rotation.y = -0.5 * Math.PI;
            meshICFE20.material = new THREE.MeshStandardMaterial({color:0xffffff});

            meshICFE20.material.map = this.textures.ifce20.t1;
            meshICFE20.material.normalMap=this.textures.ifce20.t2;
            meshICFE20.material.normalScale=new THREE.Vector2(2,-2);
            meshICFE20.material.roughnessMap=this.textures.ifce20.t3;
            meshICFE20.material.metalnessMap=this.textures.ifce20.t3;
            meshICFE20.material.aoMap=this.textures.ifce20.t3;
            meshICFE20.material.roughness = 1.0;
            meshICFE20.material.metalness = 1.0;
            this._setNormalEnvMap(meshICFE20);

            let m1 = meshICFE20.clone();
            m1.name="item_3";
            m1.position.set( 1033.108, 166.921, -254.264);
            let m2 = meshICFE20.clone();
            m2.name="item_4";
            m2.position.set( 1119.211, 178.434, 66.597);

            scene.add(m1);
            scene.add(m2);
        }

        _initICFSS20690(){
            let scene=this.mainCJ;
            let meshICFSS20690=this.models.ICF_SS.model.children[0];
            meshICFSS20690.rotation.y = 0.5 * Math.PI;
            meshICFSS20690.userData.model="ICF_SS";

            meshICFSS20690.material=new THREE.MeshStandardMaterial({color:0xffffff});
            meshICFSS20690.material.map=this.textures.icf_ss.t1;
            meshICFSS20690.material.normalMap=this.textures.icf_ss.t2;
            meshICFSS20690.material.normalScale=new THREE.Vector2(1,-1);
            meshICFSS20690.material.roughnessMap=this.textures.icf_ss.t3;
            meshICFSS20690.material.metalnessMap=this.textures.icf_ss.t3;
            meshICFSS20690.material.aoMap=this.textures.icf_ss.t3;
            meshICFSS20690.material.roughness=1.0;
            meshICFSS20690.material.metal=1.0;
            this._setNormalEnvMap(meshICFSS20690);

            let m1 = meshICFSS20690.clone();
            m1.name="item_5";
            m1.position.set( 1071.274, 174.749, 20.984);
            let m2 = meshICFSS20690.clone();
            m2.name="item_6";
            m2.position.set( 1094.097, 174.749, -199.420);

            scene.add(m1);
            scene.add(m2);
        }

        _init027L3465(){
            let scene=this.mainCJ;
            this.models.I027L3465.model.children[0].material=new THREE.MeshStandardMaterial({color:0xffffff});
            this._setNormalEnvMap(this.models.I027L3465.model.children[0]);
            let mesh027L3465=this.models.I027L3465.model.children[0].clone();
            mesh027L3465.rotation.y = -0.5 * Math.PI;
            mesh027L3465.name="item_7";
            mesh027L3465.userData.model="I027L3465";

            mesh027L3465.material.map=this.textures.I027L3465.t1;
            mesh027L3465.material.normalMap=this.textures.I027L3465.t2;
            mesh027L3465.material.normalScale=new THREE.Vector2(1,-1);
            mesh027L3465.material.roughnessMap=this.textures.I027L3465.t3;
            mesh027L3465.material.metalnessMap=this.textures.I027L3465.t3;
            mesh027L3465.material.aoMap=this.textures.I027L3465.t3;
            mesh027L3465.position.set( 1002.178, 175.486, 68.899);

            mesh027L3465.material.roughness = 1.0;
            mesh027L3465.material.metalness = 1.0;

            scene.add(mesh027L3465);
        }

        _initLGGD(){
            let m=this.models.GuanDao.model;
            this.mainCJ.add(m);
            m.traverse((c)=>{
                if(c.name==="GreenLine"||c.name==="BlueLine"||c.name==="RedLine1"){
                    c.material=this.shaderMaterial.m1.clone();
                    this.gs_arr.push(c);
                    if(c.name==="RedLine1")
                        c.material.uniforms.color.value=new THREE.Color(0xe02525);
                    else if(c.name==="GreenLine")
                        c.material.uniforms.color.value=new THREE.Color(0x4fa71f);
                    else
                        c.material.uniforms.color.value=new THREE.Color(0x283cd3);
                }
            })
        }

        _initGzkz(){

            let m = this.models.biao.model.children[0];
            let gzkz_position_arr=this.gzkz_position_arr;
            for(let i = 0; i < gzkz_position_arr.length; i++)
            {
                let mesh = m.clone();
                mesh.material = new THREE.MeshPhongMaterial( { color: 0xcccccc} );
                this.mainCJ.add( mesh );
                mesh.position.set( gzkz_position_arr[i].x, gzkz_position_arr[i].y, gzkz_position_arr[i].z );
                mesh.scale.multiplyScalar( 0.01 );
            }
        }

        _initGuanzi(){
            let meshGZ = this.models.gz.model.children[0];
            let scene=this.mainCJ;
            scene.add( meshGZ );
            meshGZ.scale.multiplyScalar( 0.01 );
            meshGZ.position.set( 999, -11.9, 745 );
            meshGZ.material = new THREE.MeshPhongMaterial( { color: 0xcccccc} );
        }

/*        _initPHE(){
            let meshPHE = this.models.Plate_heat_exchanger.model.children[0];
            this.mainCJ.add( meshPHE );
            meshPHE.position.set( 837.889, 19.152, 758.318);
            meshPHE.scale.multiplyScalar( 0.021 );
            meshPHE.rotation.y = -0.5 * Math.PI;
            meshPHE.
        }*/

        start(){
            let ta=this.tweenAnimate;
            ta.mainInOut.play()
            //ta.roofInOut.play();
        }

        _initTweenAnimate(child,ta,view){
            let camera=this.camera;
            let controls=this.controls;

            if(child.name==="main"){
                //child.visible=false;
                ta.mainInOut.from(child.position,0,{y:-150})
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

                let max=m.clone().multiply(new THREE.Vector3(0.75,1.1,0.75));
                let cp = p.clone().add(max.multiplyScalar(4*s));

/*                let vd=this.view.items[child.name];
                cp=vd.cp.mu;
                p=vd.tp;*/

                this.tweenAnimate.itemsInOut[child.name]={
                    cp:cp,
                    ct:p,
                    cameraTA:new TweenMax(camera.position,1,{x:cp.x,y:cp.y/4*3,z:cp.z,paused:true,onStart:()=>{
                            this.status.itemLooking=false;
                            //this.bs.normalControlsToggle(false);
                            this.bs.o3d.controls.autoRotate=false;
                            this.config.cp.copy(this.camera.position);
                            this.config.tp.copy(this.controls.target);
                        },onUpdate:()=>{this.status.taPlaying=true;},
                        onComplete:()=>{
                            this.status.taPlaying=false;
                            this.status.itemLooking=true;
                            this.status.itemTarget=p.clone();
                            this.controls.enabled=false;
                            //this.bs.normalControlsToggle(true);
                            this.bs.o3d.controls.autoRotate=true;
                            this.bs.o3d.controls.target.copy(p);
                            this.bs.o3d.controls.autoRotateSpeed=0.5;

                            this._itemBsOpen(child);

                            this.dispatchEvent({type:"itemChange",message:child.name})
                        }}),
                    targetTA:new TweenMax(controls.target,1,{x:p.x,y:p.y,z:p.z,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}})
                }
            }else if(child.name.split("_")[0]==="guanxian"){
                //console.log(child.name);
                //child.material=this.shaderMaterial.m1;
            }
        }

        _itemBsOpen(child){
            if(child.userData.model){
                this.$img360.fadeIn();
                let m=this.models[child.userData.model].model.isMesh?this.models[child.userData.model].model:this.models[child.userData.model].model.children[0];
                console.log(m,child.userData.model);
                this.itemBs.setModel(m.clone());
				/**
                let l1=new THREE.PointLight(0xcccccc,0.5);
                l1.position.set(this.itemBs.o3d.worldRadius,this.itemBs.o3d.worldRadius,this.itemBs.o3d.worldRadius);
                let l2=new THREE.PointLight(0xcccccc,0.5);
                l2.position.set(-this.itemBs.o3d.worldRadius,-this.itemBs.o3d.worldRadius,-this.itemBs.o3d.worldRadius);
                let l3=new THREE.PointLight(0xcccccc,0.5);
                l3.position.set(-this.itemBs.o3d.worldRadius,this.itemBs.o3d.worldRadius,-this.itemBs.o3d.worldRadius);

                let l4=new THREE.PointLight(0xcccccc,0.5);
                l4.position.set(this.itemBs.o3d.worldRadius,-this.itemBs.o3d.worldRadius,-this.itemBs.o3d.worldRadius);
                this.itemBs.addModel(l1);
                this.itemBs.addModel(l2);
                this.itemBs.addModel(l3);
                this.itemBs.addModel(l4);
                this.itemBs.normalLightOpen();
				*/
/*				var light = new THREE.HemisphereLight( 0xffffff,0xffffff,0.8 );
				light.position.set( -3000, 5000, 3000 );
				light.castShadow = true;
				this.itemBs.addModel(light);

				var light3 = new THREE.DirectionalLight( 0xffffff, 0.5 );
				light3.position.set( 3000, 5000, -3000 );
				light3.castShadow = true;
				this.itemBs.addModel(light3);*/

                this.itemBs.o3d.controls.rotateLeft(3.14/4);
                this.itemBs.normalLightOpen();
                let li = this.models[child.userData.model].lightIntensity;
                if(li){
                    this.itemBs.o3d.normalLight.intensity=li;
                    this.itemBs.o3d.renderer.outputEncoding=3000;
                }
                else{
                    this.itemBs.o3d.normalLight.intensity=0;
                    this.itemBs.o3d.renderer.outputEncoding=3001;
                }

                this.$itemStage.fadeIn();
                this.bs.openPass();
            }
        }

        _itemBsClose(){
            this.itemBs.clearMixer();
            this.itemBs.clearModel();
            this.itemBs.normalLightClose();
            this.itemBs.o3d.normalLight.intensity=0.5;
            this.$itemStage.fadeOut();
            this.bs.closePass();
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
                            "<div class='view-icon'><img src='./icon/door2.png'/></div>"+
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

            }
            else if(child.name.split("_")[0]==="item"){
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
            else if(child.name.split("_")[0]==="label"){
                /*this.labels[child.name]=child;
                let title=child.userData.title;
                let $dom=$(
                    "<div class='view view-item view-"+child.name+"'>" +
                    "<div class='label-line'>" +
                    "<div class='label-t'>" +
                    "<div data-name='"+child.name+"' class='label-title-item'>"+title+"</div>"+
                    "</div>"+
                    "</div>"+
                    "</div>"
                );
                child.userData.$dom=$dom;
                $dom.appendTo(this.$e);*/
            }
        }

        _initStageConfig(child){
            if(child.name==="main")
            {
                child.geometry.computeBoundingBox();
                child.material=new THREE.MeshBasicMaterial({map:this.textures.main});
                let box = child.geometry.boundingBox;
                this.controls.maxPan=box.max;
                this.controls.minPan=box.min;
                //console.log(box);
                this.mainCJ=child;
            }else if(child.name.split("_")[0]==="item"||child.name.split("_")[0]==="adorn")
            {
                let name=child.userData.model;

                if(name && this.models[name]){
                    let m=this.models[name].model;
                    child.add(m.clone());
                    child.userData.max=this.models[name].max;
                }
            }else if(child.name==="light_1"||child.name==="light_2"){
                let light=child;

                light.castShadow = true;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                let d = 1000;
                light.shadow.camera.left = - d;
                light.shadow.camera.right = d;
                light.shadow.camera.top = d;
                light.shadow.camera.bottom = - d;
                light.shadow.camera.far = 1;

                this.lights.push(child.clone);
            }
        }

        _initProcessing(){
            this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
            let pixelRatio = this.bs.o3d.renderer.getPixelRatio();
            this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.bs.width * pixelRatio );
            this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.bs.height * pixelRatio );

            this.bs.addPass(this.fxaaPass);

            let w=this.bs.width;
            let h=this.bs.height;
            this.bokehPass = new THREE.BokehPass( bs.o3d.scene, bs.o3d.camera, {
                focus:0,
                aperture:1*0.0001,
                maxblur:1.0,
                width: w, height: h
            } );
            this.bs.addPass(this.bokehPass);

            this.bs.closePass();
        }

        _viewMainClick(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

            this._roofOpen();
        }
        _viewItemClick(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

            let t=event.target;
            let n = t.dataset.name;
            this.lookItem(n);
            this._viewItemMessageShow(n);
            this._viewItemDomToggle(false);
            this._viewLabelDomToggle(false);
        }
        _viewItemMessageShow(name){
            let item=this.view.items[name];
            let $imst=$(this.$im.find(".item-message-story-text"));
            $imst.html(item.text);
            this.$im.fadeIn();

            this.messageScroll.refresh();
        }

        _viewItemMessageClose(event,callback,notUI){
            event.preventDefault();

            this.exitLookItem(callback,notUI);
            this._viewItemMessageHide();
            this._itemBsClose();
        }
        _viewItemMessageHide(){
            let item=this.view.items[name];
            let $imst=$(this.$im.find(".item-message-story-text"));
            //$imst.empty();
            this.$im.fadeOut();
        }

        _viewItemMessageToggle(event){
            event.preventDefault();
            event.preventDefault();

            let $t=$(event.target);
            if($t.hasClass("item-message-toggle-show")){
                $t.removeClass("item-message-toggle-show")
                    .addClass("item-message-toggle-hide");
                this.$im.css("bottom",-(this.$im.height()-30));
            }else{
                $t.removeClass("item-message-toggle-hide")
                    .addClass("item-message-toggle-show");
                this.$im.css("bottom",0);
            }
        }
        _viewItemMessageTS(event){

        }
        _viewItemMessageTH(event){

        }

        _viewMainDomToggle(show){
            if(show){
                this.view.main.$dom.fadeIn();
            }
            else{
                this.view.main.$dom.fadeOut();
            }

        }
        _viewItemDomToggle(show){
            let fn=show?"fadeIn":"fadeOut";

            let items = this.view.items;
            for(let a in items){
                items[a].$dom[fn]();
            }
        }
        _viewLabelDomToggle(show){
            let fn=show?"fadeIn":"fadeOut";

            let labels = this.labels;
            for(let a in labels){
                labels[a].userData.$dom[fn]();
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
                [new THREE.Vector3( -484.969,10.5, -37.449 ),
                new THREE.Vector3( -624.108,10.5, -37.449 ),
                new THREE.Vector3( -637.668,10.5, -43.949 ),
                new THREE.Vector3( -646.721,10.5, -55.627 ),
                new THREE.Vector3( -646.721,10.5, -123.447 ),
                new THREE.Vector3( -640.215,10.5, -139.960 ),
                new THREE.Vector3( -625.625,10.5, -146.417 ),
                new THREE.Vector3( -402.484,10.5, -146.417 ),
                new THREE.Vector3( -389.073,10.5, -156.431 ),
                new THREE.Vector3( -381.333,10.5, -169.369 ),
                new THREE.Vector3( -381.333,10.5, -322.486 )
            ],8);
        }
        _initBoxList2(){
            this._initBoxList(
                [new THREE.Vector3( -880.697,10.5, -35.236 ),
                new THREE.Vector3( -1012.438,10.5, -35.236 ),
                new THREE.Vector3( -1031.351,10.5, -41.047 ),
                new THREE.Vector3( -1037.919,10.5, -51.040 ),
                new THREE.Vector3( -1040.137,10.5, -57.301 ),
                new THREE.Vector3( -1040.137,10.5, -121.449 ),
                new THREE.Vector3( -1035.214,10.5, -137.854 ),
                new THREE.Vector3( -1023.029,10.5, -146.024 ),
                new THREE.Vector3( -849.619,10.5, -146.024 ),
                new THREE.Vector3( -836.007,10.5, -151.470 ),
                new THREE.Vector3( -829.868,10.5, -165.887 ),
                new THREE.Vector3( -829.868,10.5, -284.805 )
            ],8);
        }
        _initBoxList3(){
            this._initBoxList(
                [new THREE.Vector3( -884.857,10.5, 122.595 ),
                    new THREE.Vector3( -1017.954,10.5, 122.595 ),
                    new THREE.Vector3( -1036.123,10.5, 131.660 ),
                    new THREE.Vector3( -1038.861,10.5, 141.352 ),
                    new THREE.Vector3( -1038.861,10.5, 210.618 ),
                    new THREE.Vector3( -1035.335,10.5, 222.689 ),
                    new THREE.Vector3( -1023.781,10.5, 231.302 ),
                    new THREE.Vector3( -849.895,10.5, 231.302 ),
                    new THREE.Vector3( -837.283,10.5, 237.321 ),
                    new THREE.Vector3( -829.617,10.5, 254.106 ),
                    new THREE.Vector3( -829.617,10.5, 370.410 )
                ],8);
        }
        _initBoxList4(){
            this._initBoxList(
                [new THREE.Vector3( -477.924,10.5, 121.471 ),
                    new THREE.Vector3( -626.664,10.5, 121.471 ),
                    new THREE.Vector3( -643.027,10.5, 132.314 ),
                    new THREE.Vector3( -647.370,10.5, 141.428 ),
                    new THREE.Vector3( -647.370,10.5, 212.436 ),
                    new THREE.Vector3( -639.637,10.5, 222.845 ),
                    new THREE.Vector3( -624.398,10.5, 231.611 ),
                    new THREE.Vector3( -404.017,10.5, 231.611 ),
                    new THREE.Vector3( -388.839,10.5, 236.609 ),
                    new THREE.Vector3( -380.871,10.5, 257.577 ),
                    new THREE.Vector3( -380.871,10.5, 406.031 )
                ],8);
        }
        _initBoxList(points,count){
            let o3dml=new O3DMovementList({
                points:points,
                mesh:new THREE.Mesh(new THREE.BoxBufferGeometry(6,6,6),new THREE.MeshBasicMaterial({color:0x3e96ff})),
                count:count,
                randomRotation:true
            });

            this.bs.addModel(o3dml.list);
        }

        _initTrucks(){
            this._initTruck1();
            this._initTruck2();
            this._initTruck3();
            this._initTruck4();
        }
        _initTruck1(){
            this._initTruck([
                new THREE.Vector3( -7671.132,-24, -4221.635 ),
                new THREE.Vector3( -5268.759,-24, -4221.635 ),
                new THREE.Vector3( -3020.913,-24, -3208.639 ),
                new THREE.Vector3( -3020.913,-24, -870.326 ),
                new THREE.Vector3( -1467.542,-24, -770.326 ),
                new THREE.Vector3( -1467.542,-24, 1030.482 ),
                new THREE.Vector3( -1116.104,-24, 1030.482 ),
                new THREE.Vector3( -1116.104,-24, 826.857 ),
            ],3,300)
        }
        _initTruck2(){
            this._initTruck([
                new THREE.Vector3( 7565.030,-24, 444.667 ),
                new THREE.Vector3( 1747.307,-24, 444.667 ),
              /*  new THREE.Vector3( 1550,-24, 444.667 ),*/
                new THREE.Vector3( 1450,-24, 1035.443 ),
                new THREE.Vector3( -284,-24, 1035.443 ),
                new THREE.Vector3( -354,-24, 826 )
            ],1.0,200);
        }
        _initTruck3(){
            this._initTruck([
                new THREE.Vector3( 2634,-24, -6677 ),
                new THREE.Vector3( 2634,-24, -2499 ),
                /*  new THREE.Vector3( 1550,-24, 444.667 ),*/
                new THREE.Vector3( -2644,-24, -2399 ),
                new THREE.Vector3( -2844,-24, -3350 ),
                new THREE.Vector3( -4997,-24, -4308 ),
                new THREE.Vector3( -4997,-24, -6616 )
            ],0.6,150);
        }
        _initTruck4(){
            this._initTruck([
                new THREE.Vector3( 2738,-24, 7792 ),
                new THREE.Vector3( 2738,-24, 2388 ),
                /*  new THREE.Vector3( 1550,-24, 444.667 ),*/
                new THREE.Vector3( -2689,-24, 2188 ),
                new THREE.Vector3( -3880,-24, 2518 ),
                new THREE.Vector3( -7584,-24, 2518 )
            ],0.3,150);
        }
        _initTruck(points,speed,pointCount){
            let o3dml=new O3DMovementList({
                points:points,
                mesh:this.models["truck"].model,
                count:1,
                yoyo:true,
                delay:2+Math.random()*3,
                completeVisible:true,
                pointCount:pointCount,
                speed:speed
            });

            this.bs.addModel(o3dml.list);
        }

        _initChaches(){
            this._initChache1();
            this._initChache2();
            this._initChache3()
        }
        _initChache1(){
            this._initChache([
                new THREE.Vector3(-660,-10,321),
                new THREE.Vector3(-518,-10,321),
                new THREE.Vector3(-518,-10,490),
                new THREE.Vector3(-660,-10,490)
            ],2,100);
        }
        _initChache2(){
            this._initChache([
                new THREE.Vector3(-898,-10,571),
                new THREE.Vector3(-944,-10,561),
                new THREE.Vector3(-944,-10,353),
                new THREE.Vector3(-1030,-10,343),
/*                new THREE.Vector3(-1048,-10,310),*/
                new THREE.Vector3(-1078,-10,300),
                new THREE.Vector3(-1078,-10,-124),
                new THREE.Vector3(-1040,-10,-200),
                new THREE.Vector3(-943,-10,-237),
                new THREE.Vector3(-943,-10,-481),
                new THREE.Vector3(-984,-10,-491)
            ],1.2,150);
        }
        _initChache3(){
            this._initChache([
                new THREE.Vector3(154,-10,-87),
                new THREE.Vector3(154,-10,336),
                new THREE.Vector3(106,-10,394),
                new THREE.Vector3(-10,-10,394),
                new THREE.Vector3(-10,-10,549),
                new THREE.Vector3(175,-10,549),
                new THREE.Vector3(185,-10,519)
            ],1.7,280);
        }
        _initChache(points,speed,pointCloud){
            let o3dml=new O3DMovementList({
                points:points,
                mesh:this.models["chache"].model,
                count:1,
                yoyo:true,
                delay:3,
                completeVisible:true,
                completeNoRotation:true,
                speed:speed,
                pointCount: pointCloud,
                onComplete:(res)=>{let box=res.list.getObjectByName("Box");if(box) box.visible=!box.visible},
            });
            this.bs.addModel(o3dml.list);
        }

        _initOnceComplete(){
            if(this.status.onceReady) return;
            this.status.onceReady=true;

            this._initTestBox_todo()
            this._initTrucks();
            this._initChaches();
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
            //console.log(22222);
            let items=this.view.items;
            for(let a in items){
                let r=this._v3tov2ByObj(items[a].obj);
                items[a].$dom.css({left:r.x,top:r.y});
            }
        }
        //更新Labels状态下的ui
        _viewLabelsDomUpdate(){
            let labels=this.labels;
            for(let a in labels){
                let r=this._v3tov2ByObj(labels[a]);
                labels[a].userData.$dom.css({left:r.x,top:r.y});
            }
        }

        _animate(){
            let self = this;

            let step=()=>{
                this.animateObject = window.requestAnimationFrame(step);

                //this._renderBlurShadow();
                let config=this.config

                //if(!this.status.taPlaying){
                    if(this.status.itemLooking){
                        this.bs.o3d.controls.update();
                    }else{
                        config.xMin = this.controls.getAzimuthalAngle();
                        this.controls.update();
                        config.xMin1 = this.controls.getAzimuthalAngle();

                        if(config.xMin == config.xMin1)
                        {
                            if(config.xMin < 0)
                            {
                                this.controls.autoRotateSpeed = -0.1;
                            }
                            else
                            {
                                this.controls.autoRotateSpeed = 0.1;
                            }
                        }
                    }
                //}

                this.itemBs.o3d.controls.update();

                if(this.status.view==="main"){
                    this._viewMainDomUpdate();
                }else if(this.status.view==="items"){
                    this._viewItemsDomUpdate();
                    //this._viewLabelsDomUpdate();
                }

                for(let i=0;i<this.meshGJ_FSarr.length;i++){
                    this.meshGJ_FSarr[i].rotation.x -= 0.05;
                }
                for(let i=0;i<this.meshGJ_FSarr2.length;i++){
                    this.meshGJ_FSarr2[i].rotation.z += 0.05;
                }
/*                for(let i=0;i<this.zljFSarr.length;i++){
                    this.zljFSarr[i].rotation.x -= 0.05;
                }*/


                for(let i=0;i<this.gs_arr.length;i++){
                    let m=this.gs_arr[i].material;
                    m.uniforms.size1.value+=0.001;
                    if(m.uniforms.size1.value>=1.0)
                        m.uniforms.size1.value=0.0;
                }
/*                this.shaderMaterial.m1.uniforms.size1.value+=0.001;
                if(this.shaderMaterial.m1.uniforms.size1.value>=1.0)
                    this.shaderMaterial.m1.uniforms.size1.value=0.0;*/
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
        exitLookItem(callback,notUI){
            if(this.status.taPlaying) return;

            let camera = this.camera;
            let controls = this.controls;
            let ta = this.tweenAnimate;

            let cp=this.config.cp;
            ta.cameraReset.cameraTA=new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,paused:true,
                onStart:()=>{
                    this.status.itemLooking=false;
                    this.bs.o3d.controls.autoRotate=false;
                    this.controls.autoRotate=false;
                },
                onUpdate:()=>{this.status.taPlaying=true;},
                onComplete:()=>{
                    this.status.itemLooking=false;
                    this.status.taPlaying=false;
                    //this.bs.normalControlsToggle(false);
                    this.bs.o3d.controls.autoRotate=false;
                    this.controls.enabled=true;
                    this.controls.autoRotate=true;
                    this.controls.update();

                    if(!notUI){
                        this._viewItemDomToggle(true)
                        this._viewLabelDomToggle(true);
                    }

                    this.status.view="items";

                    if(callback) callback();
                    this.dispatchEvent({type:"cameraReset",message:""})
                }});
            ta.cameraReset.targetTA=new TweenMax(this.config.tp,1,{x:0,y:0,z:0,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}});

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
