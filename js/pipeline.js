//此类库用于生产依赖于three.js的动画管线，需传入生成管线的关键点
//依赖
//three.js

let Pipeline=(function () {

    let Pipelines = {length: 0};

    let vs =
        "uniform float amplitude;\n" +
        "\n" +
        "\t\t\tattribute float displacement;\n" +
        "\n" +
        "\t\t\tvarying vec3 vNormal;\n" +
        "\t\t\tvarying vec2 vUv;\n" +
        "\t\t\tvarying vec3 vPosition;\n" +

        "\n" +
        "\t\t\tvoid main() {\n" +
        "\n" +
        "\t\t\t\tvNormal = normal;\n" +
        "\t\t\t\t//vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );\n" +
        "\t\t\t\tvUv = uv;\n" +
        "\t\t\t\tvPosition = position;\n" +
        "\n" +
        "\t\t\t\tvec3 newPosition = position + amplitude * normal * vec3( displacement );\n" +
        "\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
        "\n" +
        "\t\t\t}";

    let fs1 =
        "\t\t\tvarying vec3 vNormal;\n" +
        "\t\t\tvarying vec2 vUv;\n" +
        "\t\t\tvarying vec3 vPosition;\n" +

        "\n" +
        "\t\t\tuniform float size1;\n" +
        "\t\t\tuniform float size2;\n" +
        "\t\t\tuniform float size3;\n" +
        "\t\t\tuniform vec3 color;\n" +
        "\n" +
        "\t\t\t//uniform vec3 color;\n" +
        "\t\t\t//uniform sampler2D colorTexture;\n" +
        "\n" +
        "            vec3 nat2rgb(vec3 nat)\n" +
        "            {\n" +
        "                if(nat.x>=0.0 && nat.x<0.25) //red to yellow\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.8,0.0,0.2),vec3(1.0,0.8,0.0),nat.x );\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.25 && nat.x<0.5) //yellow to green\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(1.0,0.8,0.0),vec3(0.0,0.6,0.4),(nat.x-0.25)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.5 && nat.x<0.75) //green to blue\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.4),vec3(0.0,0.6,0.8),(nat.x-0.5)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else //blue to red\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.8),vec3(0.8,0.0,0.2),(nat.x-0.75)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "            }\n" +
        "\n" +
        "\t\t\tvoid main() {\n" +
        "\t\t\t     //float x=clamp(vUv.x,0.5,1.0);\n" +
        "\t\t\t     vec3 nat2 = vec3(0.0,0.0,0.0);\n" +
        "\t\t\t     vec3 rgb = mix(nat2rgb(color),nat2rgb(nat2),0.2*sin(3.14*4.0*(vUv.x+size1*2.0)*4.0));\n" +
        "if(vUv.x<size2){" +
        "                 vec4 bgpattern = vec4(color,1.0 + 0.2 / sin(3.14 * 4.0 * (vUv.x + size1 * 2.0) * size3));gl_FragColor=bgpattern;\n" +

/*        "                vec2 c=step(0.45,fract(vUv.xy/0.1+size1*50.0));\n" +
        "                \n" +
        "                if(c.x==0.0){\n" +
        "                    gl_FragColor=vec4(1.0,1.0,1.0,1.0);\n" +
        "                   \n" +
        "                }else{\n" +
        "                   \tgl_FragColor=vec4(color,1.0);\n" +
        "                }"+*/

        "}else{"+
        "vec4 bgpattern=vec4(0.2,0.2,0.2,1.0);gl_FragColor=bgpattern;"+
        "}"+
        "                 //gl_FragColor=bgpattern;\n" +
        "                 //gl_FragColor=vec4(rgb,1.0);\n" +
        "\t\t\t}";

    let fs2=
        "\t\t\tvarying vec3 vNormal;\n" +
        "\t\t\tvarying vec2 vUv;\n" +
        "\t\t\tvarying vec3 vPosition;\n" +
        "\n" +
        "\t\t\tuniform float size1;\n" +
        "\t\t\tuniform float size2;\n" +
        "\t\t\tuniform vec3 color;\n" +
        "\t\t\tuniform vec3 color2;\n" +
        "\n" +
        "\t\t\t//uniform vec3 color;\n" +
        "\t\t\t//uniform sampler2D colorTexture;\n" +
        "\n" +
        "            vec3 nat2rgb(vec3 nat)\n" +
        "            {\n" +
        "                if(nat.x>=0.0 && nat.x<0.25) //red to yellow\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.8,0.0,0.2),vec3(1.0,0.8,0.0),nat.x );\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.25 && nat.x<0.5) //yellow to green\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(1.0,0.8,0.0),vec3(0.0,0.6,0.4),(nat.x-0.25)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.5 && nat.x<0.75) //green to blue\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.4),vec3(0.0,0.6,0.8),(nat.x-0.5)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else //blue to red\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.8),vec3(0.8,0.0,0.2),(nat.x-0.75)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "            }\n" +
        "\n" +
        "\t\t\tvoid main() {\n" +
        "\t\t\t     //float x=clamp(vUv.x,0.5,1.0);\n" +
        "\t\t\t     vec3 nat2 = vec3(0.0,0.0,0.0);\n" +
        "\t\t\t     vec3 rgb = mix(nat2rgb(color),nat2rgb(nat2),0.2*sin(3.14*4.0*(vUv.x+size1*2.0)*4.0));\n" +
        "if(vUv.x<size2){" +

            "vec2 c=step(0.45,fract(vUv.xy/0.1+size1*50.0));\n" +
            //"vec2 c=step(0.45,fract(vUv.xy/0.1+size1*1.0));\n" +
            "\n" +
            "if(c.x==0.0){\n" +
            "    gl_FragColor=vec4(color2,1.0);\n" +
            "   \n" +
            "}else{\n" +
            "   \tgl_FragColor=vec4(color,1.0);\n" +
            "}"+

        "}else{"+
        "vec4 bgpattern=vec4(0.2,0.2,0.2,1.0);gl_FragColor=bgpattern;"+
        "}"+
        "                 //gl_FragColor=bgpattern;\n" +
        "                 //gl_FragColor=vec4(rgb,1.0);\n" +
        "\t\t\t}";

    let fs3=
        "\t\t\tvarying vec3 vNormal;\n" +
        "\t\t\tvarying vec2 vUv;\n" +
        "\t\t\tvarying vec3 vPosition;\n" +
        "\n" +
        "\t\t\tuniform float size1;\n" +
        "\t\t\tuniform float size2;\n" +
        "\t\t\tuniform float size4;\n" +
        "\t\t\tuniform vec3 color;\n" +
        "\t\t\tuniform vec3 color2;\n" +
        "\n" +
        "\t\t\t//uniform vec3 color;\n" +
        "\t\t\t//uniform sampler2D colorTexture;\n" +
        "\n" +
        "            vec3 nat2rgb(vec3 nat)\n" +
        "            {\n" +
        "                if(nat.x>=0.0 && nat.x<0.25) //red to yellow\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.8,0.0,0.2),vec3(1.0,0.8,0.0),nat.x );\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.25 && nat.x<0.5) //yellow to green\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(1.0,0.8,0.0),vec3(0.0,0.6,0.4),(nat.x-0.25)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.5 && nat.x<0.75) //green to blue\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.4),vec3(0.0,0.6,0.8),(nat.x-0.5)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else //blue to red\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.8),vec3(0.8,0.0,0.2),(nat.x-0.75)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "            }\n" +
        "\n" +
        "\t\t\tvoid main() {\n" +
        "\t\t\t     //float x=clamp(vUv.x,0.5,1.0);\n" +
        "\t\t\t     vec3 nat2 = vec3(0.0,0.0,0.0);\n" +
        "\t\t\t     vec3 rgb = mix(nat2rgb(color),nat2rgb(nat2),0.2*sin(3.14*4.0*(vUv.x+size1*2.0)*4.0));\n" +
        "if(vUv.x<size2){" +

        "vec2 c=step(size4,fract(vUv.xy/0.1+size1*50.0));\n" +
        //"vec2 c=step(0.45,fract(vUv.xy/0.1+size1*1.0));\n" +
        "\n" +
        "if(c.x==0.0){\n" +
        "    gl_FragColor=vec4(color2,1.0);\n" +
        "   \n" +
        "}else{\n" +
        "   \tgl_FragColor=vec4(color,1.0);\n" +
        "}"+

        "}else{"+
        "vec4 bgpattern=vec4(0.2,0.2,0.2,1.0);gl_FragColor=bgpattern;"+
        "}"+
        "                 //gl_FragColor=bgpattern;\n" +
        "                 //gl_FragColor=vec4(rgb,1.0);\n" +
        "\t\t\t}";

    let fs4=
        "\t\t\tvarying vec3 vNormal;\n" +
        "\t\t\tvarying vec2 vUv;\n" +
        "\t\t\tvarying vec3 vPosition;\n" +
        "\n" +
        "\t\t\tuniform float size1;\n" +
        "\t\t\tuniform float size2;\n" +
        "\t\t\tuniform float size4;\n" +
        "\t\t\tuniform vec3 color;\n" +
        "\t\t\tuniform vec3 color2;\n" +
        "\n" +
        "\t\t\t//uniform vec3 color;\n" +
        "\t\t\t//uniform sampler2D colorTexture;\n" +
        "\n" +
        "            vec3 nat2rgb(vec3 nat)\n" +
        "            {\n" +
        "                if(nat.x>=0.0 && nat.x<0.25) //red to yellow\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.8,0.0,0.2),vec3(1.0,0.8,0.0),nat.x );\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.25 && nat.x<0.5) //yellow to green\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(1.0,0.8,0.0),vec3(0.0,0.6,0.4),(nat.x-0.25)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else if(nat.x>=0.5 && nat.x<0.75) //green to blue\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.4),vec3(0.0,0.6,0.8),(nat.x-0.5)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "                else //blue to red\n" +
        "                {\n" +
        "                    vec3 uns = mix(vec3(0.0,0.6,0.8),vec3(0.8,0.0,0.2),(nat.x-0.75)*4.0);\n" +
        "                    return mix(vec3(nat.z),uns,nat.y);\n" +
        "                }\n" +
        "            }\n" +
        "\n" +
        "\t\t\tvoid main() {\n" +
        "\t\t\t     //float x=clamp(vUv.x,0.5,1.0);\n" +
        "\t\t\t     vec3 nat2 = vec3(0.0,0.0,0.0);\n" +
        "\t\t\t     vec3 rgb = mix(nat2rgb(color),nat2rgb(nat2),0.2*sin(3.14*4.0*(vUv.x+size1*2.0)*4.0));\n" +
        "if(vUv.x<size2){" +

        "vec2 c=step(size4,fract(vUv.xy/0.1+size1*50.0));\n" +
        //"vec2 c=step(0.45,fract(vUv.xy/0.1+size1*1.0));\n" +
        "\n" +
        "if(c.x==0.0){\n" +
        "    gl_FragColor=vec4(color2,1.0);\n" +
        "   \n" +
        "}else{\n" +
        "   \tdiscard;\n" +
        "}"+

        "}else{"+
        "vec4 bgpattern=vec4(0.2,0.2,0.2,1.0);gl_FragColor=bgpattern;"+
        "}"+
        "                 //gl_FragColor=bgpattern;\n" +
        "                 //gl_FragColor=vec4(rgb,1.0);\n" +
        "\t\t\t}";

    let lineShader={
        vs:vs,
        fs1:fs1,
        fs2:fs2,
        fs3:fs3,
        fs4:fs4
    }

    let type={
        normal:1,
        color:2,
        discard:4
    }

    //basicPoints:生成管线的基础点
    //scene:要加入的object3d
    //pointCount:管线点数量，默认500
    //color:颜色
    //radius:管线粗细
    //id:可能有的id或者随机id
    class Pipeline{
        constructor(options) {

            if(options.id){
                if(Pipelines[options.id])
                    return ;
            }

            this.basicPoints=options.basicPoints;
            this.scene=options.scene;
            this.pointCount=options.pointCount?options.pointCount:500;
            this.color=options.color?options.color:0x3e96ff;
            this.color2=options.color2?options.color2:0xffffff;
            this.radius=options.radius?options.radius:2;
            this.type=options.type?options.type:type.normal;

            this.speed=options.speed?options.speed:0;

            this.enabled=true;

            this.curve = new THREE.CatmullRomCurve3(this.basicPoints,false,"catmullrom",options.tension?options.tension:0);
            this.length=this.curve.getLength();
            //console.log(this.curve.getLength());
            //this.points=this.curve.getSpacedPoints(this.pointCount);
            //this.curve=new CustomSinCurve(this.pointCount);

            //console.log(Math.ceil(this.curve.getLength()/7.5));
            let geometry = new THREE.TubeBufferGeometry( this.curve, options.tubularSegments?options.tubularSegments:Math.ceil(this.curve.getLength()/7.5)<2?2:Math.ceil(this.curve.getLength()/7.5), this.radius, 32, false );
            //let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            let material = new THREE.ShaderMaterial({
                uniforms:{
                        size1:{value:0.0},
                        size2:{value:options.size2?options.size2:0.0},
                        size3:{value:options.size3?options.size3:5.0},
                        size4:{value:options.size4?options.size4:0.15},
                        color:{value:new THREE.Color(this.color)},
                        color2:{value:new THREE.Color(this.color2)}
                    },
                vertexShader: vs,
                fragmentShader: lineShader["fs"+this.type],

                side:THREE.DoubleSide
            });
            let mesh = new THREE.Mesh( geometry, material );
            mesh.renderOrder=Infinity;
            this.mesh=mesh;
            this.material=material;
            this.scene.add( mesh );

            this.id = options.id?options.id:getRandomId();

            this.isPipeline=true;

            Pipelines[this.id]=this;
            Pipelines.length++;



            //this.init()
        }

        setEnabled(enabled=true){
            this.enabled=enabled;
        }

        setVisible(visible=true){
            this.mesh.visible=visible;
        }

        start(){
            this.material.uniforms.size2.value=0;
        }

        setColor(color){
            this.material.uniforms.color.value=new THREE.Color(color);
        }
        setColor2(color){
            this.material.uniforms.color2.value=new THREE.Color(color);
        }
        setSpeed(speed){
            this.speed=speed;
        }

