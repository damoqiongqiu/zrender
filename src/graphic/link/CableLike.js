import LinkControl from './LinkControl';
import * as matrixUtil from '../../utils/affine_matrix_util';

/**
 * @abstract
 * @class qrenderer.graphic.link.CableLike
 * This is an abstract class, anything want to work like a cable can mixin this implementation.
 * To implement some complex scenarios in the future, here are the things need to be noted:
 * - CableLike is always drawn in global space.
 * - CableLike can translate, but can NOT scale, rotate, skew. 
 * - CableLink always has two endpoints, even polyline can't have any more.
 * - CableLink does NOT belong to any group.
 * - The class mixed-in this implementation is assumed mixed-in Eventful because we need event system.
 * 
 * 
 * 连接线抽象类，需要成为连接线的类都可以混入此抽象类的实现。
 * 为了方便实现一些复杂的连接场景，特别注意：
 * - 连接线总是画在全局坐标系中。
 * - 连接线可以移动位置，但不能缩放、旋转、斜切。
 * - 连接线只有两个端点，即使是折线，也是两个端点，不会有更多。
 * - 连线不属于任何分组。
 * - 混入此实现的类默认假定已经混入了 Eventful ，因为我们需要事件系统。
 */
function CableLike(){
    this.isCable=false;
    this.showLinkControls = false;
    this.startBounding = null;      //bounding rect of start shape
    this.endBounding = null;        //bounding rect of end shape
    
    this.startControl = new LinkControl({
        el:this,
        name:'START'
    });

    this.endControl = new LinkControl({
        el:this,
        name:'END'
    });

    this.on("afterRender",this.afterRenderHandler,this);
}

CableLike.prototype={
    constructor:CableLike,

    afterRenderHandler:function(){
        if(!this.isCable){
            return;
        }
        if(this.showLinkControls){
            this.renderLinkControls(this.ctx, this.prevEl);
        }
        this.startControl.trigger("afterRender",this.startControl);
        this.endControl.trigger("afterRender",this.endControl);
    },

    /**
     * @protected
     * @method renderTransformControls
     * @param {*} ctx 
     * @param {*} prevEl 
     */
    renderLinkControls:function(ctx, prevEl){
        this.startControl.render(ctx,prevEl);
        this.endControl.render(ctx,prevEl);
    },

    setStartBounding(startBounding){
        this.startBounding=startBounding;
    },

    setEndBounding(endBounding){
        this.endBounding=endBounding;
    }
}

export default CableLike;