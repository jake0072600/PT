let FlyLine=(()=>{

    let FlyLines={length:0};
    TWEEN.FlyLines={};

    let color=new THREE.Color();
    let tl=new THREE.TextureLoader();

    let nti=new Image();
    nti.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NDQzODFjYi1iYmQ5LTNmNDktOGUyNS1iYjgxNTBkMjdhNzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUVCQ0ZDMkFGOEJCMTFFQTgzMDFEMDNBMkQ0RDdCREMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUVCQ0ZDMjlGOEJCMTFFQTgzMDFEMDNBMkQ0RDdCREMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVkZDFlZTNmLTk0ZmYtY2U0ZS05ZTQxLTZiMWJiYTcyZjAxMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDQzODFjYi1iYmQ5LTNmNDktOGUyNS1iYjgxNTBkMjdhNzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5cccgkAAAHhklEQVR42uzbwW3DQBAEQcpw/inTVgT66MHpqwKUgF6N2ePrvu8LADjLj78AAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAX/L7/3v5GwDAAgAACAAAoMYJAAAsAACABQAAsAAAAAIAABjlBAAAFgAAwAIAAFgAAAALAABgAQAALAAAgAUAALAAAAAWAADAAgAAWAAAAAsAAGABAAAsAACABQAAEAAAwOUEAAACAAA4gxMAAFgAAAALAABgAQAABAAAMMoJAAAsAACABQAAsAAAAAIAABjlBAAAFgAAQAAAAElOAABgAQAALAAAgAUAALAAAAAWAABAAAAAAgAAeA5vAADAAgAACAAAIMkJAAAsAACAAAAABAAA0OANAABYAAAAAQAAJDkBAIAFAAAQAABAkhMAAFgAAAABAAAIAABAAAAAozwCBAALAAAgAAAAAQAANHgDAAAWAABAAAAASU4AAGABAAAEAAAgAAAAAQAAjPIIEAAsAACAAAAABAAAIAAAgFEeAQKABQAAEAAAgAAAABq8AQAACwAAIAAAAAEAADR4AwAAFgAAQAAAAAIAABAAAIAAAABW+AoAACwAAIAAAAAEAAAgAACAUR4BAoAFAAAQAABAkhMAAFgAAAABAAAIAABAAAAAAgAAWOErAACwAAAAAgAAEAAAgAAAAEZ5BAgAFgAAwAIAAFgAAAABAAAIAABAAAAAj+URIABYAAAAAQAACAAAoMEbAACwAAAAAgAAEAAAQIM3AABgAQAALAAAgAUAABAAAIAAAABWeAMAABYAAEAAAAACAABo8AYAACwAAIAAAACSnAAAwAIAAAgAACDJCQAALAAAgAUAALAAAAACAAAY5QQAABYAAEAAAABJTgAAYAEAACwAAIAFAAAQAADAKCcAALAAAAAWAADAAgAACAAAYJQTAAAIAADgBE4AAGABAAAsAACABQAAsAAAABYAAMACAABYAAAACwAAYAEAACwAAIAFAACwAAAAFgAAQAAAAB85AQCABQAAsAAAABYAAEAAAACjnAAAwAIAAFgAAAALAAAgAAAAAQAACAAA4LHejwBvfwMAWAAAAAsAAGABAAAEAACwxwkAACwAAIAFAACwAAAAAgAAGOUEAAAWAADAAgAAWAAAAAsAAGABAAAsAACABQAAsAAAABYAAMACAABYAAAACwAAYAEAAAQAAPCREwAACAAA4AROAABgAQAALAAAgAUAABAAAMAoJwAAsAAAABYAAMACAAAIAABglBMAAFgAAAABAAAkOQEAgAUAALAAAAAWAABAAAAAo5wAAMACAAAIAAAgyQkAACwAAIAAAAAEAADQ4A0AAFgAAAABAAAIAACgwRsAALAAAAAWAADAAgAACAAAQAAAACu8AQAACwAAIAAAAAEAADR4AwAAFgAAQAAAAAIAABAAAMAojwABwAIAAFgAAAALAAAgAAAAAQAACAAA4LE8AgQACwAAIAAAAAEAAAgAAEAAAAArfAUAABYAAEAAAABJTgAAYAEAAAQAACAAAAABAACM8ggQACwAAIAAAAAEAAAgAAAAAQAArPAVAABYAAAAAQAACAAAoMEbAACwAAAAAgAAEAAAQIM3AABgAQAABAAAIAAAAAEAAIzyCBAALAAAgAAAAAQAACAAAIBRHgECgAUAABAAAECSEwAAWAAAAAEAAAgAAKDBGwAAsAAAAAIAABAAAIAAAABGeQQIABYAAEAAAABJTgAAYAEAAAQAAJDkBAAAFgAAQAAAAAIAAGjwBgAALAAAgAAAAJKcAADAAgAACAAAQAAAAA3eAACABQAAsAAAABYAAMACAABYAAAAAQAAPJYTAABYAAAAAQAAJDkBAIAFAACwAAAAFgAAQAAAAKOcAADAAgAAWAAAAAsAACAAAIBRTgAAIAAAgBM4AQCABQAAsAAAABYAAMACAABYAAAACwAAYAEAACwAAIAFAACwAAAAFgAAwAIAAFgAAAALAABgAQAABAAAcDkBAIAFAACwAAAAFgAAQAAAALOcAADAAgAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAMC3/AkwAIUKguWz6wIsAAAAAElFTkSuQmCC";
    let nt=new THREE.Texture(nti);

    class FlyLine{

        constructor(startPoint,endPoint,o3d,options) {

            this.options=options?options:{}

            this.id=options.id?options.id:getRandomId();

            if(FlyLines[this.id]) return ;

            this.startPoint=startPoint;
            this.endPoint=endPoint;
            this.o3d=o3d;

            if(!this.startPoint.distanceTo(this.endPoint)) return ;
            if(!this.o3d) return ;

            this.height=options.height?options.height:this.startPoint.distanceTo(this.endPoint)/2
            this.isFlyLine=true;

            this.life=options.life?(options.life+1):Infinity;

            let tg=new TWEEN.Group();
            TWEEN.FlyLines[this.id]=tg;
            this.tg=tg;

            this.img=options.img?tl.load(options.img):nt.clone();
            this.img.offset.x=-1;

            this.color=options.color?options.color:0xff0000;

            this.radius=options.radius?options.radius:1;

            this.curve = this._getSCL2(this.startPoint,this.endPoint);
            this.mesh=this._getMesh();

            this.o3d.add(this.mesh);

            FlyLines[this.id]=this;
            FlyLines.length++;

        }

        _getSCL2(){
            let p1=this.startPoint;
            let p2=this.endPoint;

            let p3=p1.clone().add(p2.clone().sub(p1).multiplyScalar(1/2));
            p3.y=this.height

            console.log(p1,p3,p2);
            let curve=new THREE.CatmullRomCurve3([p1,p3,p2]);

            return curve;
        }

        _getMesh(){
            let curve=this.curve;

            let geometry = new THREE.TubeBufferGeometry( curve,64,this.radius, 8, false );
            let material = new THREE.MeshBasicMaterial({color:this.color,map:this.img});
            material.alphaTest=0.1;
            material.transparent=true;

            let mesh = new THREE.Mesh( geometry, material );

            return mesh;
        }

        update(){
            let scl = this;
            let ltt1 = scl.mesh.material.map;

            let s=Math.floor(ltt1.offset.x*100);
            //console.log(s);
            if(s===-100){
                scl.life--;
                if(scl.life<=0)
                    scl.destroy();
            }

            ltt1.offset.x-=0.01;
            if(ltt1.offset.x<=-1)
                ltt1.offset.x=1;
        }

        destroy(){
            let id = this.id;

            if(this.mesh.material.map)
                this.mesh.material.map.dispose();
            this.mesh.material.dispose();
            this.mesh.geometry.dispose();
            this.o3d.remove(this.mesh);

            //this.objMesh.remove(this.o3d);

            delete TWEEN.FlyLines[id];

            delete FlyLines[id];
            FlyLines.length--;

            for(let a in this){
                delete this[a];
            }
        }

    }

    class FlyBallLine extends FlyLine{
        constructor(startPoint,endPoint,o3d,options) {

            super(startPoint,endPoint,o3d,options);

            if(!this.startPoint) return ;

            let ball=new THREE.Mesh(new THREE.SphereBufferGeometry(this.radius*1.5,10,10),new THREE.MeshBasicMaterial({color:this.color}));
            ball.position.copy(this.startPoint);
            this.o3d.add(ball);
            this.ball=ball;

            let points=this.curve.getPoints(20);
            this.points=points;

            let ts=[];

            for(let i=0;i<points.length-1;i++){
                //let p=points[i];
                let p2=points[i+1];
                //let duration=(i===(points.length-1)?0:400)
                let t=new TWEEN.Tween(ball.position,this.tg).to({x:p2.x,y:p2.y,z:p2.z},200);
                //t.repeat(Infinity);
                ts.push(t);
            }
            let p0=points[0];
            let t=new TWEEN.Tween(ball.position,this.tg).to({x:p0.x,y:p0.y,z:p0.z},1).onStart(()=>{
                ball.position.set(p0.x,p0.y,p0.z);
            });
            ts.push(t);
            for(let i=0;i<ts.length-1;i++){
                ts[i].chain(ts[i+1]);
            }
            ts[ts.length-1].chain(ts[0]);

            ball.userData.tween=ts[0];
            ball.userData.tween.start();

        }

        destroy(){
            let id=this.id;

            let tg = TWEEN.FlyLines[id];
            if(tg){
                tg.removeAll();
            }

            this.ball.userData.tween.stop();
            this.ball.userData.tween=null;
            delete this.ball.userData.tween;

            this.ball.material.dispose();
            this.ball.geometry.dispose();

            this.o3d.remove(this.ball);

            super.destroy();
        }
    }

    function animate(time){
        requestAnimationFrame(animate);

        //console.log(clock.getDelta());

        if(TWEEN){
            if(TWEEN.FlyLines){
                let tfls=TWEEN.FlyLines;
                for(let a in tfls){
                    tfls[a].update(time);
                }
            }
        }

        for(let a in FlyLines){
            if(FlyLines[a].isFlyLine){

                FlyLines[a].update(time)

            }
        }
    }

    function getRandomId(){
        return THREE.Math.generateUUID();
    }

    animate();

    function removeById(id){
        let mc=FlyLines[id];
        if(mc){
            if(mc.isFlyLine)
                mc.destroy();
        }
    }

    function removeAll(){
        for(let a in FlyLines){
            if(FlyLines[a].isFlyLine)
                FlyLines[a].destroy();
        }

        MagicCircles.length=0;
    }

    return{
        FlyLines:FlyLines,

        removeAll:removeAll,
        removeById:removeById,

        FlyLine:FlyLine,
        FlyBallLine:FlyBallLine
    }


})();