/**
 * @ignore
 */
export default function () {

    this.now = window.performance.now() / 1000.0;
    ++this.frameNo;
    this.frameTime = this.frameLastTime == null ? 0.0 : this.frameLastTime - this.now;
    this.frameLastTime = this.now;

    this.resize();

    if (!this.ready) {
        Object.defineProperty(this, 'ready', { value: true, configurable: true, enumerable: true });
        this.emit('ready');
        this.emit('resize');
    }

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

