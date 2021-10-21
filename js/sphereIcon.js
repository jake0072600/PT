let SphereIcon = (function () {

    let SphereIcons={length:0};
    TWEEN.SphereIcons={}
    let SphereIconType={
        none:1,
        scale:2,
        opacity:3
    }

    let tl=new THREE.TextureLoader();
    let rotationMatrix = new THREE.Matrix4();

    class SphereIcon{
        constructor(img,object3d,point,size,options) {

            if(!img) return;
            if(!object3d) return;
            if(!point) return ;

            this.id=options.id?options.id:getRandomId();

            if(SphereIcons[this.id]) return ;

            this.isSphereIcon=true;

            options=options?options:{};

            this.color=options.color?options.color:0xff0000;
            this.type=options.type?options.type:SphereIconType.none;
            this.life=options.life?options.life:Infinity;
            //this.speed=options.speed?options.speed:0.05;


            this.img=tl.load(img);
            this.object3d=object3d;
            this.point=point;
            this.size=size;

            this.init();

            SphereIcons[this.id]=this;
            SphereIcons.length++;

        }

        init(){
            let p=this.point;
            let s=this.size;
            let t=this.type;

            let r=getPointRotation(p);
            let plane=new THREE.PlaneBufferGeometry(s,s,1,1);
            let material=new THREE.MeshStandardMaterial({
                color:this.color,
                map:this.img
            })
            material.side=THREE.DoubleSide;
            material.transparent=true;
            material.alphaTest=0.1;
            material.depthWrite=true;

            let mesh=new THREE.Mesh(plane,material);
            mesh.position.copy(p.clone().multiplyScalar(1.1));
            mesh.rotation.copy(r);

            this.mesh=mesh;

            this.object3d.add(mesh);

            switch (t){
                case SphereIconType.scale:{
                    mesh.userData.tween=new TWEEN.Tween(mesh.scale,this.tg).to({x:1.2,y:1.2,z:1.2},500).onRepeat((obj)=>{
                        this.life-=0.5;
                        if(this.life<=0)
                            this.destroy();
                    }).repeat(Infinity).yoyo(true).start();
                    break;
                }
                case SphereIconType.opacity:{
                    mesh.userData.tween=new TWEEN.Tween(mesh.material,this.tg).to({opacity: 0},500).onRepeat((obj)=>{
                        this.life-=0.5;
                        if(this.life<=0)
                            this.destroy();
                    }).repeat(Infinity).yoyo(true).start();
                    break;
                }
                case SphereIconType.none:
                default:{
                    break
                }
            }

        }

        destroy(leave=true){
            let id=this.id;

            let tg = TWEEN.SphereIcons[id];
            if(tg){
                tg.removeAll();
            }

            let sm=this.mesh;
            if(leave){
                new TWEEN.Tween(sm.scale,tg).to({x:0,y:0,z:0},100).onComplete(()=>{
                    this.deleteSelf();
                }).start();
            }else{
                this.deleteSelf();
            }




        }

        deleteSelf(){
            let id=this.id;
            let sm=this.mesh;

            let tg = TWEEN.SphereIcons[id];
            if(tg){
                tg.removeAll();
            }

            sm.userData.tween.stop();
            sm.userData.tween=null;
            delete sm.userData.tween;

            if(sm.material.map)
                sm.material.map.dispose();
            sm.material.dispose();
            sm.geometry.dispose();

            this.object3d.remove(sm);

            delete TWEEN.SphereIcons[id];

            for(let a in this){
                this[a]=null;
                delete this[a];
            }
        }

        setColor(color){
            this.mesh.material.color=new THREE.Color(color);
        }
    }

    class SphereIconFire extends SphereIcon{
        constructor(img,object3d,point,size,options) {
            super(img,object3d,point,size,options);

            if(!options.img2) return;

            this.color2=options.color2?options.color2:this.color;

            let id=this.id;

            let map=tl.load(options.img2);
            let p=new THREE.PlaneBufferGeometry(this.size*0.5,this.size*1.5);
            let m=new THREE.MeshBasicMaterial({color:this.color2,transparent:true,side:THREE.DoubleSide,map:map});
            m.alphaTest=0.1;

            let fg=new THREE.Group();
            fg.rotation.x=-Math.PI/2;
            let f1=new THREE.Mesh(p,m);
            let f2=new THREE.Mesh(p,m);
            f2.rotation.set(0,Math.PI/2,0);
            f1.position.set(0,this.size*1.5/2,0);
            f2.position.set(0,this.size*1.5/2,0);
            fg.add(f1);
            fg.add(f2);

            this.mesh.add(fg);

            let tg = TWEEN.SphereIcons[id];
            fg.userData.tween=new TWEEN.Tween(fg.scale,tg).to({y:3.0,x:1.5,z:1.5},500+Math.random()*500).repeat(Infinity).yoyo(true).start();

            this.f1=f1;
            this.f2=f2
            this.fg=fg;
        }

        toggleFire(fire){
            if(fire==undefined)
                this.fg.visible=!this.fg.visible;
            else{
                this.fg.visible=fire;
            }
        }

        destroy(leave = true) {

            let fg=this.fg;
            fg.userData.tween=null;

            fg.children.map((f)=>{
                f.material.map.dispose();
                f.material.dispose();
                f.geometry.dispose();
                f.material.map=null;
            })

            fg.remove(this.f1);
            fg.remove(this.f2);

            super.destroy(false);
        }

        setColor(color){
            let c=new THREE.Color(color);
            this.f1.material.color=c;
            this.f2.material.color=c;

            super.setColor(color);
        }
    }

    function getPointRotation(point){
        let q1=new THREE.Quaternion();
        rotationMatrix.lookAt(new THREE.Vector3(),point,new THREE.Vector3(0,1,0));
        q1.setFromRotationMatrix(rotationMatrix);
        let r1=new THREE.Euler();
        r1.setFromQuaternion(q1);

        return r1;
    }

    function getRandomId(){
        return THREE.Math.generateUUID();
    }

    function animate(time){
        requestAnimationFrame(animate);

        if(TWEEN){
            if(TWEEN.SphereIcons){
                let sig=TWEEN.SphereIcons;
                for(let a in sig){
                    sig[a].update(time);
                }
            }
        }

/*        for(let a in SphereIcons){
            if(SphereIcons[a].isSphereIcon){

                let si = SphereIcons[a];



            }
        }*/
    }

    animate();

    function removeById(id,leave=true){
        let si=SphereIcons[id];
        if(si){
            if(si.isSphereIcon)
                si.destroy(leave);
        }
    }

    function removeAll(leave=true){
        for(let a in SphereIcons){
            if(SphereIcons[a].isSphereIcon)
                SphereIcons[a].destroy(leave);
        }

        SphereIcons.length=0;
    }

    return {
        SphereIcons:SphereIcons,
        SphereIconType:SphereIconType,

        SphereIcon:SphereIcon,
        SphereIconFire:SphereIconFire,

        removeById:removeById,
        removeAll:removeAll,
    }

})();