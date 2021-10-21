let BasicAnimate=(()=>{

    let animateGroup= {};


    class BasicAnimate{
        constructor(attr,assign,options) {

            this.id=THREE.MathUtils.generateUUID();

            this.options=options?options:{};

            this.attr=attr;
            this.assign=assign;

            let time=options.time?options.time:1000;
            let yoyo=options.yoyo?options.yoyo:false;
            let autoDestroy=options.autoDestroy?options.autoDestroy:false;
            let autoStart=options.autoStart||(options.autoStart==false)?options.autoStart:true;
            let delay=options.delay?options.delay:0;
            let repeat=options.repeat?options.repeat:0;
            //let easing=options.easing?options.easing:null;

            let tg=new TWEEN.Group();
            animateGroup[this.id]=tg;

            this.tween=new TWEEN.Tween(attr,tg).to(assign,time);

            if(delay)
                this.tween.delay(delay);
            if(repeat)
                this.tween.repeat(repeat);
            if(yoyo)
                this.tween.repeat(Infinity).yoyo(true);
            if(autoDestroy){
                this.tween.onComplete(()=>{
                    this.destroy();
                })
            }
            if(options.onUpdate){
                this.tween.onUpdate((obj)=>{
                    options.onUpdate(obj);
                })
            }
            if(options.easing){
                this.tween.easing(options.easing);
            }
            if(autoStart)
                this.tween.start();


            //this.o3d.userData["animate_"+this.id]=new TWEEN.Tween(o3d[attrName],tg).to()
        }

        play(){
            this.tween.start();
        }
        pause(){
            this.tween.pause();
        }

        destroy(){
            let id=this.id
            let tg = animateGroup[id];

            if(tg){
                tg.removeAll();
                animateGroup[id]=null;
                delete animateGroup[id];
            }

            for(let a in this){
                this[a]=null;
                delete this[a];
            }
        }
    }

    function animate(time){
        requestAnimationFrame(animate);

        for(let a in animateGroup){
            animateGroup[a].update(time);
        }
    }

    animate()

    return {
        BasicAnimate:BasicAnimate
    }

})();