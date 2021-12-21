class Resize{
  static instance;
  constructor(){
    Resize.instance = this;
    window.removeEventListener('resize', this.onResize.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  updateCanvas(_canvas){
    this.canvas = _canvas;
    return this
  }

  updateCamera(_camera){
    this.camera = _camera;
    return this
  }

  updateRenderer(_renderer){
    this.renderer = _renderer;
    return this
  }

  onResize(event){
    if(this.canvas && this.camera && this.renderer){
      let aspectRatio = window.innerWidth / window.innerHeight;
      
      this.camera.aspect = aspectRatio;  
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }
}

function getInstance(){
  if(!Resize.instance)
    return new Resize();
  else
    return Resize.instance;
}

export default {
  getInstance,
};