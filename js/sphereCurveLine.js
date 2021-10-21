//SphereCurveLine
//用于绘制球面连线效果的类库
//依赖于
//three.js
//tween.js

let SphereCurveLine = (function () {

    let SphereCurveInternets={length:0};
    let SphereCurveLines={length:0};
    TWEEN.SphereCurveLines={}

    let pointCount=100;
    let subdivisions=6;

    let color=new THREE.Color();

    let tl=new THREE.TextureLoader();

    //--todo 默认贴图未起作用，之后调查
    let nti=new Image();
    nti.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NDQzODFjYi1iYmQ5LTNmNDktOGUyNS1iYjgxNTBkMjdhNzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUVCQ0ZDMkFGOEJCMTFFQTgzMDFEMDNBMkQ0RDdCREMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUVCQ0ZDMjlGOEJCMTFFQTgzMDFEMDNBMkQ0RDdCREMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmVkZDFlZTNmLTk0ZmYtY2U0ZS05ZTQxLTZiMWJiYTcyZjAxMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDQzODFjYi1iYmQ5LTNmNDktOGUyNS1iYjgxNTBkMjdhNzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5cccgkAAAHhklEQVR42uzbwW3DQBAEQcpw/inTVgT66MHpqwKUgF6N2ePrvu8LADjLj78AAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAX/L7/3v5GwDAAgAACAAAoMYJAAAsAACABQAAsAAAAAIAABjlBAAAFgAAwAIAAFgAAAALAABgAQAALAAAgAUAALAAAAAWAADAAgAAWAAAAAsAAGABAAAsAACABQAAEAAAwOUEAAACAAA4gxMAAFgAAAALAABgAQAABAAAMMoJAAAsAACABQAAsAAAAAIAABjlBAAAFgAAQAAAAElOAABgAQAALAAAgAUAALAAAAAWAABAAAAAAgAAeA5vAADAAgAACAAAIMkJAAAsAACAAAAABAAA0OANAABYAAAAAQAAJDkBAIAFAAAQAABAkhMAAFgAAAABAAAIAABAAAAAozwCBAALAAAgAAAAAQAANHgDAAAWAABAAAAASU4AAGABAAAEAAAgAAAAAQAAjPIIEAAsAACAAAAABAAAIAAAgFEeAQKABQAAEAAAgAAAABq8AQAACwAAIAAAAAEAADR4AwAAFgAAQAAAAAIAABAAAIAAAABW+AoAACwAAIAAAAAEAAAgAACAUR4BAoAFAAAQAABAkhMAAFgAAAABAAAIAABAAAAAAgAAWOErAACwAAAAAgAAEAAAgAAAAEZ5BAgAFgAAwAIAAFgAAAABAAAIAABAAAAAj+URIABYAAAAAQAACAAAoMEbAACwAAAAAgAAEAAAQIM3AABgAQAALAAAgAUAABAAAIAAAABWeAMAABYAAEAAAAACAABo8AYAACwAAIAAAACSnAAAwAIAAAgAACDJCQAALAAAgAUAALAAAAACAAAY5QQAABYAAEAAAABJTgAAYAEAACwAAIAFAAAQAADAKCcAALAAAAAWAADAAgAACAAAYJQTAAAIAADgBE4AAGABAAAsAACABQAAsAAAABYAAMACAABYAAAACwAAYAEAACwAAIAFAACwAAAAFgAAQAAAAB85AQCABQAAsAAAABYAAEAAAACjnAAAwAIAAFgAAAALAAAgAAAAAQAACAAA4LHejwBvfwMAWAAAAAsAAGABAAAEAACwxwkAACwAAIAFAACwAAAAAgAAGOUEAAAWAADAAgAAWAAAAAsAAGABAAAsAACABQAAsAAAABYAAMACAABYAAAACwAAYAEAAAQAAPCREwAACAAA4AROAABgAQAALAAAgAUAABAAAMAoJwAAsAAAABYAAMACAAAIAABglBMAAFgAAAABAAAkOQEAgAUAALAAAAAWAABAAAAAo5wAAMACAAAIAAAgyQkAACwAAIAAAAAEAADQ4A0AAFgAAAABAAAIAACgwRsAALAAAAAWAADAAgAACAAAQAAAACu8AQAACwAAIAAAAAEAADR4AwAAFgAAQAAAAAIAABAAAMAojwABwAIAAFgAAAALAAAgAAAAAQAACAAA4LE8AgQACwAAIAAAAAEAAAgAAEAAAAArfAUAABYAAEAAAABJTgAAYAEAAAQAACAAAAABAACM8ggQACwAAIAAAAAEAAAgAAAAAQAArPAVAABYAAAAAQAACAAAoMEbAACwAAAAAgAAEAAAQIM3AABgAQAABAAAIAAAAAEAAIzyCBAALAAAgAAAAAQAACAAAIBRHgECgAUAABAAAECSEwAAWAAAAAEAAAgAAKDBGwAAsAAAAAIAABAAAIAAAABGeQQIABYAAEAAAABJTgAAYAEAAAQAAJDkBAAAFgAAQAAAAAIAAGjwBgAALAAAgAAAAJKcAADAAgAACAAAQAAAAA3eAACABQAAsAAAABYAAMACAABYAAAAAQAAPJYTAABYAAAAAQAAJDkBAIAFAACwAAAAFgAAQAAAAKOcAADAAgAAWAAAAAsAACAAAIBRTgAAIAAAgBM4AQCABQAAsAAAABYAAMACAABYAAAACwAAYAEAACwAAIAFAACwAAAAFgAAwAIAAFgAAAALAABgAQAABAAAcDkBAIAFAACwAAAAFgAAQAAAALOcAADAAgAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAMC3/AkwAIUKguWz6wIsAAAAAElFTkSuQmCC";
    let nt=new THREE.Texture(nti);
    //nt.offset.y=-1;
    //nt.rotation=3.14/2;

    let clock=new THREE.Clock();

    let rotationMatrix = new THREE.Matrix4();

    //连线
    //id:可能传入的id或name
    //startPoint:开始点
    //endPoint:结束点
    //objMesh:绘制和依附的mesh对象，必须包含geometry
    //img:连线用贴图路径
    //color:颜色
    class SphereCurveLine{
        constructor(options) {
            this.id=options.id?options.id:getRandomId();

            if(SphereCurveLines[this.id]) return ;

            if(!options.startPoint.distanceTo(options.endPoint)) return ;
            if(!options.objMesh) return ;
            if(!options.objMesh.geometry) return

            this.isSphereCurveLine=true;

            this.startPoint=options.startPoint.multiplyScalar(1);
            this.endPoint=options.endPoint.multiplyScalar(1);
            this.center=new THREE.Vector3();
            //this.scene=options.scene;
            this.objMesh=options.objMesh;
            if(!this.objMesh.geometry.boundingSphere)
                this.objMesh.geometry.computeBoundingSphere();

            this.life=options.life?(options.life+1):Infinity;

            let tg=new TWEEN.Group();
            TWEEN.SphereCurveLines[this.id]=tg;
            this.tg=tg;


            this.img=options.img?tl.load(options.img):nt.clone();
            //this.img.rotation=-Math.PI/2;
            this.img.offset.x=-1;

            //this.q1=q1;

            let r=this.objMesh.geometry.boundingSphere.radius;
            this.radius=Math.sqrt(r*r+r*r);

            this.color=options.color?options.color:0xff0000;

            //this.curve = this.getSCL5();
            if(options.closeTo&&options.LAL1&&options.LAL2){
                this.curve=getSCL1(options.LAL1,options.LAL2)
                this.mesh=this.getMesh();
            }
            else{
                //this.curve =getSCL1(this.startPoint,this.endPoint,this.center,1);
                this.curve = getSCL(this.startPoint,this.endPoint);
                this.mesh = this.getMesh();
            }



            this.o3d=new THREE.Group();
            this.o3d.add(this.mesh);

            this.objMesh.add(this.o3d);

            SphereCurveLines[this.id]=this;
            SphereCurveLines.length++;
        }

        /*        getQ1Q2(){
                    let q1=new THREE.Quaternion();
                    rotationMatrix.lookAt(this.center,this.startPoint,new THREE.Vector3(0,0,1));
                    q1.setFromRotationMatrix(rotationMatrix);
                    let r1=new THREE.Euler();
                    r1.setFromQuaternion(q1);

                    let q2=new THREE.Quaternion();
                    rotationMatrix.lookAt(this.center,this.endPoint,new THREE.Vector3(0,0,1));
                    q2.setFromRotationMatrix(rotationMatrix);
                    let r2=new THREE.Euler();
                    r2.setFromQuaternion(q2);

                    let r=this.radius*0.002;
                    let sm=new THREE.Mesh(new THREE.CylinderBufferGeometry(r,r,0,32),new THREE.MeshBasicMaterial({color:this.color,transparent:true,opacity:0.8}));
                    let em=new THREE.Mesh(new THREE.CylinderBufferGeometry(r,r,0,32),new THREE.MeshBasicMaterial({color:this.color,transparent:true,opacity:0.8}));

                    //console.log(this.startPoint,this.startPoint.clone().multiplyScalar(2));

                    sm.position.copy(this.startPoint.clone().multiplyScalar(2));
                    em.position.copy(this.endPoint.clone().multiplyScalar(2));
                    sm.rotation.copy(r1);
                    em.rotation.copy(r2);

                    return{sm:sm,em:em}
                }*/

        /*        getSCL1(){
                    let p1=this.startPoint;
                    let p2=this.endPoint;
                    let c=this.center;
                    let r=this.radius;

                    let a=p1.angleTo(p2);
                    console.log(a,a/(Math.PI));
                    let os= 1 + Math.abs(a/(Math.PI))

                    let p3=p1.clone().add(p2.clone().sub(p1).multiplyScalar(0.5));
                    let l1=p3.distanceTo(c);

                    let s=r/l1;
                    let p4=p3.clone().multiplyScalar(s*os);

                    let curve=new THREE.QuadraticBezierCurve3(p1,p4,p2);
                    let points=curve.getPoints(pointCount);

                    let geometry = new THREE.BufferGeometry().setFromPoints( points );
                    let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

                    let mesh = new THREE.Line( geometry, material );

                    return mesh;
                }

                getSCL2(){
                    let p1=this.startPoint;
                    let p2=this.endPoint;
                    let c=this.center;
                    let r=this.radius;

                    let a=p1.angleTo(p2);
        /!*            if(Math.abs(a/(Math.PI))>0.95) return null;
                    console.log(a,a/(Math.PI));*!/

                    if(Math.abs(a/(Math.PI))>0.95){
                        console.log(a,a/(Math.PI));
                    }
                    //let os= 1 + Math.abs(a/(Math.PI))/2

                    let p3=p1.clone().add(p2.clone().sub(p1).multiplyScalar(1/2));
                    let l1=p3.distanceTo(c);

                    let s=(r/(l1))
                    console.log(l1,s);

                    let p4=(p1.clone().add(p2.clone().sub(p1).multiplyScalar(3/8)));
                    let p5=(p1.clone().add(p2.clone().sub(p1).multiplyScalar(5/8)));

                    let s2=r/p4.distanceTo(c);
                    let s3=r/p5.distanceTo(c);
                    p4.multiplyScalar(s);
                    p5.multiplyScalar(s);
        /!*            p4.add(p3);
                    p4.add(p3);*!/

                    //let p4=p3.clone().multiplyScalar(s);

                    let curve=new THREE.CubicBezierCurve3(p1,p4,p5,p2);
                    //let points=curve.getPoints(pointCount);


                    return curve;
                }

                getSCL3(){

                    let p1=this.startPoint;
                    let p2=this.endPoint;

                    let X1=p1.x,Y1=p1.y,Z1=p1.z;
                    let X2=p2.x,Y2=p2.y,Z2=p2.z;

                    let rr=1.05;

                    // 计算中间位置节点
                    var midPointX = (X1 + X2)/2;
                    var midPointY = (Y1 + Y2)/2;
                    var midPointZ = (Z1 + Z2)/2;
                    var midPointR = Math.sqrt(midPointX*midPointX + midPointY*midPointY + midPointZ*midPointZ);
                    if (midPointR == 0 ) {
                        console.log("Err midPointR==0 ", X1, Y1, Z1, X2, Y2, Z2, rr);
                        return false;
                    }

                    console.log(midPointX, midPointY, midPointZ, midPointR);
                    // 计算圆周中心节点位置
                    var midCirPointX = midPointX * (rr / midPointR);
                    var midCirPointY = midPointY * (rr / midPointR);
                    var midCirPointZ = midPointZ * (rr / midPointR);
                    console.log(midCirPointX, midCirPointY, midCirPointZ, midPointR);

                    // 计算控制节点1的位置
                    var con1X = (X1 + midCirPointX) / 2;
                    var con1Y = (Y1 + midCirPointY) / 2;
                    var con1Z = (Z1 + midCirPointZ) / 2;
                    var conRR = Math.sqrt(con1X*con1X + con1Y*con1Y + con1Z*con1Z);

                    var conRatio = Math.pow(rr / conRR, 2);

                    con1X = con1X * conRatio;
                    con1Y = con1Y * conRatio;
                    con1Z = con1Z * conRatio;

                    // 计算控制节点2位置
                    var con2X = (X2 + midCirPointX) / 2;
                    var con2Y = (Y2 + midCirPointY) / 2;
                    var con2Z = (Z2 + midCirPointZ) / 2;
                    con2X = con2X * conRatio;
                    con2Y = con2Y * conRatio;
                    con2Z = con2Z * conRatio;

                    console.log(midCirPointX, midCirPointY, midCirPointZ);
                    console.log(con1X, con1Y, con1Z);
                    console.log(con2X, con2Y, con2Z);

                    // 计算延线
                    console.log(rr, conRR);
                    var mm = (rr / conRR) * Math.sqrt(rr*rr - conRR*conRR);
                    var nn = rr - mm;
                    console.log(mm, nn);

                    var fin1X = (con1X*rr - X1*mm) / nn;
                    var fin1Y = (con1Y*rr - Y1*mm) / nn;
                    var fin1Z = (con1Z*rr - Z1*mm) / nn;

                    var fin2X = (con2X*rr - X2*mm) / nn;
                    var fin2Y = (con2Y*rr - Y2*mm) / nn;
                    var fin2Z = (con2Z*rr - Z2*mm) / nn;
                    console.log(fin1X, fin1Y, fin1Z);
                    console.log(fin2X, fin2Y, fin2Z);


                    /!*
                       var curve = new THREE.CatmullRomCurve3(
                       points=[
                       new THREE.Vector3( X1, Y1, Z1 ),
                       new THREE.Vector3( midPointX, midPointY, midPointZ ),
                       new THREE.Vector3( X2, Y2, Z2 ),
                       ] ,
                       closed=false,
                    //curveType='chordal',
                    curveType = 'catmullrom',
                    tension = 0.5,
                    );
                    *!/

                    var curve = new THREE.CubicBezierCurve3(
                        new THREE.Vector3(X1, Y1, Z1),
                        new THREE.Vector3(fin1X, fin1Y, fin1Z),
                        new THREE.Vector3(fin2X, fin2Y, fin2Z),
                        new THREE.Vector3(X2, Y2, Z2),
                    );


                    var points = curve.getPoints(40);
                    //return points;
                    //console. log(points);

                    let geometry = new THREE.BufferGeometry().setFromPoints( points );
                    let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

                    let mesh = new THREE.Line( geometry, material );

                    return mesh;
                }

                getSCL4(){
                    let p1=this.startPoint;
                    let p2=this.endPoint;
                    let c=this.center;
                    let r=this.radius;

                    let a=p1.angleTo(p2);
                    console.log(a,a/(Math.PI));
                    let os= 1 + Math.abs(a/(Math.PI));
                    //let os=1;

                    let p3=p1.clone().add(p2.clone().sub(p1).multiplyScalar(1/2));
                    let l1=p3.distanceTo(c);
                    let s=r/l1;
                    p3.multiplyScalar(s*os);


                    let p4=(p1.clone().add(p2.clone().sub(p1).multiplyScalar(1/4)));
                    let p5=(p1.clone().add(p2.clone().sub(p1).multiplyScalar(3/4)));

                    let s2=r/p4.distanceTo(c);
                    let s3=r/p5.distanceTo(c);
                    p4.multiplyScalar(s2*os);
                    p5.multiplyScalar(s3*os);

                    //let p4=p3.clone().multiplyScalar(s);

                    let curve=new THREE.CatmullRomCurve3([p1,p4,p5,p2]);
                    let points=curve.getPoints(50);

                    let geometry = new THREE.BufferGeometry().setFromPoints( points );
                    let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

                    let mesh = new THREE.Line( geometry, material );

                    return mesh;
                }

                getSCL5(){
                    let v0=this.startPoint;
                    let v3=this.endPoint;

                    // 计算向量夹角
                    let angle = v0.angleTo(v3) //!* 270 / Math.PI / 10; // 0 ~ Math.PI
                    let aLen = angle/2 //!* 50,
                    let hLen = angle * angle //!* 120;
                    let p0 = new THREE.Vector3(0, 0, 0);

                    // 法线向量
                    let rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));

                    // 顶点坐标
                    let vtop = (rayLine.at(hLen / rayLine.at(1).distanceTo(p0))).multiplyScalar(-1);

                    console.log(aLen,hLen,vtop);

                    // 控制点坐标
                    let v1 = getLenVcetor(v0.clone(), vtop, aLen);
                    let v2 = getLenVcetor(v3.clone(), vtop, aLen);

                    // 绘制贝塞尔曲线
                    let curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);

                    return curve;
                }*/

        getMesh(){
            let curve=this.curve;

            let geometry = new THREE.TubeBufferGeometry( curve,50,this.radius*0.0015, 8, false );
            let material = new THREE.MeshBasicMaterial({color:this.color,map:this.img});
            material.alphaTest=0.1;
            material.transparent=true;

            let mesh = new THREE.Mesh( geometry, material );

            return mesh;
        }
        getMesh2(){

            let p1=this.startPoint;
            let p2=this.endPoint;
            let c=this.center;
            let r=this.radius;

            let a=p1.angleTo(p2);

            let p3=p1.clone().add(p2);
            let p2y=new THREE.Vector2(p3.x,p3.y);
            let p2x=new THREE.Vector2(p3.y,p3.z);
            let p2z=new THREE.Vector2(p3.x,p3.y);


            console.log(a);

            let geometry=new THREE.TorusBufferGeometry(1,this.radius*0.0015,16,64,a);
            let material = new THREE.MeshBasicMaterial({color:this.color,map:this.img});
            material.alphaTest=0.1;
            material.transparent=true;

            let mesh = new THREE.Mesh( geometry, material );
            //mesh.rotateX(p2x.angle());
            mesh.rotateY(p2y.angle());
            //mesh.rotateZ(p2z.angle());
            //mesh.rotation.set(0,p2y.angle(),0);
            //console.log(p2y.angle(),mesh.rotation);


            return mesh;
        }

        update(time){
            let scl = this;
            let ltt1 = scl.mesh.material.map;

            let s=Math.floor(ltt1.offset.x*100);
            //console.log(s);
            if(s===-100){
                if(scl.endPointMesh)
                    scl.endPointMesh.userData.tween.start();

                scl.life--;
                if(scl.life<=0)
                    scl.destroy();
            }
            if(s===0){
                if(scl.startPointMesh)
                    scl.startPointMesh.userData.tween.start();
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

            this.objMesh.remove(this.o3d);

            delete TWEEN.SphereCurveLines[id];

            delete SphereCurveLines[id];
            SphereCurveLines.length--;

            for(let a in this){
                delete this[a];
            }
        }
    }

    //带起始点和结束点效果的连线
    class SphereCurveLine2 extends SphereCurveLine{
        constructor(props) {
            super(props);

            this.startPoint=props.endPoint.multiplyScalar(1.01);
            this.endPoint=props.startPoint.multiplyScalar(1.01);

            this.startPointMesh=this.getPointMesh(this.startPoint);
            this.endPointMesh=this.getPointMesh(this.endPoint);

            this.o3d.add(this.startPointMesh);
            this.o3d.add(this.endPointMesh);
        }

        getPointMesh(point){

            let r1=getPointRotation(point);

            let r=this.radius*0.01;

            let sm=new THREE.Mesh(new THREE.CircleBufferGeometry(r,32),new THREE.MeshBasicMaterial({color:this.color,transparent:false,opacity:0.8,side:THREE.DoubleSide}));
            sm.position.copy(point);
            sm.rotation.copy(r1);
            sm.scale.set(0.5,0.5,0.5);

            sm.userData.tween=new TWEEN.Tween(sm.scale,this.tg).to({x:1.2,y:1.2,z:1.2},500).onComplete(function(obj){
                //console.log(this);
                //sm.scale.set(0,0,0);
            }).repeat(1).yoyo(true);

            return sm;
        }

        destroy(){
            let id=this.id;

            let tg = TWEEN.SphereCurveLines[id];
            if(tg){
                tg.removeAll();
            }

            this.startPointMesh.userData.tween.stop();
            this.startPointMesh.userData.tween=null;
            delete this.startPointMesh.userData.tween;
            this.endPointMesh.userData.tween.stop();
            this.endPointMesh.userData.tween=null;
            delete this.endPointMesh.userData.tween;
/*            this.startPointMesh.userData.tween=null;
            this.endPointMesh.userData.tween=null;*/

            this.startPointMesh.material.dispose();
            this.startPointMesh.geometry.dispose();
            this.endPointMesh.material.dispose();
            this.endPointMesh.geometry.dispose();

            this.o3d.remove(this.startPointMesh);
            this.o3d.remove(this.endPointMesh);

            super.destroy();
        }
    }

    //带球的线
    class SphereCurveLineABall extends SphereCurveLine{
        constructor(props) {
            //if(props.closeTo) return ;

            super(props);

            let ball=new THREE.Mesh(new THREE.SphereBufferGeometry(this.radius*0.005,10,10),new THREE.MeshBasicMaterial({color:this.color}));
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


            //console.log(points);
        }

        destroy(){
            let id=this.id;

            let tg = TWEEN.SphereCurveLines[id];
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

    //管线效果的线
    class SphereCurveLinePipeline extends SphereCurveLine{
        constructor(props) {
            super(props);

            this.mesh.material.map.dispose();
            this.mesh.material.map=null;
            this.mesh.material.dispose();
            this.mesh.material=null;

            if(this.life>1)
                this.life-=1;

            let options=props;

            this.mesh.material=new THREE.ShaderMaterial({
                uniforms:{
                    size1:{value:0.0},
                    size2:{value:options.size2?options.size2:1.0},
                    size4:{value:options.size4?options.size4:0.15},
                    color:{value:new THREE.Color(this.color)},
                    color2:{value:new THREE.Color(0xffffff)}
                },
                vertexShader: Pipeline.shaderCode.vs,
                fragmentShader:  Pipeline.shaderCode.fs3,

                side:THREE.DoubleSide
            });
        }

        update() {
            let m=this.mesh.material;
            m.uniforms.size1.value-=0.001;
            this.life-=0.001;

            if(this.life<=0)
                this.destroy();

            if(m.uniforms.size1.value<=0.0){
                m.uniforms.size1.value=1.0;

                //console.log(222);
            }


            if(m.uniforms.size2.value<1.0)
                m.uniforms.size2.value+=0.006;
            else
                m.uniforms.size2.value=1.0;
        }
    }


    class SpherePoint{
        constructor(options) {
            this.id=options.id?options.id:getRandomId();

            this.objMesh=options.objMesh;

            this.point=options.point;
            this.radius=options.radius;

            this.color=options.color?options.color:0xff0000;

            this.r=getPointRotation(this.point);

            let tg=new TWEEN.Group();
            TWEEN.SphereCurveLines[this.id]=tg;
            this.tg=tg;

            let rr=this.radius*0.005;
            let sm=new THREE.Mesh(new THREE.CircleBufferGeometry(rr,32),new THREE.MeshBasicMaterial({color:this.color,transparent:false,opacity:0.8,side:THREE.DoubleSide}));
            sm.position.copy(this.point);
            sm.rotation.copy(this.r);
            sm.scale.set(0.5,0.5,0.5);

            sm.userData.tween=new TWEEN.Tween(sm.scale,this.tg).to({x:1.2,y:1.2,z:1.2},500).onComplete(function(obj){
                //console.log(this);
                //sm.scale.set(0,0,0);
            }).repeat(Infinity).yoyo(true).start();

            this.sm=sm;

            this.objMesh.add(sm);
        }

        destroy(){
            let id=this.id;

            let tg = TWEEN.SphereCurveLines[id];
            if(tg){
                tg.removeAll();
            }

            let sm=this.sm;
            sm.material.dispose();
            sm.geometry.dispose();

            sm.userData.tween.stop();
            sm.userData.tween=null;
            delete sm.userData.tween;

            this.objMesh.remove(sm);

            delete TWEEN.SphereCurveLines[id];

            for(let a in this){
                delete this[a];
            }
        }
    }

    class SphereCurveInternet{
        constructor(options) {
            //if(this.points.length!==this.colors.length) return ;

            this.id=options.id?options.id:getRandomId();

            if(SphereCurveInternets[this.id]) return

            this.points=options.points;
            this.colors=options.colors;

            this.img=options.img;

            this.objMesh=options.objMesh;
            if(!this.objMesh.geometry.boundingSphere)
                this.objMesh.geometry.computeBoundingSphere();

            this.radius=this.objMesh.geometry.boundingSphere.radius;

            this.spherePoints={}

            this.lines={};

            this.init();

            SphereCurveInternets[this.id]=this;
            SphereCurveInternets.length++;
        }
        init(){
            let points=this.points;

            for(let i=0;i<points.length;i++){
                let p=points[i].clone().multiplyScalar(1.01);
                let sp=new SpherePoint({
                    objMesh:this.objMesh,
                    color:this.colors[i],
                    point:p,
                    radius:this.radius
                });

                this.spherePoints[sp.id]=sp;
            }
        }

        addLine(startId,endId,color){

            let sps=this.spherePoints;
            let startPoint=sps[startId].point;
            let endPoint=sps[endId].point;

            let l = new SphereCurveLine({
                startPoint:startPoint,
                endPoint:endPoint,
                img:this.img,
                objMesh:this.objMesh,
                color:color
            });

            this.lines[l.id]=l.id;
        }
        getPoints(){
            return this.spherePoints;
        }
        getLines(){
            return this.lines;
        }

        removeLineById(id){
            if(this.lines[id]){
                removeById(id);
                delete this.lines[id];
            }
        }

        removeLineAll(){
            let lines=this.lines;
            for(let a in lines){
                removeById(lines[a]);
            }
        }

        destroy(){
            let id=this.id;

            this.removeLineAll();

            let sps=this.spherePoints;
            for(let a in sps){
                sps[a].destroy();
            }
            this.spherePoints=null;

            delete SphereCurveInternets[id];
            SphereCurveInternets.length--;

            for(let a in this){
                delete this[a];
            }
        }
    }


    function getPointRotation(point){
        let q1=new THREE.Quaternion();
        rotationMatrix.lookAt(point,new THREE.Vector3(),new THREE.Vector3(0,0,1));
        q1.setFromRotationMatrix(rotationMatrix);
        let r1=new THREE.Euler();
        r1.setFromQuaternion(q1);

        return r1;
    }
    function getSCL1(LAL1,LAL2){

        let count=50
        let l1 = (LAL2[0]-LAL1[0])/count;
        let l2 = (LAL2[1]-LAL1[1])/count;

        let  ps=[]
        for(let i=0;i<count;i++){
            let v3=getPosition(LAL1[0]+90+l1*i,LAL1[1]+l2*i,1);
            ps.push(v3);
        }
        ps.push(getPosition(LAL2[0]+90,LAL2[1],1))

        let curve=new THREE.CatmullRomCurve3(ps);

        return curve
    }

    function getSCL(startPoint,endPoint){
        let v0=startPoint;
        let v3=endPoint;

        // 计算向量夹角
        let angle = v0.angleTo(v3) //* 270 / Math.PI / 10; // 0 ~ Math.PI
        let aLen = angle/2 //* 50,
        let hLen = angle * angle //* 120;
        let p0 = new THREE.Vector3(0, 0, 0);

        // 法线向量
        let rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));

        // 顶点坐标
        let vtop = (rayLine.at(hLen / rayLine.at(1).distanceTo(p0))).multiplyScalar(-1);

        //console.log(aLen,hLen,vtop);

        // 控制点坐标
        let v1 = getLenVcetor(v0.clone(), vtop, aLen);
        let v2 = getLenVcetor(v3.clone(), vtop, aLen);

        // 绘制贝塞尔曲线
        let curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);

        return curve;
    }

    function removeById(id){
        let scl=SphereCurveLines[id];
        if(scl){
            if(scl.isSphereCurveLine)
                scl.destroy();
        }
    }

    function removeAll(){
        for(let a in SphereCurveLines){
            if(SphereCurveLines[a].isSphereCurveLine)
                SphereCurveLines[a].destroy();
        }

        SphereCurveLines.length=0;
    }

    function getRandomId(){
        return THREE.Math.generateUUID();
    }

    function animate(time){
        requestAnimationFrame(animate);

        //console.log(clock.getDelta());

        if(TWEEN){
            if(TWEEN.SphereCurveLines){
                let tsclg=TWEEN.SphereCurveLines;
                for(let a in tsclg){
                    tsclg[a].update(time);
                }
            }
        }

        for(let a in SphereCurveLines){
            if(SphereCurveLines[a].isSphereCurveLine){

                SphereCurveLines[a].update(time)

/*                let scl = SphereCurveLines[a];
                let ltt1 = scl.mesh.material.map;

                let s=Math.floor(ltt1.offset.x*100);
                //console.log(s);
                if(s===-100){
                    if(scl.endPointMesh)
                        scl.endPointMesh.userData.tween.start();

                    scl.life--;
                    if(scl.life<=0)
                        scl.destroy();
                }
                if(s===0){
                    if(scl.startPointMesh)
                        scl.startPointMesh.userData.tween.start();
                }

                ltt1.offset.x-=0.01;
                if(ltt1.offset.x<=-1)
                    ltt1.offset.x=1;*/

            }
        }
    }

    // 计算v1,v2 的中点
    function getVCenter(v1, v2) {
        let v = v1.add(v2);
        return v.divideScalar(2);
    }

// 计算V1，V2向量固定长度的点
    function getLenVcetor(v1, v2, len) {
        let v1v2Len = -v1.distanceTo(v2);
        return v1.lerp(v2, len / v1v2Len);
    }

    animate()

    return {
        SphereCurveLines:SphereCurveLines,
        SphereCurveInternets:SphereCurveInternets,

        SphereCurveLine:SphereCurveLine,
        SphereCurveLine2:SphereCurveLine2,
        SphereCurveLineABall:SphereCurveLineABall,
        SphereCurveLinePipeline:SphereCurveLinePipeline,

        SphereCurveInternet:SphereCurveInternet,

        removeById:removeById,
        removeAll:removeAll,

        getSCL:getSCL
    }

})()
