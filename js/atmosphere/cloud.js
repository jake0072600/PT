let ASCloud=(()=>{

    let tl=new THREE.TextureLoader();

    class ASCloud{
        constructor(o3d,options) {

            let o=options?options:{};

            this.options=o;

            this.radius=o.radius;

            this.width=o.width;
            this.height=o.height;

            this.urls=o.urls;

            this.textures=[];

            this._loaded=0;

            this.o3d=o3d;

            this.maxParticleCount=o.maxParticleCount?o.maxParticleCount:100;

            this.group=new THREE.Group();

            this.o3d.add(this.group);

            this._load(()=>{
                this._init();
            });

        }

        _load(callback){
            this.urls.map((u,i)=>{
                this.textures[i]={t:tl.load(u,()=>{
                    this._oneLoaded(callback)
                })};
            });
        }

        _oneLoaded(callback){
            this._loaded++;

            if(this._loaded>=this.urls.length){
                if(callback) callback();
            }

        }

        _init(){

            let r=this.radius;

            let geo=new THREE.PlaneBufferGeometry(this.width,this.height);

            let ts=this.textures;

            ts.map((t)=>{
                //t.geo=new THREE.PlaneBufferGeometry()
                //console.log(t.t.image.width,t.t.image.height);
                t.mat=new THREE.MeshBasicMaterial({map:t.t});
                t.mat.transparent=true;
                t.mat.alphaTest=0.1;
                t.mat.side=THREE.DoubleSide;
            });
            //console.log(this.textures);
            //let sprite=new THREE.Sprite()

            for ( let i = 0; i < this.maxParticleCount; i ++ ) {

                const x = (r/2+Math.random() * r)*(Math.ceil(Math.random()*2)%2?1:-1);
                const y = (Math.random() * r*5)*(Math.ceil(Math.random()*2)%2?1:-1);
                const z = (Math.random() * r*4)*(Math.ceil(Math.random()*2)%2?1:-1);

                let m=new THREE.Mesh(geo,ts[Math.floor(ts.length*Math.random())].mat);
                m.position.set(x,y,z);
                m.rotation.z=Math.PI/2;
                m.rotation.x=Math.PI/2;

                this.group.add(m);
            }



        }

        update(){
            if(!this.maxParticleCount) return ;

            this.group.children.map((gc)=>{
                gc.position.y=gc.position.y+0.1>this.radius?-this.radius*5:gc.position.y+0.1;
            })
        }

        destroy(){
            this.group.children.map((gc)=>{
                gc.geometry.dispose();
                gc.material.dispose();
            });

            while (this.group.children.length)
                this.group.remove(this.group.children[0]);

            this.o3d.remove(this.group);

            for(let a in this){
                delete this[a];
            }


        }
    }

    return{
        ASCloud:ASCloud
    }

})()