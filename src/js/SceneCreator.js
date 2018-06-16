/** created by shoaib khan on 30.4.2018 */
import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
import OrbitControls from 'three-orbit-controls';
OBJLoader(THREE);
var OC = OrbitControls(THREE);

import ObjModelLoader from './Loaders/ObjModelLoader';
import ModalWinOptions from './ModalWinOptions'


class SceneCreator {
  constructor(threeElement) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouseClient = new THREE.Vector2;
    this.container = threeElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd6d6d6);
    this.viewerWidth = threeElement.clientWidth;
    this.viewerHeight = threeElement.clientHeight;
    
    // Event Listeners
    document.addEventListener('mousemove', (e)=>{this.onDocumentMouseMove(e);}, false);
    window.addEventListener( 'resize', (e)=>{this.onWindowResize(e);}, false );
    
    window.myscene = this.scene;  //todo : remove this
    window.myclass = this;        // todo : remove this
  }
  
  onDocumentMouseMove(event) {
    this.mouse.x = (event.clientX / this.viewerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.viewerHeight) * 2 + 1;
    this.mouseClient.x = event.clientX;
    this.mouseClient.y = event.clientY;
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    // this.intersects = this.raycaster.intersectObject(this.scene.children[2], true);
    // if (this.intersects.length) {
    //   this.intersects[0].object.material.forEach(element => {
    //     element.color.set(0xff0000);
    //   });
    //   this.modalStateSetter(
    //     new ModalWinOptions()
    //     .setText(this.intersects[0].object.name)
    //     .setPosition(window.innerWidth - event.clientX, event.clientY)
    //     .setVisibility(true)
    //   );
    // } else {
    //   this.modalStateSetter(new ModalWinOptions().setVisibility(false));
    // }
  }
  
  onWindowResize (event) {
    this.viewerWidth = this.container.clientWidth;
    this.viewerHeight = this.container.clientHeight;
    this.camera.aspect = this.viewerWidth / this.viewerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewerWidth, this.viewerHeight);
    this.modalStateSetter(new ModalWinOptions().setVisibility(false))
  }
  
  setCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.viewerWidth / this.viewerHeight, 1, 2000);
    this.camera.position.z = 250;
  }
  
  setLighting() {
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    var pointLight = new THREE.PointLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
    //this.scene.add(pointLight);
    this.camera.add(pointLight);  // point light is attached to camera
  }
  
  addCameraToscene() {
    this.scene.add(this.camera);
  }
  
  addObjToScene(obj) {
    this.scene.add(obj);
  }
  
  addControls() {
    var oc = new OC(this.camera, this.container);
    oc.minAzimuthAngle = 0 - (Math.PI);
    oc.maxAzimuthAngle = 0 + (Math.PI);
    oc.minPolarAngle = 0 - (Math.PI/2);
    oc.maxPolarAngle = 0 + (Math.PI/2);
  }
  
  LoadModel(fileName) {
    var objLoader = new ObjModelLoader();
    return objLoader.loadObj(fileName)
  }
  
  LoadModelAndMtl(objFile, mtlFile) {
    var objLoader = new ObjModelLoader();
    return objLoader.load(objFile, mtlFile)
  }
  
  initRender() {
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.viewerWidth, this.viewerHeight);
		this.container.appendChild(this.renderer.domElement);
  }
  
  /**
  * @private
  */
  _render() {
    this.camera.lookAt(this.scene.position);
    /** Ray caster for selection highlighting */
    this.raycaster.setFromCamera(this.mouse, this.camera);
    if(this.scene.children[2] !== undefined) {
      let intersects = this.raycaster.intersectObject(this.scene.children[2], true);
      if (intersects.length) {
        if (this.intersected != intersects[0].object) {
          if (this.intersected) this.intersected.material.forEach(e => e.emissive.setHex(this.intersected.currentHex));
          this.intersected = intersects[0].object;
          this.intersected.currentHex = this.intersected.material[0].emissive.getHex();
          this.intersected.material.forEach(e => e.emissive.setHex(0xff0000));
        } 
        // this.intersects[0].object.material.forEach(element => {
        //   element.color.set(0xff0000);
        // });
        this.modalStateSetter(
          new ModalWinOptions()
          .setText(this.intersected.name)
          .setPosition(window.innerWidth - this.mouseClient.x, this.mouseClient.y)
          .setVisibility(true)
        );        
      } else {
        if (this.intersected) this.intersected.material.forEach(e => e.emissive.setHex(this.intersected.currentHex));
        this.intersected = null;
        this.modalStateSetter(new ModalWinOptions().setVisibility(false));
      }
      /** render scene */
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  setModalStateSetter(callback){
    this.modalStateSetter = callback
  }
}

export default SceneCreator;