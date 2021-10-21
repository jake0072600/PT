//此类用于实现一个或一组相同3D物体沿SplineCurve线路进行列表移动

//options
//points:用户生成CatmullRomCurve3的关键点数组
//mesh:用于移动的object3d
//animations:mesh上可能有的帧动画
//count:出现多少个mesh，默认1
//pointCount:SplineCurve中取得的点数，默认50
//speed:移动速度，默认0.8
//scale:mesh的放大缩小，默认1.0



let O3DMovementList=(function () {


    class O3DMovementList {
        constructor(options) {
            this.pointCount=options.pointCount?options.pointCount:100;
            this.count=options.count?Math.abs(options.count):1;
            if(this.count>this.pointCount) return;

            this.basicCount=Math.floor(this.pointCount/this.count);

            //--todo 有关randomRotation的处理，次版本仅简单处理为y随机，但未来可能遇到更复杂场景
            this.randomRotation=options.randomRotation?options.randomRotation:false;

            this.delay=options.delay?options.delay:0;
            this.yoyo=options.yoyo?options.yoyo:0;
            this.willDelay=0;
            this.delaying=false;
            this.completeVisible=options.completeVisible?options.completeVisible:false;
            this.completeNoRotation=options.completeNoRotation?options.completeNoRotation:false;

            this.onComplete=options.onComplete?options.onComplete:null;
            //this.onYoYoComplete=options.onYoYoComplete?options.onYoYoComplete:null;

            this.basicPoints=options.points;
            this.mesh=options.mesh;
            this.animations=options.animations?options.animations:[];
            this.rs=options.speed?Math.abs(options.speed):0.8;
            this.scale=options.scale?options.scale:1;

            this.list=new THREE.Group();
            this.moveIndex=0;
            this.listIndex=0;

            if(this.animations.length)
            {
                this.mixer = new THREE.AnimationMixer( this.list );
            }

            this.clock=new THREE.Clock();

            this.curve = new THREE.CatmullRomCurve3(this.basicPoints,false,"catmullrom",0.18);
            //this.curveLength=this.curve.getLength();
            let c = (this.curve.getLength()/this.pointCount)/(10*this.rs)/4;
            this.bd=c;
            //console.log(this.curve.getLength());
            //let curve = new Polyline3(this.basicPoints);
            //console.log(curve);

            this.points=this.curve.getSpacedPoints(this.pointCount);

            this.animateObject=null;

            this.paused=false;

            this._initList();
            this._animate();
        }

        _initList(){
            for(let i=0;i<this.count;i++){
                let mm=this.mesh.clone();
                if(this.randomRotation)
                    mm.rotation.set(0,Math.PI/2*Math.random(),0)

                let m=new THREE.Group();
                m.add(mm);
                m.userData.rotationMatrix=new THREE.Matrix4();
                m.userData.targetQuaternion=new THREE.Quaternion();
                m.userData.index=i;
                this._resetMesh(m);
                m.visible=i===0?true:false;
                m.scale.set(this.scale,this.scale,this.scale);

                this.list.add(m);

                if(this.mixer)
                    this.mixer.clipAction( this.animations[ 0 ], m ).play();
            }
        }
        _resetMesh(m){
            m.userData.nextPointIndex=1;
            m.position.copy(this.points[0]);
            m.lookAt(this.points[1]);
            let q=m.quaternion;
            m.userData.targetQuaternion.set(m.x,m.y,m.z,m.w);
            //console.log(m.rotation,new THREE.Quaternion().setFromEuler(m.rotation),m.quaternion)
            this._nextQuaternion(m);
        }
        _nextQuaternion(m){
            let rotationMatrix=m.userData.rotationMatrix;
            let targetQuaternion=m.userData.targetQuaternion;
            rotationMatrix.lookAt(this.points[m.userData.nextPointIndex],this.points[m.userData.nextPointIndex-1],m.up);
            targetQuaternion.setFromRotationMatrix(rotationMatrix);
        }

        _resetAllMesh(){
            let cs=this.list.children
            for(let i=0;i<cs.length;i++){
                let m=cs[i];
                this._resetMesh(m);
                m.userData.nextOnce=false;
                //m.visible=this.completeVisible;
            }

        }

        _get1D(v){
            if(v.x!==0){
                v.x=v.x>0?1:-1;
            }
            if(v.y!==0){
                v.y=v.y>0?1:-1;
            }
            if(v.z!==0){
                v.z=v.z>0?1:-1;
            }
            return v;
        }
        _animate(){
            let step=()=> {
                this.animateObject = window.requestAnimationFrame(step);

                let delta = this.clock.getDelta();

                let speed = this.rs * delta;

                if(!this.delaying){
                    for(let i=this.moveIndex;i<=this.listIndex;i++){
                        let m=this.list.children[i];
                        if(!m) continue;
                        m.visible=true;
                        let nowP = this.points[m.userData.nextPointIndex-1];
                        let nextP = this.points[m.userData.nextPointIndex];
                        let d = nextP.clone().sub(nowP);
                        m.position.add(d.clone().multiplyScalar(speed*8));
                        if(! m.quaternion.equals( m.userData.targetQuaternion )){
                            m.quaternion.rotateTowards( m.userData.targetQuaternion, speed*3.8 );
                        }

                        if((m.position.clone().sub(nowP)).length()>=d.length()){
                            m.position.copy(nextP);
                            m.userData.nextPointIndex++;
                            if(m.userData.nextPointIndex>=this.points.length){
                                if(!this.yoyo)
                                    this._resetMesh(m);
                                if(this.delay){
                                    this.moveIndex++
                                    m.visible=this.completeVisible;
                                    m.userData.nextOnce=false;
                                }
                                if(m.userData.index+1>=this.count){
                                    if(this.delay)
                                        this.delaying=true;

                                    if(this.yoyo){
                                        this.points=this.points.reverse();
                                        if(!this.completeNoRotation)
                                            this._resetAllMesh();
                                        this.listIndex=0;
                                        this.moveIndex=0;
                                    }
                                    if(this.onComplete) this.onComplete({list:this.list});
                                }

                            }else{
                                this._nextQuaternion(m);
                                //m.lookAt(this.points[m.userData.nextPointIndex]);
                            }

                            if(m.userData.nextPointIndex>=this.basicCount&&!m.userData.nextOnce){
                                m.userData.nextOnce=true
                                this.listIndex++;
                            }

                        }

                    }
                }else{
                    this.willDelay+=delta;
                    if(this.willDelay>=this.delay){
                        this.delaying=false;
                        this.willDelay=0;
                        this.listIndex=0;
                        this.moveIndex=0;
                        if(this.yoyo&&this.completeNoRotation){
                            this._resetAllMesh();
                        }
                    }

                }


                if ( this.mixer ) this.mixer.update( delta );
            }

            window.requestAnimationFrame(step);
        }

        setScale(scale){
            if(scale)
                this.scale=scale;

            let lc = this.list.children;
            for(let i=0;i<lc.length;i++){
                lc[i].scale.set(this.scale,this.scale,this.scale);
            }
        }
    }

    Object.assign( O3DMovementList.prototype, THREE.EventDispatcher.prototype);


    return O3DMovementList;
})()

