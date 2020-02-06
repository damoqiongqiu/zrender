/**
 * Timeline，时间线，用来计算图元上的某个属性在指定时间点的数值。
 * 
 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
 * @config life(1000) 动画时长
 * @config delay(0) 动画延迟时间
 * @config loop(true)
 * @config gap(0) 循环的间隔时间
 * @config onframe
 * @config easing(optional)
 * @config ondestroy(optional)
 * @config onrestart(optional)
 *
 */
import easingFuncs from './utils/easing';

export default class Timeline{
    constructor(options){
        this._target = options.target;
        this._lifeTime = options.lifeTime || 1000;
        this._delay = options.delay || 0;
        this._initialized = false;
        this.loop = options.loop == null ? false : options.loop;
        this.gap = options.gap || 0;
        this.easing = options.easing || 'Linear';
        this.onframe = options.onframe;
        this.ondestroy = options.ondestroy;
        this.onrestart = options.onrestart;
    
        this._pausedTime = 0;
        this._paused = false;
    }

    nextFrame(globalTime, deltaTime) {
        // Set startTime on first frame, or _startTime may has milleseconds different between clips
        // PENDING
        if (!this._initialized) {
            this._startTime = globalTime + this._delay;
            this._initialized = true;
        }

        if (this._paused) {
            this._pausedTime += deltaTime;
            return;
        }

        let percent = (globalTime - this._startTime - this._pausedTime) / this._lifeTime;
        // 还没开始
        if (percent < 0) {
            return;
        }
        percent = Math.min(percent, 1);

        let easing = this.easing;
        let easingFunc = typeof easing === 'string' ? easingFuncs[easing] : easing;
        let schedule = typeof easingFunc === 'function'
            ? easingFunc(percent)
            : percent;

        this.fire('frame', schedule);

        // 结束或者重新开始周期
        // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
        // why?
        if (percent === 1) {
            if (this.loop) {
                this.restart(globalTime);
                return 'restart';
            }
            return 'destroy';
        }
        return percent;
    }

    restart(globalTime) {
        let remainder = (globalTime - this._startTime - this._pausedTime) % this._lifeTime;
        this._startTime = globalTime - remainder + this.gap;
        this._pausedTime = 0;
    }

    fire(eventType, arg) {
        eventType = 'on' + eventType;
        if (this[eventType]) {
            this[eventType](this._target, arg);
        }
    }

    pause() {
        this._paused = true;
    }

    resume() {
        this._paused = false;
    }
}