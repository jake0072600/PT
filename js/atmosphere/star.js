let Star=(()=>{

    class Star1{
        constructor(o3d,options){
            let o=options?options:{};

            this.o3d=o3d;
            this.radius=o.radius?o.radius:15;
            this.color=o.color?o.color:0xffffff;

            this.randomColor=o.randomColor?o.randomColor:false;

            this.maxParticleCount=o.maxParticleCount?o.maxParticleCount:1000;

            console.log(this.maxParticleCount);

            this.group=new THREE.Group();
            //this.group.position.x=-1;

            this.o3d.add(this.group);

            this._init();
        }

        _init(){

            let r=this.radius;

            this.pm=new THREE.PointsMaterial( {
                color: this.color,
                size: 1.5,
                blending: THREE.AdditiveBlending,
                transparent: true,
                sizeAttenuation: false,
                vertexColors:true
            } );

            this.particles = new THREE.BufferGeometry();
            this.particlePositions = new Float32Array( this.maxParticleCount * 3 );

            let color=new THREE.Color();
            var colors=[];

            for ( let i = 0; i < this.maxParticleCount; i ++ ) {

                const x = (r/10+Math.random() * r)*(Math.ceil(Math.random()*2)%2?1:-1);
                const y = (Math.random() * r)*(Math.ceil(Math.random()*2)%2?1:-1);
                const z = (Math.random() * r)*(Math.ceil(Math.random()*2)%2?1:-1);

                this.particlePositions[ i * 3 ] = x;
                this.particlePositions[ i * 3 + 1 ] = y;
                this.particlePositions[ i * 3 + 2 ] = z;

                const vx = ( x / r ) + 0.5;
                const vy = ( y / r ) + 0.5;
                const vz = ( z / r ) + 0.5;

                color.setRGB( vx, vy, vz );

                colors.push( color.r, color.g, color.b );

            }

            this.particles.setDrawRange( 0, this.maxParticleCount );
            this.particles.setAttribute( 'position', new THREE.BufferAttribute( this.particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
            this.particles.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

            // create the particle system
            this.pointCloud = new THREE.Points( this.particles, this.pm );
            this.group.add( this.pointCloud );
        }

        update(){
            if(!this.maxParticleCount) return ;

            for ( let i = 0; i < this.maxParticleCount; i ++ ) {


                //this.particlePositions[ i * 3 ] += particleData.velocity.x;
                this.particlePositions[ i * 3 + 1 ] = this.particlePositions[ i * 3 + 1 ]+0.1>this.radius?-this.radius:this.particlePositions[ i * 3 + 1 ]+0.1;
                //this.particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

            }

            this.pointCloud.geometry.attributes.position.needsUpdate = true;


        }

        destroy(){
            this.pointCloud.geometry.dispose();
            this.pointCloud.material.dispose();

            this.group.remove(this.pointCloud);

            this.o3d.remove(this.group);

            this.o3d=null;
            this.maxParticleCount=0;

            for(let a in this){
                delete this[a];
            }
        }
    }

    return{
        Star1:Star1
    }

})()