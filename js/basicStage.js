//此类用于渲染一个基础的3D场景
//依赖于
// three.js
// jquery.js
// OrbitControls
//EffectComposer
//RenderPass



/**
 * @author stemkoski / http://github.com/stemkoski
 *
 * Blend two textures additively
 */

/*THREE.AdditiveBlendShader = {

    uniforms: {

        "tDiffuse1": { type: "t", value: null },
        //"tDiffuse2": { type: "t", value: null }
    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform sampler2D tDiffuse1;",
        //"uniform sampler2D tDiffuse2;",

        "varying vec2 vUv;",

        "void main() {",

        "vec4 texel1 = texture2D( tDiffuse1, vUv );",
        //"vec4 texel2 = texture2D( tDiffuse2, vUv );",
        //"gl_FragColor = texel1 + texel2;",
        "}"

    ].join("\n"),

    fragmentShaderBasic:[
        "uniform sampler2D tDiffuse1;",
        "varying vec2 vUv;",
        "void main() {",
        "vec4 texel0 = texture2D( tDiffuse1, vUv );",
        "}"
    ]

};*/




//options
//element 用于写入canvas的dom元素
let BasicStage=(function () {

    class BasicStage{

        constructor(options) {

            this.id = this.getRandomId();

            this.element = options.element;
            this.$e = $(this.element);

            this.stats = new Stats();
            this.element.appendChild( this.stats.dom );

            this.width = this.$e.width();
            this.height = this.$e.height();

            this.config = options.config;

            this.enabled = true;

            this.o3d = {
                renderer:null,
                camera:null,
                scene:null,
                models:new THREE.Group(),
                clock:null,
                mixer:null,
                mixers:[],
                controls:null,
                normalLight:null,
                animations:[],

                renderPass:null,
                composer:null,

                worldRadius:0,
                worldCenter:new THREE.Vector3()
            };

            this.eventOptions={
                resize:this._resize.bind(this)
            }

            this.normalRender=true;

            this.animateObject = null;

            this._init();
            this._animate();

        }

        _init(){
            this._initBasic();
            this._initEvents();
        }
        _initBasic(){
            let w = this.width;
            let h = this.height;

            let o3d = this.o3d;
            o3d.renderer = new THREE.WebGLRenderer( { antialias: true,alpha:true } );
            o3d.renderer.setPixelRatio( window.devicePixelRatio );
            o3d.renderer.setSize(w,h);
            //o3d.renderer.outputEncoding=THREE.sRGBEncoding;

            o3d.renderer.outputEncoding = THREE.sRGBEncoding;
            o3d.renderer.physicallyCorrectLights = false;
            o3d.renderer.shadowMap.enabled = false;
            o3d.renderer.shadowMap.type = 1;
            //o3d.renderer.toneMapping = THREE.ReinhardToneMapping;;
            //o3d.renderer.toneMappingExposure = 1;

            o3d.renderer.autoClear = true;
            this.element.appendChild(o3d.renderer.domElement);

            o3d.scene = new THREE.Scene();
            o3d.scene.add(o3d.models);

            o3d.camera = new THREE.PerspectiveCamera(45,w/h,1,1000000);

            o3d.clock = new THREE.Clock();

            o3d.controls=new THREE.OrbitControls(o3d.camera,this.element);
            o3d.controls.target.set( 0, 0, 0 );
            //o3d.controls.enablePan = false;

            o3d.normalLight=new THREE.AmbientLight(0xffffff,1);

            o3d.scene.add(o3d.normalLight);

            this._initProcessing();
        }
        _initProcessing(){
            let o3d=this.o3d;
            o3d.renderPass=new THREE.RenderPass(o3d.scene,o3d.camera);
            o3d.composer=new THREE.EffectComposer(o3d.renderer);
            o3d.composer.addPass(o3d.renderPass);
            o3d.composer.setSize(this.width,this.height);
        }
        addPass(pass){
            if(!pass) return;
            this.o3d.composer.addPass(pass);
            this.normalRender=false;
        }
        setPass(pass){
            if(!pass) return;

            this._initProcessing();
            this.o3d.composer.addPass(pass);

            this.normalRender=false;
        }
        openPass(){
            this.normalRender=false;
        }
        closePass(){
            this.normalRender=true;
        }
        noPass(){
            this._initProcessing();
            this.normalRender=true;
        }

        _initEvents(){
            $(window).on("resize",this.eventOptions.resize);
        }
        _resize(){
            this.width = this.$e.width();
            this.height = this.$e.height();

            let w = this.width;
            let h = this.height;
            let camera = this.o3d.camera;
            let renderer = this.o3d.renderer;
            let composer = this.o3d.composer;
            let normalComposer = this.o3d.normalComposer

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize( w, h);
            if(normalComposer)
                normalComposer.setSize( w, h);
            composer.setSize( w, h );

            this.dispatchEvent({type:"resize",message:""});
        }

        setEnabled(enabled){
            this.enabled = enabled;
        }
        normalLightOpen(){
            this.o3d.normalLight.intensity=1.0;
        }
        normalLightClose(){
            this.o3d.normalLight.intensity=0.0;
        }
        normalControlsToggle(enabled){
            if(typeof enabled==="boolean"){
                this.o3d.controls.enabled=enabled;
            }else{
                this.o3d.controls.enabled=!this.o3d.controls.enabled;
            }
        }

        getRandomId(randomLength){
            return THREE.Math.generateUUID();
        }

        //重置3D视角
        goHomeO3D(){
            let o3d=this.o3d;
            let r=o3d.worldRadius;
            let c=o3d.worldCenter;

/*            let s = new THREE.Spherical( r*1.5,Math.PI*2, Math.PI );
            console.log(s);
            let v = new THREE.Vector3();
            v.setFromSpherical(s);*/
            //v.add(c);

            o3d.camera.position.set(0,0,r*3);
            //o3d.camera.position.copy(v);
            o3d.camera.far=r*60;

            o3d.controls.target.copy(c);
            o3d.controls.update();
/*            o3d.controls.target.set( 0, 0, 0 );
            o3d.controls.update();*/
        }

        //创建写入mixer对象
        setMixer(model,animations,paused){
            let o3d=this.o3d;
            this.clearMixer();

            //o3d.mixer=new THREE.AnimationMixer(model);
            o3d.animations=animations;
            if(!paused){
                if(animations.length){
                    animations.map((a)=>{
                        let m=new THREE.AnimationMixer(model);
                        o3d.mixers.push(m);
                        m.clipAction(a.optimize?a.optimize():a).play();
                    })
                }
            }
                //o3d.mixer.clipAction(animations[0].optimize?animations[0].optimize():animations[0]).play();
        }
        clearMixer(){
            let o3d=this.o3d;
            if(o3d.mixers.length){
                o3d.mixers.map((m)=>{
                    m.stopAllAction();
                })
                //o3d.mixer.stopAllAction();
                o3d.mixers=[];
                o3d.animations=[];
            }
        }

        //写入scene中的model
        setModel(model){
            this.clearMixer();
            this.clearModel();

            this.normalLightClose();
			this.o3d.models.add(model);
           

            this.updateWorldRC();
            this.goHomeO3D();
        }
        //追加model
        addModel(model){
            this.o3d.models.add(model);
        }
        clearModel(){
            let models=this.o3d.models;

            models.traverse((c)=>{
                if(c.isMesh){
                    c.geometry.dispose();
                    if(c.material.map)
                        c.material.map.dispose();
                    if(c.material.normalMap)
                        c.material.normalMap.dispose();
                    if(c.material.roughnessMap)
                        c.material.roughnessMap.dispose();
                    if(c.material.metalnessMap)
                        c.material.metalnessMap.dispose();
                    if(c.material.aoMap)
                        c.material.aoMap.dispose();

                    c.material.dispose();
                }
            })
            while (models.children.length)
                models.remove(models.children[0]);

            this.o3d.scene.remove(this.o3d.models);
            this.o3d.models=null;
            this.o3d.models=new THREE.Group();
            this.o3d.scene.add(this.o3d.models);

            this.o3d.worldCenter=new THREE.Vector3();
            this.o3d.worldRadius=0;
        }

        //更新WorldCenter和WorldRadius
        updateWorldRC(){
            let models=this.o3d.models;
            let o3d=this.o3d;

            let ml = 0;
            let n = 0;

            let v3s=[];

            models.traverse( function ( child ) {
                if ( child.isMesh ) {
                    //child.geometry.computeBoundingSphere();
                    child.geometry.computeBoundingBox();
                    //child.material=new THREE.MeshBasicMaterial({color:0x000000});
                    //ml = child.position.length()>ml?child.position.length():ml;
                    //ml=(child.geometry.boundingSphere.radius)>ml?(child.geometry.boundingSphere.radius):ml;
                    //o3d.worldCenter.add(child.geometry.boundingSphere.center.clone());
                    //n++;
                    v3s.push(child.geometry.boundingBox.max);
                    v3s.push(child.geometry.boundingBox.min);
                }
            } );
/*            o3d.worldRadius=ml;
            o3d.worldCenter.divideScalar(n);*/
            let g=new THREE.Geometry();
            g.vertices=v3s;
            g.computeBoundingSphere();
            o3d.worldRadius=g.boundingSphere.radius;
            o3d.worldCenter=g.boundingSphere.center;
        }

        _animate(){
            let self = this;

            let step=(time)=>{
                let o3d = this.o3d;
                let renderer = o3d.renderer;
                let composer = o3d.composer;
                if(!renderer) return;
                this.animateObject = window.requestAnimationFrame(step);

                if(this.enabled){

                    this.stats.update();

                    let delta=o3d.clock.getDelta();

                    if(TWEEN){
                        TWEEN.update(time);
                        if(TWEEN.groups){
                            for(let a in TWEEN.groups){
                                TWEEN.groups[a].update(time);
                            }
                        }
                    }

                    this.dispatchEvent({type:"animate",message:time});

                    if(o3d.mixers.length){
                        o3d.mixers.map((m)=>{
                           m.update(delta);
                        })
                    }
                        //o3d.mixer.update(delta);

                    if(this.normalRender){
                        renderer.render( o3d.scene, o3d.camera );
                    }
                    else
                        composer.render();

                    this.dispatchEvent({type:"afterRender",message:""});
                }
            }

            window.requestAnimationFrame(step)
        }

        _destroy(){

        }


    }

    Object.assign( BasicStage.prototype, THREE.EventDispatcher.prototype);

    class EffectStage extends BasicStage{
        constructor(props,config) {
            super(props);

            config=config?config:{};

            //this.key=0;

            let renderTargetParameters =
                {
                    minFilter: config.minFilter?config.minFilter:THREE.LinearFilter,
                    magFilter: config.magFilter?config.magFilter:THREE.LinearFilter,
                    //format: config.format?config.format:THREE.RGBFormat,
                    //stencilBuffer: false,
                    wrapS: config.wrapS?config.wrapS:THREE.ClampToEdgeWrapping,
                    wrapT: config.wrapT?config.wrapT:THREE.ClampToEdgeWrapping,
                    encoding:config.encoding?config.encoding:THREE.LinearEncoding,
                };

            this.renderTarget=new THREE.WebGLRenderTarget( this.width, this.height, renderTargetParameters );

            this.normalComposer=new THREE.EffectComposer(this.o3d.renderer,this.renderTarget);
            this.normalComposer.addPass(new THREE.RenderPass(this.o3d.scene,this.o3d.camera));


            this.effectPass={length:0};
        }

        addEffectPass(shaderPass){
            let sp=(shaderPass instanceof Array)?shaderPass:[shaderPass];

            let ep=new EffectPass(this.o3d.camera,this.o3d.renderer,this.renderTarget,sp);

            this.effectPass[ep.id]=ep;
            this.effectPass.length++;

            this._UpdateBlendShader();

            return ep;
        }

        add(object3d,id){
            let eps=this.effectPass;
            if(eps[id])
                eps[id].add(object3d);
            else
                this.scene.add(object3d);
        }

        _UpdateBlendShader(){
            this.AdditiveBlendShader = {

                uniforms: {

                    "tDiffuse0": { type: "t", value: null },
                    //"tDiffuse2": { type: "t", value: null }
                },

                vertexShader: [

                    "varying vec2 vUv;",

                    "void main() {",

                    "vUv = uv;",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                    "}"

                ].join("\n"),

                fragmentShader: [

                    "uniform sampler2D tDiffuse0;",
                    //"uniform sampler2D tDiffuse2;",

                    "varying vec2 vUv;",

                    "void main() {",

                    "vec4 texel1 = texture2D( tDiffuse0, vUv );",
                    //"vec4 texel2 = texture2D( tDiffuse2, vUv );",
                    //"gl_FragColor = texel1 + texel2;",
                    "}"

                ].join("\n"),

                fragmentShaderBasic:[
                    "uniform sampler2D tDiffuse0;",
                    "varying vec2 vUv;",
                    "void main() {",
                    "vec4 texel0 = texture2D( tDiffuse0, vUv );",
                    "gl_FragColor = texel0;",
                    "}"
                ]
            };

            let eps=this.effectPass
            let uniformStr="";
            let texelStr="";
            let fragColorStr="gl_FragColor = texel0"
            let i=1;
            for(let a in eps){
                if(eps[a].isEffectPass){
                    this.AdditiveBlendShader.uniforms["tDiffuse"+i]={ type: "t", value: eps[a].composer.renderTarget2 };
                    uniformStr+= "uniform sampler2D tDiffuse"+i+";";
                    texelStr+="vec4 texel"+i+" = texture2D( tDiffuse"+i+", vUv );";
                    fragColorStr+="+texel"+i;
                    i++;
                }
            }

            fragColorStr+=";"
            this.AdditiveBlendShader.fragmentShader=[
                "uniform sampler2D tDiffuse0;",
                uniformStr,
                "varying vec2 vUv;",
                "void main() {",
                "vec4 texel0 = texture2D( tDiffuse0, vUv );",
                texelStr,
                fragColorStr,
                "}"
            ].join("\n");

            this.normalComposer=new THREE.EffectComposer(this.o3d.renderer,this.renderTarget);
            this.normalComposer.addPass(new THREE.RenderPass(this.o3d.scene,this.o3d.camera));

            let effectBlend = new THREE.ShaderPass( this.AdditiveBlendShader, "tDiffuse0" );
            effectBlend.renderToScreen = true;
            this.normalComposer.addPass(effectBlend);

            console.log(this.AdditiveBlendShader)
        }

        _animate(){
            let self = this;

            let step=(time)=>{
                let o3d = this.o3d;
                let renderer = o3d.renderer;
                let composer = o3d.composer;
                if(!renderer) return;
                this.animateObject = window.requestAnimationFrame(step);

                //this.key++;
                //console.log(this.key,"1111111111111111");

                if(this.enabled){

                    this.stats.update();

                    let delta=o3d.clock.getDelta();

                    if(TWEEN){
                        TWEEN.update(time);
                        if(TWEEN.groups){
                            for(let a in TWEEN.groups){
                                TWEEN.groups[a].update(time);
                            }
                        }
                    }


                    if(o3d.mixer)
                        o3d.mixer.update(delta);

/*                    if(this.normalRender){
                        renderer.render( o3d.scene, o3d.camera );
                    }
                    else
                        composer.render();*/

                    for(let a in this.effectPass){
                        if(this.effectPass[a].isEffectPass)
                            this.effectPass[a].update();
                    }

                    this.normalComposer.render();
                }
            }
            
            window.requestAnimationFrame(step)
        }
    }

    class EffectPass{
        constructor(camera,renderer,renderTarget,shaderPass) {

            this.isEffectPass=true;

            this.id=THREE.Math.generateUUID();
            this.scene=new THREE.Scene();
            this.camera=camera;

            this.composer=new THREE.EffectComposer(renderer,renderTarget);
            this.renderPass=new THREE.RenderPass( this.scene, camera );
            this.composer.addPass(this.renderPass);

            for(let i=0;i<shaderPass.length;i++){
                this.composer.addPass(shaderPass[i]);
            }
        }

        add(object3d){
            this.scene.add(object3d);
        }

        update(){
            this.composer.render();
        }
    }

    return {
        BasicStage:BasicStage,
        EffectStage:EffectStage
    };

})()
