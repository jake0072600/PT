//一套用去获取和编辑空间种点和线的工具，依赖于
//three.js
//jquery

let EditorTools=(function (){

    let ray=new THREE.Raycaster();
    let mouse=new THREE.Vector2();

    class PointEdit{
        constructor(canvas,scene,camera) {
            this.scene=scene;
            this.canvas=canvas;
            this.$c=$(canvas);
            this.camera=camera;

            this.width=this.$c.width();
            this.height=this.$c.height();

            this.eventObjs={
                checkPoint:this._checkPoint.bind(this)
            };

            this.vec3s=[];
            let geo=new THREE.BufferGeometry();
            let mat = new THREE.PointsMaterial( { color: 0xff0000 } );
            let points=new THREE.Points(geo,mat);

            this.group=new THREE.Group();
            this.points=points;

            this.group.add(points);



        }

        addPoint(){
            this.$c.on("click",this.eventObjs.checkPoint);
        }

        _checkPoint(event){

            event.preventDefault();

            let w=this.width();
            let h=this.height();
            mouse.x = ( event.clientX / w ) * 2 - 1;
            mouse.y = - ( event.clientY / h ) * 2 + 1;

            ray.setFromCamera( mouse, this.camera );

            let intersection = r.intersectObjects( this.scene );

            console.log(intersection);

            this.$c.off("click",this.eventObjs.checkPoint);
        }
    }


    return {

    }

})()