/*        init(){


        }*/

        destroy(){

            let m=this.mesh;
            this.scene.remove(m);
            m.material.dispose();
            m.geometry.dispose();

            let id=this.id;
            delete Pipelines[id];
            Pipelines.length--;

            for(let a in this){
                delete this[a];
            }
        }
    }

    function removeById(id){
        let pl=Pipelines[id];
        if(pl){
            if(pl.isPipeline)
                pl.destroy();
        }
    }

    function removeAll(){
        for(let a in Pipelines){
            if(Pipelines[a].isPipeline)
                Pipelines[a].destroy();
        }

        Pipelines.length=0;
    }

    function setVisibleById(id,visible){
        let pl=Pipelines[id];
        if(pl){
            if(pl.isPipeline)
                pl.setVisible(visible);
        }
    }

    function setVisibleAll(visible){
        for(let a in Pipelines){
            if(Pipelines[a].isPipeline)
                Pipelines[a].setVisible(visible);
        }
    }



    function animate(time){
        requestAnimationFrame(animate);

        for(let a in Pipelines){
            if(Pipelines[a].isPipeline&&Pipelines[a].enabled){
                let m=Pipelines[a].material;
                m.uniforms.size1.value-=(Pipelines[a].speed?Pipelines[a].speed:(1/Pipelines[a].length*3.0));
                if(m.uniforms.size1.value<=0.0)
                    m.uniforms.size1.value=1.0;

                if(m.uniforms.size2.value<1.0)
                    m.uniforms.size2.value+=0.006;
                else
                    m.uniforms.size2.value=1.0;
            }
        }
    }

    function getRandomId(){
        return THREE.Math.generateUUID();
    }

    animate()

    return {
        Pipelines:Pipelines,
        Pipeline:Pipeline,

        type:type,

        removeById:removeById,
        removeAll:removeAll,

        setVisibleById:setVisibleById,
        setVisibleAll:setVisibleAll,

        shaderCode:{
            vs:vs,
            fs1:fs1,
            fs2:fs2,
            fs3:fs3
        }
    }

})();