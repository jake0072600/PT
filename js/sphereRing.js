let SphereRing = (function () {

    let SphereRings={length:0};

    let SphereRingCode={
        rotationY:1,
        rotationX:2,
        rotationZ:3
    }

    class SphereRing{
        constructor(o3d,radius,tube,options) {
            options=options?options:{};
            this.id=options.id?options.id:THREE.MathUtils.generateUUID();
            if(SphereRings[this.id]) return;

            this.isSphereRing=true;

            this.o3d=o3d;

            this.options=options;

            this.color=options.color?options.color:0xff0000
            this.codes=options.codes?options.codes:[];

            this.speed=options.speed?options.speed:0.001;

            this.torus=new THREE.Mesh(new THREE.TorusBufferGeometry(radius,tube,4,128),new THREE.MeshBasicMaterial({color:this.color}));
            this.ball=new THREE.Mesh(new THREE.SphereBufferGeometry(options.tube2?options.tube2:tube*5,32,32),new THREE.MeshBasicMaterial({color:options.color2?options.color2:this.color}));

            this.torus.rotation.x=Math.PI/2;
            this.torus.add(this.ball);
            this.ball.position.set(radius,0,0);
            //this.torus.rotation.y=Math.random()*(Math.PI/8);

            o3d.add(this.torus);

            SphereRings[this.id]=this;
            SphereRings.length++;

        }

        destroy(){

            let id=this.id;

            this.ball.geometry.dispose();
            this.ball.material.dispose();
            this.torus.remove(this.ball);

            this.torus.geometry.dispose();
            this.torus.material.dispose();
            this.o3d.remove(this.torus);

            delete SphereRings[id];
            SphereRings.length--;

            for(let a in this){
                this[a]=null;
                delete this[a];
            }

        }
    }

    class SphereRingStarWar extends SphereRing{
        constructor(o3d,radius,tube,options) {

            if(!options.mesh) return;

            super(o3d,radius,tube,options);
            this.mesh=options.mesh;

            this.codes.push("StarWar");

            this._justDoIt();
        }

        _justDoIt(){
            let ball=this.ball;
            let torus=this.torus;
            let mesh=this.mesh;

            ball.visible=false;

            mesh.position.copy(ball.position);

            torus.add(mesh);
            torus.material.opacity=0;
            torus.material.transparent=true;
            torus.material.alpha=0.1;

            console.log(mesh);

            mesh.lookAt(this.o3d.position);
        }
    }

    function doCode(sr,time){

        let codes=sr.codes;
        codes.map((c)=>{
            switch (c){
                case SphereRingCode.rotationZ:{
                    sr.torus.rotation.z+=sr.speed;
                    if(sr.torus.rotation.z>=Math.PI*2)
                        sr.torus.rotation.z=sr.torus.rotation.z-Math.PI*2;
                    break;
                }
                case SphereRingCode.rotationX:{
                    sr.torus.rotation.x=Math.sin(time/1000)/16+Math.PI/2;
                    break;
                }
                case SphereRingCode.rotationY:{
                    sr.torus.rotation.y=Math.cos(time/1000)/8;
                    break;
                }
                case "StarWar":{
                    sr.mesh.lookAt(sr.o3d.position);
                    break;
                }

            }
        })

    }
    function animate(time){
        requestAnimationFrame(animate);

        for(let a in SphereRings){
            let sr=SphereRings[a];
            if(sr.isSphereRing){
                if(sr.codes.length)
                    doCode(sr,time);
            }
        }
    }

    function removeById(id){
        let sr=SphereRings[id];
        if(sr){
            if(sr.isSphereRing)
                sr.destroy();
        }
    }

    function removeAll(){
        for(let a in SphereRings){
            if(SphereRings[a].isSphereRing)
                SphereRings[a].destroy();
        }

        SphereRings.length=0;
    }

    animate()



    return{
        SphereRing:SphereRing,
        SphereRingStarWar:SphereRingStarWar,

        SphereRings:SphereRings,
        SphereRingCode:SphereRingCode,

        removeById:removeById,
        removeAll:removeAll
    }

})();