let PT=(()=>{

    let pt;
    let xyz=["x","y","z"];

    Array.prototype.shuffle = function() {
        var array = this;
        var m = array.length,
            t, i;
        while (m>0) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    class PT extends THREE.EventDispatcher{
        constructor(bs,bl,url,$loading) {
            super();

            this.bs=bs;
            this.bl=bl;
            this.url=url;

            this.$loading=$loading;
            this.$loadText=$(this.$loading.find(".spinner-text"));

            this.model=null;

            this.clock=new THREE.Clock();

            this.ready=false;

            this.audio=new Howl({
                src:["./a.mp3"],
                sprite:{
                    key1:[100,1000]
                }
            })

            this.d={

            }

            this.value={
                D6_6:[
                    {v:1,r:new THREE.Euler(-3.1415926535897745,1.5587734938282092,3.141592653589775)},
                    {v:2,r:new THREE.Euler(0,0,0)},
                    {v:3,r:new THREE.Euler(1.621113171691312,0,0)},
                    {v:4,r:new THREE.Euler(1.5445251451597313,  0,  3.1415808031313492)},
                    {v:5,r:new THREE.Euler(-3.1401090007190615, 0,-3.1360875339159384)},
                    {v:6,r:new THREE.Euler(-3.1415926535897873, -1.5302768018355637,-3.141592653589788)},
/*                    {v:6,r:new THREE.Euler(-3.1415926535897873, -1.5302768018355637,-3.141592653589788)},
                    {v:6,r:new THREE.Euler(-3.1415926535897873, -1.5302768018355637,-3.141592653589788)},*/
                ],
                'D10-0_8_1':[
                    {v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},
                    //{v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},
                    {v:1,r:new THREE.Euler(-1.7825423465916752,  0.21613622468425533,  0.8437686453602331)},
                    {v:2,r:new THREE.Euler(-2.3792077372067806,  0.5493833791464258,  -2.025492524205153)},
                    {v:3,r:new THREE.Euler(0.725262160970202, -0.5526303564725611,  2.011362447192341)},
                    {v:4,r:new THREE.Euler(1.3018816106509443, -0.19910557993453448,-0.9212965443071974)},
                    {v:5,r:new THREE.Euler(1.8303977381265844,  0.20150906090568763,  2.2406176154078272)},
                    {v:6,r:new THREE.Euler(2.337093955869611, 0.5632935622251087, -1.0550609670911721)},
                    {v:7,r:new THREE.Euler(-0.770974453987678,-0.5452893306171882, 1.1105735976919595)},
                    {v:8,r:new THREE.Euler(-1.3148659337670576, -0.2095973702000048, -2.251468570998033)},
                    {v:9,r:new THREE.Euler(-3.1305398247175216,  0.7643328542752909,  1.5548260209195892)},
/*                    {v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},
                    {v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},*/
                ],
                'D10-0_8_2':[
                    {v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},
                    //{v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},
                    {v:1,r:new THREE.Euler(-1.7825423465916752,  0.21613622468425533,  0.8437686453602331)},
                    {v:2,r:new THREE.Euler(-2.3792077372067806,  0.5493833791464258,  -2.025492524205153)},
                    {v:3,r:new THREE.Euler(0.725262160970202, -0.5526303564725611,  2.011362447192341)},
                    {v:4,r:new THREE.Euler(1.3018816106509443, -0.19910557993453448,-0.9212965443071974)},
                    {v:5,r:new THREE.Euler(1.8303977381265844,  0.20150906090568763,  2.2406176154078272)},
                    {v:6,r:new THREE.Euler(2.337093955869611, 0.5632935622251087, -1.0550609670911721)},
                    {v:7,r:new THREE.Euler(-0.770974453987678,-0.5452893306171882, 1.1105735976919595)},
                    {v:8,r:new THREE.Euler(-1.3148659337670576, -0.2095973702000048, -2.251468570998033)},
                    {v:9,r:new THREE.Euler(-3.1305398247175216,  0.7643328542752909,  1.5548260209195892)},
/*                    {v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},
                    {v:0,r:new THREE.Euler(-0.019257470063191215, -0.7656873811125255, -1.580969364995179)},*/
                ],
                'D4_5':[
                    {v:1,r:new THREE.Euler( 0.580207265422302, -0.3843859667505273,1.8093325483629032)},
                    {v:2,r:new THREE.Euler( -0.5711936703855178, -0.3660021777530491, -0.5733383804085056)},
                    {v:3,r:new THREE.Euler( 0.005214914320487311, 0.6639874815833439, -2.536752738847566)},

                    {v:2,r:new THREE.Euler( 1.5700544891183552,  0,  0)},
                    {v:3,r:new THREE.Euler( -1.569306821622161,  1.0494556300798414,  3.1403010256142116)},
                    {v:4,r:new THREE.Euler(-1.5693150706128838, -1.0462542137177364, -3.140310547104374)},

                    {v:1,r:new THREE.Euler( 2.5721947933386438, 0.3568318781897422,  1.7901041234564663)},
                    {v:2,r:new THREE.Euler( -2.5245981004027334, 0.25536008978627783, -0.5098819204284077)},
                    {v:4,r:new THREE.Euler( 3.09500650324261,  -0.6599391299708693,  -2.4986532490242435)},

                    {v:1,r:new THREE.Euler( -1.5106150622228756,  -0.02059765600076231,  1.1372153945497943)},
                    {v:3,r:new THREE.Euler( 1.4568553069283945,  1.013501828628975, -1.9088007481358666)},
                    {v:4,r:new THREE.Euler( 1.452002215435901, -1.0386537717528692,  -2.108109641126588)},
                ],
                'D8_7':[
                    {v:1,r:new THREE.Euler( -2.207483891193261, 0.41869316274943447, 1.0887155406934281)},
                    {v:2,r:new THREE.Euler( 2.264612182295777,  0.38981203918133084, -1.14107274867768)},
                    {v:3,r:new THREE.Euler( -2.1886563561722134, 0.463700225545065, -2.1182901481582666)},
                    {v:4,r:new THREE.Euler( 2.2528696464480724, 0.44590199556076016, 2.0689186509747572)},
                    {v:5,r:new THREE.Euler( 0.91113851424958, -0.4372795222604672, -1.069594092639303)},
                    {v:6,r:new THREE.Euler( -0.8680322082961778, -0.4291210777151458,  1.11695797095071)},
                    {v:7,r:new THREE.Euler( 0.8958027338932882, -0.4286918925579554, 2.047393260323781)},
                    {v:8,r:new THREE.Euler( -0.8758988050490654, -0.43375317402157954, -2.0391691115409847)},
                ],
                'D2_4':[
                    {v:1,r:new THREE.Euler( 1.5828192090609567, -0.0028636572352003856, -3.14155822256406)},
                    {v:2,r:new THREE.Euler(0,0,0)},
                    {v:1,r:new THREE.Euler( -1.5828192090609567, -0.0028636572352003856, -3.14155822256406)},
                    {v:2,r:new THREE.Euler(3.14,0,0)},
                ],
                'D12_9':[
                    {v:1,r:new THREE.Euler( -2.415536772841149,  0.7244884546207542, 2.2419584442290783)},
                    {v:2,r:new THREE.Euler( -2.605540271817288,  0.15184930127545507,  -2.867549506824715)},
                    {v:3,r:new THREE.Euler( -2.1437083026725072, -0.2852541973378458, -1.7188581388314914)},
                    {v:4,r:new THREE.Euler( -1.5497342742914635, -0.00853744139422886, -0.5304965002315395)},
                    {v:5,r:new THREE.Euler( -1.5753774960558478, 0.6211201600514442, 0.5803320336330334)},
                    {v:6,r:new THREE.Euler( 2.817762390106998,  -0.48708615970852115, -2.2835638184762477)},
                    {v:7,r:new THREE.Euler( 0.34514298160554846, 0.46447556255586564, 0.8672341385265234)},
                    {v:8,r:new THREE.Euler( 1.555616048130691, -0.01888795844562709, 0.5400973754089073)},
                    {v:9,r:new THREE.Euler( 1.5922574409293437, -0.6280103025179824, -0.5238993883472437)},
                    {v:10,r:new THREE.Euler( 0.7328088482158914, -0.747543209659637, -2.2216698574584495)},
                    {v:11,r:new THREE.Euler( 0.5281791754114035, -0.15380060127641215, 2.858746600334477)},
                    {v:12,r:new THREE.Euler( 1.0275228807075287, 0.2939139981616702, 1.6946135418267028)}
                ],
                'D20_10':[
                    {v:1,r:new THREE.Euler( 2.5697433726776437,  0.9639533313524039,  2.065368721603865)},
                    {v:2,r:new THREE.Euler( 1.1989963695444137, -0.5153404173381113,  0.4089721535077557)},
                    {v:3,r:new THREE.Euler( 0.017830026221440084, 1.195068444464539, -1.0385318396426924)},
                    {v:4,r:new THREE.Euler( 2.4740700564947042, -0.6524087044102016, 0.4799587557388163)},
                    {v:5,r:new THREE.Euler( -2.6020900463142524, 0.9382431391179974, -0.9223935211308661)},
                    {v:6,r:new THREE.Euler( -1.5688157365532769, 0.001284675613866268, 1.705968195386494)},
                    {v:7,r:new THREE.Euler( -1.5782626663790122, 1.036428320003894, -0.6458183562115978)},
                    {v:8,r:new THREE.Euler( -0.3039189247664472, 0.19223919162536737, 1.626707771189697)},
                    {v:9,r:new THREE.Euler( 2.192877101845562, -0.07276898207814418, -1.6819085001125367)},
                    {v:10,r:new THREE.Euler( -0.0018398305383324162, -0.4311596917269573,0.5513409128071967)},
                    {v:11,r:new THREE.Euler( 3.1413637467258435, 0.44393511646902006, -2.5826012924487465)},
                    {v:12,r:new THREE.Euler( 0.9382341614257894, 0.09594852213483585, 1.4277328397288374)},
                    {v:13,r:new THREE.Euler( -2.8119575064068703, -0.163298834393146, -1.5109467861285903)},
                    {v:14,r:new THREE.Euler( -1.639208916016831, -1.0376758552021008,  2.4057950143749633)},
                    {v:15,r:new THREE.Euler( -1.5757669854505514, -0.004329079738663087, -1.4351331190434908)},
                    {v:16,r:new THREE.Euler( -0.5296974786555914, -0.8848204101838439, 2.2544089876665367)},
                    {v:17,r:new THREE.Euler( 0.6498708185748705, 0.6154370571351979, -2.6481990707801004)},
                    {v:18,r:new THREE.Euler( -3.1161149791765075, -1.1792741660309884, 2.127539836634308)},
                    {v:19,r:new THREE.Euler( 1.9891023167129147, 0.49423785065652887, -2.7574387296667515)},
                    {v:20,r:new THREE.Euler( 0.7045497216648711, 0.6998047011253735, 0.4143115409050701)},
                ]
            }

            this.tg=new TWEEN.Group();

            this.now=null;
            this.status= {
                nowObj:null,
                nowName:'',
                a1:false,
                a2:false,
                life:0,
                maxLife:1.5,
                lastD10_2:null,
            };

            this._load(()=>{
                this._init();
                pt=this;

                this.dispatchEvent({type:"loaded",message:""});
            })
        }

        _load(callback){

            let url=this.url;
            let bl=this.bl;
            let bs=this.bs;

            bl.load(url,(res)=>{
                console.log(res);

                this.$loadText.html("100%");
                this.$loading.fadeOut(1000);

                //res.model.position.x=-0.5;

                bs.setModel(res.model);
                bs.normalLightOpen();

                this.model=res.model;

                if(callback) callback();
            });

            bl.addEventListener("basicLoaderStart",(res)=>{
            })
            bl.addEventListener("basicLoaderProgress",(res)=>{

                this.$loadText.html(res.message+"%");

            })
            bl.addEventListener("basicLoaderComplete",(res)=>{

            })

        }

        _init(){
            this._initBasic();
            this._initBackDoor();
            //this._initPass();
        }

        _initBasic(){

            this.ready=true;

            let bs=this.bs;
            let model=this.model;

            let root=model.getObjectByName("root");

            root.children.map((d)=>{
                d.visible=false;
                this.d[d.name]=d;
            });

            bs.o3d.renderer.outputEncoding=3000;

            let l=new THREE.PointLight({color:0xffffff});
            l.intensity=8;
            l.position.set(-2.5,2.5,0);
            let lg=new THREE.Group();
            lg.add(l);
            this.lg=lg;
            bs.o3d.scene.add(lg);

            bs.o3d.camera.position.set(0.85,10,0);
            bs.o3d.camera.rotation.set(-Math.PI/2,0,Math.PI/2);
            //bs.o3d.camera.lookAt(new THREE.Vector3());
            bs.o3d.controls.enabled=false;

            this.tc = new THREE.TransformControls( bs.o3d.camera, bs.o3d.renderer.domElement );
            this.tc.setMode( "rotate" );

            this.selectD();
            //this.selectD('D20_10',true)

            bs.o3d.scene.add(this.tc);



            //this.setBG("star1");

            //new ASCloud.ASCloud({radius:15,urls:["./js/atmosphere/cloud/1.png","./js/atmosphere/cloud/2.png","./js/atmosphere/cloud/3.png","./js/atmosphere/cloud/4.png"]})


        }

        _initBackDoor(){
            if(!this._getQueryVariable("bd")) return;

            let vd6 = this.value["D6_6"];
            //let l1=Math.ceil(vd6.length/3*1);
            let l1=1;

            for(let i=0;i<l1;i++){
                vd6.push({v:6,r:vd6[5].r.clone()});
                vd6.push({v:5,r:vd6[4].r.clone()});
                vd6.push({v:4,r:vd6[3].r.clone()});
                vd6.push({v:4,r:vd6[3].r.clone()});
            }

            let vd10_2=this.value["D10-0_8_2"];
            //let l2=Math.ceil(vd10_2.length/3*1);
            let l2=1;

            for(let i=0;i<l2;i++){
                vd10_2.push({v:0,r:vd10_2[0].r.clone()});
                vd10_2.push({v:1,r:vd10_2[1].r.clone()});
                vd10_2.push({v:1,r:vd10_2[1].r.clone()});
                vd10_2.push({v:2,r:vd10_2[2].r.clone()});
                vd10_2.push({v:2,r:vd10_2[2].r.clone()});
                vd10_2.push({v:2,r:vd10_2[2].r.clone()});
                vd10_2.push({v:3,r:vd10_2[3].r.clone()});
                vd10_2.push({v:3,r:vd10_2[3].r.clone()});
                vd10_2.push({v:3,r:vd10_2[3].r.clone()});
            }

            vd6.shuffle();
            vd10_2.shuffle();

            let vd20 = this.value["D20_10"];

            for(let i=0;i<1;i++){
                vd20.push({v:13,r:new THREE.Euler( -2.8119575064068703, -0.163298834393146, -1.5109467861285903)}),
                vd20.push({v:14,r:new THREE.Euler( -1.639208916016831, -1.0376758552021008,  2.4057950143749633)}),
                vd20.push({v:15,r:new THREE.Euler( -1.5757669854505514, -0.004329079738663087, -1.4351331190434908)}),
                vd20.push({v:16,r:new THREE.Euler( -0.5296974786555914, -0.8848204101838439, 2.2544089876665367)}),
                vd20.push({v:17,r:new THREE.Euler( 0.6498708185748705, 0.6154370571351979, -2.6481990707801004)}),
                vd20.push({v:18,r:new THREE.Euler( -3.1161149791765075, -1.1792741660309884, 2.127539836634308)}),
                vd20.push({v:19,r:new THREE.Euler( 1.9891023167129147, 0.49423785065652887, -2.7574387296667515)}),
                vd20.push({v:20,r:new THREE.Euler( 0.7045497216648711, 0.6998047011253735, 0.4143115409050701)}),
                    vd20.push({v:18,r:new THREE.Euler( -3.1161149791765075, -1.1792741660309884, 2.127539836634308)}),
                    vd20.push({v:19,r:new THREE.Euler( 1.9891023167129147, 0.49423785065652887, -2.7574387296667515)}),
                    vd20.push({v:20,r:new THREE.Euler( 0.7045497216648711, 0.6998047011253735, 0.4143115409050701)})
                vd20.push({v:18,r:new THREE.Euler( -3.1161149791765075, -1.1792741660309884, 2.127539836634308)}),
                    vd20.push({v:19,r:new THREE.Euler( 1.9891023167129147, 0.49423785065652887, -2.7574387296667515)}),
                    vd20.push({v:20,r:new THREE.Euler( 0.7045497216648711, 0.6998047011253735, 0.4143115409050701)})
            }

/*            vd6.sort(()=>{
                return 0.5-Math.random()
            });
            vd10_2.sort(()=>{
                return 0.5-Math.random()
            });*/
        }

        _initPass(){
            let aip=new THREE.AfterimagePass();
            aip.uniforms.damp.value=0.5;
            //this.bs.setPass(aip);

            let params = {
                exposure: 1,
                bloomStrength: 1.5,
                bloomThreshold: 0,
                bloomRadius: 0
            };
            let bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( bs.width, bs.height ), 1.5, 0, 0 );
            bloomPass.threshold = params.bloomThreshold;
            bloomPass.strength = params.bloomStrength;
            bloomPass.radius = params.bloomRadius;

            bs.addPass(bloomPass);
        }

        setBG(name="star1"){
            if(!this.ready) return;

            if(this.bg){
                this.bg.destroy();
                this.bg=null;
            }

            let bs=this.bs;

            switch (name){
                case "star1":{
                    //this.bg = new Star.Star1(this.model,{radius:15,color:0x032037,maxParticleCount:8000})
                    this.bg = new Star.Star1(bs.o3d.scene,{radius:15,color:0x0e8ff5,maxParticleCount:8000})
                    bs.o3d.scene.background=new THREE.Color(0x000000);
                    break;
                }
                case "cloud":{
                    this.bg = new ASCloud.ASCloud(bs.o3d.scene,{maxParticleCount:500,width:17.82,height:8.03,radius:15,urls:["./js/atmosphere/cloud/1.png","./js/atmosphere/cloud/2.png","./js/atmosphere/cloud/3.png","./js/atmosphere/cloud/4.png"]})
                    bs.o3d.scene.background=new THREE.Color(0x1a5a8d);
                    break;
                }
                case "water":{
                    this.bg=new Water.Water(bs);
                    break;
                }
            }
        }

        selectD(name='D6_6',debug){

            if(!this.ready) return;

            if(!this.d[name]) return ;
            if(!this.value[name]) return ;
            if(this.status.a1||this.status.a2||this.status.life) return ;

            for(let a in this.d)
            {
                this.d[a].visible=false;
            }

            let obj=this.d[name];
            this._reD(obj);



            if(debug)
                this.tc.attach(obj);

            this.status.nowObj=obj;
            this.status.nowName=name;

            if(this.value[this.status.nowName].length)
            {
                let e=this.value[this.status.nowName][0].r;
                this.status.nowObj.rotation.copy(e);
            }

            /*this.now=obj;
            this.status=name;*/


/*            bs.o3d.controls.object=obj;
            bs.o3d.controls.reset();
            bs.o3d.controls.update();*/

        }

        _reD(obj){
            obj.visible=true;
            obj.position.set(0,0,0);
            obj.rotation.set(0,0,0);
            obj.scale.set(1,1,1);
        }

        justDoIt(){
            if(!this.ready) return;

            if(this.status.a1||this.status.a2||this.status.life) return ;

            this._reD(this.status.nowObj);
            this.status.a1=true;

            this.audio.play("key1");
        }

        _update(time){
            let status=this.status;
            let c=this.clock;
            let d=c.getDelta()

            //console.log(status.life);
            if(status.nowName){
                if(status.a1){
                    let key=xyz[Math.floor(Math.random()*3)];
                    //status.nowObj.rotation[key]+=0.1;
                    let r=status.nowObj.rotation;
                    let bv=Math.sin(time/1000);
                    r.x+=bv*(1+Math.random()*3);
                    r.y+=bv*(1+Math.random()*3);
                    r.y+=bv*(1+Math.random()*3);

                    status.life+=d;

                    //console.log(c.getDelta(),status.life,status.maxLife);

                    if(status.life>=status.maxLife){
                        status.life=0;
                        status.a1=false;
                        status.a2=true;
                        console.log(status.life);


                        //let index=Math.floor(Math.random()*(+status.nowName.split("_")[1]))
                        //let index=Math.floor(Math.random()*this.value[status.nowName].length);
                        let index=this.random(this.value[status.nowName].length)-1;
                        let e=this.value[status.nowName][index];
                        console.log(index);
                        if(status.nowName=="D10-0_8_2"){
                            status.lastD10_2=index;
                        }
                        //在进行了几局COC游戏后我们一致认为，用电子骰投出00大失败，这何止是愚蠢，这简直就是愚蠢
                        if(status.nowName=="D10-0_8_1"){
                            if(status.lastD10_2===0){
                                index=index<5?index+1:index;
                            }
                        }
                        status.t = new TWEEN.Tween(status.nowObj.rotation,this.tg).to({x:e.r.x,y:e.r.y,z:e.r.z},100).start();
                        status.t.onComplete(()=>{
                            this.tg.remove(status.t);
                            status.t=null;
                            status.a2=false;
                        })
                    }

/*                    if(Math.abs(status.nowObj.rotation.x)>=Math.PI*2||Math.abs(status.nowObj.rotation.y)>=Math.PI*2||Math.abs(status.nowObj.rotation.z>=Math.PI*2)>=Math.PI*2){

                        status.a1=false;
                        status.a2=true;

                        let e=this.value[status.nowName][Math.floor(Math.random()*(+status.nowName.split("_")[1]))];
                        console.log(status.nowObj.rotation,e,{x:e.r.x,y:e.r.y,z:e.r.z},this.tg);
                        status.t = new TWEEN.Tween(status.nowObj.rotation,this.tg).to({x:e.r.x,y:e.r.y,z:e.r.z},100).start();
                        status.t.onComplete(()=>{
                            this.tg.remove(status.t);
                            status.t=null;
                        })

                    }*/
                }
            }

            this.tg.update(time)

            if(this.lg)
                this.lg.rotation.y+=0.001;

            if(this.bg)
                this.bg.update();
        }

        rnd(seed){
            seed = ( seed * 9301 + 49297 ) % 233280;
            return seed / ( 233280.0 );
        }
        random(num){
            let today = new Date();
            let seed = today.getTime();
            return Math.ceil( this.rnd( seed ) * num );
        }


        _getQueryVariable(variable)
        {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(false);
        }




    }

    function animate(time){
        requestAnimationFrame(animate);

        if(pt){
            pt._update(time);
        }

    }

    animate();

    return{
        PT:PT
    }

})()