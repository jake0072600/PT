let Drama=(function () {
    class Drama2 {
        constructor(bs,bl,url,view) {

            this.bs=bs;
            this.bl=bl;

            this.config={
                cp:new THREE.Vector3(-1500, 2000, 2000),
                tp:new THREE.Vector3(0,0,0),
                hcp:new THREE.Vector3(-1500, 2000, 2000),
                htp:new THREE.Vector3(0,0,0),
                models:{},

                xMin:0,
                xMin1:0
            };

            bs.o3d.renderer.physicallyCorrectLights =true;
            bs.o3d.scene.background = new THREE.Color( 0xcccccc );
            bs.o3d.scene.fog = new THREE.Fog( 0xffffff, 100, 10000 );
            let tl=new THREE.TextureLoader();
            tl.encoding = THREE.sRGBEncoding;


            this.controls;

            this.scene;
            this.models={};
            this.textures={
                huojia:tl.load("./res/texture/huojia.jpg"),
                huojiaall:tl.load("./res/texture/huojiaall.jpg"),
                main:tl.load("./res/texture/cflightmap2-1024.png"),
                icfe20:{
                    t1:tl.load("./res/other/obj/ICFE20_2/027L4589_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICFE20_2/027L4589_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICFE20_2/027L4589_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                    t4:tl.load("./res/other/obj/ICFE20_2/xianquan_DefaultMaterial_BaseColor.jpg"),
                    t5:tl.load("./res/other/obj/ICFE20_2/xianquan_DefaultMaterial_Normal.jpg"),
                    t6:tl.load("./res/other/obj/ICFE20_2/xianquan_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
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
                },
                ICLX:{
                    t1:tl.load("./res/other/obj/ICLX/ICLX/ICLX_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICLX/ICLX/ICLX_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICLX/ICLX/ICLX_OcclusionRoughnessMetallic.jpg"),
                    t4:tl.load("./res/other/obj/ICLX/XianQ/xianquan_DefaultMaterial_BaseColor.jpg"),
                    t5:tl.load("./res/other/obj/ICLX/XianQ/xianquan_DefaultMaterial_Normal.jpg"),
                    t6:tl.load("./res/other/obj/ICLX/XianQ/xianquan_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                ICF50_4_41:{
                    t1:tl.load("./res/other/obj/ICF50-4-41/ICF50-4-41_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICF50-4-41/ICF50-4-41_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICF50-4-41/ICF50-4-41_OcclusionRoughnessMetallic.jpg"),
                    t4:tl.load("./res/other/obj/ICF50-4-41/xianquan_DefaultMaterial_BaseColor.jpg"),
                    t5:tl.load("./res/other/obj/ICF50-4-41/xianquan_DefaultMaterial_Normal.jpg"),
                    t6:tl.load("./res/other/obj/ICF50-4-41/xianquan_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                FIASTR15_200_148B5716:{
                    t1:tl.load("./res/other/obj/CHV/FIASTR15-200_148B5716_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/CHV/FIASTR15-200_148B5716_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/CHV/FIASTR15-200_148B5716_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                ICM:{
                    t1:tl.load("./res/other/obj/ICM/ICAD_Tong_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICM/ICAD_Tong_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICM/ICAD_Tong_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                    t4:tl.load("./res/other/obj/ICM/pj_DefaultMaterial_BaseColor.jpg"),
                    t5:tl.load("./res/other/obj/ICM/pj_DefaultMaterial_Normal.jpg"),
                    t6:tl.load("./res/other/obj/ICM/pj_DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                ICF20_6_3:{
                    t1:tl.load("./res/other/obj/ICF20-6-3/ICF20-6-3_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICF20-6-3/ICF20-6-3_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICF20-6-3/ICF20-6-3_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                ICF25_4_9:{
                    t1:tl.load("./res/other/obj/ICF25-4-9/ICF25-4-9_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICF25-4-9/ICF25-4-9_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICF25-4-9/ICF25-4-9_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                SVA_L1:{
                    t1:tl.load("./res/other/obj/SVA-L1/SVA-L1_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/SVA-L1/SVA-L1_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/SVA-L1/SVA-L1_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                OFV:{
                    t1:tl.load("./res/other/obj/OFV/OFV_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/OFV/OFV_Normal.jpg"),
                    t3:tl.load("./res/other/obj/OFV/OFV_OcclusionRoughnessMetallic.jpg"),
                },
                BSV:{
                    t1:tl.load("./res/other/obj/BSV/BSV_wire_229166215_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/BSV/BSV_wire_229166215_Normal.jpg"),
                    t3:tl.load("./res/other/obj/BSV/BSV_wire_229166215_OcclusionRoughnessMetallic.jpg"),
                },
                SNV:{
                    t1:tl.load("./res/other/obj/SNV/SNV_None_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/SNV/SNV_None_Normal.jpg"),
                    t3:tl.load("./res/other/obj/SNV/SNV_None_OcclusionRoughnessMetallic.jpg"),
                },
                AKS4100:{
                    t1:tl.load("./res/other/obj/AKS4100/084H4521_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/AKS4100/084H4521_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/AKS4100/084H4521_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                PHE3:{
                    t1:tl.load("./res/other/obj/PHE/1_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/PHE/1_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/PHE/1_DefaultMaterial_Roughness.jpg"),
                },
                DSV_148F3005:{
                    t1:tl.load("./res/other/obj/DSV_148F3005/DSV_148F3005_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/DSV_148F3005/DSV_148F3005_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/DSV_148F3005/DSV_148F3005_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                TUV_SV:{
                    t1:tl.load("./res/other/obj/TUV-SV/TUV-SV_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/TUV-SV/TUV-SV_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/TUV-SV/TUV-SV_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                bar:{
                    t1:tl.load("./res/other/obj/bar/bar_d.jpg"),
                    t2:tl.load("./res/other/obj/bar/bar_n.jpg"),
                    t3:tl.load("./res/other/obj/bar/bar_a.jpg"),
                },
                barG:{
                    t1:tl.load("./res/other/obj/barG/barG_d.jpg"),
                    t2:tl.load("./res/other/obj/barG/barG_n.jpg"),
                    t3:tl.load("./res/other/obj/barG/barG_a.jpg"),
                },
                kzg:{
                    t1:tl.load("./res/other/obj/KZG/KZG_Diffuse.jpg")
                },
                biao:{
                    t1:tl.load("./res/other/obj/biao.jpg")
                },
                aks33:{
                    t1:tl.load("./res/other/obj/AKS33/DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/AKS33/DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/AKS33/DefaultMaterial_OcclusionRoughnessMetallic.jpg")
                },
                SVA_L2:{
                    t1:tl.load("./res/other/obj/SVA-L2/SVA-L2_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/SVA-L2/SVA-L2_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/SVA-L2/SVA-L2_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                },
                ICF25_6_5A:{
                    t1:tl.load("./res/other/obj/ICF25-6-5a/ICF_SS_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/ICF25-6-5a/ICF_SS_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/ICF25-6-5a/ICF_SS_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                    t4:tl.load("./res/other/obj/ICF25-6-5a/pj_DefaultMaterial_BaseColor.jpg"),
                    t5:tl.load("./res/other/obj/ICF25-6-5a/pj_DefaultMaterial_Normal.jpg"),
                    t6:tl.load("./res/other/obj/ICF25-6-5a/pj_DefaultMaterial_Roughness.jpg")
                },
                LL4000:{
                    t1:tl.load("./res/other/obj/LL4000/LL4000_DefaultMaterial_BaseColor.jpg"),
                    t2:tl.load("./res/other/obj/LL4000/LL4000_DefaultMaterial_Normal.jpg"),
                    t3:tl.load("./res/other/obj/LL4000/LL4000_DefaultMaterial_OcclusionRoughnessMetallic.jpg"),
                }
            }
            this.cubes={
                Bridge2:null,
                hdr:null
            }
            this.bokehPass=null;
            this.fxaaPass=null;

            this.$e=this.bs.$e;
            this.$ec=$(this.bs.o3d.renderer.domElement);
            this.camera=this.bs.o3d.camera;
            this.element=this.bs.o3d.renderer.domElement;

            this.camera.fov=40;
            this.camera.updateProjectionMatrix()


            this.animateObject=null;

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2( 1, 1 );
            this.items = [];
            this.labelItems = [];

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
                onceReady:false,
                guide:{
                    index:0,
                    once:false
                },
                items:[]
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
            this.meshGJ_FSposition_arr = [new THREE.Vector3(1225, 106, -207),
										new THREE.Vector3(1225, 106, -237),
										new THREE.Vector3(1225, 106, -267),
										new THREE.Vector3(1225, 106, -297),
										new THREE.Vector3(1225, 106, 89),
										new THREE.Vector3(1225, 106, 119),
										new THREE.Vector3(1225, 106, 149),
										new THREE.Vector3(1225, 106, 179),


										new THREE.Vector3(878, 106, 89),
										new THREE.Vector3(878, 106, 119),
										new THREE.Vector3(878, 106, 149),
										new THREE.Vector3(878, 106, 179),
										new THREE.Vector3(878, 106, -207),
										new THREE.Vector3(878, 106, -237),
										new THREE.Vector3(878, 106, -267),
										new THREE.Vector3(878, 106, -297),

										new THREE.Vector3(530, 106, 143),
										new THREE.Vector3(530, 106, 173),
										new THREE.Vector3(530, 106, 203),
										new THREE.Vector3(530, 106, 233),
										new THREE.Vector3(530, 106, -105),
										new THREE.Vector3(530, 106, -135),
										new THREE.Vector3(530, 106, -165),
										new THREE.Vector3(530, 106, -195),

										new THREE.Vector3(168, 106, 143),
										new THREE.Vector3(168, 106, 173),
										new THREE.Vector3(168, 106, 203),
										new THREE.Vector3(168, 106, 233),
										new THREE.Vector3(168, 106, -105),
										new THREE.Vector3(168, 106, -135),
										new THREE.Vector3(168, 106, -165),
										new THREE.Vector3(168, 106, -195)
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
            this.gj_position_arr = [new THREE.Vector3(1238, 106, -252),
									new THREE.Vector3(1238, 106, 134),

									new THREE.Vector3(891, 106, -252),
									new THREE.Vector3(891, 106, 134),

									new THREE.Vector3(543, 106, -150),
									new THREE.Vector3(543, 106, 188),

									new THREE.Vector3(181, 106, -150),
									new THREE.Vector3(181, 106, 188),

									new THREE.Vector3(-510, 110, 60),
									new THREE.Vector3(-947, 110, 60),

									new THREE.Vector3(740, 86, -561)
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

            //冷却塔控制
            this.LQTS=[];
            //冷却塔风扇控制
            this.lqtfs_position_arr = [
                new THREE.Vector3(1200.219, 247.605, 518.568),
                new THREE.Vector3(1148.219, 247.605, 518.568),
                new THREE.Vector3(981.219, 247.605, 518.568),
                new THREE.Vector3(928.219, 247.605, 518.568)
            ];
            this.lqtfsArr = [];
            this.GuanDao_F=null;

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

                    if(n==="ICLX"){
                        this._loadICLX(scene,i,n);
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

        _loadICLX(scene,i,n){
            let m=scene[i].model;
            let mm=m.children[0];
            mm.geometry.computeBoundingBox();
            this.models[n].max=mm.geometry.boundingBox.max;
            this.models[n].max.y*=2.0;
        }


        _init(){
            this._initDom();
            this._initItemBS();
            this._initConfiguration();
            this._initBasic();
            this._initStage();
            this._initProcessing();
            this._initGuide();

            this._initEvents();
        }

        _initGuide(){
            let guide = this.view.guide;

            for(let i=0;i<guide.length;i++){
                let g=guide[i];

                let camera=this.camera;
                let controls=this.controls;
                let cp=g.cp;
                let tp=g.tp;
                g.ct = new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,paused:true,
                    onStart:()=>{
                        //controls.autoRotate=false;
                        this.config.cp.copy(this.config.hcp);
                        this.config.tp.copy(this.config.htp);
                    },
                    onUpdate:()=>{this.status.taPlaying=true;},
                    onComplete:()=>{
                        //controls.autoRotate=false;
                        this.status.taPlaying=false;
                        this.$fkStory.html(this.view.guide[this.status.guide.index].text)
                        this.$fkaz.fadeIn();
                        if(this.status.guide.index<this.view.guide.length){
                            this.controls.enabled=false;
                        }else{
                            this.controls.enabled=true;
                        }
                        this.$fkEnter.unbind().fastClick(()=>{
                            if(this.status.taPlaying) return;
                            this.status.guide.index++;
                            if(this.status.guide.index>=this.view.guide.length){
                                this._guideEnd();
                                this.status.guide.once=true;
                                this.$fkSkip.show();
                            }else{
                                this._guidePlay();
                            }
                        });
                    }})
                g.tt = new TweenMax(controls.target,1,{x:tp.x,y:tp.y,z:tp.z,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}})
            }
        }
        _guideEnd(){
            this.status.guide.index = 0;
            this._viewLabelDomToggle(true);
            this.status.view="labels";
            this.$fkaz.fadeOut();
            this.exitLookLabel();
            this.$fkEnter.unbind();
        }
        _guidePlay(){
            let i=this.status.guide.index;
            let g=this.view.guide[i];
            g.ct.restart();
            g.tt.restart();
        }
        //目前只用于那个点击
        _guidePlayByIndex(index){
            //this.status.guide.index=index;
            let guide=this.view.guide;
            let g=guide[index];

            let camera=this.camera;
            let controls=this.controls;
            let cp=g.cp;
            let tp=g.tp;
            let ct = new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,
                onStart:()=>{
                    //controls.autoRotate=false;
                    this.config.cp.copy(this.config.hcp);
                    this.config.tp.copy(this.config.htp);
                    this._initBanner();
                },
                onUpdate:()=>{this.status.taPlaying=true;},
                onComplete:()=>{
                    //controls.autoRotate=false;
                    this.status.taPlaying=false;

                    if(this.$banner){
                        this.$banner.css({"zIndex":1,"opacity":1});
                    }
                }})
            let tt = new TweenMax(controls.target,1,{x:tp.x,y:tp.y,z:tp.z,onUpdate:()=>{camera.lookAt(controls.target)}})
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

            let $fkaz=$("<div class='fk'>" +
                    "<div class='fk-story'></div>"+
                    "<div class='fk-enter'>Enter</div>" +
                    "<div class='fk-skip'></div>"+
                "</div>");
            this.$fkaz=$fkaz;
            this.$fkStory=$($fkaz.find(".fk-story"));
            this.$fkEnter=$($fkaz.find(".fk-enter"));
            this.$fkSkip=$($fkaz.find(".fk-skip"));

            this.$fkaz.appendTo(this.$e);

            let $banner=$(
                '<div class="banner-box">' +
                    '<div class="banner-close"><img src="./icon/close.png"/></div>'+
                '</div>'
            );
            this.$banner=$banner;
            this.$banner.appendTo(this.$e);

            this._initBanner();

            this.messageScroll=new IScroll("#item-message-story",{mouseWheel:true});
        }
        _initItemBS(){
            this.itemBs=new BasicStage({element:this.$itemStage.get(0)});
            this.itemBs.o3d.controls.autoRotate=true;
            this.itemBs.o3d.controls.autoRotateSpeed=0.25;
            this.itemBs.o3d.controls.maxPolarAngle=Math.PI/2;
            //this.itemBs.o3d.renderer.outputEncoding=3001;
            this.itemBs.o3d.controls.enableDamping = true;
            this.itemBs.o3d.controls.dampingFactor = 0.05;
            this.itemBs.o3d.controls.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY
            }
            this.itemBs.o3d.controls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_ROTATE
            }

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

            //let hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
            let hdrCubeMap = new THREE.RGBELoader()
                .setDataType( THREE.UnsignedByteType )
                .load( "./res/hdr/hdr/gongchang.hdr", function () {} );
            //hdrCubeMap.encoding = 3002;
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
            controls.minPolarAngle = Math.PI * 0.05;
			controls.maxPolarAngle = Math.PI * 0.4;
			controls.minDistance = 400;
			controls.maxDistance = 4000;
/*			controls.enableDamping = true;
			controls.dampingFactor = 0.05;*/
			controls.panSpeed = 0.5;
			controls.zoomSpeed = 0.5;
			controls.rotationSpeed = 0.9;
			//controls.autoRotate = true
			//controls.autoRotateSpeed = 0.3;
			//设置摄像机左右移动范围
			//controls.minAzimuthAngle = -Math.PI * (20 / 180);
			//controls.maxAzimuthAngle = Math.PI * (5 / 180);
        }

        _initEvents(){

            this.$ec.on("touchstart mousedown",this._onMouseTouchStart.bind(this));
            this.$ec.fastClick(this._onMouseTap.bind(this));
            let $md=this.view.main.$dom;
            $md.find(".view-icon").on("mouseup touchend",this._viewMainClick.bind(this));
            $md.find(".view-t").on("mouseup touchend",this._viewMainClick.bind(this));

            let items=this.view.items;
            for(let a in items){
                let $md=items[a].$dom;
                $md.find(".view-icon-item").on("mouseup touchend",this._viewItemClick.bind(this));
                $md.find(".view-t").on("mouseup touchend",this._viewItemClick.bind(this));
            }

            let labels=this.view.labels;
            for(let a in labels){
                let $md=labels[a].$dom;
                $md.find(".has-item-2").on("mouseup touchend",this._viewLabelClick.bind(this));
            }

            this.$im.find(".item-message-close").on("mouseup touchend",this._viewItemMessageClose.bind(this));
            this.$im.find(".item-message-toggle").on("mouseup touchend",this._viewItemMessageToggle.bind(this));

            this.$home.on("mouseup touchend",this._homeClose.bind(this));

            this.$itemStage.on("mousedown touchstart",this._itemStageTouch.bind(this))

            document.addEventListener('touchmove', function (e) { e.preventDefault(); },  false);

            this.$fkSkip.fastClick(this._guideEnd.bind(this));

            this.$banner.find(".banner-close").on("mouseup touchend",this._bannerClose.bind(this));

            $(window).on("resize",this.eventOptions.resize);
        }

        _initBanner(){
            this.$banner.find('.banner-plane').unbind().empty();
            $B.stopPlay();
            let $bds= $(
                '<div class="banner-plane">' +
                '<div class="banner banner-tr" draggable="false">' +
                '<img class="b-i" src="./img/i2.PNG" draggable="false"/>' +
                '<img class="b-i" src="./img/i1.PNG" draggable="false"/>' +
                '<img class="b-i" src="./img/i2.PNG" draggable="false"/>' +
                '<img class="b-i" src="./img/i3.PNG" draggable="false"/>' +
                '<img class="b-i" src="./img/i1.PNG" draggable="false"/>' +
                /*'<img class="b-i" src="./img/i2.PNG" draggable="false"/>' +*/
                '</div>' +
                '</div>'
            );

            $bds.appendTo(this.$banner);

            this.$banner.find(".banner").width(this.$banner.width()*5).height(this.$banner.height());
            this.$banner.find(".b-i").width(this.$banner.width());

            //let banner=new $.jqz_banner({duration:200,distence:1,time:5000});
            let config={
                contentBox:'.banner-plane',  //配置外层容器
                content:".banner",        //配置内层移动容器
                infinity:true,              //是否开启循环
                autoPlay:true,              //是否自动轮播
                pcDrag:true,                //是否开启支持PC拖拽轮播
                dragTime:1,               //滑动动画速度
                moveTime:5000,               //自动播放速度
                callBack:function(){
                    /*                    $(".msbtn li").removeClass('active');
                                        $(".msbtn li:eq("+($B.index-1)+")").addClass('active');*/
                }
            };

            $B.init(config);
            //$B.autoPlay();
        }

        _bannerClose(event){
            this.$banner.css({"zIndex":-1,"opacity":0});
            this._viewItemMessageClose(event);
        }

        _itemStageTouch(){
            this.$img360.fadeOut();
        }

        _itemStageClick(event){
            console.log(event);
        }

        _homeClose(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

            let config=this.config;
            config.cp.copy(config.hcp);
            config.tp.copy(config.htp);

            this.$home.fadeOut();
            this.$fkaz.fadeOut();
            if(this.status.itemLooking){
                this._viewItemMessageClose(event,()=>{
                    this._roofClose();
                },true);
            }else{
                this.exitLookItem(()=>{
                    this._roofClose();
                },true)
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
            //this._viewItemDomToggle(true);
            //this._viewLabelDomToggle(true);
            //this.status.view="labels";
        }

        _resize(){
/*            let pixelRatio = this.bs.o3d.renderer.getPixelRatio();

            this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.bs.width * pixelRatio );
            this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.bs.height * pixelRatio );*/

            if(this.bs.width>768){
                this.$im.css("bottom","auto");
            }

            if(this.$banner){
                this._initBanner();
            }
        }

        _initStage(){
            let camera=this.camera;
            let controls=this.controls;
            let m=this.scene.model;
            let ta=this.tweenAnimate;
            ta.mainInOut=new TimelineMax({paused:true,onStart:()=>{this.mainCJ.visible=true;},onUpdate:()=>{this.status.taPlaying=true;},onComplete:()=>{this.status.taPlaying=false;this._viewMainDomToggle(true);this._initOnceComplete();}});
            ta.roofInOut=new TimelineMax({paused:true,delay:1,
                onStart:()=>{
                    this._roofHideOrShow();
                    this._LQTShowOrHide(false)
                },
                onUpdate:()=>{this.status.taPlaying=true;},
                onComplete:()=>{this.status.taPlaying=false;},
                onReverseComplete:()=>{
                    this.status.taPlaying=false;
                    this._roofHideOrShow(false);
                    this.$home.fadeIn();
                    this._LQTShowOrHide(true);

                    this._guidePlay();
            }});

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
            //this._init027L3465();
            this._initLGGD();
            this._initGzkz();
            this._initGuanzi();

            this._initICLX();
            this._initICF50441();
            this._initCHV();
            this._initICM();
            this._initICF2063();
            this._initICF2549();
            this._initSVAL1();
            this._initOFV();
            this._initBSV();
            this._initSNV();
            this._initAKS4100();
            this._initPHE();
            this._initDSV_148F3005();
            this._initTUV_SV();
            this._initBar();
            this._initBarG();
            this._initFangDing();
            this._initLQT();
            this._initLQTFS();
            this._LQTShowOrHide(false);
            this._initTP();
            this._initKZG();

            this._initAKS33();
            this._initSVA_L2();
            this._initICF2565A();
            this._initLL4000();



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
				if(i>3)
				{
					this.meshGJ_FSarr.push(mesh);
				}

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
            let object = this.models.icfe20.model;
            object.userData.model="icfe20";

            let mesh1 = object.children[0];
            let mesh2 = object.children[1];

            this._setNormalMap(mesh2,this.textures.icfe20.t1,this.textures.icfe20.t2,this.textures.icfe20.t3);
            this._setNormalMap(mesh1,this.textures.icfe20.t4,this.textures.icfe20.t5,this.textures.icfe20.t6);

            mesh1.geometry.computeBoundingBox();
            let max=mesh1.geometry.boundingBox.max.multiply(new THREE.Vector3(2,2,2));

            let m=object.clone();
            m.scale.multiplyScalar( 0.4 );
            m.position.set(1150.689,166.263, -141.329);
            m.name="item_3";
            m.userData.max=max;

            scene.add( m );
        }

        _initICFSS20690(){
            let scene=this.mainCJ;
            let meshICFSS20690=this.models.ICF_SS.model.children[0];
            meshICFSS20690.rotation.y = Math.PI;
            meshICFSS20690.userData.model="ICF_SS";

            meshICFSS20690.material=new THREE.MeshStandardMaterial();
            meshICFSS20690.material.map=this.textures.icf_ss.t1;
            meshICFSS20690.material.normalMap=this.textures.icf_ss.t2;
            meshICFSS20690.material.normalScale=new THREE.Vector2(1,-1);
            meshICFSS20690.material.roughnessMap=this.textures.icf_ss.t3;
            meshICFSS20690.material.metalnessMap=this.textures.icf_ss.t3;
            meshICFSS20690.material.aoMap=this.textures.icf_ss.t3;
            meshICFSS20690.material.roughness=1.0;
            meshICFSS20690.material.metalness=0.6;
            this._setNormalEnvMap(meshICFSS20690);

            let m1 = meshICFSS20690.clone();
            m1.name="item_5";
            m1.scale.multiplyScalar( 0.6 );
            m1.position.set( 1104.378, 165.466, -126.512);
/*            let m2 = meshICFSS20690.clone();
            m2.name="item_6";
            m2.position.set( 1094.097, 174.749, -199.420);*/

            scene.add(m1);
            //scene.add(m2);
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
            let m=this.models.GuanDao_F.model;
            this.GuanDao_F=m;
            this.mainCJ.add(m);
            m.traverse((c)=>{
                //if(c.name==="Blue_F"||c.name==="Green_F"||c.name==="Green1_F"||c.name==="Red_F"||c.name==="White_F"||c.name==="Yellow_F"){
				 if(c.name==="Blue_F"||c.name==="Green_F"||c.name==="Green1_F"||c.name==="Red_F"||c.name==="White_F"||c.name==="Yellow_F"||c.name==="DepthYellow_F"){//c.name==="Gray_F"||
                    c.material=this.shaderMaterial.m1.clone();
                    this.gs_arr.push(c);
					
					
					
					if(c.name==="Blue_F")
						c.material = new THREE.MeshPhongMaterial( { color: 0x245389});
                        //c.material.uniforms.color.value=new THREE.Color(0x245389);
                    else if(c.name==="Green_F")
						c.material = new THREE.MeshPhongMaterial( { color: 0x18602e});
                       // c.material.uniforms.color.value=new THREE.Color(0x18602e);
					else if(c.name==="Green1_F")
						c.material = new THREE.MeshPhongMaterial( { color: 0xa0d06d});
                        //c.material.uniforms.color.value=new THREE.Color(0xa0d06d);
                    else if(c.name==="Red_F")
						c.material = new THREE.MeshPhongMaterial( { color: 0xee1b22});
                        //c.material.uniforms.color.value=new THREE.Color(0xee1b22);
                    else if(c.name==="Yellow_F")
						c.material = new THREE.MeshPhongMaterial( { color: 0xfbbd2a});
                        //c.material.uniforms.color.value=new THREE.Color(0xfbbd2a);
					else if(c.name==="DepthYellow_F")
						c.material = new THREE.MeshPhongMaterial( { color: 0xfdbc2a});
						//c.material.uniforms.color.value=new THREE.Color(0xfdbc2a);
					
					
					
					
					/**
					if(c.name==="Blue_F")
                        c.material.uniforms.color.value=new THREE.Color(0x245389);
                    else if(c.name==="Green_F")
                        c.material.uniforms.color.value=new THREE.Color(0x18602e);
					else if(c.name==="Green1_F")
                        c.material.uniforms.color.value=new THREE.Color(0xa0d06d);
                    else if(c.name==="Red_F")
                        c.material.uniforms.color.value=new THREE.Color(0xee1b22);
                    //else if(c.name==="Gray_F")
						//c.material = new THREE.MeshPhongMaterial( { color: 0x999999});
						//c.material.uniforms.color.value=new THREE.Color(0x999999);
                    else if(c.name==="Yellow_F")
                        c.material.uniforms.color.value=new THREE.Color(0xfbbd2a);
					else if(c.name==="DepthYellow_F")
						c.material.uniforms.color.value=new THREE.Color(0xfdbc2a);




					

                    if(c.name==="Blue_F")
                        c.material.uniforms.color.value=new THREE.Color(0x0000ff);
                    else if(c.name==="Green_F")
                        c.material.uniforms.color.value=new THREE.Color(0x009900);
					else if(c.name==="Green1_F")
                        c.material.uniforms.color.value=new THREE.Color(0x66ee66);
                    else if(c.name==="Red_F")
                        c.material.uniforms.color.value=new THREE.Color(0xff0000);
                    else if(c.name==="White_F")
                        c.material.uniforms.color.value=new THREE.Color(0xcccccc);
                    else if(c.name==="Yellow_F")
                        c.material.uniforms.color.value=new THREE.Color(0xffcc00);
						*/
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
                mesh.material.map=this.textures.biao.t1;
                this.mainCJ.add( mesh );
                mesh.position.set( gzkz_position_arr[i].x, gzkz_position_arr[i].y, gzkz_position_arr[i].z );
                mesh.scale.multiplyScalar( 0.01 );
            }
        }

        _initGuanzi(){
            let meshGZ = this.models.gz.model.children[0];
            let scene=this.mainCJ;
            scene.add( meshGZ );
/*            meshGZ.scale.multiplyScalar( 0.01 );
            meshGZ.position.set( 999, -11.9, 745 );*/
            meshGZ.material = new THREE.MeshPhongMaterial( { color: 0xcccccc} );
        }

        _initICLX(){
            let scene=this.mainCJ;
            let object = this.models.ICLX.model;
            object.userData.model="ICLX";

            let mesh1 = object.children[0];
            let mesh2 = object.children[1];
            mesh1.material=new THREE.MeshStandardMaterial();
            mesh1.material.map=this.textures.ICLX.t1;
            mesh1.material.normalMap=this.textures.ICLX.t2;
            mesh1.material.normalScale=new THREE.Vector2(1,-1);
            mesh1.material.roughnessMap=this.textures.ICLX.t3;
			mesh1.material.roughness = 1.0;
            mesh1.material.metalness = 0.7;

            mesh2.material=new THREE.MeshStandardMaterial();
            mesh2.material.map=this.textures.ICLX.t4;
            mesh2.material.normalScale=new THREE.Vector2(1,-1);
            mesh2.material.normalMap=this.textures.ICLX.t5;
            mesh2.material.roughnessMap=this.textures.ICLX.t6;


            let m=object.clone();
            m.scale.multiplyScalar( 0.05 );
            m.position.set(1172.790, 169.517, -160.035);
            m.name="item_8";
            m.userData.max=this.models["ICLX"].max;

            scene.add( m );
        }
        _initICF50441(){
            let scene=this.mainCJ;
            let object = this.models.ICF50_4_41.model;
            object.userData.model="ICF50_4_41";
            let mesh1 = object.children[1];
            let mesh2 = object.children[0];
            object.rotation.y = Math.PI;
            this._setNormalMap(mesh1,this.textures.ICF50_4_41.t1,this.textures.ICF50_4_41.t2,this.textures.ICF50_4_41.t3);
            this._setNormalMap(mesh2,this.textures.ICF50_4_41.t4,this.textures.ICF50_4_41.t5,this.textures.ICF50_4_41.t6);

            mesh1.geometry.computeBoundingBox();
            let max=mesh1.geometry.boundingBox.max.multiply(new THREE.Vector3(1,3,1));


            let m=object.clone();
            m.name="item_9";

            scene.add( m );
            m.position.set(1113.237, 167.897,-181.803);
            m.scale.multiplyScalar( 0.05 );
            m.userData.max=max;

        }
        _initCHV(){
            let scene=this.mainCJ;
            let object = this.models.FIASTR15_200_148B5716.model.children[0];
            object.rotation.x = -0.5 * Math.PI;
            object.material=new THREE.MeshStandardMaterial()
            object.material.map=this.textures.FIASTR15_200_148B5716.t1;
            object.material.normalMap=this.textures.FIASTR15_200_148B5716.t2;
            object.material.normalScale = new THREE.Vector2(1,-1);
            object.material.roughnessMap=this.textures.FIASTR15_200_148B5716.t3;
			this._setNormalMap(object,this.textures.FIASTR15_200_148B5716.t1,this.textures.FIASTR15_200_148B5716.t2,this.textures.FIASTR15_200_148B5716.t3);
            object.userData.model="FIASTR15_200_148B5716"

            object.geometry.computeBoundingBox();
            let m=object.geometry.boundingBox.max.multiply(new THREE.Vector3(1,3,1));

            let mesh=object.clone();
            mesh.name="item_10"
            mesh.scale.multiplyScalar( 0.07 );
            mesh.position.set(1233.384,165.308, 30.883);
            mesh.rotation.x = -0.5 * Math.PI;
            mesh.rotation.z = Math.PI;
            mesh.userData.max=m;
            scene.add( mesh );
			/**
            let mesh2 = object.clone();
            mesh2.name="item_11"
            mesh2.scale.multiplyScalar( 0.07 );
            mesh2.position.set(1183.309,166.142, 63.998);
            mesh2.rotation.x = -0.5 * Math.PI;
            mesh2.rotation.z = 0.5 * Math.PI;
            mesh2.userData.max=m;
            scene.add( mesh2 );
			*/
            let mesh3 = object.clone();
            mesh3.name="item_29"
            mesh3.scale.multiplyScalar( 0.07 );
            mesh3.position.set(1233.472,165.763, -150.953);
            mesh3.rotation.x = -0.5 * Math.PI;
            mesh3.userData.max=m;
            scene.add( mesh3 );

        }
        _initICM(){
            let scene = this.mainCJ;
            let object = this.models.ICM.model;
            object.userData.model="ICM";

            this._setNormalMap(object.children[0],this.textures.ICM.t1,this.textures.ICM.t2,this.textures.ICM.t3);
            this._setNormalMap(object.children[1],this.textures.ICM.t4,this.textures.ICM.t5,this.textures.ICM.t6);

            object.children[0].geometry.computeBoundingBox();
            let m=object.children[0].geometry.boundingBox.max.multiply(new THREE.Vector3(1,3,1));

            let mesh=object.clone();
            mesh.name="item_12";
            mesh.userData.max=m;
            mesh.scale.multiplyScalar( 0.54 );
            mesh.position.set(1145.396,161.204,38.355);
            scene.add( mesh );

        }
        _initICF2063(){
            let scene=this.mainCJ;
            let mesh = this.models.ICF20_6_3.model.children[0];
            mesh.userData.model="ICF20_6_3";
            this._setNormalMap(mesh,this.textures.ICF20_6_3.t1,this.textures.ICF20_6_3.t2,this.textures.ICF20_6_3.t3);

            let m=mesh.clone();
            m.name="item_13";

            scene.add(m);
            m.scale.multiplyScalar( 0.6 );
            m.position.set(1096.659,163.205, 4.753);
        }
        _initICF2549(){
            let scene=this.mainCJ;
            let mesh = this.models.ICF25_4_9.model.children[0];
            mesh.userData.model="ICF25_4_9";
            this._setNormalMap(mesh,this.textures.ICF25_4_9.t1,this.textures.ICF25_4_9.t2,this.textures.ICF25_4_9.t3);

            let object=mesh.clone();
            object.name="item_14";

            scene.add(object);
            object.scale.multiplyScalar( 0.6 );
            object.position.set(1127.794,164.120, 64.040);
        }
        _initSVAL1(){
            let scene=this.mainCJ;
            let mesh = this.models.SVA_L1.model.children[0];
            mesh.rotation.x = 0.5 * Math.PI;
            mesh.rotation.y = Math.PI;
            mesh.rotation.z = -0.5 * Math.PI;
            mesh.userData.model="SVA_L1";
            this._setNormalMap(mesh,this.textures.SVA_L1.t1,this.textures.SVA_L1.t2,this.textures.SVA_L1.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(1,3,1));

            let object=mesh.clone();
            object.name="item_15";
            object.scale.multiplyScalar( 0.093);
            object.position.set(1098.303,167.883,38.359);
            scene.add( object );
            object.userData.max=m;

            let object2=mesh.clone();
            object2.name="item_27";
            object2.scale.multiplyScalar( 0.05 );
            object2.position.set(1127.441,171.312,19.133);
            object2.rotation.x = -0.5 * Math.PI;
            object2.rotation.z = -0.5 * Math.PI;
            object2.rotation.y = 0;
            scene.add( object2 );
            object2.userData.max=m;

            let object3=mesh.clone();
            object3.name="item_28";
            object3.scale.multiplyScalar( 0.093 );
            object3.position.set(1204.960,167.883,38.382);
            object3.rotation.x = 0.5 * Math.PI;
            object3.rotation.y = Math.PI;
            object3.rotation.z = 0.5 * Math.PI;
            scene.add( object3 );
            object3.userData.max=m;
        }
        _initOFV(){
            let scene=this.mainCJ;
            let mesh = this.models.OFV.model.children[0];
            mesh.userData.model="OFV"
            this._setNormalMap(mesh,this.textures.OFV.t1,this.textures.OFV.t2,this.textures.OFV.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(2,2,2));

            let object = mesh.clone();
            object.name="item_16";
            object.scale.multiplyScalar( 1.1 );
            object.position.set(1176.034,171.832,19.146);
			object.rotation.y = 0.5 * Math.PI;
            object.userData.max=m;

            scene.add(object);
        }
        _initBSV(){
            let scene=this.mainCJ;
            let mesh = this.models.BSV.model.children[0];
            mesh.userData.model="BSV";
            this._setNormalMap(mesh,this.textures.BSV.t1,this.textures.BSV.t2,this.textures.BSV.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(2,6,2));

            let object = mesh.clone();
            object.rotation.y = 0.5 * Math.PI;
            object.name="item_17";
            object.scale.multiplyScalar( 1 );
            object.position.set(1238.992,165.393,52.035);
            object.userData.max=m;

            scene.add(object);

            let object2 = mesh.clone();
            object2.rotation.y = 0.5 * Math.PI;
            object2.name="item_30";
            object2.scale.multiplyScalar( 1 );
            object2.position.set(1217.892,168.949,-172.712);
            object2.userData.max=m;

            scene.add(object2);
        }
        _initSNV(){
            let scene=this.mainCJ;
            let mesh = this.models.SNV.model.children[0];
            mesh.userData.model="SNV";
            this._setNormalMap(mesh,this.textures.SNV.t1,this.textures.SNV.t2,this.textures.SNV.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(2,8,2));

            let object = mesh.clone();
            object.name="item_18";
            object.scale.multiplyScalar( 1 );
            object.position.set(1175.182,166.335,38.367);
            object.userData.max=m;

            scene.add(object);

            let object2 = mesh.clone();
            object2.name="item_23";
            object2.scale.multiplyScalar( 1 );
            object2.position.set(1200.268,167.913,-126.423);
            object2.userData.max=m;

            scene.add(object2);

            let object3 = mesh.clone();
            object3.name="item_24";
            object3.scale.multiplyScalar( 1 );
            object3.position.set(1202.239,166.192,-160.050);
            object3.userData.max=m;

            scene.add(object3);
        }
        _initAKS4100(){
            let scene=this.mainCJ;
            let mesh = this.models.AKS4100.model.children[0];
            mesh.userData.model="AKS4100";
            this._setNormalMap(mesh,this.textures.AKS4100.t1,this.textures.AKS4100.t2,this.textures.AKS4100.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(2,2,2));

            let object = mesh.clone();
            object.name="item_19";
            object.scale.multiplyScalar( 2 );
            object.position.set(1023.078,87.807,764.263);
            object.userData.max=m;

            scene.add(object);
        }
        _initPHE(){
            let scene=this.mainCJ;
            let mesh = this.models.PHE3.model.children[0];
            this.models.PHE3.lightIntensity=0.5;
            mesh.userData.model="PHE3";
            this._setNormalMap(mesh,this.textures.PHE3.t1,this.textures.PHE3.t2,this.textures.PHE3.t3,1,1);

            mesh.envMap=this.cubes.Bridge2;
            mesh.envMapIntensity=120;

            let object = mesh.clone();
            object.name="item_2";
            object.position.set( 892.286, 0, 734.550);

            scene.add(object);
        }
        _initDSV_148F3005(){
            let scene=this.mainCJ;
            let mesh = this.models.DSV_148F3005.model.children[0];
            mesh.rotation.z = 0.5 * Math.PI
            mesh.userData.model="DSV_148F3005";
            this._setNormalMap(mesh,this.textures.DSV_148F3005.t1,this.textures.DSV_148F3005.t2,this.textures.DSV_148F3005.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(2,2,2));

            let object = mesh.clone();
            //object.rotation.z = 0.5 * Math.PI;
            object.name="item_20";
            object.scale.multiplyScalar( 0.5 );
            object.position.set(1077.465,102.199,742.229);
            object.userData.max=m;

            scene.add(object);
        }
        _initTUV_SV(){
            let scene=this.mainCJ;
            let mesh = this.models.TUV_SV.model.children[0];
            mesh.userData.model="TUV_SV";

            this._setNormalMap(mesh,this.textures.TUV_SV.t1,this.textures.TUV_SV.t2,this.textures.TUV_SV.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(2,2,2));

            let object = mesh.clone();
            object.name="item_21";
            object.rotation.y = 0.5 * Math.PI;
            object.scale.multiplyScalar( 2 );
            object.position.set(1084.137,110.910,742.335);
            object.userData.max=m;
            scene.add(object);

            let object2 = mesh.clone();
            //object2.name="item_22";
            object2.scale.multiplyScalar( 2 );
            object2.rotation.y = -0.5 * Math.PI;
            object2.position.set(1079.227,110.910,742.335);
            object2.userData.max=m;
            scene.add(object2);
        }
        _initBar(){
            let scene=this.mainCJ;
            let mesh = this.models.bar.model.children[0];
            mesh.rotation.y = -0.5 * Math.PI;
            mesh.userData.model="bar";

            this._setNormalMap(mesh,this.textures.bar.t1,this.textures.bar.t2,this.textures.bar.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(1,1,1));

            let object = mesh.clone();
            //object.name="item_25";
            object.scale.multiplyScalar( 3 );
            object.position.set(1096.840,34.440,737.866);
            //object.rotation.y = -0.5 * Math.PI;
            object.userData.max=m;
            scene.add( object );
			
			
			var meshBar = mesh.clone();
			meshBar.scale.multiplyScalar( 3 );
            meshBar.position.set(1007.684,34.316,737.866);
			scene.add( meshBar );
        }
        _initBarG(){
            let scene=this.mainCJ;
            let mesh = this.models.barG.model.children[0];
            mesh.rotation.y = -0.5 * Math.PI;
            mesh.userData.model="barG";

            this._setNormalMap(mesh,this.textures.barG.t1,this.textures.barG.t2,this.textures.barG.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(1,1,1));

            let object = mesh.clone();
            //object.name="item_26";
            object.scale.multiplyScalar( 3 );
            object.position.set(1083.352,34.417,738.007);
            //object.rotation.y = -0.5 * Math.PI;
            object.userData.max=m;
            scene.add( object );
			
			var meshBarG = mesh.clone();
			meshBarG.scale.multiplyScalar( 3 );
            meshBarG.position.set(1018.843,34.417,738.007);
			scene.add( meshBarG );
        }
        _initFangDing(){
            let scene=this.mainCJ;
            let meshFD = this.models.FangDing.model.children[0];
            meshFD.position.set( 1080.654, 128.187, -71.369 );
            meshFD.material = new THREE.MeshPhongMaterial( { color: 0xffffff,transparent:true,opacity:0.6});
            scene.add( meshFD );
        }
        _initLQT(){
            let scene=this.mainCJ;
            let meshLQT = this.models.ZhiLengJi.model.children[0];
            meshLQT.scale.multiplyScalar( 0.8 );
            meshLQT.position.set( 1175, 189.8, 520 );
            meshLQT.material = new THREE.MeshPhongMaterial( { color: 0xffffff});
            scene.add( meshLQT );

            let meshLQT2 = meshLQT.clone();
            meshLQT2.position.set( 955, 189.8, 520 );
            scene.add( meshLQT2 );

            this.LQTS=[meshLQT,meshLQT2];
        }
        _LQTShowOrHide(show){
            this.LQTS.map((lqt)=>{
                lqt.visible=show;
            });
            this.lqtfsArr.map((lqtfs)=>{
                lqtfs.visible=show;
            });
            if(this.GuanDao_F)
                this.GuanDao_F.visible=show
        }
        _initLQTFS(){
            let scene=this.mainCJ;
            let lqtfs_position_arr = this.lqtfs_position_arr;
            let lqtfsArr = this.lqtfsArr;
            for(let i=0;i<lqtfs_position_arr.length;i++){
                let mesh = this.models.ZLJ_Fan.model.children[0].clone();
                mesh.material = new THREE.MeshPhongMaterial( { color: 0xffffff} );
                mesh.position.set( lqtfs_position_arr[i].x, lqtfs_position_arr[i].y, lqtfs_position_arr[i].z );
                mesh.scale.multiplyScalar( 0.8 );
                scene.add( mesh );
                lqtfsArr.push(mesh);
            }
        }
        _initTP(){
            let scene=this.mainCJ;
            let object=this.models.TuoPan.model;
			var mesh1 = object.children[0];
			mesh1.material = new THREE.MeshPhongMaterial( { color: 0xffffff,transparent:true,opacity:0.6});
            object.position.set(1238.634,86.395,-252.710);
            scene.add( object );

            let mesh = object.children[0].clone();
			mesh.material = new THREE.MeshPhongMaterial( { color: 0xffffff,transparent:true,opacity:0.6});
            mesh.position.set(1238.634,86.395,132.744);
            scene.add( mesh );
        }
        _initKZG(){
            let scene=this.mainCJ;
            let object=this.models.kzg.model.children[0];
            object.position.set(534.508,65.458,443.086);
			object.scale.multiplyScalar( 0.4 );
			object.rotation.y = -0.5 * Math.PI;
            object.material=new THREE.MeshBasicMaterial();
            object.material.map=this.textures.kzg.t1;
            scene.add( object );

            this.kzg=object;
        }
        _initAKS33(){
            let scene=this.mainCJ;
            let mesh = this.models.aks33.model.children[0];
            mesh.rotation.y = -0.5 * Math.PI;
            mesh.userData.model="aks33";

            this._setNormalMap(mesh,this.textures.aks33.t1,this.textures.aks33.t2,this.textures.aks33.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(1,1,1));

            let object = mesh.clone();
            object.name="item_31";
            object.scale.set(1,1,1);
            object.position.set(1200.287,167.806,-130.040);
            object.rotation.x = -0.5 * Math.PI;
            object.rotation.y = Math.PI;
            object.userData.max=m;
            scene.add( object );
        }

        _initSVA_L2(){
            let scene=this.mainCJ;
            let mesh = this.models.SVA_L2.model.children[0];
            mesh.rotation.x = 0.5 * Math.PI;
            mesh.rotation.y = Math.PI;
            //mesh.rotation.z = -0.5 * Math.PI;
            mesh.userData.model="SVA_L2";
            this._setNormalMap(mesh,this.textures.SVA_L2.t1,this.textures.SVA_L2.t2,this.textures.SVA_L2.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(1,3,1));

            let object=mesh.clone();
            object.name="item_32";
            object.scale.multiplyScalar(0.075);
            object.position.set(1133.773,77.083,706.237);
            scene.add( object );
            object.userData.max=m;
        }

        _initICF2565A(){
            let scene=this.mainCJ;
            let object = this.models.ICF25_6_5A.model;
            object.userData.model="ICF25_6_5A";
            let mesh1 = object.children[1];
            let mesh2 = object.children[0];
            object.rotation.y = 0.5 * Math.PI;
            this._setNormalMap(mesh1,this.textures.ICF25_6_5A.t1,this.textures.ICF25_6_5A.t2,this.textures.ICF25_6_5A.t3);
            this._setNormalMap(mesh2,this.textures.ICF25_6_5A.t4,this.textures.ICF25_6_5A.t5,this.textures.ICF25_6_5A.t6);

            mesh1.geometry.computeBoundingBox();
            let max=mesh1.geometry.boundingBox.max.multiply(new THREE.Vector3(1,3,1));


            let m=object.clone();
            m.name="item_33";

            scene.add( m );
            m.position.set(1109.804,73.653,707.026);
            m.scale.multiplyScalar( 0.5 );
            m.userData.max=max;

        }

        _initLL4000(){
            let scene=this.mainCJ;
            let mesh = this.models.LL4000.model.children[0];
            //mesh.rotation.x = 0.5 * Math.PI;
			/**
            mesh.rotation.y = Math.PI;
            mesh.rotation.z = -0.5 * Math.PI;
			*/
            mesh.userData.model="LL4000";
            this._setNormalMap(mesh,this.textures.LL4000.t1,this.textures.LL4000.t2,this.textures.LL4000.t3);

            mesh.geometry.computeBoundingBox();
            let m=mesh.geometry.boundingBox.max.multiply(new THREE.Vector3(1,1,1));

            let object=mesh.clone();
            object.name="item_34";
            object.rotation.x = 0.5 * Math.PI;
            object.scale.multiplyScalar(0.1);
            object.position.set(1022.751,81.222,767.022);
            scene.add( object );
            object.userData.max=m;
        }





        _setNormalMap(mesh,t1,t2,t3,roughness=0.8,metalness=1){
            mesh.material=new THREE.MeshStandardMaterial();
            mesh.material.map=t1;
            mesh.material.normalMap=t2;

            if(parseFloat(roughness).toString() !== "NaN")
                mesh.material.roughness = roughness;
            if(parseFloat(metalness).toString() !== "NaN")
                mesh.material.metalness = metalness;

            mesh.material.normalScale=new THREE.Vector2(1,-1);
            mesh.material.roughnessMap=t3;
            mesh.material.metalnessMap=t3;

            return mesh;
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
                //this.items.push(child);
                this.scene.model.updateWorldMatrix();
                let p=child.getWorldPosition();
                let s=child.scale.x;

                let m;
                if(child.isMesh&&!child.userData.max){
                    child.geometry.computeBoundingBox();
                    m=child.geometry.boundingBox.max;
                }else{
                    m = child.userData.max;
                }

                let max=m.clone().multiply(new THREE.Vector3(0.75,1.1,0.75));
                //console.log(max);
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
                            //this.config.tp.y=0;
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
                let m=this.models[child.userData.model].model.isMesh||(child.userData.model==="ICLX")||(child.userData.model==="ICM")||(child.userData.model==="icfe20")||(child.userData.model==="ICF50_4_41")||(child.userData.model==="ICF25_6_5A")?this.models[child.userData.model].model:this.models[child.userData.model].model.children[0];
                //console.log(m,child.userData.model);
                this.itemBs.setModel(m.clone());
                this.itemBs.o3d.controls.minDistance=this.itemBs.o3d.worldRadius*2.5;
                this.itemBs.o3d.controls.maxDistance=this.itemBs.o3d.worldRadius*7.5;

                this.itemBs.o3d.controls.rotateLeft(3.14/4);
                this.itemBs.normalLightOpen();
                let li = this.models[child.userData.model].lightIntensity;
                if(li){
                    this.itemBs.o3d.normalLight.intensity=li;
                    //this.itemBs.o3d.renderer.outputEncoding=3000;
                    this.itemBs.o3d.renderer.physicallyCorrectLights =false;
                    this.itemBs.o3d.renderer.toneMapping = THREE.NoToneMapping;
                    this.itemBs.o3d.renderer.toneMappingExposure = 1;
                }
                else{
                    this.itemBs.o3d.normalLight.intensity=0;
                    //this.itemBs.o3d.renderer.outputEncoding = THREE.sRGBEncoding;
                    this.itemBs.o3d.renderer.physicallyCorrectLights =true;
                    this.itemBs.o3d.renderer.toneMapping = THREE.ReinhardToneMapping;
                    this.itemBs.o3d.renderer.toneMappingExposure = 3;
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
                if(child.isMesh){
                    child.userData.name=child.name;
                    this.status.items.push(child);
                }
                else{
                    let c=child.children;
                    for(let i=0;i<c.length;i++){
                        c[i].userData=JSON.parse(JSON.stringify(child.userData));
                        c[i].userData.name=child.name;
                        this.status.items.push(c[i]);
                    }
                }

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
                    name:child.name,
                    obj:child,
                    $dom:$dom
                });
                $dom.appendTo(this.$e);
            }
            else if(child.name.split("_")[0]==="label"){
                let l=view.labels[child.name];
                let title=l.title;
                let text=l.text?"<div class='"+(l.items?"has-item-3 label-text":"label-text")+"'>"+l.text+"</div>":""
                let $dom=$(
                    "<div class='view view-item view-"+child.name+"'>" +
                    "<div class='"+(l.items?"has-item-1 label-line":"label-line")+"'>" +
                    "<div class='label-t'>" +
                    "<div data-name='"+child.name+"' class='"+(l.items?"has-item-2 label-title-item":"label-title-item")+"'>"+title+"</div>"+
                    text+
                    "</div>"+
                    "</div>"+
                    "</div>"
                );
                child.userData.$dom=$dom;
                Object.assign(view.labels[child.name],{
                    name:child.name,
                    obj:child,
                    $dom:$dom
                });
                $dom.appendTo(this.$e);
            }
            else if(child.name.split("_")[0]==="itemLabels"){
                let l=view.itemLabels[child.name];
                let title=l.title;
                let text=l.text?"<div class='"+(l.items?"has-item-3 label-text":"label-text")+"'>"+l.text+"</div>":""
                let $dom=$(
                    "<div class='view view-item view-"+child.name+"'>" +
                    "<div class='"+(l.items?"has-item-1 label-line":"label-line")+"'>" +
                    "<div class='label-t'>" +
                    "<div data-name='"+child.name+"' class='has-item-4 label-title-item'>"+title+"</div>"+
                    text+
                    "</div>"+
                    "</div>"+
                    "</div>"
                );
                child.userData.$dom=$dom;
                Object.assign(view.itemLabels[child.name],{
                    name:child.name,
                    obj:child,
                    $dom:$dom
                });
                $dom.appendTo(this.$e);
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
                //light.intensity=0.5;
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
                aperture:1*0.0002,
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

        _viewLabelClick(event){
            event.preventDefault();
            if(this.status.taPlaying) return;

            let label=this.view.labels[$(event.target).data("name")];
            if(!label) return;

            if(label.fk){
                this._viewLabelDomToggle(false,()=>{

                    let camera=this.camera;
                    let controls=this.controls;
                    let cp=label.fk.cp;
                    let tp=label.fk.tp;
                    new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,
                        onStart:()=>{
                            //controls.autoRotate=false;
                            this.config.cp.copy(this.camera.position);
                            this.config.tp.copy(this.controls.target);
                        },
                        onUpdate:()=>{this.status.taPlaying=true;},
                        onComplete:()=>{
                            //controls.autoRotate=false;
                            this.status.taPlaying=false;
                            this.$fkStory.html(label.fk.text)
                            this.$fkaz.fadeIn();
                            this.$fkEnter.unbind().fastClick(()=>{
                                this._viewItemDomToggle(true);
                                this.status.view="items";
                                this.$fkaz.fadeOut();
                                this.exitLookItem();
                            });
                        }})
                    new TweenMax(controls.target,1,{x:tp.x,y:tp.y,z:tp.z,onUpdate:()=>{camera.lookAt(controls.target)}})
                });

            }else{
                this._viewLabelDomToggle(false,()=>{
                    this._viewItemDomToggle(true);
                    this.status.view="items";
                });
            }



        }

        _viewMainDomToggle(show){
            if(show){
                this.view.main.$dom.fadeIn();
            }
            else{
                this.view.main.$dom.fadeOut();
            }

        }
        _viewItemDomToggle(show,callback){
/*            let fn=show?"fadeIn":"fadeOut";

            let items = this.view.items;
            for(let a in items){
                items[a].$dom[fn]("normal",callback);
            }*/
            let fn=show?"fadeIn":"fadeOut";

            let itemLabels = this.view.itemLabels;
            for(let a in itemLabels){
                itemLabels[a].$dom[fn]("normal",callback);
            }
        }
        _viewLabelDomToggle(show,callback){
            let fn=show?"fadeIn":"fadeOut";

            let labels = this.view.labels;
            for(let a in labels){
                labels[a].$dom[fn]("normal",callback);
            }
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
/*            let items=this.view.items;
            for(let a in items){
                let r=this._v3tov2ByObj(items[a].obj);
                items[a].$dom.css({left:r.x,top:r.y});
            }*/
            let itemLabels=this.view.itemLabels;
            for(let a in itemLabels){
                let r=this._v3tov2ByObj(itemLabels[a].obj);
                itemLabels[a].$dom.css({left:r.x,top:r.y});
            }
        }
        //更新Labels状态下的ui
        _viewLabelsDomUpdate(){
            let labels=this.view.labels;
            for(let a in labels){
                let r=this._v3tov2ByObj(labels[a].obj);
                labels[a].$dom.css({left:r.x,top:r.y});

                let $dom=labels[a].$dom;
                let $lt = $dom.find(".label-t");
                let $lti = $dom.find(".label-title-item");
                let $ltt = $dom.find(".label-text");
                $lt.css({"marginLeft":-$lti.width()/2,"marginTop":-($lti.height()+$ltt.height())/2});
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

                        /*config.xMin = this.controls.getAzimuthalAngle();
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
                        }*/
                    }
                //}

                this.itemBs.o3d.controls.update();

                if(this.status.view==="main"){
                    this._viewMainDomUpdate();
                }else if(this.status.view==="labels"){
                    this._viewLabelsDomUpdate();
                }else if(this.status.view==="items"){
                    this._viewItemsDomUpdate();
                }

                for(let i=0;i<this.meshGJ_FSarr.length;i++){
                    this.meshGJ_FSarr[i].rotation.x -= 0.05;
                }
                for(let i=0;i<this.meshGJ_FSarr2.length;i++){
                    this.meshGJ_FSarr2[i].rotation.z += 0.05;
                }
                for(let i = 0; i < this.lqtfsArr.length; i++) {
                    this.lqtfsArr[i].rotation.y += 0.07;
                }
/*                for(let i=0;i<this.zljFSarr.length;i++){
                    this.zljFSarr[i].rotation.x -= 0.05;
                }*/

				/**
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

        _onMouseTouchStart(event){
            if(event.type==="touchend"){
                if(event.changedTouches.length>1) return;
                else {
                    event.clientX=event.changedTouches[0].clientX;
                    event.clientY=event.changedTouches[0].clientY;
                }
            }

            let mouse=this.mouse;

            mouse.x = event.clientX;
            mouse.y = event.clientY;
        }
        _onMouseTap( event ) {

            if(this.status.view!=="items") return;

            event.preventDefault();
            let mouse=this.mouse;

            if(event.type==="touchend"){
                if(event.originalEvent.changedTouches.length>1) return;
                else {
                    event.clientX=event.originalEvent.changedTouches[0].clientX;
                    event.clientY=event.originalEvent.changedTouches[0].clientY;
                }
            }

            if(Math.abs(event.clientX-mouse.x)>0||Math.abs(event.clientY-mouse.y)>0) return;



            let r=this.raycaster;
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            r.setFromCamera( mouse, this.camera );

            let intersection = r.intersectObjects( this.status.items );
            if ( intersection.length > 0 ) {
                //this._itemBsOpen(intersection[0].object);
                //console.log(intersection);
                let n=intersection[0].object.userData.name;
                this.lookItem(n);
                this._viewItemMessageShow(n);
                this._viewItemDomToggle(false);
                this._viewLabelDomToggle(false);
            }

            let intersection2 = r.intersectObject( this.kzg );
            if( intersection2.length>0 ){
                this._guidePlayByIndex(4);
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
            let tp=this.config.tp;
            ta.cameraReset.cameraTA=new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,paused:true,
                onStart:()=>{
                    this.status.itemLooking=false;
                    this.bs.o3d.controls.autoRotate=false;
                    //this.controls.autoRotate=false;
                },
                onUpdate:()=>{this.status.taPlaying=true;},
                onComplete:()=>{
                    this.status.itemLooking=false;
                    this.status.taPlaying=false;
                    //this.bs.normalControlsToggle(false);
                    //this.bs.o3d.controls.autoRotate=false;
                    this.controls.enabled=true;
                    //this.controls.autoRotate=true;
                    this.controls.update();

                    if(!notUI){
                        this._viewItemDomToggle(true)
                        //this._viewLabelDomToggle(true);
                    }

                    this.status.view="items";

                    if(callback) callback();
                    this.dispatchEvent({type:"cameraReset",message:""})
                }});
            ta.cameraReset.targetTA=new TweenMax(this.controls.target,1,{x:tp.x,y:tp.y,z:tp.z,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}});

            this.tweenAnimate.cameraReset.cameraTA.restart();
            this.tweenAnimate.cameraReset.targetTA.restart();
        }
        exitLookLabel(callback,notUI){
            if(this.status.taPlaying) return;

            let camera = this.camera;
            let controls = this.controls;
            let ta = this.tweenAnimate;

            let cp=this.config.cp;
            let tp=this.config.tp;
            ta.cameraReset.cameraTA=new TweenMax(camera.position,1,{x:cp.x,y:cp.y,z:cp.z,paused:true,
                onStart:()=>{
                    this.status.itemLooking=false;
                    this.bs.o3d.controls.autoRotate=false;
                    //this.controls.autoRotate=false;
                },
                onUpdate:()=>{this.status.taPlaying=true;},
                onComplete:()=>{
                    this.status.itemLooking=false;
                    this.status.taPlaying=false;
                    //this.bs.normalControlsToggle(false);
                    //this.bs.o3d.controls.autoRotate=false;
                    this.controls.enabled=true;
                    //this.controls.autoRotate=true;
                    this.controls.update();

                    if(!notUI){
                        this._viewLabelDomToggle(true)
                        //this._viewLabelDomToggle(true);
                    }

                    this.status.view="labels";

                    if(callback) callback();
                    this.dispatchEvent({type:"cameraReset",message:""})
                }});
            ta.cameraReset.targetTA=new TweenMax(this.controls.target,1,{x:tp.x,y:tp.y,z:tp.z,paused:true,onUpdate:()=>{camera.lookAt(controls.target)}});

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
