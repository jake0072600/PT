let Water=(()=>{

    let waterObj;

    class Water{
        constructor(bs) {

            this.bs=bs;

            this._initBasic();
        }

        _initBasic(){
            let bs=this.bs;

            let sun = new THREE.Vector3();

            const waterGeometry = new THREE.PlaneGeometry( 1000, 1000 );

            let water = new THREE.Water(
                waterGeometry,
                {
                    textureWidth: 256,
                    textureHeight: 256,
                    waterNormals: new THREE.TextureLoader().load( './js/atmosphere/water/waternormals.jpg', function ( texture ) {

                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                    } ),
                    alpha: 1.0,
                    sunDirection: new THREE.Vector3(),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 1.7,
                    fog: bs.o3d.scene.fog !== undefined
                }
            );

            water.rotation.x = - Math.PI / 2;
            water.rotation.y = 0.5;
            water.position.y=-5;

            bs.addModel(water);

            const sky = new THREE.Sky();
            sky.scale.setScalar( 1000 );
            bs.addModel( sky );

            const skyUniforms = sky.material.uniforms;

            skyUniforms[ 'turbidity' ].value = 10;
            skyUniforms[ 'rayleigh' ].value = 2;
            skyUniforms[ 'mieCoefficient' ].value = 0.005;
            skyUniforms[ 'mieDirectionalG' ].value = 0.8;

            this.parameters = {
                inclination: 0.49,
                azimuth: 0.205
            };

            const waterUniforms = water.material.uniforms;
            /*        waterUniforms.size.value=0.1;
                    waterUniforms.distortionScale.value=0.1;*/


            this.pmremGenerator = new THREE.PMREMGenerator( bs.o3d.renderer );

            this.sun=sun;
            this.sky=sky;
            this.water=water;

            this.updateSun();

            waterObj=this;

        }

        updateSun() {

            let sun=this.sun;
            let sky=this.sky;

            const theta = Math.PI * ( this.parameters.inclination - 0.5 );
            const phi = 2 * Math.PI * ( this.parameters.azimuth - 0.5 );

            sun.x = Math.cos( phi );
            sun.y = Math.sin( phi ) * Math.sin( theta );
            sun.z = Math.sin( phi ) * Math.cos( theta );

            this.sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
            this.water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

            this.bs.o3d.scene.environment = this.pmremGenerator.fromScene( sky ).texture;

        }

        update(){
            this.water.material.uniforms['time'].value+=1.0/120.0;
        }

        destroy(){
            waterObj=null;
            this.bs.o3d.scene.environment=null;

            let w=this.water;

            w.material.uniforms.normalSampler.value.dispose();
            w.material.uniforms.normalSampler.value=null;
            w.material.uniforms.mirrorSampler.value.dispose();
            w.material.uniforms.mirrorSampler.value=null;
            w.material.dispose();
            w.geometry.dispose();

            this.bs.o3d.models.remove(w);
            this.bs.o3d.models.remove(this.sky);

            for(let a in this){
                delete this[a];
            }

        }
    }

    function animate(time){
        requestAnimationFrame(animate);

        if(waterObj){

            waterObj.update();

        }

    }

    animate();

    return{
        Water:Water
    }

})()