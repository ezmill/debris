var container;
var scene, renderer, camera, controls;
var cubeCamera;
var mouseX = 0, mouseY = 0;
var time = 0;
var debris = [];
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var start = Date.now(); 

init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000000);
    camera.position.set(0,100, 700);
    controls = new THREE.OrbitControls(camera);
    
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer: true} );
    renderer.setClearColor(0x000000, 1.0)
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.physicallyBasedShading = true;
    
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    
    cubeCamera = new THREE.CubeCamera( 0.01, 100000, 2048 );
    cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    scene.add( cubeCamera );
    // cubeCamera.position.y = 200;

    var blueGreenCube = createTexCube("tex/Cube/bg/", ".png");
    var blueGreenMaterial = new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("tex/beach.jpg")});
    // var blueGreenGeometry = new THREE.SphereGeometry(150, 25, 25);
    // var blueGreenGeometry = new THREE.BoxGeometry(150, 150, 150);
    var blueGreenGeometry = new THREE.PlaneBufferGeometry(2048/4, 1536/4);
    blueGreen = new THREE.Mesh(blueGreenGeometry, blueGreenMaterial);
    scene.add(blueGreen);
    // blueGreen.position.y = 300;
    // blueGreen.rotation.x = Math.PI/2;
    // blueGreen.rotation.y = Math.PI/2;


    var shader = textureCubeShader;
    for(var i = 0; i < 999; i++){
        // var onOff = Math.floor(Math.random()*10);
        var onOff = 1;
        if(onOff == 1){
            var material = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                side: 2
            })
            material.uniforms["tCube"].value = cubeCamera.renderTarget;
            material.uniforms["tFlip"].value = 1;
        } else{
            var material = new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture("tex/rainbowtex.jpg")});
        }


        loadModel("obj/ob"+i+".obj", material, new THREE.Vector3(Math.random(Math.random()*500-250, Math.random()*500-250, Math.random()*500-250)) );
    }
    // var cubeGeo = new THREE.BoxGeometry(75,75,75);
    // for(var i = 0; i < 100; i++){
    //     var cube = new THREE.Mesh(cubeGeo,new THREE.MeshBasicMaterial({color:randomColor()}));
    //     cubes.push(cube);
    //     // cube.position = new THREE.Vector3(Math.random(Math.random()*100, Math.random()*100, Math.random()*100));
    //     cube.position.set(Math.random()*1000-500,Math.random()*1000-500,Math.random()*1000-500)
    //     scene.add(cube);
    // }

    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'keydown', function(){screenshot(renderer)}, false );
    window.addEventListener( 'resize', onWindowResize, false );
    
}
function randomColor(){
    var hex = '#'+Math.floor(Math.random()*16777215).toString(16);
    return new THREE.Color(hex);
}
function animate(){
	window.requestAnimationFrame(animate);
	draw();
}
function draw(){
    time+=0.01;
    for(var i = 0; i<debris.length;i++){
        // debris[i].rotation.x = Date.now()*0.0001 + i;
        // debris[i].rotation.y = Date.now()*0.0001 + i;
        // debris[i].rotation.z = Date.now()*0.0001 + i;
    }
        // cubes[i].rotation.y = Date.now()*0.001;
    cubeCamera.lookAt(blueGreen.position);
    blueGreen.lookAt(cubeCamera.position);

    // cubeCamera.position.x = Math.sin(time)*2100;
    // cubeCamera.position.y = Math.cos(time)*2100;
    // }
    blueGreen.position.x = Math.sin(time)*100;
    // blueGreen.position.y = Math.cos(time)*170;
    blueGreen.position.z = Math.cos(time)*100;
    // blueGreen.rotation.set(Date.now()*0.001, Date.now()*0.0005, Date.now()*0.0005);
    // for(var i = 0; i < cubeCameras.length; i++){
    blueGreen.visible = true;
    cubeCamera.updateCubeMap( renderer, scene );
    blueGreen.visible = false;

    // }
	renderer.render(scene, camera);
}

function onWindowResize(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}