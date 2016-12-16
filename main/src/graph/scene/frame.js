import { updateProjection } from './init';

/**
 * @ignore
 */
export function onFrame () {

    if (this.hasOwnProjection) {
        checkProjectionNeedsUpdate(this);
        updateProjection(this);
    }

    checkResize(this);
    createRenderCommand(this);

}

/**
 * @ignore
 */
export function onFrameEnd () {

    this.app.renderer.addRenderCommand(this.renderPostCmd, null);

}

/**
 * @ignore
 */
function createRenderCommand (scene) {

    let renderCmd = scene.renderCmd;
    renderCmd.uniforms.renderPrio = scene.renderPrio;
    scene.app.renderer.addRenderCommand(renderCmd, null);

}

/**
 * @ignore
 */
function checkResize (scene) {

    let width      = scene.width;
    let height     = scene.height;
    let pixelRatio = scene.pixelRatio;
    let uniforms   = scene.renderCmd.uniforms;

    if (width !== scene.prevWidth || height !== scene.prevHeight || pixelRatio !== scene.prevPixelRatio) {

        scene.prevWidth      = width;
        scene.prevHeight     = height;
        scene.prevPixelRatio = pixelRatio;

        uniforms.sceneInfo[0] = scene.width;
        uniforms.sceneInfo[1] = scene.height;
        uniforms.sceneInfo[2] = scene.pixelRatio;

        /*
         * Announce a scene size ( width, height or pixelRatio ) change.
         * @param {number} width
         * @param {number} height
         * @param {number} pixelRatio
         */

        scene.emit('resize', width, height, pixelRatio);

    }

}

/**
 * @ignore
 */
function checkProjectionNeedsUpdate (scene) {

    let parent = scene.scene || scene.app;

    if (   parent.width !== scene.parentResolution.width
        || parent.height !== scene.parentResolution.height
        || parent.pixelRatio !== scene.parentResolution.pixelRatio
        || parent.devicePixelRatio !== scene.parentResolution.devicePixelRatio ) {

            scene.parentResolution.width = scene.parentResolution.width;
            scene.parentResolution.height = scene.parentResolution.height;
            scene.parentResolution.pixelRatio = scene.parentResolution.pixelRatio;
            scene.parentResolution.devicePixelRatio = scene.parentResolution.devicePixelRatio;

            scene.projectionNeedsUpdate = true;

        }
}

/**
 * @ignore
 */
export function onRootFrame () {

    let scene = this;
    let uniforms = scene.rootRenderCmd.uniforms;
    let app = scene.app;

    uniforms.iGlobalTime    = app.now;
    uniforms.iFrameNo       = app.frameNo;
    uniforms.iResolution[0] = app.width;
    uniforms.iResolution[1] = app.height;

    app.renderer.addRenderCommand(scene.rootRenderCmd);

}

