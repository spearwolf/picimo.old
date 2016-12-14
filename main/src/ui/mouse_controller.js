import eventize from '@spearwolf/eventize';

const MOUSE_BTN_LEFT   = 0;
const MOUSE_BTN_MIDDLE = 1;
const MOUSE_BTN_RIGHT  = 2;

export default class MouseController {

    constructor (picimo) {

        this.picimo = picimo;

        this.mouseBtnDown = [false, false, false];
        this.mouseBtnMove = [false, false, false];
        this.isDrag = false;

        registerMouseListeners(this);

        eventize(this);

    }

    mouseDown (event) {
        this.mouseBtnDown[event.button] = true;
        this.mouseBtnMove[event.button] = false;
    }

    mouseMove (event) {

        this.mouseBtnMove[MOUSE_BTN_LEFT] = this.mouseBtnDown[MOUSE_BTN_LEFT];
        this.mouseBtnMove[MOUSE_BTN_MIDDLE] = this.mouseBtnDown[MOUSE_BTN_MIDDLE];
        this.mouseBtnMove[MOUSE_BTN_RIGHT] = this.mouseBtnDown[MOUSE_BTN_RIGHT];

        this.isDrag = this.isSomeBtnDown;

        const dpr = this.picimo.devicePixelRatio;
        const moveEvent = movement(event, this.isDrag, dpr);

        this.emit('mouseMove', moveEvent, this);

        if (this.mouseBtnDown[MOUSE_BTN_LEFT]) this.emit('mouseDragLeft', moveEvent, this);
        if (this.mouseBtnDown[MOUSE_BTN_MIDDLE]) this.emit('mouseDragMiddle', moveEvent, this);
        if (this.mouseBtnDown[MOUSE_BTN_RIGHT]) this.emit('mouseDragRight', moveEvent, this);

    }

    mouseUp (event) {

        let btn = event.button;
        this.mouseBtnDown[btn] = false;

        this.isDrag = this.isSomeBtnDown;

        if (this.mouseBtnMove[btn]) {
            this.mouseBtnMove[btn] = false;
        } else {
            if (btn === MOUSE_BTN_LEFT) this.emit('mouseClickLeft', event, this);
            if (btn === MOUSE_BTN_MIDDLE) this.emit('mouseClickMiddle', event, this);
            if (btn === MOUSE_BTN_RIGHT) this.emit('mouseClickRight', event, this);
        }

    }

    mouseWheel (event) {
        this.emit('mouseWheel', event.wheelDeltaX, event.wheelDeltaY, this);
    }

    get isBtnLeftDown () {
        return this.mouseBtnDown[MOUSE_BTN_LEFT];
    }

    get isBtnMiddleDown () {
        return this.mouseBtnDown[MOUSE_BTN_MIDDLE];
    }

    get isBtnRightDown () {
        return this.mouseBtnDown[MOUSE_BTN_RIGHT];
    }

    get isSomeBtnDown () {
        return (this.mouseBtnDown[MOUSE_BTN_LEFT] ||
                this.mouseBtnDown[MOUSE_BTN_MIDDLE] ||
                this.mouseBtnDown[MOUSE_BTN_RIGHT]);
    }

}

function movement (event, isDrag, devicePixelRatio) {

    return {
        isDrag     : isDrag,
        translateX :  event.movementX * devicePixelRatio,
        translateY : -event.movementY * devicePixelRatio,
    };

}

function registerMouseListeners (controller) {

    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
    // http://www.w3schools.com/jsref/dom_obj_event.asp

    controller.picimo.canvas.addEventListener('contextmenu', preventDefault, false);
    controller.picimo.canvas.addEventListener('mousedown', controller.mouseDown.bind(controller), false);

    document.addEventListener('mousemove', controller.mouseMove.bind(controller), false);
    document.addEventListener('mouseup', controller.mouseUp.bind(controller), false);
    document.addEventListener('mousewheel', controller.mouseWheel.bind(controller), false);

}

function preventDefault (event) {
    event.preventDefault();
    return false;
}

