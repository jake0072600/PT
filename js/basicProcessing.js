//用于简单管理processing类，
//依赖于
//EffectComposer
//RenderPass

//……弃用，并入basicStage

let BasicProcessing=(function () {

    class BasicProcessing{
        constructor(bs) {
            this.bs=bs;
            let o3d=bs.o3d;
            this.renderer=o3d.renderer;
            this.scene=o3d.scene;
            this.camera=o3d.camera;

            this.pass=[];

            this.renderPass=new THREE.RenderPass(this.scene,this.camera);
            this.composer=new THREE.EffectComposer(this.renderer);

            this.composer.addPass(this.renderPass);
        }

        addPass(pass){

        }
        setPass(pass){

        }
    }

    return BasicProcessing;

})()
