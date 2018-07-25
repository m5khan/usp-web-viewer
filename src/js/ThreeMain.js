/** created by shoaib khan on 30.4.2018 */
import SceneCreator from './SceneCreator';
import configs from '../../config.json';

export default function (threeElement, modalStateSetter) {
  let sc = new SceneCreator(threeElement);
  sc.setModalStateSetter(modalStateSetter);
  sc.setCamera();
  sc.setLighting();
  sc.addCameraToscene();
  /** Loading model with materials */
  sc.LoadModelAndMtl(configs.paths.defaultObj, configs.paths.defaultMtl)
  .then(obj => sc.addObjToScene(obj))
 
  /** Loading model without mtl */
  // sc.LoadModel(configs.paths.defaultObj)
  // .then(obj => sc.addObjToScene(obj))
 
  /** Loading model with backface culling enabled */
  // sc.LoadModel(configs.paths.defaultObj)
  // .then((obj) => {
  //   obj.children.forEach(el => {
  //     el.material.forEach(mt => {
  //       console.log(mt);
  //       mt.side = 2;          // 2 is equal to THREE.BothSide
  //     });
  //   });
  //   sc.addObjToScene(obj);
  // })
  // .catch((err) => {
  //   console.log('failed to load object', err);
  // });
  
  sc.addControls();
  sc.initRender();
  
  const animate = () => {
    requestAnimationFrame(animate);
    sc._render();
  };
  animate();
}
