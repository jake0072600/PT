let DOM3D=(function (){

    let Dom3ds={
        length:0
    }

    class Dom3d{
        constructor(o3d,$element,camera,options) {

            options=options?options:{};

            this.id=options.id?options.id:getRandomId();

            if(Dom3ds[this.id]) return ;

            this.o3d=o3d;
            this.$element=$element;
            this.camera=camera;

            this.isDom3d=true;

            this.width=options.width?options.width:$(window).width();
            this.height=options.height?options.height:$(window).height();

            let $e=this.$element;

            $e.css({
                position:"absolute",
                left:0,
                top:0,
                transition:"all 0.1s"
            });

            let o=options.offset?options.offset:{x:0,y:0}
            this.offset=o;

            this.center={
                x:$e.width()/2,
                y:$e.height()/2
            }

            Dom3ds[this.id]=this;
            Dom3ds.length++;
        }

        _v3tov2(){
            let w=this.width;
            let h=this.height;

            this.o3d.updateWorldMatrix()
            let wp=this.o3d.getWorldPosition(new THREE.Vector3());
            let v=wp.project(this.camera);
            let hw = w / 2;
            let hh = h / 2;
            return new THREE.Vector2(Math.round(v.x * hw + hw),Math.round(-v.y * hh + hh));
        }

        _update(){
            let v2=this._v3tov2();

            //
            let c=this.center;
            let o=this.offset;
            //this.$element.css({left:Math.floor(v2.x-o.w),top:Math.floor(v2.y-o.h)});
            this.$element.css("transform" , 'translate(' + Math.floor(v2.x-c.x+o.x) + 'px, ' + Math.floor(v2.y-c.y+o.y) + 'px)');
        }



        show(){
            this.$element.show();
        }
        hide(){
            this.$element.hide()
        }
        fadeIn(){
            this.$element.fadeIn();
        }
        fadeOut(){
            this.$element.fadeOut()
        }
    }

    function getRandomId(){
        return THREE.Math.generateUUID();
    }

    function animate(time){
        requestAnimationFrame(animate);

        for(let a in Dom3ds){
            let d3d=Dom3ds[a];
            if(d3d.isDom3d){
                d3d._update();
            }
        }
    }

    animate();


    return{
        Dom3ds:Dom3ds,
        Dom3d:Dom3d
    }



})()