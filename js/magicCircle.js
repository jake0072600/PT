//此类库用于生成依赖于three.js和tween.js的魔法阵效果
//依赖
//three.js
//tween.js

let MagicCircle=(function () {

    let FireShader={
        uniforms: {
            time:{type:"f",value:0.0}
        },
        side:THREE.DoubleSide,
        //depthTest:false,
        vertexShader:[
            "varying vec2 vUv;",
            "void main()",
            "{",
                "vUv = uv;",
                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
                "gl_Position = projectionMatrix * mvPosition;",
            "}"
        ].join("\n"),
        fragmentShader:[
            "uniform float time;",
            //"uniform float fire;",
            "uniform sampler2D texture1;",

            "varying vec2 vUv;",

            "float noise(vec3 p) //Thx to Las^Mercury",
            "{",
                "vec3 i = floor(p);",
                "vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);",
                "vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;",
                "a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);",
                "a.xy = mix(a.xz, a.yw, f.y);",
                "return mix(a.x, a.y, f.z);",
            "}",

            "float sphere(vec3 p, vec4 spr){return length(spr.xyz-p) - spr.w;}",

            "float flame(vec3 p)",
            "{",
                //"float d = sphere(p*vec3(0.0,fire,1.), vec4(.2,-1.,.0,1.));",
                "float d = sphere(p*vec3(0.0,0.8,1.), vec4(.0,-1.,.0,1.));",
                "return d + (noise(p+vec3(.0,time*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;",
            "}",

            "float scene(vec3 p){return min(100.-length(p) , abs(flame(p)) );}",

            "vec4 raymarch(vec3 org, vec3 dir)",
            "{",
                "float d = 0.0, glow = 0.0, eps = 0.02;",
                "vec3  p = org;",
                "bool glowed = false;",

                "for(int i=0; i<64; i++)",
                "{",
                    "d = scene(p) + eps;",
                    "p += d * dir;",
                    "if( d>eps )",
                    "{",
                        "if(flame(p) < .0)",
                            "glowed=true;",
                        "if(glowed)",
                            "glow = float(i)/64.;",
                    "}",
                "}",
                "return vec4(p,glow);",
            "}",

            "void main()",
            "{",
                "vec2 v = -1.0 + 2.0 * vUv;",
                //"v.x*=vUv.x/vUv.y;",
                "vec3 org = vec3(0., -2.5, 4.);",
                "vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));",

                "vec4 p = raymarch(org, dir);",
                "float glow = p.w;",

                "vec4 col = mix(vec4(1.,.5,.1,1.), vec4(1.,.5,.1,1.), p.y*.02+.4);",

                "vec4 color=mix(vec4(0.), col, pow(glow*2.,4.));",

                "if((color.x<=0.15&&color.y<=0.15&&color.z<=0.15)) discard;",

                "gl_FragColor = color;",
                "//gl_FragColor = mix(vec4(1.), mix(vec4(1.,.5,.1,1.),vec4(1.0,.5,1.,1.),p.y*.1+.2), pow(glow*2.,4.));",

            "}"
        ].join("\n")
    };

    let clock=new THREE.Clock();

    let MagicCircles={length:0};
    TWEEN.MagicCircleGroup={}

    //radius:半径
    //height:高度
    //img1:魔法阵下方圆柱贴图
    //img2：魔法阵上方贴片贴图
    //pos:位置
    //scene:要加入的object3d
    //id:可能有的自定义id或随机id
    class Light1{
        constructor(options) {

            if(options.id){
                if(MagicCircles[options.id])
                    return ;
            }

            this.radius=options.radius;
            this.height=options.height;
            this.img1=options.img1;
            this.img2=options.img2;
            this.color=options.color?options.color:0xff0000
            this.pos=options.pos;
            this.scene=options.scene;

            this.rect=options.rect;

            this.codes=[];


            let p=this.pos;
            this.o3d=new THREE.Group();
            this.o3d.position.set(p.x,p.y,p.z);

            this.tl=new THREE.TextureLoader();
            this.t1=this.tl.load(this.img1,this.isReady.bind(this));
            this.t2=this.tl.load(this.img2,this.isReady.bind(this));

            this.id = options.id?options.id:getRandomId();
            this.isMagicCircle = true;

            this.m1;
            this.m2;

            this.tg=new TWEEN.Group();

            this.init();

            TWEEN.MagicCircleGroup[this.id]=this.tg;
            MagicCircles[this.id]=this;
            MagicCircles.length++;
        }

        init(){
            this.initBasic();
            this.initShow();
        }

        initBasic(){

            let g;
            g=new THREE.CylinderBufferGeometry(this.radius,this.radius,this.height,50,1,true);
            //let m=new THREE.MeshStandardMaterial({color:this.color,map:this.t1});
            let m=new THREE.MeshBasicMaterial({color:this.color,map:this.t1});
            m.side=THREE.DoubleSide;
            m.transparent=true;
            m.alphaTest=0.001;
            m.depthWrite=false;
            let mesh = new THREE.Mesh(g,m);
            mesh.position.set(0,this.height/2,0);
            mesh.scale.set(0.5,1,0.5);
            this.o3d.add(mesh);

            //let g2=new THREE.PlaneBufferGeometry(this.radius*1.6,this.radius*1.6);
            let g2 = new THREE.CircleBufferGeometry(this.radius*0.8,50);
            //let m2=new THREE.MeshStandardMaterial({color:this.color,map:this.t2});
            let m2=new THREE.MeshBasicMaterial({color:this.color,map:this.t2});
            m2.side=THREE.DoubleSide;
            m2.transparent=true;
            m2.alphaTest=0.001;
            m2.depthWrite=false;
            m2.side=THREE.DoubleSide;
            let mesh2 = new THREE.Mesh(g2,m2);
            mesh2.rotation.set(Math.PI/2,0,0);
            mesh2.position.set(0,0,0);
            mesh2.userData.pos1=new THREE.Vector3(0,this.height*1.2,0);
            mesh2.userData.pos2=new THREE.Vector2(0,this.height*1.05,0);
            this.o3d.add(mesh2);

            this.m1=mesh;
            this.m2=mesh2;

            this.scene.add(this.o3d);
        }

        initShow(){
            let m1=this.m1;
            let m2=this.m2;
            let tg=this.tg;

            let t1=new TWEEN.Tween(m1.scale,tg).to({x:1,z:1},1000).easing(TWEEN.Easing.Linear.None);
            let t2=new TWEEN.Tween(m2.position,tg).to({y:m2.userData.pos1.y},1000).easing(TWEEN.Easing.Linear.None);
            let t3=new TWEEN.Tween(m2.position,tg).to({y:m2.userData.pos2.y},1000).easing(TWEEN.Easing.Linear.None);
            let t4=new TWEEN.Tween(m2.position,tg).to({y:m2.userData.pos1.y},1000).easing(TWEEN.Easing.Linear.None);

            t1.chain(t2);
            t2.chain(t3);
            t3.chain(t4);
            t4.chain(t3);

            t1.start();
        }

        destroy(){
            let id = this.id;

            this.tl._listeners=null;

            let tg = TWEEN.MagicCircleGroup[id];
            if(tg){
                tg.removeAll();
                delete TWEEN.MagicCircleGroup[id];
            }
            this.m1.geometry.dispose();
            if(this.m1.material.map)
                this.m1.material.map.dispose();
            this.m1.material.dispose();
            this.o3d.remove(this.m1);

            this.m2.geometry.dispose();
            if(this.m2.material.map)
                this.m2.material.map.dispose();
            this.m2.material.dispose();
            this.o3d.remove(this.m2);

            this.scene.remove(this.o3d);

            delete MagicCircles[id];
            MagicCircles.length--;

            for(let a in this){
                delete this[a];
            }

        }

        isReady(){
            if(this.t1.image&&this.t2.image){
                //this.init();
            }
        }

        setColor(color){
            this.m1.material.color=new THREE.Color(color);
            this.m2.material.color=new THREE.Color(color);
        }
        setVisible(visible){
            this.o3d.visible=visible;
        }
    }

    class Light2 extends Light1{
        constructor(props) {
            super(props);

            //this.t1.repeat.x=Math.ceil(Math.random()*3);
/*            this.t1.repeat.x=1;
            this.t1.warpS=THREE.RepeatWrapping;*/
            //this.t1.offset.x=Math.random();
            //this.t1.needsUpdate=true;

            this.codes.push("t1_move");
        }
    }

    class FireLight extends Light1{
        constructor(props) {
            super(props);

            this.m1.material.map.dispose();
            this.m1.material.dispose();

            this.m1.material=new THREE.ShaderMaterial(
                JSON.parse(JSON.stringify(FireShader))
            )

            this.codes.push("t1_move")
            this.codes.push("time_move");
        }
    }



    function removeById(id){
        let mc=MagicCircles[id];
        if(mc){
            if(mc.isMagicCircle)
                mc.destroy();
        }
    }

    function removeAll(){
        for(let a in MagicCircles){
            if(MagicCircles[a].isMagicCircle)
                MagicCircles[a].destroy();
        }

        MagicCircles.length=0;
    }

    function doOtherCodes(mc){
        if(!mc.codes.length) return;

        let delta = clock.getDelta();
        let time=clock.getElapsedTime();

        let codes=mc.codes;
        for(let i=0;i<codes.length;i++){
            switch (codes[i]){
                case "t1_move":{
                    //mc.t1.offset.x=mc.t1.offset.x+0.01>1?0:mc.t1.offset.x+0.01;
                    //mc.t1.offset.x+=0.01;
                    mc.m1.rotation.y=mc.m1.rotation.y+0.05>Math.PI*2?0:mc.m1.rotation.y+0.05;
                    //mc.m1.rotation.y+=0.05;
                    break;
                }
                case "time_move":{
                    mc.m1.material.uniforms.time.value+=delta * 5000;
                    break;
                }
                case "scale_simple":{
                    //let t=Math.sin(time)/400;
                    let tt =1+Math.abs(Math.sin(time)/10);
/*                    mc.m1.scale.x+=Math.sin(t);
                    mc.m1.scale.z+=Math.sin(t);*/
                    mc.m1.scale.x=tt;
                    mc.m1.scale.z=tt;
                    break;
                }
                default:continue;
            }
        }
    }

    function animate(time){
        requestAnimationFrame(animate);

        if(TWEEN){
            if(TWEEN.MagicCircleGroup){
                let tmcg=TWEEN.MagicCircleGroup;
                for(let a in tmcg){
/*                    for(let b in tmcg[a]){
                        tmcg[a][b].update(time);
                    }*/
                    tmcg[a].update();
                }
            }


        }

        for(let a in MagicCircles){
            if(MagicCircles[a].isMagicCircle){
                doOtherCodes(MagicCircles[a]);
            }
        }
    }

    function getRandomId(){
        return THREE.Math.generateUUID();
    }

    animate();

    return {
        Light1:Light1,
        Light2:Light2,
        FireLight:FireLight,

        MagicCircles:MagicCircles,
        removeById:removeById,
        removeAll:removeAll
    }

})();