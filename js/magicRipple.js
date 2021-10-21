let MagicRipple=(()=>{

    let Ripples={}

    let tl=new THREE.TextureLoader();

    class Ripple1{
        constructor(width,height,url,o3d,options) {

            //if(this)

            this.id = options.id?options.id:THREE.Math.generateUUID();

            this.count=options.count?options.count:3;
            this.maxLength=options.maxLength?options.maxLength:0.5;
            this.maxScale=options.maxScale?options.maxScale:new THREE.Vector3(1,1,1);

            this.life=options.life?options.life:50;


            let ss=options.startScale?options.startScale:new THREE.Vector3(0.5,0.5,0.5);
            let pos=options.position?options.position:new THREE.Vector3();

            this.ls=this.maxLength/this.life;
            this.ss=(this.maxScale.x-ss.x)/this.life;

            console.log(this.ss,this.ls);


            this.isRipple=true;

            this.group=new THREE.Group();
            //this.group.rotation.x=Math.PI/2;
            o3d.add(this.group);

            let g=new THREE.PlaneBufferGeometry(width,height);
            let m=new THREE.MeshBasicMaterial({color:options.color?options.color:0xffffff,map:tl.load(url),transparent:true});
            m.side=THREE.DoubleSide;
            m.alphaTest=0.1;

            let ps=[];

            for(let i=0;i<this.count;i++){
                let p=new THREE.Mesh(g,m);
                p.rotation.x=-Math.PI/2;
/*                let sa=((this.maxScale.x-ss.x)/(this.count-1));
                p.scale.set(ss.x+i*sa,ss.y+i*sa,ss.z+i*sa);
                //console.log(p.scale);
                p.position.set(0,i*this.ls,0);*/
                p.userData.progress=((i+1)/this.count);
                p.userData.vx=0.001*i*0.001;
                p.userData.rvx=0.001*i*0.001

                this.group.add(p);
                ps.push(p);
            }

            this.ps=ps;

/*            let p1=new THREE.Mesh(g,m);
            let p2=new THREE.Mesh(g,m);
            let p3=new THREE.Mesh(g,m);*/



            this.startScale=ss;

            this.group.position.copy(pos);

/*            this.group.add(p1);
            this.group.add(p2);
            this.group.add(p3);*/

/*            p1.scale.set(ss.x,ss.y,ss.z);
            p2.scale.set((1-ss.x)/2,(1-ss.y)/2,(1-ss.z)/2);
            p3.scale.set(1,1,1);

            p1.position.z=0;
            p2.position.z=0.3;
            p3.position.z=0.6;

            this.p1=p1;
            this.p2=p2;
            this.p3=p3;*/

            Ripples[this.id]=this;

/*            new BasicAnimate.BasicAnimate(p1.scale,{x:1,y:1,z:1},{time:1000,delay:0, repeat:Infinity, autoStart: true,easing:TWEEN.Easing.Exponential.InOut});
            new BasicAnimate.BasicAnimate(p2.scale,{x:1,y:1,z:1},{time:1000,delay:1000, repeat:Infinity, autoStart: true,easing:TWEEN.Easing.Exponential.InOut});
            new BasicAnimate.BasicAnimate(p3.scale,{x:1,y:1,z:1},{time:1000,delay:2000, repeat:Infinity, autoStart: true,easing:TWEEN.Easing.Exponential.InOut});

            new BasicAnimate.BasicAnimate(p1.position,{z:0.6},{time:1000,delay:0, repeat:Infinity, autoStart: true,easing:TWEEN.Easing.Exponential.InOut});
            new BasicAnimate.BasicAnimate(p2.position,{z:0.6},{time:1000,delay:1000, repeat:Infinity, autoStart: true,easing:TWEEN.Easing.Exponential.InOut});
            new BasicAnimate.BasicAnimate(p3.position,{z:0.6},{time:1000,delay:2000, repeat:Infinity, autoStart: true,easing:TWEEN.Easing.Exponential.InOut});*/

            this._update();
        }

        setVisible(visible){
            this.group.visible=visible;
        }

        _update(){
/*            let p1=this.p1;
            let p2=this.p2;
            let p3=this.p3;

            this._updateP(p1);
            this._updateP(p2);
            this._updateP(p3);*/

            this.ps.map((p)=>{
                this._updateP(p);
            })
        }

        _updateP(p){
            if(p.userData.progress>=1){
                p.userData.vx=p.userData.rvx;
                p.userData.progress=0;
            }


            let ml=this.maxLength;
            let ms=this.maxScale;

            let sx=p.scale.x;
            let ss=this.startScale;

            let pp=p.userData.progress;

            p.scale.set(ss.x+((ms.x-ss.x)*pp),ss.x+((ms.x-ss.x)*pp),ss.x+((ms.x-ss.x)*pp));
            p.position.y=-(ml*pp);

            p.userData.vx+=0.0001;
            //p.userData.progress+=0.0005+p.userData.vx;
            p.userData.progress+=0.005;

/*            sx+=this.ss;
            //console.log(this.ss,this.ls);
            if(sx>=ms.x){
                sx=ss.x;
            }

            p.scale.set(sx,sx,sx);

            let py=p.position.y;

            py-=this.ls;
            //console.log(this.ls,py);
            if(py<=(-ml)){
                py=0;
                //p.scale.copy(ss);
            }

            p.position.y=py;
            console.log(sx,ms.x,py,ml);*/

        }
    }

    function animate(time){
        requestAnimationFrame(animate);


        for(let a in Ripples){
            if(Ripples[a].isRipple){
                let mra=Ripples[a]
                mra._update();
            }
        }
    }

    animate()


    return{
        Ripple1:Ripple1
    }

})();