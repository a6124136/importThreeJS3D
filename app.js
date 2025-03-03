import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
export default
class App {
    constructor(){
        const container = document.createElement('div');    
        document.body.appendChild(container);
        // 建立div元素
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
        // 攝影機參數:視角,寬高比,近端,遠端
        this.camera.position.set(0,0,4);
        // 攝影機xyz的位置
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xAAAAAAA);
        // 建立場景
        const ambiet = new THREE.HemisphereLight(0xFFFFFF, 0xBBBBFF, 0.3);
        // 環境光(天空色、地面顏色、顏色強度)
        const light = new THREE.DirectionalLight();
        // 平行光(顏色、強度)
        light.position.set(0.2,1,1);
        // 平行打光位置(x、y、z)，相對於場景
        this.renderer= new THREE.WebGLRenderer({antialias:true});
        // antialias:true 抗鋸齒
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 設定像素比
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // 設定渲染器大小
        // 建立渲染器
        container.appendChild(this.renderer.domElement);
        // 將渲染器加入div
        this.renderer.setAnimationLoop(this.render.bind(this));
        // 執行render函式
        window.addEventListener('resize', this.resize.bind(this));
        // 監聽視窗大小變化，綁定指向app實例

        // -----------------實例設定-----------------------------
        const circle=   new THREE.CircleGeometry(1, 50,0,Math.PI);
         // 建立圓形幾何體，參數(半徑,分段數,起始角度,結束角度)，分段數越多圓越平滑
        // 一個圓的弧度是2*Math.PI，所以Math.PI是半圓，0.5*Math.PI是1/4圓以此類推
        // 面相攝影機那一面才有上色，故要看到背面要加上背面材質
        const geometry = new THREE.BoxGeometry();
        // 建立立方體
        const material= new THREE.MeshStandardMaterial({color:0xFF0000});
        // 建立材質，標準材質會接受光源照射，注意參數的顏色大小寫敏感
        const material2= new THREE.MeshPhongMaterial({color:0xFFAA00,  specular:0x444444,shininess:60});
        // 建立材質，高光源反射材質，參數(顏色,高光顏色,高光強度)
        // 材質參考網址:https://threejs.org/docs/#api/zh/materials/MeshPhongMaterial
        // 調適的屬性都在旁邊
        const mesh=this.mesh = new THREE.Mesh(geometry, material);
        // bind this.mesh 這行是為了讓this.mesh在其他函式中可以使用
        // 立方體幾何體與材質建立網格
        const mesh2 =this.mesh2= new THREE.Mesh(circle, material);
        // bind this.mesh2 這行是為了讓this.mesh2在其他函式中可以使用
        // 圓形幾何體與材質建立網格
        const mesh3Setting = this.creatGeometry();
        // 建立自訂幾何體
        const mesh3 =this.mesh3= new THREE.Mesh(mesh3Setting, material2);
        // bind this.mesh3 這行是為了讓this.mesh3在其他函式中可以使用
        mesh2.position.set(2,0,0);
        mesh3.position.set(-2,0,0);
        // 網格位置
        // 建立實體物件
        // -------------------實例設定---------------------------   
        
        this.scene.add(mesh,mesh2,mesh3, ambiet, light);
        // 將實體物件、環境光源、平行加入場景
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // 建立控制器，鏡頭、渲染器
        controls.update();
        // 更新控制器，滑鼠拖動鏡頭
        

    }
    creatGeometry(innerRadius=0.4, outerRadius=0.8, point=5){
        // 建立自訂幾何體的函數，參數(內圓半徑,外圓半徑,角度分段數)
        const shape= new THREE.Shape();
        // 建立形狀，這是一個2D的形狀，在平面(X、Y)上建立基礎的形狀
        const PI2 = Math.PI * 2;
        // 計算一個完整圖形繪製的弧度
        const inc= PI2/(point*2);
        // 每個角度的間隔
        shape.moveTo(outerRadius,0);
        // 移動到外圓的右邊
        let inner=true;
        for(let theta=0; theta<PI2; theta+=inc){
            inner=!inner;
            const radius= inner?innerRadius:outerRadius;
            // 判斷是內圓還是外圓，下一個頂點在另外一個圓上
            shape.lineTo(Math.cos(theta)*radius, Math.sin(theta)*radius);
            // 切換內外圓
        }
        const excluedSettings = {
            steps:1,
            // steps:分段數
            depth:0.5,
            // depth:深度
            bevelEnabled:false
            // bavelEnabled:是否有斜角
        };
        // 設定幾何體的參數
        return new THREE.ExtrudeGeometry(shape, excluedSettings);
        // 建立自訂幾何體，參數(形狀,參數)
    }  
    resize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        // 設定渲染器大小，這行不使用會讓實例變形
        this.camera.aspect = this.width / this.height;
        // 設定攝影機寬高比
        this.camera.updateProjectionMatrix();
        // 更新攝影機參數
    }
    render(){
        this.renderer.render(this.scene, this.camera);
        // 渲染場景
        this.mesh.rotateY(0.01);
        // 網格旋轉，參數是旋轉的速率，依此類推RotateX、RotateZ往不同軸旋轉，負數是反方向
        this.mesh2.rotateX(-0.01);
        this.mesh3.rotateZ(0.01);
    }


}