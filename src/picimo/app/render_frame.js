'use strict';

export default function renderFrame () {

    this.now = window.performance.now() / 1000.0;
    ++this.frameNo;
    this.frameTime = this.frameLastTime == null ? 0.0 : this.frameLastTime - this.now;
    this.frameLastTime = this.now;

    this.resize();

    this.emit('frameBegin');

    this.renderer.onStartFrame();

    this.emit('frame');

    if (this.scene) {
        this.scene.renderFrame();
    }

    this.emit('renderFrame');

    this.renderer.onEndFrame();

    this.emit('frameEnd');

    requestAnimationFrame(this.onAnimationFrame);

}

