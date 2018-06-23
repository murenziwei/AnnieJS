var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * annie引擎类的基类
     * @class annie.AObject
     * @since 1.0.0
     */
    var AObject = (function () {
        function AObject() {
            this._instanceId = 0;
            this._instanceType = "annie.AObject";
            this._instanceId = AObject._object_id++;
        }
        Object.defineProperty(AObject.prototype, "instanceId", {
            /**
             * 每一个annie引擎对象都会有一个唯一的id码。
             * @property instanceId
             * @public
             * @since 1.0.0
             * @returns {number}
             * @readonly
             * @example
             *      //获取 annie引擎类对象唯一码
             *      trace(this.instanceId);
             */
            get: function () {
                return this._instanceId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AObject.prototype, "instanceType", {
            /**
             * 每一个annie类都有一个实例类型字符串，通过这个字符串，你能知道这个实例是从哪个类实例而来
             * @property instanceType
             * @since 1.0.3
             * @public
             * @return {string}
             * @readonly
             */
            get: function () {
                return this._instanceType;
            },
            enumerable: true,
            configurable: true
        });
        AObject._object_id = 0;
        return AObject;
    }());
    annie.AObject = AObject;
    /**
     * 事件触发基类
     * @class annie.EventDispatcher
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            var _this = _super.call(this) || this;
            _this.eventTypes = {};
            _this.eventTypes1 = {};
            _this._instanceType = "annie.EventDispatcher";
            return _this;
        }
        /**
         * 看看有多少mouse或者touch侦听数
         * @method getMouseEventCount
         * @returns {number}
         * @static
         * @private
         * @since 1.0.0
         * @param {string} type 获取事件类型，默认是所有
         */
        EventDispatcher.getMouseEventCount = function (type) {
            if (type === void 0) { type = ""; }
            var count = 0;
            if (type == "") {
                //返回所有鼠标事件数
                for (var item in EventDispatcher._MECO) {
                    if (item.indexOf("onMouse") == 0) {
                        count += EventDispatcher._MECO[item];
                    }
                }
            }
            else {
                if (EventDispatcher._MECO[type]) {
                    count = EventDispatcher._MECO[type];
                }
            }
            return count;
        };
        /**
         * 给对象添加一个侦听
         * @method addEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @example
         *      this.addEventListener(annie.Event.ADD_TO_STAGE,function(e){trace(this);}.bind(this));
         */
        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (!type) {
                throw new Error("添加侦听的type值为undefined");
            }
            if (!listener) {
                throw new Error("侦听回调函数不能为null");
            }
            var s = this;
            if (!s.eventTypes[type]) {
                s.eventTypes[type] = [];
            }
            if (s.eventTypes[type].indexOf(listener) < 0) {
                s.eventTypes[type].unshift(listener);
                if (type.indexOf("onMouse") == 0) {
                    s._changeMouseCount(type, true);
                }
            }
        };
        /**
         * 增加或删除相应mouse或touch侦听记数
         * @method _changeMouseCount
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} isAdd
         */
        EventDispatcher.prototype._changeMouseCount = function (type, isAdd) {
            var count = isAdd ? 1 : -1;
            if (!EventDispatcher._MECO[type]) {
                EventDispatcher._MECO[type] = 0;
            }
            EventDispatcher._MECO[type] += count;
            if (EventDispatcher._MECO[type] < 0) {
                EventDispatcher._MECO[type] = 0;
            }
            EventDispatcher._totalMEC += count;
        };
        /**
         * 广播侦听
         * @method dispatchEvent
         * @public
         * @since 1.0.0
         * @param {annie.Event|string} event 广播所带的事件对象,如果传的是字符串则直接自动生成一个的事件对象,事件类型就是你传入进来的字符串的值
         * @param {Object} data 广播后跟着事件一起传过去的其他任信息,默认值为null
         * @returns {boolean} 如果有收听者则返回true
         * @example
         *      var mySprite=new annie.Sprite(),
         *          yourEvent=new annie.Event("yourCustomerEvent");
         *       yourEvent.data='Flash2x';
         *       mySprite.addEventListener("yourCustomerEvent",function(e){
         *          trace(e.data);
         *        })
         *       mySprite.dispatchEvent(yourEvent);
         */
        EventDispatcher.prototype.dispatchEvent = function (event, data) {
            if (data === void 0) { data = null; }
            var s = this;
            if (typeof (event) == "string") {
                event = new annie.Event(event);
            }
            var listeners = s.eventTypes[event.type];
            if (listeners) {
                var len = listeners.length;
                if (event.target == null) {
                    event.target = s;
                }
                if (data != null) {
                    event.data = data;
                }
                for (var i = len - 1; i >= 0; i--) {
                    if (listeners[i]) {
                        listeners[i](event);
                    }
                    else {
                        listeners.splice(i, 1);
                    }
                }
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * 是否有添加过此类形的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {number} state 0 查找所有 1 只找从事件对象本身向上冒泡的事件类型线路查找 2 只找从最上层向事件对象本身的线路事件类型查找
         * @returns {boolean} 如果有则返回true
         */
        EventDispatcher.prototype.hasEventListener = function (type, state) {
            if (state === void 0) { state = 0; }
            if (state == 0 || state == 1) {
                if (this.eventTypes[type] && this.eventTypes[type].length > 0) {
                    return true;
                }
            }
            if (state == 0 || state == 2) {
                if (this.eventTypes1[type] && this.eventTypes1[type].length > 0) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 移除对应类型的侦听
         * @method removeEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 要移除的侦听类型
         * @param {Function} listener 及侦听时绑定的回调方法
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            var s = this;
            var listeners = s.eventTypes[type];
            if (listeners) {
                var len = listeners.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        if (type.indexOf("onMouse") == 0) {
                            s._changeMouseCount(type, false);
                        }
                    }
                }
            }
        };
        /**
         * 移除对象中所有的侦听
         * @method removeAllEventListener
         * @public
         * @since 1.0.0
         */
        EventDispatcher.prototype.removeAllEventListener = function () {
            var s = this;
            for (var type in s.eventTypes) {
                if (type.indexOf("onMouse") == 0) {
                    for (var j = 0; j < s.eventTypes[type].length; j++) {
                        s._changeMouseCount(type, false);
                    }
                }
            }
            s.eventTypes = {};
        };
        EventDispatcher.prototype.destroy = function () {
            var s = this;
            s.removeAllEventListener();
            s.eventTypes = null;
        };
        /**
         * 全局的鼠标事件的监听数对象表
         * @property _MECO
         * @private
         * @since 1.0.0
         */
        EventDispatcher._MECO = {};
        EventDispatcher._totalMEC = 0;
        return EventDispatcher;
    }(AObject));
    annie.EventDispatcher = EventDispatcher;
    /**
     * 全局事件侦听
     * @property globalDispatcher
     * @type {annie.EventDispatcher}
     */
    annie.globalDispatcher = new EventDispatcher();
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 事件类,annie引擎中一切事件的基类
     * @class annie.Event
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        /**
         * @method Event
         * @param {string} type 事件类型
         */
        function Event(type) {
            var _this = _super.call(this) || this;
            /**
             * 事件类型名
             * @property type
             * @type {string}
             * @public
             * @since 1.0.0
             */
            _this.type = "";
            /**
             * 触发此事件的对象
             * @property target
             * @public
             * @since 1.0.0
             * @type {any}
             */
            _this.target = null;
            /**
             * 随着事件一起附带的信息对象
             * 所有需要随事件一起发送的信息都可以放在此对象中
             * @property data
             * @public
             * @since 1.0.0
             * @type {any}
             * @default null
             */
            _this.data = null;
            /**
             * 是否阻止事件向下冒泡
             * @property _pd
             * @type {boolean}
             * @private
             * @since 1.0.0
             */
            _this._pd = false;
            _this._instanceType = "annie.Event";
            _this.type = type;
            return _this;
        }
        /**
         * 阻止向下冒泡事件,如果在接收到事件后调用事件的这个方法,那么这个事件将不会再向显示对象的子级派送
         * @method preventDefault
         * @public
         * @since 1.0.0
         */
        Event.prototype.preventDefault = function () {
            this._pd = true;
        };
        /**
         * @method destroy
         * @public
         * @since 2.0.0
         * @returns {void}
         */
        Event.prototype.destroy = function () {
            var s = this;
            s.target = null;
            s.data = null;
        };
        /**
         * 舞台尺寸发生变化时触发
         * @Event
         * @property RESIZE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.RESIZE = "onResize";
        /**
         * annie.Media相关媒体类的播放刷新事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_UPDATE
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_PLAY_UPDATE = "onPlayUpdate";
        /**
         * annie.Media相关媒体类的播放完成事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_PLAY_END = "onPlayEnd";
        /**
         * annie.Media相关媒体类的开始播放事件。像annie.Sound annie.Video都可以捕捉这种事件。
         * @property ON_PLAY_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_PLAY_START = "onPlayStart";
        /**
         * annieUI.FlipBook组件翻页开始事件
         * @property ON_FLIP_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_FLIP_START = "onFlipStart";
        /**
         * annieUI.FlipBook组件翻页结束事件
         * @property ON_FLIP_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_FLIP_STOP = "onFlipStop";
        /**
         * annieUI.ScrollPage组件滑动到开始位置事件
         * @property ON_SCROLL_TO_HEAD
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_TO_HEAD = "onScrollToHead";
        /**
         * annieUI.ScrollPage组件停止滑动事件
         * @property ON_SCROLL_STOP
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_STOP = "onScrollStop";
        /**
         * annieUI.ScrollPage组件开始滑动事件
         * @property ON_SCROLL_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_START = "onScrollStart";
        /**
         * annieUI.ScrollPage组件滑动到结束位置事件
         * @property ON_SCROLL_TO_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SCROLL_TO_END = "onScrollToEnd";
        /**
         * annieUI.Slide 组件开始滑动事件
         * @property ON_SLIDE_START
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SLIDE_START = "onSlideStart";
        /**
         * annieUI.Slide 组件结束滑动事件
         * @property ON_SLIDE_END
         * @static
         * @since 1.1.0
         * @type {string}
         */
        Event.ON_SLIDE_END = "onSlideEnd";
        /**
         * 舞台初始化完成后会触发的事件
         * @Event
         * @property ON_STAGE_INIT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.INIT_TO_STAGE = "onInitStage";
        /**
         * 显示对象加入到舞台事件
         * @Event
         * @property ADD_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ADD_TO_STAGE = "onAddToStage";
        /**
         * 显示对象从舞台移出事件
         * @Event
         * @property REMOVE_TO_STAGE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.REMOVE_TO_STAGE = "onRemoveToStage";
        /**
         * 显示对象 循环帧事件
         * @Event
         * @property ENTER_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ENTER_FRAME = "onEnterFrame";
        /**
         * MovieClip 播放完成事件
         * @Event
         * @property END_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.END_FRAME = "onEndFrame";
        /**
         * MovieClip 帧标签事件
         * @Event
         * @property CALL_FRAME
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.CALL_FRAME = "onCallFrame";
        /**
         * 完成事件
         * @Event
         * @property COMPLETE
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.COMPLETE = "onComplete";
        /**
         * 加载过程事件
         * @Event
         * @property PROGRESS
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.PROGRESS = "onProgress";
        /**
         * 出错事件
         * @Event
         * @property ERROR
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ERROR = "onError";
        /**
         * 中断事件
         * @Event
         * @property ABORT
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.ABORT = "onAbort";
        /**
         * 开始事件
         * @Event
         * @property START
         * @type {string}
         * @static
         * @public
         * @since 1.0.0
         */
        Event.START = "onStart";
        /**
         * 定时器触发事件
         * @property TIMER
         * @static
         * @since 1.0.9
         * @public
         * @type {string}
         */
        Event.TIMER = "onTimer";
        /**
         * 定时器完成事件
         * @property TIMER_COMPLETE
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        Event.TIMER_COMPLETE = "onTimerComplete";
        return Event;
    }(annie.AObject));
    annie.Event = Event;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 鼠标事件类,电脑端鼠标,移动设备端的触摸都使用此事件来监听
     * @class annie.MouseEvent
     * @extends annie.Event
     * @public
     * @since 1.0.0
     */
    var MouseEvent = (function (_super) {
        __extends(MouseEvent, _super);
        /**
         * @method MouseEvent
         * @public
         * @since 1.0.0
         * @param {string} type
         */
        function MouseEvent(type) {
            var _this = _super.call(this, type) || this;
            /**
             * mouse或touch事件时rootDiv坐标x点
             * @property clientX
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.clientX = 0;
            /**
             * mouse或touch事件时rootDiv坐标y点
             * @property clientY
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.clientY = 0;
            /**
             * mouse或touch事件时全局坐标x点
             * @property stageX
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.stageX = 0;
            /**
             * mouse或touch事件时全局坐标y点
             * @property stageY
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.stageY = 0;
            /**
             * mouse或touch事件时本地坐标x点
             * @property localX
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.localX = 0;
            /**
             * mouse或touch事件时本地坐标y点
             * @property localY
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.localY = 0;
            /**
             * 绑定此事件的侦听对象
             * @property currentTarget
             * @public
             * @since 1.0.0
             * @type{annie.DisplayObject}
             * @default null
             */
            _this.currentTarget = null;
            /**
             * 触摸或者鼠标事件的手指唯一标识
             * @property identifier
             * @type {number}
             * @since 1.1.2
             * @public
             */
            _this.identifier = 0;
            _this._instanceType = "annie.MouseEvent";
            return _this;
        }
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         */
        MouseEvent.prototype.updateAfterEvent = function () {
            this.target.stage._cp = true;
        };
        MouseEvent.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s.currentTarget = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * 鼠标或者手指按下事件
         * @property MOUSE_DOWN
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_DOWN = "onMouseDown";
        /**
         * 鼠标或者手指抬起事件
         * @property MOUSE_UP
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_UP = "onMouseUp";
        /**
         * 鼠标或者手指单击
         * @property CLICK
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.CLICK = "onMouseClick";
        /**
         * 鼠标或者手指移动事件
         * @property MOUSE_MOVE
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_MOVE = "onMouseMove";
        /**
         * 鼠标或者手指移入到显示对象上里触发的事件
         * @property MOUSE_OVER
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_OVER = "onMouseOver";
        /**
         * 鼠标或者手指移出显示对象边界触发的事件
         * @property MOUSE_OUT
         * @static
         * @public
         * @since 1.0.0
         * @type {string}
         */
        MouseEvent.MOUSE_OUT = "onMouseOut";
        return MouseEvent;
    }(annie.Event));
    annie.MouseEvent = MouseEvent;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 多点触碰事件。单点事件请使用mouseEvent,pc和mobile通用
     * @class annie.TouchEvent
     * @extends annie.Event
     */
    var TouchEvent = (function (_super) {
        __extends(TouchEvent, _super);
        /**
         * @method TouchEvent
         * @public
         * @since 1.0.3
         * @param {string} type
         */
        function TouchEvent(type) {
            var _this = _super.call(this, type) || this;
            /**
             * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第1个点。
             * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
             * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
             * @property clientPoint1
             * @public
             * @since 1.0.3
             * @type {annie.Point}
             */
            _this.clientPoint1 = new annie.Point();
            /**
             * 多点事件中点的信息,两个手指的点的在Canvas中的信息，第2个点。
             * 此点坐标不是显示对象中的点坐标，是原始的canvas中的点坐标。
             * 如果需要获取显示对象中此点对应的位置，包括stage在内，请用对象的getGlobalToLocal方法转换。
             * @property clientPoint2
             * @public
             * @since 1.0.3
             * @type {annie.Point}
             */
            _this.clientPoint2 = new annie.Point();
            /**
             * 相对于上一次的缩放值
             * @property scale
             * @since 1.0.3
             */
            _this.scale = 0;
            /**
             * 相对于上一次的旋转值
             * @property rotate
             * @since 1.0.3
             */
            _this.rotate = 0;
            _this._instanceType = "annie.TouchEvent";
            return _this;
        }
        /**
         * 事件后立即更新显示列表状态
         * @method updateAfterEvent
         * @since 1.0.9
         * @public
         */
        TouchEvent.prototype.updateAfterEvent = function () {
            this.target.stage._cp = true;
        };
        TouchEvent.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s.clientPoint1 = null;
            s.clientPoint2 = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * @property ON_MULTI_TOUCH
         * @static
         * @public
         * @since 1.0.3
         * @type {string}
         */
        TouchEvent.ON_MULTI_TOUCH = "onMultiTouch";
        return TouchEvent;
    }(annie.Event));
    annie.TouchEvent = TouchEvent;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * @class annie.Point
     * @extends annie.AObject
     * @since 1.0.0
     * @public
     */
    var Point = (function (_super) {
        __extends(Point, _super);
        /**
         * 构造函数
         * @method Point
         * @public
         * @since 1.0.0
         * @param x
         * @param y
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            /**
             * 水平坐标
             * @property x
             * @public
             * @since 1.0.0
             * @type{number}
             */
            _this.x = 0;
            /**
             * 垂直坐标
             * @property y
             * @since 1.0.0
             * @public
             * @type {number}
             */
            _this.y = 0;
            var s = _this;
            s._instanceType = "annie.Point";
            s.x = x;
            s.y = y;
            return _this;
        }
        Point.prototype.destroy = function () { };
        /**
         * 求两点之间的距离
         * @method distance
         * @param args 可变参数 传两个参数的话就是两个annie.Point类型 传四个参数的话分别是两个点的x y x y
         * @returns {number}
         */
        Point.distance = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var len = args.length;
            if (len == 4) {
                return Math.sqrt((args[0] - args[2]) * (args[0] - args[2]) + (args[1] - args[3]) * (args[1] - args[3]));
            }
            else if (len == 2) {
                return Math.sqrt((args[0].x - args[1].x) * (args[0].x - args[1].x) + (args[0].y - args[1].y) * (args[0].y - args[1].y));
            }
        };
        return Point;
    }(annie.AObject));
    annie.Point = Point;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    var PI = Math.PI;
    var HalfPI = PI >> 1;
    var PacPI = PI + HalfPI;
    var TwoPI = PI << 1;
    var DEG_TO_RAD = Math.PI / 180;
    function cos(angle) {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 0;
            case PI:
            case -PI:
                return -1;
            case PacPI:
            case -HalfPI:
                return 0;
            default:
                return Math.cos(angle);
        }
    }
    /**
     * @private
     */
    function sin(angle) {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 1;
            case PI:
            case -PI:
                return 0;
            case PacPI:
            case -HalfPI:
                return -1;
            default:
                return Math.sin(angle);
        }
    }
    /**
     * 2维矩阵,不熟悉的朋友可以找相关书箱看看
     * @class annie.Matrix
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var Matrix = (function (_super) {
        __extends(Matrix, _super);
        /**
         * 构造函数
         * @method Matrix
         * @param {number} a
         * @param {number} b
         * @param {number} c
         * @param {number} d
         * @param {number} tx
         * @param {number} ty
         * @public
         * @since 1.0.0
         */
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            var _this = _super.call(this) || this;
            /**
             * @property a
             * @type {number}
             * @public
             * @default 1
             * @since 1.0.0
             */
            _this.a = 1;
            /**
             * @property b
             * @public
             * @since 1.0.0
             * @type {number}
             */
            _this.b = 0;
            /**
             * @property c
             * @type {number}
             * @public
             * @since 1.0.0
             */
            _this.c = 0;
            /**
             * @property d
             * @type {number}
             * @public
             * @since 1.0.0
             */
            _this.d = 1;
            /**
             * @property tx
             * @type {number}
             * @public
             * @since 1.0.0
             */
            _this.tx = 0;
            /**
             * @property ty
             * @type {number}
             * @since 1.0.0
             * @public
             */
            _this.ty = 0;
            /**
             * 将一个点通过矩阵变换后的点
             * @method transformPoint
             * @param {number} x
             * @param {number} y
             * @param {annie.Point} 默认为空，如果不为null，则返回的是Point就是此对象，如果为null，则返回来的Point是新建的对象
             * @returns {annie.Point}
             * @public
             * @since 1.0.0
             */
            _this.transformPoint = function (x, y, bp) {
                if (bp === void 0) { bp = null; }
                var s = this;
                if (!bp) {
                    bp = new annie.Point();
                }
                bp.x = x * s.a + y * s.c + s.tx;
                bp.y = x * s.b + y * s.d + s.ty;
                return bp;
            };
            /**
             * 矩阵相乘
             * @method prepend
             * @public
             * @since 1.0.0
             * @param {annie.Matrix} mtx
             */
            _this.prepend = function (mtx) {
                var s = this;
                var a = mtx.a;
                var b = mtx.b;
                var c = mtx.c;
                var d = mtx.d;
                var tx = mtx.tx;
                var ty = mtx.ty;
                var a1 = s.a;
                var c1 = s.c;
                var tx1 = s.tx;
                s.a = a * a1 + c * s.b;
                s.b = b * a1 + d * s.b;
                s.c = a * c1 + c * s.d;
                s.d = b * c1 + d * s.d;
                s.tx = a * tx1 + c * s.ty + tx;
                s.ty = b * tx1 + d * s.ty + ty;
            };
            var s = _this;
            s._instanceType = "annie.Matrix";
            s.a = a;
            s.b = b;
            s.c = c;
            s.d = d;
            s.tx = tx;
            s.ty = ty;
            return _this;
        }
        /**
         * 复制一个矩阵
         * @method clone
         * @since 1.0.0
         * @public
         * @returns {annie.Matrix}
         */
        Matrix.prototype.clone = function () {
            var s = this;
            return new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
        };
        /**
         * 从一个矩阵里赋值给这个矩阵
         * @method setFrom
         * @param {annie.Matrix} mtx
         * @public
         * @since 1.0.0
         */
        Matrix.prototype.setFrom = function (mtx) {
            var s = this;
            s.a = mtx.a;
            s.b = mtx.b;
            s.c = mtx.c;
            s.d = mtx.d;
            s.tx = mtx.tx;
            s.ty = mtx.ty;
        };
        /**
         * 将矩阵恢复成原始矩阵
         * @method
         * @public
         * @since 1.0.0
         */
        Matrix.prototype.identity = function () {
            var s = this;
            s.a = s.d = 1;
            s.b = s.c = s.tx = s.ty = 0;
        };
        /**
         * 反转一个矩阵
         * @method
         * @returns {Matrix}
         * @since 1.0.0
         * @public
         */
        Matrix.prototype.invert = function () {
            var s = this;
            var target = new Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
            var a = s.a;
            var b = s.b;
            var c = s.c;
            var d = s.d;
            var tx = s.tx;
            var ty = s.ty;
            if (b == 0 && c == 0) {
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                }
                else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }
                return target;
            }
            var determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return target;
            }
            determinant = 1 / determinant;
            var k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
            return target;
        };
        /**
         * 设置一个矩阵通过普通的显示对象的相关九大属性
         * @method createBox
         * @param {number} x
         * @param {number} y
         * @param {number} scaleX
         * @param {number} scaleY
         * @param {number} rotation
         * @param {number} skewX
         * @param {number} skewY
         * @param {number} ax
         * @param {number} ay
         * @since 1.0.0
         * @public
         */
        Matrix.prototype.createBox = function (x, y, scaleX, scaleY, rotation, skewX, skewY, ax, ay) {
            var s = this;
            if (rotation != 0) {
                skewX = skewY = rotation % 360;
            }
            else {
                skewX %= 360;
                skewY %= 360;
            }
            if ((skewX == 0) && (skewY == 0)) {
                s.a = scaleX;
                s.b = s.c = 0;
                s.d = scaleY;
            }
            else {
                skewX *= DEG_TO_RAD;
                skewY *= DEG_TO_RAD;
                var u = cos(skewX);
                var v = sin(skewX);
                if (skewX == skewY) {
                    s.a = u * scaleX;
                    s.b = v * scaleX;
                }
                else {
                    s.a = cos(skewY) * scaleX;
                    s.b = sin(skewY) * scaleX;
                }
                s.c = -v * scaleY;
                s.d = u * scaleY;
            }
            ;
            s.tx = x + ax - (ax * s.a + ay * s.c);
            s.ty = y + ay - (ax * s.b + ay * s.d);
        };
        /**
         * 判断两个矩阵是否相等
         * @method isEqual
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Matrix} m1
         * @param {annie.Matrix} m2
         * @returns {boolean}
         */
        Matrix.isEqual = function (m1, m2) {
            return m1.tx == m2.tx && m1.ty == m2.ty && m1.a == m2.a && m1.b == m2.b && m1.c == m2.c && m1.d == m2.d;
        };
        Matrix.prototype.concat = function (mtx) {
            var s = this;
            var a = s.a, b = s.b, c = s.c, d = s.d, tx = s.tx, ty = s.ty;
            var ma = mtx.a, mb = mtx.b, mc = mtx.c, md = mtx.d, mx = mtx.tx, my = mtx.ty;
            s.a = a * ma + b * mc;
            s.b = a * mb + b * md;
            s.c = c * ma + d * mc;
            s.d = c * mb + d * md;
            s.tx = tx * ma + ty * mc + mx;
            s.ty = tx * mb + ty * md + my;
        };
        /**
         * 对矩阵应用旋转转换。
         * @method rotate
         * @param angle
         * @since 1.0.3
         * @public
         */
        Matrix.prototype.rotate = function (angle) {
            var s = this;
            var sin = Math.sin(angle), cos = Math.cos(angle), a = s.a, b = s.b, c = s.c, d = s.d, tx = s.tx, ty = s.ty;
            s.a = a * cos - b * sin;
            s.b = a * sin + b * cos;
            s.c = c * cos - d * sin;
            s.d = c * sin + d * cos;
            s.tx = tx * cos - ty * sin;
            s.ty = tx * sin + ty * cos;
        };
        /**
         * 对矩阵应用缩放转换。
         * @method scale
         * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
         * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
         * @since 1.0.3
         * @public
         */
        Matrix.prototype.scale = function (sx, sy) {
            var s = this;
            s.a *= sx;
            s.d *= sy;
            s.c *= sx;
            s.b *= sy;
            s.tx *= sx;
            s.ty *= sy;
        };
        /**
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @method translate
         * @public
         * @since 1.0.3
         * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位
         * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位
         */
        Matrix.prototype.translate = function (dx, dy) {
            var s = this;
            s.tx += dx;
            s.ty += dy;
        };
        Matrix.prototype.destroy = function () {
        };
        return Matrix;
    }(annie.AObject));
    annie.Matrix = Matrix;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     *
     * @class annie.Rectangle
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        /**
         * 构造函数
         * @method Rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var _this = _super.call(this) || this;
            /**
             * 矩形左上角的 x 坐标
             * @property x
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.x = 0;
            /**
             * 矩形左上角的 y 坐标
             * @property y
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.y = 0;
            /**
             * 矩形的宽度（以像素为单位）
             * @property width
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.width = 0;
            /**
             * 矩形的高度（以像素为单位）
             * @property height
             * @public
             * @since 1.0.0
             * @type{number}
             * @default 0
             */
            _this.height = 0;
            var s = _this;
            s._instanceType = "annie.Rectangle";
            s.x = x;
            s.y = y;
            s.height = height;
            s.width = width;
            return _this;
        }
        /**
         * 判断一个点是否在矩形内包括边
         * @method isPointIn
         * @param {annie.Point} point
         * @returns {boolean}
         * @public
         * @since 1.0.0
         */
        Rectangle.prototype.isPointIn = function (point) {
            var s = this;
            return point.x >= s.x && point.x <= (s.x + s.width) && point.y >= s.y && point.y <= (s.y + s.height);
        };
        /**
         * 将多个矩形合成为一个矩形,并将结果存到第一个矩形参数，并返回
         * @method createFromRects
         * @param {annie.Rectangle} rect
         * @param {..arg} arg
         * @public
         * @since 1.0.0
         * @static
         */
        Rectangle.createFromRects = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            if (arg.length == 0) {
                return null;
            }
            else if (arg.length == 1) {
                return arg[0];
            }
            else {
                var rect = arg[0];
                var x = rect.x, y = rect.y, w = rect.width, h = rect.height, wx1 = void 0, wx2 = void 0, hy1 = void 0, hy2 = void 0;
                for (var i = 1; i < arg.length; i++) {
                    wx1 = x + w;
                    hy1 = y + h;
                    wx2 = arg[i].x + arg[i].width;
                    hy2 = arg[i].y + arg[i].height;
                    if (x > arg[i].x || wx1 == 0) {
                        x = arg[i].x;
                    }
                    if (y > arg[i].y || hy1 == 0) {
                        y = arg[i].y;
                    }
                    if (wx1 < wx2) {
                        wx1 = wx2;
                    }
                    if (hy1 < hy2) {
                        hy1 = hy2;
                    }
                    rect.x = x;
                    rect.y = y;
                    rect.width = wx1 - x;
                    rect.height = hy1 - y;
                }
                return rect;
            }
        };
        /**
         * 通过一系列点来生成一个矩形
         * 返回包含所有给定的点的最小矩形
         * @method createFromPoints
         * @static
         * @public
         * @since 1.0.0
         * @param {annie.Point} p1
         * @param {..arg} ary
         * @returns {annie.Rectangle}
         */
        Rectangle.createFromPoints = function (rect) {
            var arg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg[_i - 1] = arguments[_i];
            }
            var x = arg[0].x, y = arg[0].y, w = arg[0].x, h = arg[0].y;
            for (var i = 1; i < arg.length; i++) {
                if (arg[i] == null)
                    continue;
                if (x > arg[i].x) {
                    x = arg[i].x;
                }
                if (y > arg[i].y) {
                    y = arg[i].y;
                }
                if (w < arg[i].x) {
                    w = arg[i].x;
                }
                if (h < arg[i].y) {
                    h = arg[i].y;
                }
            }
            rect.x = x;
            rect.y = y;
            rect.width = w - x;
            rect.height = h - y;
            return rect;
        };
        /**
         * 通过两个点来确定一个矩形
         * @param rect
         * @param p1
         * @param p2
         */
        Rectangle.createRectform2Point = function (rect, p1, p2) {
            var x = p1.x, y = p1.y, w = p1.x, h = p1.y;
            if (x > p2.x) {
                x = p2.x;
            }
            if (y > p2.y) {
                y = p2.y;
            }
            if (w < p2.x) {
                w = p2.x;
            }
            if (h < p2.y) {
                h = p2.y;
            }
            rect.x = x, rect.y = y, rect.width = w - x, rect.height = h - y;
        };
        /**
         * 判读两个矩形是否相交
         * @method testRectCross
         * @public
         * @since 1.0.2
         * @param r1
         * @param r2
         * @return {boolean}
         */
        Rectangle.testRectCross = function (ra, rb) {
            var a_cx, a_cy; /* 第一个中心点*/
            var b_cx, b_cy; /* 第二个中心点*/
            a_cx = ra.x + (ra.width / 2);
            a_cy = ra.y + (ra.height / 2);
            b_cx = rb.x + (rb.width / 2);
            b_cy = rb.y + (rb.height / 2);
            return ((Math.abs(a_cx - b_cx) <= (ra.width / 2 + rb.width / 2)) && (Math.abs(a_cy - b_cy) <= (ra.height / 2 + rb.height / 2)));
        };
        Rectangle.prototype.destroy = function () {
        };
        return Rectangle;
    }(annie.AObject));
    annie.Rectangle = Rectangle;
})(annie || (annie = {}));
/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="../geom/Point.ts" />
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 显示对象抽象类,不能直接实例化。一切显示对象的基类,包含了显示对象需要的一切属性
     * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
     * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕
     * 上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、TextField 或 MovieClip 类。
     * @class annie.DisplayObject
     * @since 1.0.0
     * @extends annie.EventDispatcher
     */
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        /**
         * @method DisplayObject
         * @since 1.0.0
         * @public
         */
        function DisplayObject() {
            var _this = _super.call(this) || this;
            /**
             * 更新信息
             * @property _UI
             * @param UM 是否更新矩阵 UA 是否更新Alpha UF 是否更新滤镜
             */
            _this._UI = { UD: false, UM: true, UA: true, UF: false };
            /**
             * 此显示对象所在的舞台对象,如果此对象没有被添加到显示对象列表中,此对象为空。
             * @property stage
             * @public
             * @since 1.0.0
             * @type {Stage}
             * @default null;
             * @readonly
             * */
            _this.stage = null;
            /**
             * 显示对象的父级
             * @property parent
             * @since 1.0.0
             * @public
             * @type {annie.Sprite}
             * @default null
             * @readonly
             */
            _this.parent = null;
            /**
             * 显示对象在显示列表上的最终表现出来的透明度,此透明度会继承父级的透明度依次相乘得到最终的值
             * @property cAlpha
             * @private
             * @type {number}
             * @since 1.0.0
             * @default 1
             */
            _this.cAlpha = 1;
            /**
             * 显示对象上对显示列表上的最终合成的矩阵,此矩阵会继承父级的显示属性依次相乘得到最终的值
             * @property cMatrix
             * @private
             * @type {annie.Matrix}
             * @default null
             * @since 1.0.0
             */
            _this.cMatrix = new annie.Matrix();
            /**
             * 因为每次enterFrame事件时都生成一个Event非常浪费资源,所以做成一个全局的
             * @property _enterFrameEvent
             * @private
             * @type {annie.Event}
             * @default null
             * @since 1.0.0
             */
            _this._enterFrameEvent = null;
            /**
             * 是否可以接受点击事件,如果设置为false,此显示对象将无法接收到点击事件
             * @property mouseEnable
             * @type {boolean}
             * @public
             * @since 1.0.0
             * @default false
             */
            _this.mouseEnable = true;
            /**
             * 显示对象上对显示列表上的最终的所有滤镜组
             * @property cFilters
             * @private
             * @default []
             * @since 1.0.0
             * @type {Array}
             */
            _this.cFilters = [];
            /**
             * 每一个显示对象都可以给他启一个名字,这样我们在查找子级的时候就可以直接用this.getChildrndByName("name")获取到这个对象的引用
             * @property name
             * @since 1.0.0
             * @public
             * @type {string}
             * @default ""
             */
            _this.name = "";
            _this._x = 0;
            _this._y = 0;
            _this._scaleX = 1;
            _this._scaleY = 1;
            _this._rotation = 0;
            _this._alpha = 1;
            _this._skewX = 0;
            _this._skewY = 0;
            _this._anchorX = 0;
            _this._anchorY = 0;
            _this._visible = true;
            /**
             * 显示对象的混合模式
             * 支持的混合模式大概有
             * @property blendMode
             * @public
             * @since 1.0.0
             * @type {string}
             * @default 0
             */
            _this.blendMode = "normal";
            _this._matrix = new annie.Matrix();
            _this._mask = null;
            _this._filters = [];
            /**
             * 是否自己的父级发生的改变
             * @type {boolean}
             * @private
             */
            _this._cp = true;
            _this._dragBounds = new annie.Rectangle();
            _this._isDragCenter = false;
            _this._lastDragPoint = new annie.Point();
            /**
             * 缓存起来的纹理对象。最后真正送到渲染器去渲染的对象
             * @property _texture
             * @protected
             * @since 1.0.0
             * @type {any}
             * @default null
             */
            _this._texture = null;
            _this._bounds = new annie.Rectangle();
            _this._drawRect = new annie.Rectangle();
            _this._a2x_sounds = null;
            _this._a2x_res_obj = {};
            _this._instanceType = "annie.DisplayObject";
            return _this;
        }
        Object.defineProperty(DisplayObject.prototype, "x", {
            /**
             * 显示对象位置x
             * @property x
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._setProperty("_x", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            /**
             * 显示对象位置y
             * @property y
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._setProperty("_y", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            /**
             * 显示对象x方向的缩放值
             * @property scaleX
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             */
            get: function () {
                return this._scaleX;
            },
            set: function (value) {
                this._setProperty("_scaleX", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            /**
             * 显示对象y方向的缩放值
             * @property scaleY
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             */
            get: function () {
                return this._scaleY;
            },
            set: function (value) {
                this._setProperty("_scaleY", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotation", {
            /**
             * 显示对象旋转角度
             * @property rotation
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._setProperty("_rotation", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            /**
             * 显示对象透明度
             * @property alpha
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             */
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                this._setProperty("_alpha", value, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "skewX", {
            /**
             * 显示对象x方向的斜切值
             * @property skewX
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._skewX;
            },
            set: function (value) {
                this._setProperty("_skewX", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "skewY", {
            /**
             * 显示对象y方向的斜切值
             * @property skewY
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._skewY;
            },
            set: function (value) {
                this._setProperty("_skewY", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "anchorX", {
            /**
             * 显示对象上x方向的缩放或旋转点
             * @property anchorX
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._anchorX;
            },
            set: function (value) {
                this._setProperty("_anchorX", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "anchorY", {
            /**
             * 显示对象上y方向的缩放或旋转点
             * @property anchorY
             * @pubic
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            get: function () {
                return this._anchorY;
            },
            set: function (value) {
                this._setProperty("_anchorY", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "visible", {
            /**
             * 显未对象是否可见
             * @property visible
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default 0
             */
            get: function () { return this._visible; },
            set: function (value) {
                this._setProperty("_visible", value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "matrix", {
            /**
             * 显示对象的变形矩阵
             * @property matrix
             * @public
             * @since 1.0.0
             * @type {annie.Matrix}
             * @default null
             */
            get: function () {
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(DisplayObject.prototype, "mask", {
            /**
             * 显示对象的遮罩, 是一个Shape显示对象或是一个只包含shape显示对象的MovieClip
             * @property mask
             * @public
             * @since 1.0.0
             * @type {annie.DisplayObject}
             * @default null
             */
            get: function () {
                return this._mask;
            },
            set: function (value) {
                if (value != this.mask) {
                    this._mask = value;
                    if (value) {
                        value["_isUseToMask"] = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "filters", {
            /**
             * 显示对象的滤镜数组
             * @property filters
             * @since 1.0.0
             * @public
             * @type {Array}
             * @default null
             */
            get: function () {
                return this._filters;
            },
            set: function (value) {
                this._setProperty("_filters", value, 2);
            },
            enumerable: true,
            configurable: true
        });
        /**
         *将全局坐标转换到本地坐标值
         * @method globalToLocal
         * @since 1.0.0
         * @public
         * @param {annie.Point} point
         * @returns {annie.Point}
         */
        DisplayObject.prototype.globalToLocal = function (point, bp) {
            if (bp === void 0) { bp = null; }
            return this.cMatrix.invert().transformPoint(point.x, point.y, bp);
        };
        /**
         *将本地坐标转换到全局坐标值
         * @method localToGlobal
         * @public
         * @since 1.0.0
         * @param {annie.Point} point
         * @returns {annie.Point}
         */
        DisplayObject.prototype.localToGlobal = function (point, bp) {
            if (bp === void 0) { bp = null; }
            if (this.parent) {
                //下一级的坐标始终应该是相对父级来说的，所以是用父级的矩阵去转换
                return this.parent.cMatrix.transformPoint(point.x, point.y, bp);
            }
            else {
                //没有父级
                return this.cMatrix.transformPoint(point.x, point.y, bp);
            }
        };
        /**
         * 启动鼠标或者触摸拖动
         * @method startDrag
         * @param {boolean} isCenter 指定将可拖动的对象锁定到指针位置中心 (true)，还是锁定到用户第一次单击该对象的位置 (false) 默认false
         * @param {annie.Rectangle} bounds 相对于显圣对象父级的坐标的值，用于指定 Sprite 约束矩形
         * @since 1.1.2
         * @public
         */
        DisplayObject.prototype.startDrag = function (isCenter, bounds) {
            if (isCenter === void 0) { isCenter = false; }
            if (bounds === void 0) { bounds = null; }
            var s = this;
            if (!s.stage) {
                return;
            }
            annie.Stage._dragDisplay = s;
            s._isDragCenter = isCenter;
            s._lastDragPoint.x = Number.MAX_VALUE;
            s._lastDragPoint.y = Number.MAX_VALUE;
            if (bounds) {
                s._dragBounds.x = bounds.x;
                s._dragBounds.y = bounds.y;
                s._dragBounds.width = bounds.width;
                s._dragBounds.height = bounds.height;
            }
            else {
                s._dragBounds.x = 0;
                s._dragBounds.y = 0;
                s._dragBounds.width = 0;
                s._dragBounds.height = 0;
            }
        };
        /**
         * 停止鼠标或者触摸拖动
         * @method stopDrag
         * @public
         * @since 1.1.2
         */
        DisplayObject.prototype.stopDrag = function () {
            if (annie.Stage._dragDisplay == this) {
                annie.Stage._dragDisplay = null;
            }
        };
        /**
         * 点击碰撞测试,就是舞台上的一个point是否在显示对象内,在则返回该对象，不在则返回null
         * @method hitTestPoint
         * @public
         * @since 1.0.0
         * @param {annie.Point} point 需要碰到的坐标点
         * @param {boolean} isMouseEvent 是否是鼠标事件调用此方法,用户一般无须理会,除非你要模拟鼠标点击可以
         * @returns {annie.DisplayObject}
         */
        DisplayObject.prototype.hitTestPoint = function (point, isMouseEvent) {
            if (isMouseEvent === void 0) { isMouseEvent = false; }
            var s = this;
            if (!s.visible)
                return null;
            if (isMouseEvent && !s.mouseEnable)
                return null;
            if (!isMouseEvent) {
                //如果不是系统调用则不考虑这个点是从全局来的，只认为这个点就是当前要碰撞测试同级别下的坐标点
                if (s.getBounds().isPointIn(point)) {
                    return s;
                }
            }
            else {
                if (s.getBounds().isPointIn(s.globalToLocal(point, DisplayObject._bp))) {
                    return s;
                }
            }
            return null;
        };
        /**
         * 获取对象的自身的没有任何形变的原始姿态下的原点坐标及宽高,抽像方法
         * @method getBounds
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         * @abstract
         */
        DisplayObject.prototype.getBounds = function () {
            return this._bounds;
        };
        ;
        /**
         * 获取对象形变后外切矩形。
         * 可以从这个方法中读取到此显示对象变形后x方向上的宽和y方向上的高
         * @method getDrawRect
         * @public
         * @since 1.0.0
         * @returns {annie.Rectangle}
         */
        DisplayObject.prototype.getDrawRect = function () {
            var s = this;
            var rect = s.getBounds();
            if (s._mask) {
                var maskRect = s._mask.getDrawRect();
                if (rect.x < maskRect.x) {
                    rect.x = maskRect.x;
                }
                if (rect.y < maskRect.y) {
                    rect.y = maskRect.y;
                }
                if (rect.width > maskRect.width) {
                    rect.width = maskRect.width;
                }
                if (rect.height > maskRect.height) {
                    rect.height = maskRect.height;
                }
            }
            s.matrix.transformPoint(rect.x, rect.y, DisplayObject._p1);
            s.matrix.transformPoint(rect.x + rect.width, rect.y, DisplayObject._p2);
            s.matrix.transformPoint(rect.x + rect.width, rect.y + rect.height, DisplayObject._p3);
            s.matrix.transformPoint(rect.x, rect.y + rect.height, DisplayObject._p4);
            annie.Rectangle.createFromPoints(s._drawRect, DisplayObject._p1, DisplayObject._p2, DisplayObject._p3, DisplayObject._p4);
            return s._drawRect;
        };
        /**
         * 更新函数
         * @method update
         * @public
         * @since 1.0.0
         */
        DisplayObject.prototype.update = function (isDrawUpdate) {
            if (isDrawUpdate === void 0) { isDrawUpdate = true; }
            var s = this;
            var UI = s._UI;
            if (s._cp) {
                UI.UM = UI.UA = UI.UF = true;
                s._cp = false;
            }
            if (UI.UM) {
                s._matrix.createBox(s._x, s._y, s._scaleX, s._scaleY, s._rotation, s._skewX, s._skewY, s._anchorX, s._anchorY);
            }
            if (s.parent) {
                var PUI = s.parent._UI;
                if (PUI.UM)
                    UI.UM = true;
                if (PUI.UA)
                    UI.UA = true;
                if (PUI.UF)
                    UI.UF = true;
            }
            if (UI.UM) {
                s.cMatrix.setFrom(s._matrix);
                if (s.parent) {
                    s.cMatrix.prepend(s.parent.cMatrix);
                }
            }
            if (UI.UA) {
                s.cAlpha = s._alpha;
                if (s.parent) {
                    s.cAlpha *= s.parent.cAlpha;
                }
            }
            if (UI.UF) {
                /* s.cFilters.length = 0;
                 let sf = s._filters;
                 if(sf) {
                     let len = sf.length;
                     for (let i = 0; i < len; i++) {
                         s.cFilters.push(sf[i]);
                     }
                 }
                 if (s.parent) {
                     if (s.parent.cFilters.length > 0) {
                         let len = s.parent.cFilters.length;
                         let pf = s.parent.cFilters;
                         for (let i = len - 1; i >= 0; i--) {
                             s.cFilters.unshift(pf[i]);
                         }
                     }
                 }*/
            }
            //enterFrame事件一定要放在这里，不要再移到其他地方
            if (s.hasEventListener("onEnterFrame")) {
                if (!s._enterFrameEvent) {
                    s._enterFrameEvent = new annie.Event("onEnterFrame");
                }
                s.dispatchEvent(s._enterFrameEvent);
            }
        };
        /**
         * 调用此方法将显示对象渲染到屏幕
         * @method render
         * @public
         * @since 1.0.0
         * @param {annie.IRender} renderObj
         * @abstract
         */
        DisplayObject.prototype.render = function (renderObj) {
            var s = this;
            /*let cf = s.cFilters;
            let cfLen = cf.length;
            let fId=-1;
            if(cfLen) {
                for (let i = 0; i < cfLen; i++) {
                    if (s.cFilters[i].type == "Shadow") {
                        fId=i;
                        break;
                    }
                }
            }
            if(fId>=0){
                let ctx: any = renderObj["_ctx"];
                ctx.shadowBlur = cf[fId].blur;
                ctx.shadowColor = cf[fId].color;
                ctx.shadowOffsetX = cf[fId].offsetX;
                ctx.shadowOffsetY = cf[fId].offsetY;
                renderObj.draw(s);
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }else {*/
            renderObj.draw(s);
            //}
        };
        /**
         * 调用些方法会冒泡的将事件向显示列表下方传递
         * @method _onDispatchBubbledEvent
         * @private
         * @since 1.0.0
         * @param {string} type
         * @param {boolean} updateMc 是否更新movieClip时间轴信息
         * @private
         */
        DisplayObject.prototype._onDispatchBubbledEvent = function (type) {
            var s = this;
            if (type == "onRemoveToStage" && !s.stage)
                return;
            s.stage = s.parent.stage;
            var sounds = s._a2x_sounds;
            var timeLineObj = s._a2x_res_class;
            if (type == "onRemoveToStage") {
                s.dispatchEvent(type);
                s.stage = null;
                //如果有音乐。则关闭音乐
                if (sounds && sounds.length > 0) {
                    for (var i = 0; i < sounds.length; i++) {
                        sounds[i].stop();
                    }
                }
                //如果是mc，则还原成动画初始时的状态
                if (s._instanceType == "annie.MovieClip" && timeLineObj && timeLineObj.tf > 1) {
                    s._curFrame = 1;
                    s._lastFrame = 0;
                    s._isPlaying = true;
                    s._isFront = true;
                }
            }
            else if (type == "onAddToStage") {
                //如果有音乐，如果是Sprite则播放音乐
                if (sounds && sounds.length > 0 && s._instanceType == "annie.Sprite") {
                    for (var i = 0; i < sounds.length; i++) {
                        sounds[i].play(0);
                    }
                }
                s.dispatchEvent(type);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "width", {
            /**
             * 获取或者设置显示对象在父级里的x方向的宽，不到必要不要用此属性获取高
             * 如果你要同时获取款高，建议使用getWH()方法获取宽和高
             * @property  width
             * @public
             * @since 1.0.3
             * @return {number}
             */
            get: function () {
                return this.getWH().width;
            },
            set: function (value) {
                var s = this;
                var w = s.width;
                if (value > 0 && w > 0) {
                    var sx = value / w;
                    s.scaleX *= sx;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "height", {
            /**
             * 获取或者设置显示对象在父级里的y方向的高,不到必要不要用此属性获取高
             * 如果你要同时获取款高，建议使用getWH()方法获取宽和高
             * @property  height
             * @public
             * @since 1.0.3
             * @return {number}
             */
            get: function () {
                return this.getWH().height;
            },
            set: function (value) {
                var s = this;
                var h = s.height;
                if (value > 0 && h > 0) {
                    var sy = value / h;
                    s.scaleY *= sy;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 如果需要同时获取宽和高的值，建议使用此方法更有效率
         * @method getWH
         * @public
         * @returns {{width: number, height: number}}
         * @since 1.0.9
         */
        DisplayObject.prototype.getWH = function () {
            var s = this;
            s.update();
            var dr = s.getDrawRect();
            return { width: dr.width, height: dr.height };
        };
        DisplayObject.prototype._setProperty = function (property, value, type) {
            var s = this;
            if (s[property] != value) {
                s[property] = value;
                var UI = s._UI;
                if (type == 0) {
                    UI.UM = true;
                }
                else if (type == 1) {
                    UI.UA = true;
                }
                else if (type == 2) {
                    UI.UF = true;
                }
                else if (type == 3) {
                    UI.UD = true;
                }
            }
        };
        /**
         * 返回一个id，这个id你要留着作为删除他时使用。
         * 这个声音会根据这个显示对象添加到舞台时播放，移出舞台而关闭
         * @param {annie.Sound} sound
         * @returns {number}
         */
        DisplayObject.prototype.addSound = function (sound) {
            var s = this;
            if (!s._a2x_sounds) {
                s._a2x_sounds = [];
            }
            var sounds = s._a2x_sounds;
            sounds.push(sound);
            return sounds.length - 1;
        };
        /**
         * 删除一个已经添加进来的声音
         * @param {number} id -1 删除所有 0 1 2 3...删除对应的声音
         */
        DisplayObject.prototype.removeSound = function (id) {
            var s = this;
            var sounds = s._a2x_sounds;
            if (sounds) {
                if (id > 0) {
                    if (sounds.length > id) {
                        sounds.splice(id, 1);
                    }
                }
                else {
                    sounds.length = 0;
                }
            }
        };
        DisplayObject.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s._a2x_sounds = null;
            s._a2x_res_obj = null;
            s.mask = null;
            s.filters = null;
            s.parent = null;
            s.stage = null;
            s._bounds = null;
            s._drawRect = null;
            s._enterFrameEvent = null;
            s._dragBounds = null;
            s._lastDragPoint = null;
            s.cFilters = null;
            s._matrix = null;
            s.cMatrix = null;
            s._UI = null;
            s._texture = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * 为了hitTestPoint，localToGlobal，globalToLocal等方法不复新不重复生成新的点对象而节约内存
         * @type {annie.Point}
         * @private
         * @static
         */
        DisplayObject._bp = new annie.Point();
        DisplayObject._p1 = new annie.Point();
        DisplayObject._p2 = new annie.Point();
        DisplayObject._p3 = new annie.Point();
        DisplayObject._p4 = new annie.Point();
        return DisplayObject;
    }(annie.EventDispatcher));
    annie.DisplayObject = DisplayObject;
})(annie || (annie = {}));
/// <reference path="DisplayObject.ts" />
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象的引用的 Bitmap 对象。
     * 创建了 Bitmap 对象后，使用父 Sprite 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 BitmapData 引用，
     * 与转换属性或旋转属性无关。由于能够创建引用相同 BitmapData 对象的多个 Bitmap 对象，
     * 因此，多个显示对象可以使用相同的复杂 BitmapData 对象，而不会因为每个显示对象实例使用一个 BitmapData 对象而产生内存开销。
     * @class annie.Bitmap
     * @public
     * @extends annie.DisplayObject
     * @since 1.0.0
     */
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        /**
         * 构造函数
         * @method Bitmap
         * @since 1.0.0
         * @public
         * @param {string} imagePath 一个图片地址
        */
        function Bitmap(imagePath) {
            var _this = _super.call(this) || this;
            var s = _this;
            s._instanceType = "annie.Bitmap";
            s._texture = imagePath;
            annie.getImageInfo({
                src: imagePath,
                success: function (res) {
                    s._bounds.width = res.width;
                    s._bounds.height = res.height;
                }
            });
            return _this;
        }
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        Bitmap.prototype.hitTestPoint = function (globalPoint, isMouseEvent) {
            if (isMouseEvent === void 0) { isMouseEvent = false; }
            var s = this;
            if (isMouseEvent && !s.mouseEnable)
                return null;
            var p = s.globalToLocal(globalPoint);
            if (s.getBounds().isPointIn(p)) {
                return s;
            }
            return null;
        };
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
        Bitmap.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s._texture = "";
            _super.prototype.destroy.call(this);
        };
        return Bitmap;
    }(annie.DisplayObject));
    annie.Bitmap = Bitmap;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 矢量对象
     * @class annie.Shape
     * @extends annie.DisplayObject
     * @since 1.0.0
     * @public
     */
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            var _this = _super.call(this) || this;
            /**
             * 一个数组，每个元素也是一个数组[类型 0是属性,1是方法,名字 执行的属性或方法名,参数]
             * @property _command
             * @private
             * @since 1.0.0
             * @type {Array}
             * @default []
             */
            _this._command = [];
            /**
             * 是否对矢量使用像素碰撞 默认开启
             * @property hitTestWidthPixel
             * @type {boolean}
             * @default true
             * @since 1.1.0
             */
            _this.hitTestWidthPixel = true;
            /**
             * 径向渐变填充 一般给Flash2x用
             * @method beginRadialGradientFill
             * @param {Array} points 一组点
             * @param {Array} colors 一组颜色值
             * @param {Object} matrixDate 如果渐变填充有矩阵变形信息
             * @public
             * @since 1.0.0
             */
            _this.beginRadialGradientFill = function (points, colors) {
                this._fill(Shape.getGradientColor(points, colors));
            };
            /**
             * 画径向渐变的线条 一般给Flash2x用
             * @method beginRadialGradientStroke
             * @param {Array} points 一组点
             * @param {Array} colors 一组颜色值
             * @param {number} lineWidth
             * @param {string} cap 线头的形状 butt round square 默认 butt
             * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
             * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
             * @public
             * @since 1.0.0
             */
            _this.beginRadialGradientStroke = function (points, colors, lineWidth, cap, join, miter) {
                if (lineWidth === void 0) { lineWidth = 1; }
                if (cap === void 0) { cap = 0; }
                if (join === void 0) { join = 0; }
                if (miter === void 0) { miter = 10; }
                this._stroke(Shape.getGradientColor(points, colors), lineWidth, cap, join, miter);
            };
            _this._isUseToMask = false;
            /**
             * 解析一段路径 一般给Flash2x用
             * @method decodePath
             * @param {Array} data
             * @public
             * @since 1.0.0
             */
            _this.decodePath = function (data) {
                var s = this;
                var instructions = ["moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "closePath"];
                var count = data.length;
                for (var i = 0; i < count; i++) {
                    if (data[i] == 0 || data[i] == 1) {
                        s.addDraw(instructions[data[i]], [data[i + 1], data[i + 2]]);
                        i += 2;
                    }
                    else {
                        s.addDraw(instructions[data[i]], [data[i + 1], data[i + 2], data[i + 3], data[i + 4]]);
                        i += 4;
                    }
                }
            };
            /**
             * @property _offsetX
             * @protected
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            _this._offsetX = 0;
            /**
             * @property _offsetY
             * @protected
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            _this._offsetY = 0;
            _this._instanceType = "annie.Shape";
            return _this;
        }
        /**
         * 通过一系统参数获取生成颜色或渐变所需要的对象
         * 一般给用户使用较少,Flash2x工具自动使用
         * @method getGradientColor
         * @static
         * @param points
         * @param colors
         * @returns {any}
         * @since 1.0.0
         * @pubic
         */
        Shape.getGradientColor = function (points, colors) {
            var colorObj;
            var ctx = annie.CanvasRender.drawCtx;
            if (points.length == 4) {
                colorObj = ctx.createLinearGradient(points[0], points[1], points[2], points[3]);
            }
            else {
                colorObj = ctx.createRadialGradient(points[0], points[1], 0, points[2], points[3], points[4]);
            }
            for (var i = 0, l = colors.length; i < l; i++) {
                colorObj.addColorStop(colors[i][0], Shape.getRGBA(colors[i][1], colors[i][2]));
            }
            return colorObj;
        };
        /**
         * 设置位图填充时需要使用的方法,一般给用户使用较少,Flash2x工具自动使用
         * @method getBitmapStyle
         * @static
         * @param {Image} image HTML Image元素
         * @returns {CanvasPattern}
         * @public
         * @since 1.0.0
         */
        Shape.getBitmapStyle = function (image) {
            var ctx = annie.CanvasRender.drawCtx;
            return ctx.createPattern(image, "repeat");
        };
        /**
         * 通过24位颜色值和一个透明度值生成RGBA值
         * @method getRGBA
         * @static
         * @public
         * @since 1.0.0
         * @param {string} color 字符串的颜色值,如:#33ffee
         * @param {number} alpha 0-1区间的一个数据 0完全透明 1完全不透明
         * @returns {string}
         */
        Shape.getRGBA = function (color, alpha) {
            if (color.indexOf("0x") == 0) {
                color = color.replace("0x", "#");
            }
            if (color.length < 7) {
                color = "#000000";
            }
            if (alpha != 1) {
                var r = parseInt("0x" + color.substr(1, 2));
                var g = parseInt("0x" + color.substr(3, 2));
                var b = parseInt("0x" + color.substr(5, 2));
                color = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
            }
            return color;
        };
        /**
         * 添加一条绘画指令,具体可以查阅Html Canvas画图方法
         * @method addDraw
         * @param {string} commandName ctx指令的方法名 如moveTo lineTo arcTo等
         * @param {Array} params
         * @public
         * @since 1.0.0
         */
        Shape.prototype.addDraw = function (commandName, params) {
            var s = this;
            s._UI.UD = true;
            s._command[s._command.length] = [1, commandName, params];
        };
        /**
         * 画一个带圆角的矩形
         * @method drawRoundRect
         * @param {number} x 点x值
         * @param {number} y 点y值
         * @param {number} w 宽
         * @param {number} h 高
         * @param {number} rTL 左上圆角半径
         * @param {number} rTR 右上圆角半径
         * @param {number} rBL 左下圆角半径
         * @param {number} rBR 右上圆角半径
         * @public
         * @since 1.0.0
         */
        Shape.prototype.drawRoundRect = function (x, y, w, h, rTL, rTR, rBL, rBR) {
            if (rTL === void 0) { rTL = 0; }
            if (rTR === void 0) { rTR = 0; }
            if (rBL === void 0) { rBL = 0; }
            if (rBR === void 0) { rBR = 0; }
            var max = (w < h ? w : h) / 2;
            var mTL = 0, mTR = 0, mBR = 0, mBL = 0;
            if (rTL < 0) {
                rTL *= (mTL = -1);
            }
            if (rTL > max) {
                rTL = max;
            }
            if (rTR < 0) {
                rTR *= (mTR = -1);
            }
            if (rTR > max) {
                rTR = max;
            }
            if (rBR < 0) {
                rBR *= (mBR = -1);
            }
            if (rBR > max) {
                rBR = max;
            }
            if (rBL < 0) {
                rBL *= (mBL = -1);
            }
            if (rBL > max) {
                rBL = max;
            }
            var c = this._command;
            c[c.length] = [1, "moveTo", [x + w - rTR, y]];
            c[c.length] = [1, "arcTo", [x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR]];
            c[c.length] = [1, "lineTo", [x + w, y + h - rBR]];
            c[c.length] = [1, "arcTo", [x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR]];
            c[c.length] = [1, "lineTo", [x + rBL, y + h]];
            c[c.length] = [1, "arcTo", [x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL]];
            c[c.length] = [1, "lineTo", [x, y + rTL]];
            c[c.length] = [1, "arcTo", [x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL]];
            c[c.length] = [1, "closePath", []];
        };
        /**
         * 绘画时移动到某一点
         * @method moveTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        Shape.prototype.moveTo = function (x, y) {
            this._command[this._command.length] = [1, "moveTo", [x, y]];
        };
        /**
         * 从上一点画到某一点,如果没有设置上一点，则上一点默认为(0,0)
         * @method lineTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        Shape.prototype.lineTo = function (x, y) {
            this._command[this._command.length] = [1, "lineTo", [x, y]];
        };
        /**
         * 从上一点画弧到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method arcTo
         * @param {number} x
         * @param {number} y
         * @public
         * @since 1.0.0
         */
        Shape.prototype.arcTo = function (x, y) {
            this._command[this._command.length] = [1, "arcTo", [x, y]];
        };
        /**
         * 二次贝赛尔曲线
         * 从上一点画二次贝赛尔曲线到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method quadraticCurveTo
         * @param {number} cpX 控制点X
         * @param {number} cpX 控制点Y
         * @param {number} x 终点X
         * @param {number} y 终点Y
         * @public
         * @since 1.0.0
         */
        Shape.prototype.quadraticCurveTo = function (cpX, cpY, x, y) {
            this._command[this._command.length] = [1, "quadraticCurveTo", [cpX, cpY, x, y]];
        };
        /**
         * 三次贝赛尔曲线
         * 从上一点画二次贝赛尔曲线到某一点,如果没有设置上一点，则上一占默认为(0,0)
         * @method bezierCurveTo
         * @param {number} cp1X 1控制点X
         * @param {number} cp1Y 1控制点Y
         * @param {number} cp2X 2控制点X
         * @param {number} cp2Y 2控制点Y
         * @param {number} x 终点X
         * @param {number} y 终点Y
         * @public
         * @since 1.0.0
         */
        Shape.prototype.bezierCurveTo = function (cp1X, cp1Y, cp2X, cp2Y, x, y) {
            this._command[this._command.length] = [1, "bezierCurveTo", [cp1X, cp1Y, cp2X, cp2Y, x, y]];
        };
        /**
         * 闭合一个绘画路径
         * @method closePath
         * @public
         * @since 1.0.0
         */
        Shape.prototype.closePath = function () {
            this._command[this._command.length] = [1, "closePath", []];
        };
        /**
         * 画一个矩形
         * @method drawRect
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @public
         * @since 1.0.0
         */
        Shape.prototype.drawRect = function (x, y, w, h) {
            var c = this._command;
            c[c.length] = [1, "moveTo", [x, y]];
            c[c.length] = [1, "lineTo", [x + w, y]];
            c[c.length] = [1, "lineTo", [x + w, y + h]];
            c[c.length] = [1, "lineTo", [x, y + h]];
            c[c.length] = [1, "closePath", []];
        };
        /**
         * 画一个弧形
         * @method drawArc
         * @param {number} x 起始点x
         * @param {number} y 起始点y
         * @param {number} radius 半径
         * @param {number} start 开始角度
         * @param {number} end 结束角度
         * @public
         * @since 1.0.0
         */
        Shape.prototype.drawArc = function (x, y, radius, start, end) {
            this._command[this._command.length] = [1, "arc", [x, y, radius, start / 180 * Math.PI, end / 180 * Math.PI]];
        };
        /**
         * 画一个圆
         * @method drawCircle
         * @param {number} x 圆心x
         * @param {number} y 圆心y
         * @param {number} radius 半径
         * @public
         * @since 1.0.0
         */
        Shape.prototype.drawCircle = function (x, y, radius) {
            this._command[this._command.length] = [1, "arc", [x, y, radius, 0, 2 * Math.PI]];
        };
        /**
         * 画一个椭圆
         * @method drawEllipse
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @public
         * @since 1.0.0
         */
        Shape.prototype.drawEllipse = function (x, y, w, h) {
            var k = 0.5522848;
            var ox = (w / 2) * k;
            var oy = (h / 2) * k;
            var xe = x + w;
            var ye = y + h;
            var xm = x + w / 2;
            var ym = y + h / 2;
            var c = this._command;
            c[c.length] = [1, "moveTo", [x, ym]];
            c[c.length] = [1, "bezierCurveTo", [x, ym - oy, xm - ox, y, xm, y]];
            c[c.length] = [1, "bezierCurveTo", [xm + ox, y, xe, ym - oy, xe, ym]];
            c[c.length] = [1, "bezierCurveTo", [xe, ym + oy, xm + ox, ye, xm, ye]];
            c[c.length] = [1, "bezierCurveTo", [xm - ox, ye, x, ym + oy, x, ym]];
        };
        /**
         * 清除掉之前所有绘画的东西
         * @method clear
         * @public
         * @since 1.0.0
         */
        Shape.prototype.clear = function () {
            var s = this;
            s._command = [];
            s._UI.UD = true;
            s._offsetX = 0;
            s._offsetY = 0;
            s._bounds.width = 0;
            s._bounds.height = 0;
        };
        /**
         * 开始绘画填充,如果想画的东西有颜色填充,一定要从此方法开始
         * @method beginFill
         * @param {string} color 颜色值 单色和RGBA格式
         * @public
         * @since 1.0.0
         */
        Shape.prototype.beginFill = function (color) {
            this._fill(color);
        };
        /**
         * 线性渐变填充 一般给Flash2x用
         * @method beginLinearGradientFill
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @public
         * @since 1.0.0
         */
        Shape.prototype.beginLinearGradientFill = function (points, colors) {
            this._fill(Shape.getGradientColor(points, colors));
        };
        /**
         * 位图填充 一般给Flash2x用
         * @method beginBitmapFill
         * @param {Image} image
         * @param { Array} matrix
         * @public
         * @since 1.0.0
         */
        Shape.prototype.beginBitmapFill = function (image, matrix) {
            var s = this;
            if (matrix) {
                s._isBitmapFill = matrix;
            }
            s._fill(Shape.getBitmapStyle(image));
        };
        Shape.prototype._fill = function (fillStyle) {
            var c = this._command;
            c[c.length] = [0, "fillStyle", fillStyle];
            c[c.length] = [1, "beginPath", []];
            this._UI.UD = true;
        };
        /**
         * 给线条着色
         * @method beginStroke
         * @param {string} color  颜色值
         * @param {number} lineWidth 宽度
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        Shape.prototype.beginStroke = function (color, lineWidth, cap, join, miter) {
            if (lineWidth === void 0) { lineWidth = 1; }
            if (cap === void 0) { cap = 0; }
            if (join === void 0) { join = 0; }
            if (miter === void 0) { miter = 0; }
            this._stroke(color, lineWidth, cap, join, miter);
        };
        /**
         * 画线性渐变的线条 一般给Flash2x用
         * @method beginLinearGradientStroke
         * @param {Array} points 一组点
         * @param {Array} colors 一组颜色值
         * @param {number} lineWidth
         * @param {number} cap 线头的形状 0 butt 1 round 2 square 默认 butt
         * @param {number} join 线与线之间的交接处形状 0 miter 1 bevel 2 round  默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        Shape.prototype.beginLinearGradientStroke = function (points, colors, lineWidth, cap, join, miter) {
            if (lineWidth === void 0) { lineWidth = 1; }
            if (cap === void 0) { cap = 0; }
            if (join === void 0) { join = 0; }
            if (miter === void 0) { miter = 10; }
            this._stroke(Shape.getGradientColor(points, colors), lineWidth, cap, join, miter);
        };
        /**
         * 线条位图填充 一般给Flash2x用
         * @method beginBitmapStroke
         * @param {Image} image
         * @param {Array} matrix
         * @param {number} lineWidth
         * @param {string} cap 线头的形状 butt round square 默认 butt
         * @param {string} join 线与线之间的交接处形状 bevel round miter 默认miter
         * @param {number} miter 正数,规定最大斜接长度,如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示 默认10
         * @public
         * @since 1.0.0
         */
        Shape.prototype.beginBitmapStroke = function (image, matrix, lineWidth, cap, join, miter) {
            if (lineWidth === void 0) { lineWidth = 1; }
            if (cap === void 0) { cap = 0; }
            if (join === void 0) { join = 0; }
            if (miter === void 0) { miter = 10; }
            var s = this;
            if (matrix) {
                s._isBitmapStroke = matrix;
            }
            s._stroke(Shape.getBitmapStyle(image), lineWidth, cap, join, miter);
        };
        Shape.prototype._stroke = function (strokeStyle, width, cap, join, miter) {
            var c = this._command;
            c[c.length] = [0, "lineWidth", width];
            c[c.length] = [0, "lineCap", Shape._caps[cap]];
            c[c.length] = [0, "lineJoin", Shape._joins[join]];
            c[c.length] = [0, "miterLimit", miter];
            c[c.length] = [0, "strokeStyle", strokeStyle];
            c[c.length] = [1, "beginPath", []];
            this._UI.UD = true;
        };
        /**
         * 结束填充
         * @method endFill
         * @public
         * @since 1.0.0
         */
        Shape.prototype.endFill = function () {
            var s = this;
            var c = s._command;
            var m = s._isBitmapFill;
            if (m) {
                c[c.length] = [2, "setTransform", m];
            }
            c[c.length] = ([1, "fill", []]);
            if (m) {
                s._isBitmapFill = null;
            }
        };
        /**
         * 结束画线
         * @method endStroke
         * @public
         * @since 1.0.0
         */
        Shape.prototype.endStroke = function () {
            var s = this;
            var c = s._command;
            var m = s._isBitmapStroke;
            if (m) {
                //如果为2则还需要特别处理
                c[c.length] = [2, "setTransform", m];
            }
            c[c.length] = ([1, "stroke", []]);
            if (m) {
                s._isBitmapStroke = null;
            }
        };
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        Shape.prototype.update = function (isDrawUpdate) {
            if (isDrawUpdate === void 0) { isDrawUpdate = false; }
            var s = this;
            if (!s._visible)
                return;
            _super.prototype.update.call(this, isDrawUpdate);
            if (s._UI.UD || s._UI.UF) {
                //更新缓存
                var cLen = s._command.length;
                var leftX = void 0;
                var leftY = void 0;
                var buttonRightX = void 0;
                var buttonRightY = void 0;
                var i = void 0;
                if (cLen > 0) {
                    //确定是否有数据,如果有数据的话就计算出缓存图的宽和高
                    var data = void 0;
                    var lastX = 0;
                    var lastY = 0;
                    var lineWidth = 0;
                    for (i = 0; i < cLen; i++) {
                        data = s._command[i];
                        if (data[0] == 1) {
                            if (data[1] == "moveTo" || data[1] == "lineTo" || data[1] == "arcTo" || data[1] == "bezierCurveTo") {
                                if (leftX == undefined) {
                                    leftX = data[2][0];
                                }
                                if (leftY == undefined) {
                                    leftY = data[2][1];
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = data[2][0];
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = data[2][1];
                                }
                                if (data[1] == "bezierCurveTo") {
                                    leftX = Math.min(leftX, data[2][0], data[2][2], data[2][4]);
                                    leftY = Math.min(leftY, data[2][1], data[2][3], data[2][5]);
                                    buttonRightX = Math.max(buttonRightX, data[2][0], data[2][2], data[2][4]);
                                    buttonRightY = Math.max(buttonRightY, data[2][1], data[2][3], data[2][5]);
                                    lastX = data[2][4];
                                    lastY = data[2][5];
                                }
                                else {
                                    leftX = Math.min(leftX, data[2][0]);
                                    leftY = Math.min(leftY, data[2][1]);
                                    buttonRightX = Math.max(buttonRightX, data[2][0]);
                                    buttonRightY = Math.max(buttonRightY, data[2][1]);
                                    lastX = data[2][0];
                                    lastY = data[2][1];
                                }
                            }
                            else if (data[1] == "quadraticCurveTo") {
                                //求中点
                                var mid1X = (lastX + data[2][0]) * 0.5;
                                var mid1Y = (lastY + data[2][1]) * 0.5;
                                var mid2X = (data[2][0] + data[2][2]) * 0.5;
                                var mid2Y = (data[2][1] + data[2][3]) * 0.5;
                                if (leftX == undefined) {
                                    leftX = mid1X;
                                }
                                if (leftY == undefined) {
                                    leftY = mid1Y;
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = mid1X;
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = mid1Y;
                                }
                                leftX = Math.min(leftX, mid1X, mid2X, data[2][2]);
                                leftY = Math.min(leftY, mid1Y, mid2Y, data[2][3]);
                                buttonRightX = Math.max(buttonRightX, mid1X, mid2X, data[2][2]);
                                buttonRightY = Math.max(buttonRightY, mid1Y, mid2Y, data[2][3]);
                                lastX = data[2][2];
                                lastY = data[2][3];
                            }
                            else if (data[1] == "arc") {
                                var yuanPointX = data[2][0];
                                var yuanPointY = data[2][1];
                                var radio = data[2][2];
                                var yuanLeftX = yuanPointX - radio;
                                var yuanLeftY = yuanPointY - radio;
                                var yuanBRX = yuanPointX + radio;
                                var yuanBRY = yuanPointY + radio;
                                if (leftX == undefined) {
                                    leftX = yuanLeftX;
                                }
                                if (leftY == undefined) {
                                    leftY = yuanLeftY;
                                }
                                if (buttonRightX == undefined) {
                                    buttonRightX = yuanBRX;
                                }
                                if (buttonRightY == undefined) {
                                    buttonRightY = yuanBRY;
                                }
                                leftX = Math.min(leftX, yuanLeftX);
                                leftY = Math.min(leftY, yuanLeftY);
                                buttonRightX = Math.max(buttonRightX, yuanBRX);
                                buttonRightY = Math.max(buttonRightY, yuanBRY);
                            }
                        }
                        else {
                            if (data[1] == "lineWidth") {
                                if (lineWidth < data[2]) {
                                    lineWidth = data[2];
                                }
                            }
                        }
                    }
                    if (leftX != undefined || lineWidth > 0) {
                        if (leftX == undefined) {
                            leftX = 0;
                            leftY = 0;
                        }
                        leftX -= lineWidth >> 1;
                        leftY -= lineWidth >> 1;
                        buttonRightX += lineWidth >> 1;
                        buttonRightY += lineWidth >> 1;
                        var w = buttonRightX - leftX;
                        var h = buttonRightY - leftY;
                        s._offsetX = leftX;
                        s._offsetY = leftY;
                        s._bounds.x = leftX;
                        s._bounds.y = leftY;
                        s._bounds.width = w;
                        s._bounds.height = h;
                    }
                }
                s._UI.UD = false;
            }
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
        };
        Shape.prototype._draw = function (ctx) {
            var s = this;
            var com = s._command;
            var cLen = com.length;
            var data;
            var leftX = s._offsetX;
            var leftY = s._offsetY;
            for (var i = 0; i < cLen; i++) {
                data = com[i];
                if (data[0] > 0) {
                    var paramsLen = data[2].length;
                    if (paramsLen == 0) {
                        ctx[data[1]]();
                    }
                    else if (paramsLen == 2) {
                        ctx[data[1]](data[2][0], data[2][1]);
                    }
                    else if (paramsLen == 4) {
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3]);
                    }
                    else if (paramsLen == 5) {
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], data[2][4]);
                    }
                    else if (paramsLen == 6) {
                        var lx = data[2][4];
                        var ly = data[2][5];
                        if (data[0] == 2) {
                            //位图填充
                            lx -= leftX;
                            ly -= leftY;
                        }
                        ctx[data[1]](data[2][0], data[2][1], data[2][2], data[2][3], lx, ly);
                    }
                }
                else {
                    ctx[data[1]] = data[2];
                }
            }
        };
        /**
         * 重写hitTestPoint
         * @method  hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        Shape.prototype.hitTestPoint = function (globalPoint, isMouseEvent) {
            if (isMouseEvent === void 0) { isMouseEvent = false; }
            var s = this;
            if (isMouseEvent && !s.mouseEnable)
                return null;
            //如果都不在缓存范围内,那就更不在矢量范围内了;如果在则继续看
            var p = globalPoint;
            if (isMouseEvent) {
                p = s.globalToLocal(globalPoint);
            }
            if (s.getBounds().isPointIn(p)) {
                return s;
            }
            return null;
        };
        /**
         * 如果有的话,改变矢量对象的边框或者填充的颜色.
         * @method changeColor
         * @param {Object} infoObj
         * @param {string|any} infoObj.fillColor 填充颜色值，如"#fff" 或者 "rgba(255,255,255,1)"或者是annie.Shape.getGradientColor()方法返回的渐变对象;
         * @param {string} infoObj.strokeColor 线条颜色值，如"#fff" 或者 "rgba(255,255,255,1)";
         * @param {number} infoObj.lineWidth 线条的粗细，如"1,2,3...";
         * @public
         * @since 1.0.2
         */
        Shape.prototype.changeColor = function (infoObj) {
            var s = this;
            var cLen = s._command.length;
            var c = s._command;
            for (var i = 0; i < cLen; i++) {
                if (c[i][0] == 0) {
                    if (c[i][1] == "fillStyle" && infoObj.fillColor && c[i][2] != infoObj.fillColor) {
                        c[i][2] = infoObj.fillColor;
                        s._UI.UD = true;
                    }
                    if (c[i][1] == "strokeStyle" && infoObj.strokeColor && c[i][2] != infoObj.strokeColor) {
                        c[i][2] = infoObj.strokeColor;
                        s._UI.UD = true;
                    }
                    if (c[i][1] == "lineWidth" && infoObj.lineWidth && c[i][2] != infoObj.lineWidth) {
                        c[i][2] = infoObj.lineWidth;
                        s._UI.UD = true;
                    }
                }
            }
        };
        Shape.prototype.render = function (renderObj) {
            if (!this._isUseToMask) {
                _super.prototype.render.call(this, renderObj);
            }
        };
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
        Shape.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s._command = null;
            s._isBitmapStroke = null;
            s._isBitmapFill = null;
            _super.prototype.destroy.call(this);
        };
        Shape._caps = ["butt", "round", "square"];
        Shape._joins = ["miter", "round", "bevel"];
        return Shape;
    }(annie.DisplayObject));
    annie.Shape = Shape;
})(annie || (annie = {}));
/// <reference path="DisplayObject.ts" />
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 显示对象的容器类,可以将其他显示对象放入其中,是annie引擎的核心容器类.
     * Sprite 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。
     * Sprite 对象与影片剪辑类似，但没有时间轴。Sprite 是不需要时间轴的对象的相应基类。
     * 例如，Sprite 将是通常不使用时间轴的用户界面 (UI) 组件的逻辑基类
     * @class annie.Sprite
     * @extends annie.DisplayObject
     * @public
     * @since 1.0.0
     */
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            var _this = _super.call(this) || this;
            //sprite 和 moveClip的类资源信息
            _this._a2x_res_class = null;
            _this._a2x_res_children = [];
            /**
             * 是否可以让children接收鼠标事件,如果为false
             * 鼠标事件将不会往下冒泡
             * @property mouseChildren
             * @type {boolean}
             * @default true
             * @public
             * @since 1.0.0
             */
            _this.mouseChildren = true;
            /**
             * 显示对象的child列表
             * @property children
             * @type {Array}
             * @public
             * @since 1.0.0
             * @default []
             * @readonly
             */
            _this.children = [];
            var s = _this;
            s._instanceType = "annie.Sprite";
            if (s._resId) {
                var resInfo = s._resId.split(".");
                annie._initRes(s, resInfo[0], resInfo[1]);
            }
            return _this;
        }
        Sprite.prototype.destroy = function () {
            var s = this;
            //让子级也destroy
            for (var i = 0; i < s.children.length; i++) {
                s.children[i].destroy();
            }
            s._a2x_res_children = null;
            s._a2x_res_class = null;
            s.children = null;
            _super.prototype.destroy.call(this);
        };
        /**
         * 添加一个显示对象到Sprite
         * @method addChild
         * @param {annie.DisplayObject} child
         * @public
         * @since 1.0.0
         */
        Sprite.prototype.addChild = function (child) {
            this.addChildAt(child, this.children.length);
        };
        /**
         * 从Sprite中移除一个child
         * @method removeChild
         * @public
         * @since 1.0.0
         * @param {annie.DisplayObject} child
         */
        Sprite.prototype.removeChild = function (child) {
            var s = this;
            var len = s.children.length;
            for (var i = 0; i < len; i++) {
                if (s.children[i] == child) {
                    s.removeChildAt(i);
                    break;
                }
            }
        };
        //全局遍历
        Sprite._getElementsByName = function (rex, root, isOnlyOne, isRecursive, resultList) {
            var len = root.children.length;
            if (len > 0) {
                var name_1;
                var child = void 0;
                for (var i = 0; i < len; i++) {
                    child = root.children[i];
                    name_1 = child.name;
                    if (name_1 && name_1 != "") {
                        if (rex.test(name_1)) {
                            resultList[resultList.length] = child;
                            if (isOnlyOne) {
                                return;
                            }
                        }
                    }
                    if (isRecursive) {
                        if (child["children"] != null) {
                            Sprite._getElementsByName(rex, child, isOnlyOne, isRecursive, resultList);
                        }
                    }
                }
            }
        };
        /**
         * 通过给displayObject设置的名字来获取一个child,可以使用正则匹配查找
         * @method getChildByName
         * @param {string} name 对象的具体名字或是一个正则表达式
         * @param {boolean} isOnlyOne 默认为true,如果为true,只返回最先找到的对象,如果为false则会找到所有匹配的对象数组
         * @param {boolean} isRecursive false,如果为true,则会递归查找下去,而不只是查找当前对象中的child,child里的child也会找,依此类推
         * @returns {any} 返回一个对象,或者一个对象数组,没有找到则返回空
         * @public
         * @since 1.0.0
         */
        Sprite.prototype.getChildByName = function (name, isOnlyOne, isRecursive) {
            if (isOnlyOne === void 0) { isOnlyOne = true; }
            if (isRecursive === void 0) { isRecursive = false; }
            if (!name)
                return null;
            var s = this;
            var rex;
            if (typeof (name) == "string") {
                rex = new RegExp("^" + name + "$");
            }
            else {
                rex = name;
            }
            var elements = [];
            Sprite._getElementsByName(rex, s, isOnlyOne, isRecursive, elements);
            var len = elements.length;
            if (len == 0) {
                return null;
            }
            else if (len == 1) {
                return elements[0];
            }
            else {
                return elements;
            }
        };
        /**
         * 添加一个child到Sprite中并指定添加到哪个层级
         * @method addChildAt
         * @param {annie.DisplayObject} child
         * @param {number} index 从0开始
         * @pubic
         * @since 1.0.0
         */
        Sprite.prototype.addChildAt = function (child, index) {
            if (!child)
                return;
            var s = this;
            var sameParent = (s == child.parent);
            var len;
            if (child.parent) {
                if (!sameParent) {
                    child.parent.removeChild(child);
                }
                else {
                    len = s.children.length;
                    for (var i = 0; i < len; i++) {
                        if (s.children[i] == child) {
                            s.children.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            child.parent = s;
            len = s.children.length;
            if (index >= len) {
                s.children[s.children.length] = child;
            }
            else if (index == 0) {
                s.children.unshift(child);
            }
            else {
                s.children.splice(index, 0, child);
            }
            if (s.stage && !sameParent) {
                child["_cp"] = true;
                child._onDispatchBubbledEvent("onAddToStage");
            }
        };
        /**
         * 获取Sprite中指定层级一个child
         * @method getChildAt
         * @param {number} index 从0开始
         * @pubic
         * @since 1.0.0
         * @return {annie.DisplayObject}
         */
        Sprite.prototype.getChildAt = function (index) {
            if ((this.children.length - 1) >= index) {
                return this.children[index];
            }
            else {
                return null;
            }
        };
        /**
         * 获取Sprite中一个child所在的层级索引，找到则返回索引数，未找到则返回-1
         * @method getChildIndex
         * @param {annie.DisplayObject} child 子对象
         * @pubic
         * @since 1.0.2
         * @return {number}
         */
        Sprite.prototype.getChildIndex = function (child) {
            var len = this.children.length;
            for (var i = 0; i < len; i++) {
                if (this.children[i] == child) {
                    return i;
                }
            }
            return -1;
        };
        /**
         *
         * @param child1 显示对象，或者显示对象的索引
         * @param child2 显示对象，或者显示对象的索引
         * @returns {boolean}
         */
        //TODO
        Sprite.prototype.swapChild = function (child1, child2) {
            return false;
        };
        /**
         * 调用此方法对Sprite及其child触发一次指定事件
         * @method _onDispatchBubbledEvent
         * @private
         * @param {string} type
         * @param {boolean} updateMc 是否更新movieClip时间轴信息
         * @since 1.0.0
         */
        Sprite.prototype._onDispatchBubbledEvent = function (type) {
            var s = this;
            var len = s.children.length;
            if (type == "onRemoveToStage" && !s.stage)
                return;
            s.stage = s.parent.stage;
            for (var i = 0; i < len; i++) {
                s.children[i]._onDispatchBubbledEvent(type);
            }
            _super.prototype._onDispatchBubbledEvent.call(this, type);
        };
        /**
         * 移除指定层级上的孩子
         * @method removeChildAt
         * @param {number} index 从0开始
         * @public
         * @since 1.0.0
         */
        Sprite.prototype.removeChildAt = function (index) {
            var s = this;
            var child;
            var len = s.children.length - 1;
            if (len < 0)
                return;
            if (index == len) {
                child = s.children.pop();
            }
            else if (index == 0) {
                child = s.children.shift();
            }
            else {
                child = s.children.splice(index, 1)[0];
            }
            child._onDispatchBubbledEvent("onRemoveToStage");
            child.parent = null;
        };
        /**
         * 移除Sprite上的所有child
         * @method removeAllChildren
         * @public
         * @since 1.0.0
         */
        Sprite.prototype.removeAllChildren = function () {
            var s = this;
            var len = s.children.length;
            for (var i = len - 1; i >= 0; i--) {
                s.removeChildAt(0);
            }
        };
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        Sprite.prototype.update = function (isDrawUpdate) {
            if (isDrawUpdate === void 0) { isDrawUpdate = true; }
            var s = this;
            if (!s._visible)
                return;
            _super.prototype.update.call(this, isDrawUpdate);
            var len = s.children.length;
            for (var i = len - 1; i >= 0; i--) {
                s.children[i].update(isDrawUpdate);
            }
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
        };
        /**
         * 重写碰撞测试
         * @method hitTestPoint
         * @param {annie.Point} globalPoint
         * @param {boolean} isMouseEvent
         * @returns {any}
         * @public
         * @since 1.0.0
         */
        Sprite.prototype.hitTestPoint = function (globalPoint, isMouseEvent) {
            if (isMouseEvent === void 0) { isMouseEvent = false; }
            var s = this;
            if (!s._visible)
                return null;
            if (isMouseEvent && !s.mouseEnable)
                return null;
            var len = s.children.length;
            var hitDisplayObject;
            var child;
            //这里特别注意是从上往下遍历
            for (var i = len - 1; i >= 0; i--) {
                child = s.children[i];
                if (child._isUseToMask) {
                    continue;
                }
                if (child.mask && child.mask.parent == child.parent) {
                    //看看点是否在遮罩内
                    if (!child.mask.hitTestPoint(globalPoint, isMouseEvent)) {
                        //如果都不在遮罩里面,那还检测什么直接检测下一个
                        continue;
                    }
                }
                hitDisplayObject = child.hitTestPoint(globalPoint, isMouseEvent);
                if (hitDisplayObject) {
                    return hitDisplayObject;
                }
            }
            return null;
        };
        /**
         * 重写getBounds
         * @method getBounds
         * @returns {any}
         * @since 1.0.0
         * @public
         */
        Sprite.prototype.getBounds = function () {
            var s = this;
            var rect = s._bounds;
            rect.x = 0;
            rect.y = 0;
            rect.width = 0;
            rect.height = 0;
            var len = s.children.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    if (s.children[i].visible)
                        annie.Rectangle.createFromRects(rect, s.children[i].getDrawRect());
                }
                if (s.mask && s.mask.parent == s.parent) {
                    var maskRect = s.mask.getDrawRect();
                    if (rect.x < maskRect.x) {
                        rect.x = maskRect.x;
                    }
                    if (rect.y < maskRect.y) {
                        rect.y = maskRect.y;
                    }
                    if (rect.width > maskRect.width) {
                        rect.width = maskRect.width;
                    }
                    if (rect.height > maskRect.height) {
                        rect.height = maskRect.height;
                    }
                }
            }
            return rect;
        };
        /**
         * 重写渲染
         * @method render
         * @param {annie.IRender} renderObj
         * @public
         * @since 1.0.0
         */
        Sprite.prototype.render = function (renderObj) {
            var s = this;
            if (s._cp)
                return;
            if (s.cAlpha > 0 && s._visible) {
                var maskObj = void 0;
                var child = void 0;
                var len = s.children.length;
                for (var i = 0; i < len; i++) {
                    child = s.children[i];
                    if (child.cAlpha > 0 && child._visible) {
                        if (maskObj) {
                            if (child.mask && child.mask.parent == child.parent) {
                                if (child.mask != maskObj) {
                                    renderObj.endMask();
                                    maskObj = child.mask;
                                    renderObj.beginMask(maskObj);
                                }
                            }
                            else {
                                renderObj.endMask();
                                maskObj = null;
                            }
                        }
                        else {
                            if (child.mask && child.mask.parent == child.parent) {
                                maskObj = child.mask;
                                renderObj.beginMask(maskObj);
                            }
                        }
                        child.render(renderObj);
                    }
                }
                if (maskObj) {
                    renderObj.endMask();
                }
            }
        };
        return Sprite;
    }(annie.DisplayObject));
    annie.Sprite = Sprite;
})(annie || (annie = {}));
/// <reference path="Sprite.ts" />
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * annie引擎核心类
     * @class annie.MovieClip
     * @since 1.0.0
     * @public
     * @extends annie.Sprite
     */
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip() {
            var _this = _super.call(this) || this;
            _this._curFrame = 1;
            _this._lastFrameObj = null;
            _this._isPlaying = true;
            _this._isFront = true;
            _this._lastFrame = 0;
            _this._a2x_script = null;
            _this._isButton = false;
            _this._clicked = false;
            _this._mouseEvent = function (e) {
                var s = this;
                if (!s._clicked) {
                    var frame = 2;
                    if (e.type == "onMouseDown") {
                        if (s._currentFrame > 2) {
                            frame = 3;
                        }
                    }
                    else {
                        frame = 1;
                    }
                    s.gotoAndStop(frame);
                }
            };
            _this._maskList = [];
            var s = _this;
            s._instanceType = "annie.MovieClip";
            if (s._a2x_res_class == null) {
                s._a2x_res_class = { tf: 1 };
            }
            return _this;
        }
        Object.defineProperty(MovieClip.prototype, "currentFrame", {
            /**
             * mc的当前帧
             * @property currentFrame
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             * @readonly
             */
            get: function () {
                return this._curFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "isPlaying", {
            /**
             * 当前动画是否处于播放状态
             * @property isPlaying
             * @readOnly
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default true
             * @readonly
             */
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "isFront", {
            /**
             * 动画的播放方向,是顺着播还是在倒着播
             * @property isFront
             * @public
             * @since 1.0.0
             * @type {boolean}
             * @default true
             * @readonly
             */
            get: function () {
                return this._isFront;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MovieClip.prototype, "totalFrames", {
            /**
             * 当前动画的总帧数
             * @property totalFrames
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 1
             * @readonly
             */
            get: function () {
                return this._a2x_res_class.tf;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 调用止方法将停止当前帧
         * @method stop
         * @public
         * @since 1.0.0
         */
        MovieClip.prototype.stop = function () {
            var s = this;
            s._isPlaying = false;
        };
        /**
         * 给时间轴添加回调函数,当时间轴播放到当前帧时,此函数将被调用.注意,之前在此帧上添加的所有代码将被覆盖,包括从Fla文件中当前帧的代码.
         * @method addFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex {number} 要将代码添加到哪一帧,从0开始.0就是第一帧,1是第二帧...
         * @param {Function}frameScript {Function} 时间轴播放到当前帧时要执行回调方法
         */
        MovieClip.prototype.addFrameScript = function (frameIndex, frameScript) {
            var s = this;
            if (s._a2x_script == undefined)
                s._a2x_script = {};
            s._a2x_script[frameIndex] = frameScript;
        };
        /**
         * @移除帧上的回调方法
         * @method removeFrameScript
         * @public
         * @since 1.0.0
         * @param {number} frameIndex
         */
        MovieClip.prototype.removeFrameScript = function (frameIndex) {
            var s = this;
            if (s._a2x_script != undefined)
                s._a2x_script[frameIndex] = null;
        };
        Object.defineProperty(MovieClip.prototype, "isButton", {
            get: function () {
                return this._isButton;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将一个mc变成按钮来使用 如果mc在于2帧,那么点击此mc将自动有被按钮的状态,无需用户自己写代码.
         * 此方法不可逆，设置后不再能设置回剪辑，一定要这么做的话，请联系作者，看作者答不答应
         * @method initButton
         * @public
         * @since 1.0.0
         */
        MovieClip.prototype.initButton = function () {
            var s = this;
            if (!s._isButton && s._a2x_res_class.tf > 1) {
                s.mouseChildren = false;
                //将mc设置成按钮形式
                s.addEventListener("onMouseDown", s._mouseEvent.bind(s));
                s.addEventListener("onMouseUp", s._mouseEvent.bind(s));
                s.addEventListener("onMouseOut", s._mouseEvent.bind(s));
                s.gotoAndStop(1);
                s._isButton = true;
            }
        };
        Object.defineProperty(MovieClip.prototype, "clicked", {
            get: function () {
                return this._clicked;
            },
            set: function (value) {
                var s = this;
                if (value != s._clicked) {
                    if (value) {
                        s._mouseEvent({ type: "onMouseDown" });
                    }
                    s._clicked = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * mc的当前帧的标签名,没有则为空
         * @method getCurrentLabel
         * @public
         * @since 1.0.0
         * @returns {string}
         * */
        MovieClip.prototype.getCurrentLabel = function () {
            return "";
        };
        /**
         * 将播放头向后移一帧并停在下一帧,如果本身在最后一帧则不做任何反应
         * @method nextFrame
         * @since 1.0.0
         * @public
         */
        MovieClip.prototype.nextFrame = function () {
            var s = this;
            if (s._curFrame < s.totalFrames) {
                s._curFrame++;
            }
            s._isPlaying = false;
        };
        /**
         * 将播放头向前移一帧并停在下一帧,如果本身在第一帧则不做任何反应
         * @method prevFrame
         * @since 1.0.0
         * @public
         */
        MovieClip.prototype.prevFrame = function () {
            var s = this;
            if (s._curFrame > 1) {
                s._curFrame--;
            }
            s._isPlaying = false;
        };
        /**
         * 将播放头跳转到指定帧并停在那一帧,如果本身在第一帧则不做任何反应
         * @method gotoAndStop
         * @public
         * @since 1.0.0
         * @param {number} frameIndex{number|string} 批定帧的帧数或指定帧的标签名
         */
        MovieClip.prototype.gotoAndStop = function (frameIndex) {
            var s = this;
            s._isPlaying = false;
            var timeLineObj = s._a2x_res_class;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                }
                else {
                    frameIndex = s._curFrame;
                }
            }
            else if (typeof (frameIndex) == "number") {
                if (frameIndex > timeLineObj.tf) {
                    frameIndex = timeLineObj.tf;
                }
                if (frameIndex < 1) {
                    frameIndex = 1;
                }
            }
            s._curFrame = frameIndex;
        };
        /**
         * 如果当前时间轴停在某一帧,调用此方法将继续播放.
         * @method play
         * @public
         * @since 1.0.0
         */
        MovieClip.prototype.play = function (isFront) {
            if (isFront === void 0) { isFront = true; }
            var s = this;
            s._isPlaying = true;
            s._isFront = isFront;
        };
        /**
         * 将播放头跳转到指定帧并从那一帧开始继续播放
         * @method gotoAndPlay
         * @public
         * @since 1.0.0
         * @param {number} frameIndex 批定帧的帧数或指定帧的标签名
         * @param {boolean} isFront 跳到指定帧后是向前播放, 还是向后播放.不设置些参数将默认向前播放
         */
        MovieClip.prototype.gotoAndPlay = function (frameIndex, isFront) {
            if (isFront === void 0) { isFront = true; }
            var s = this;
            s._isFront = isFront;
            s._isPlaying = true;
            var timeLineObj = s._a2x_res_class;
            if (typeof (frameIndex) == "string") {
                if (timeLineObj.label[frameIndex] != undefined) {
                    frameIndex = timeLineObj.label[frameIndex];
                }
                else {
                    frameIndex = s._curFrame;
                }
            }
            else if (typeof (frameIndex) == "number") {
                if (frameIndex > timeLineObj.tf) {
                    frameIndex = timeLineObj.tf;
                }
                if (frameIndex < 1) {
                    frameIndex = 1;
                }
            }
            s._curFrame = frameIndex;
        };
        /**
         * 重写刷新
         * @method update
         * @public
         * @param isDrawUpdate 不是因为渲染目的而调用的更新，比如有些时候的强制刷新 默认为true
         * @since 1.0.0
         */
        MovieClip.prototype.update = function (isDrawUpdate) {
            if (isDrawUpdate === void 0) { isDrawUpdate = true; }
            var s = this;
            if (isDrawUpdate && s._a2x_res_class.tf > 1) {
                var isNeedUpdate = false;
                if (s._lastFrame != s._curFrame) {
                    isNeedUpdate = true;
                    s._lastFrame = s._curFrame;
                }
                else {
                    if (s._isPlaying) {
                        isNeedUpdate = true;
                        if (s._isFront) {
                            s._curFrame++;
                            if (s._curFrame > s._a2x_res_class.tf) {
                                s._curFrame = 1;
                            }
                        }
                        else {
                            s._curFrame--;
                            if (s._curFrame < 1) {
                                s._curFrame = s._a2x_res_class.tf;
                            }
                        }
                        s._lastFrame = s._curFrame;
                    }
                }
                if (isNeedUpdate) {
                    //先确定是哪一帧
                    var allChildren = s._a2x_res_children;
                    var timeLineObj = s._a2x_res_class;
                    var curFrameObj = null;
                    var lastFrameObj = s._lastFrameObj;
                    if (timeLineObj.timeLine[s._curFrame - 1] >= 0) {
                        curFrameObj = timeLineObj.f[timeLineObj.timeLine[s._curFrame - 1]];
                    }
                    if (lastFrameObj != curFrameObj) {
                        //更新元素
                        if (lastFrameObj) {
                            var lastFrameChildrenObjectIdObj = null;
                            //获取上一次动画所在的帧数据
                            if (lastFrameObj.c) {
                                lastFrameChildrenObjectIdObj = lastFrameObj.c;
                            }
                            else {
                                lastFrameChildrenObjectIdObj = {};
                            }
                            //获取当前动画所在的帧数据
                            var curFrameChildrenObjectIdObj = null;
                            if (curFrameObj && curFrameObj.c) {
                                curFrameChildrenObjectIdObj = curFrameObj.c;
                            }
                            else {
                                curFrameChildrenObjectIdObj = {};
                            }
                            //上一帧有，这一帧没有的，要执行移除事件
                            for (var item in lastFrameChildrenObjectIdObj) {
                                if (curFrameChildrenObjectIdObj[item] == undefined) {
                                    //remove
                                    s.removeChild(allChildren[lastFrameChildrenObjectIdObj[item].o - 1]);
                                }
                            }
                            //这一帧有，上一帧没有，要执行添加到舞台
                            for (var item in curFrameChildrenObjectIdObj) {
                                if (lastFrameChildrenObjectIdObj[item] == undefined) {
                                    //add
                                    if (curFrameChildrenObjectIdObj[item].at == undefined) {
                                        s.addChildAt(allChildren[curFrameChildrenObjectIdObj[item].o - 1], 0);
                                    }
                                    else if (curFrameChildrenObjectIdObj[item].at == 0) {
                                        s.addChild(allChildren[curFrameChildrenObjectIdObj[item].o - 1]);
                                    }
                                    else {
                                        for (var i = 0; i < s.children.length; i++) {
                                            if (s.children[i] == allChildren[curFrameChildrenObjectIdObj[item].at - 1]) {
                                                s.addChildAt(allChildren[curFrameChildrenObjectIdObj[item].o - 1], i);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if (curFrameObj.c) {
                                for (var i in curFrameObj.c) {
                                    s.addChildAt(allChildren[curFrameObj.c[i].o - 1], 0);
                                }
                            }
                        }
                        if (curFrameObj) {
                            //更新child属性
                            s._maskList.length = 0;
                            var maskList = s._maskList;
                            if (curFrameObj.c) {
                                for (var i in curFrameObj.c) {
                                    annie.d(allChildren[curFrameObj.c[i].o - 1], curFrameObj.c[i]);
                                    //检查是否有遮罩
                                    if (curFrameObj.c[i].ma != undefined) {
                                        if (curFrameObj.c[i].ma != curFrameObj.c[i].o) {
                                            maskList.push(allChildren[curFrameObj.c[i].ma - 1], allChildren[curFrameObj.c[i].o - 1]);
                                        }
                                        allChildren[curFrameObj.c[i].o - 1]._isUseToMask = true;
                                    }
                                    //是否有名字
                                    if (curFrameObj.c[i].n != undefined) {
                                        s[curFrameObj.c[i].n] = allChildren[curFrameObj.c[i].o - 1];
                                        allChildren[curFrameObj.c[i].o - 1].name = curFrameObj.c[i].n;
                                    }
                                }
                            }
                            //如果有遮罩则更新遮罩
                            if (maskList.length > 0) {
                                var isFindMask = false;
                                for (var i = 0; i < s.children.length; i++) {
                                    if (s.children[i] == maskList[0]) {
                                        //找到最下面的mask对象
                                        isFindMask = true;
                                    }
                                    else if (s.children[i] == maskList[1]) {
                                        //结束mask，并寻找下一个mask
                                        isFindMask = false;
                                        //同时删除maskList前两位元素
                                        maskList.splice(0, 2);
                                        //判断是否还有遮罩，有就继续，没有就退出循环
                                        if (maskList.length == 0) {
                                            break;
                                        }
                                    }
                                    if (isFindMask) {
                                        s.children[i].mask = maskList[1];
                                    }
                                }
                            }
                        }
                    }
                    s._lastFrameObj = curFrameObj;
                    //有没有声音
                    var index = s._curFrame - 1;
                    var curFrameOther = timeLineObj.s[index];
                    if (curFrameOther) {
                        for (var sound in curFrameOther) {
                            allChildren[sound - 1]._repeatCount = curFrameOther[sound];
                            allChildren[sound - 1].play();
                        }
                    }
                    //有没有脚本，是否用户有动态添加，如果有则覆盖原有的，并且就算用户删除了这个动态脚本，原有时间轴上的脚本一样不再执行
                    var isUserScript = false;
                    if (s._a2x_script) {
                        curFrameOther = s._a2x_script[index];
                        if (curFrameOther != undefined) {
                            if (curFrameOther != null)
                                curFrameOther();
                            isUserScript = true;
                        }
                    }
                    if (!isUserScript) {
                        curFrameOther = timeLineObj.a[index];
                        if (curFrameOther) {
                            s[curFrameOther[0]](curFrameOther[1]);
                        }
                    }
                    //有没有事件
                    if (s.hasEventListener(annie.Event.CALL_FRAME)) {
                        curFrameOther = timeLineObj.e[index];
                        if (curFrameOther) {
                            for (var i = 0; i < curFrameOther.length; i++) {
                                //抛事件
                                s.dispatchEvent(annie.Event.CALL_FRAME, {
                                    frameIndex: s._curFrame,
                                    frameName: curFrameOther[i]
                                });
                            }
                        }
                    }
                    if (((s._curFrame == 1 && !s._isFront) || (s._curFrame == s._a2x_res_class.tf && s._isFront)) && s.hasEventListener(annie.Event.END_FRAME)) {
                        s.dispatchEvent(annie.Event.END_FRAME, {
                            frameIndex: s._curFrame,
                            frameName: "endFrame"
                        });
                    }
                }
            }
            _super.prototype.update.call(this, isDrawUpdate);
        };
        /**
         * 销毁一个对象
         * 销毁之前一定要从显示对象移除，否则将会出错
         */
        MovieClip.prototype.destroy = function () {
            //清除相应的数据引用
            var s = this;
            s._lastFrameObj = null;
            s._a2x_script = null;
            s._maskList = null;
            _super.prototype.destroy.call(this);
        };
        return MovieClip;
    }(annie.Sprite));
    annie.MovieClip = MovieClip;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 动态文本类,有时需要在canvas里有一个动态文本,能根据我们的显示内容来改变
     * @class annie.TextField
     * @extends annie.DisplayObject
     * @since 1.0.0
     * @public
     */
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this) || this;
            _this._textAlign = "left";
            _this._textAlpha = 1;
            _this._textHeight = 0;
            _this._lineSpacing = 14;
            _this._textWidth = 0;
            _this._lineType = "single";
            _this._textOffX = 0;
            _this._text = "";
            _this._font = "Arial";
            _this._size = 12;
            _this._color = "#fff";
            _this._italic = false;
            _this._bold = false;
            _this._border = false;
            _this._instanceType = "annie.TextField";
            return _this;
        }
        Object.defineProperty(TextField.prototype, "textAlign", {
            get: function () {
                return this._textAlign;
            },
            /**
             * 文本的对齐方式
             * @property textAlign
             * @public
             * @since 1.0.0
             * @type {string}
             * @default left
             */
            set: function (value) {
                this._setProperty("_textAlign", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textAlpha", {
            get: function () {
                return this._textAlpha;
            },
            set: function (value) {
                this._setProperty("_textAlpha", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textHeight", {
            get: function () {
                return this._textHeight;
            },
            /**
             * 文本的行高
             * @property textHeight
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            set: function (value) {
                this._setProperty("_textHeight", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "lineSpacing", {
            get: function () {
                return this._lineSpacing;
            },
            /**
             *
             * @param {number} value
             */
            set: function (value) {
                this._setProperty("_lineSpacing", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "textWidth", {
            get: function () {
                return this._textWidth;
            },
            /**
             * 文本的宽
             * @property textWidth
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 0
             */
            set: function (value) {
                this._setProperty("_textWidth", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "lineType", {
            get: function () {
                return this._lineType;
            },
            /**
             * 文本类型,单行还是多行 single multi
             * @property lineType
             * @public
             * @since 1.0.0
             * @type {string} 两种 single和multi
             * @default single
             */
            set: function (value) {
                this._setProperty("_lineType", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this._text;
            },
            /**
             * 文本内容
             * @property text
             * @type {string}
             * @public
             * @default ""
             * @since 1.0.0
             */
            set: function (value) {
                this._setProperty("_text", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "font", {
            get: function () {
                return this._font;
            },
            /**
             * 文本的css字体样式
             * @property font
             * @public
             * @since 1.0.0
             * @type {string}
             * @default 12px Arial
             */
            set: function (value) {
                this._setProperty("_font", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "size", {
            get: function () {
                return this._size;
            },
            /**
             * 文本的size
             * @property size
             * @public
             * @since 1.0.0
             * @type {number}
             * @default 12
             */
            set: function (value) {
                this._setProperty("_size", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "color", {
            get: function () {
                return this._color;
            },
            /**
             * 文本的颜色值
             * @property color
             * @type {string}
             * @public
             * @since 1.0.0
             * @default #fff
             */
            set: function (value) {
                this._setProperty("_color", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "italic", {
            get: function () {
                return this._italic;
            },
            /**
             * 文本是否倾斜
             * @property italic
             * @public
             * @since
             * @default false
             * @type {boolean}
             */
            set: function (value) {
                this._setProperty("_italic", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "bold", {
            get: function () {
                return this._bold;
            },
            /**
             * 文本是否加粗
             * @property bold
             * @public
             * @since
             * @default false
             * @type {boolean}
             */
            set: function (value) {
                this._setProperty("_bold", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "border", {
            get: function () {
                return this._border;
            },
            /**
             * 设置或获取是否有边框
             * @property property
             * @param {boolean} show true或false
             * @public
             * @since 1.0.6
             */
            set: function (value) {
                this._setProperty("_border", value, 3);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置文本在canvas里的渲染样式
         * @param ctx
         * @private
         * @since 1.0.0
         */
        TextField.prototype._draw = function (ctx) {
            var s = this;
            ctx.font = s.fontInfo;
            ctx.fillStyle = annie.Shape.getRGBA(s._color, s._textAlpha);
            ctx.textAlign = s._textAlign;
            ctx.textBaseline = "top";
            for (var i = 0; i < s.realLines.length; i++) {
                ctx.fillText(s.realLines[i], s._textOffX, i * s.lineSpacing, s._bounds.width);
            }
        };
        /**
         * 获取文本宽
         * @method _getMeasuredWidth
         * @param text
         * @return {number}
         * @private
         * @since 1.0.0
         */
        TextField.prototype._getMeasuredWidth = function (text) {
            var ctx = annie.CanvasRender.drawCtx;
            //ctx.save();
            var w = ctx.measureText(text).width;
            //ctx.restore();
            return w;
        };
        /**
         * 重写 update
         * @method update
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        TextField.prototype.update = function (isDrawUpdate) {
            if (isDrawUpdate === void 0) { isDrawUpdate = false; }
            _super.prototype.update.call(this, isDrawUpdate);
            var s = this;
            if (!s._visible)
                return;
            if (s._UI.UD || s._UI.UF) {
                s._text += "";
                var ctx = annie.CanvasRender.drawCtx;
                var hardLines = s._text.toString().split(/(?:\r\n|\r|\n)/);
                s.realLines = [];
                s.fontInfo = s.size || 12;
                s.fontInfo += "px ";
                s.fontInfo += s.font;
                if (s._bold) {
                    s.fontInfo = "bold " + s.fontInfo;
                }
                if (s._italic) {
                    s.fontInfo = "italic " + s.fontInfo;
                }
                ctx.font = s.fontInfo;
                var lineH = s._lineSpacing;
                if (s._text.indexOf("\n") < 0 && s.lineType == "single") {
                    s.realLines[s.realLines.length] = hardLines[0];
                    var str = hardLines[0];
                    var lineW = s._getMeasuredWidth(str);
                    if (lineW > s._textWidth) {
                        var w = s._getMeasuredWidth(str[0]);
                        var lineStr = str[0];
                        var wordW = 0;
                        var strLen = str.length;
                        for (var j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
                                s.realLines[0] = lineStr;
                                break;
                            }
                            else {
                                lineStr += str[j];
                            }
                        }
                    }
                }
                else {
                    for (var i = 0, l = hardLines.length; i < l; i++) {
                        var str = hardLines[i];
                        if (!str)
                            continue;
                        var w = s._getMeasuredWidth(str[0]);
                        var lineStr = str[0];
                        var wordW = 0;
                        var strLen = str.length;
                        for (var j = 1; j < strLen; j++) {
                            wordW = ctx.measureText(str[j]).width;
                            w += wordW;
                            if (w > s._textWidth) {
                                s.realLines[s.realLines.length] = lineStr;
                                lineStr = str[j];
                                w = wordW;
                            }
                            else {
                                lineStr += str[j];
                            }
                        }
                        s.realLines[s.realLines.length] = lineStr;
                    }
                }
                var maxH = lineH * s.realLines.length;
                var maxW = s._textWidth;
                if (s._textAlign == "center") {
                    s._textOffX = maxW * 0.5;
                }
                else if (s._textAlign == "right") {
                    s._textOffX = maxW;
                }
                else {
                    s._textOffX = 0;
                }
                s._UI.UD = false;
                s._bounds.height = maxH;
                s._bounds.width = maxW;
            }
            s._UI.UM = false;
            s._UI.UA = false;
            s._UI.UF = false;
        };
        /**
         * 重写 getBounds
         * @method getBounds
         * @return {annie.Rectangle}
         * @public
         * @since 1.0.0
         */
        TextField.prototype.getBounds = function () {
            return this._bounds;
        };
        return TextField;
    }(annie.DisplayObject));
    annie.TextField = TextField;
})(annie || (annie = {}));
/// <reference path="Sprite.ts" />
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * Stage 表示显示 canvas 内容的整个区域，所有显示对象的顶级显示容器
     * 无法以全局方式访问 Stage 对象,而是需要利用DisplayObject实例的getStage()方法进行访问
     * @class annie.Stage
     * @extends annie.Sprite
     * @public
     * @since 1.0.0
     */
    var Stage = (function (_super) {
        __extends(Stage, _super);
        /**
         * 显示对象入口函数
         * @method Stage
         * @param {Canvas} ctx
         * @param {number} desW canvas宽
         * @param {number} desH canvas高
         * @param {number} desW 舞台宽
         * @param {number} desH 舞台高
         * @param {number} fps 刷新率
         * @param {string} scaleMode 缩放模式 StageScaleMode
         * @param {string} bgColor 背景颜色-1为透明
         * @public
         * @since 1.0.0
         */
        function Stage(ctx, canW, canH, desW, desH, frameRate, scaleMode) {
            if (canW === void 0) { canW = 640; }
            if (canH === void 0) { canH = 960; }
            if (desW === void 0) { desW = 640; }
            if (desH === void 0) { desH = 1040; }
            if (frameRate === void 0) { frameRate = 30; }
            if (scaleMode === void 0) { scaleMode = "fixedHeight"; }
            var _this = _super.call(this) || this;
            /**
             * 当前stage所使用的渲染器
             * 渲染器有两种,一种是canvas 一种是webGl
             * @property renderObj
             * @public
             * @since 1.0.0
             * @type {IRender}
             * @default null
             */
            _this.renderObj = null;
            /**
             * 如果值为true则暂停更新当前显示对象及所有子对象。在视觉上就相当于界面停止了,但一样能会接收鼠标事件<br/>
             * 有时候背景为大量动画的一个对象时,当需要弹出一个框或者其他内容,或者模糊一个背景时可以设置此属性让<br/>
             * 对象视觉暂停更新
             * @property pause
             * @type {boolean}
             * @public
             * @since 1.0.0
             * @default false
             */
            _this.pause = false;
            /**
             * 舞台在设备里截取后的可见区域,有些时候知道可见区域是非常重要的,因为这样你就可以根据舞台的可见区域做自适应了。
             * @property viewRect
             * @public
             * @readonly
             * @since 1.0.0
             * @type {annie.Rectangle}
             * @default {x:0,y:0,width:0,height:0}
             * @readonly
             * @example
             *      //始终让一个对象顶对齐，或者
             */
            _this.viewRect = new annie.Rectangle();
            /**
             * 开启或关闭多点手势事件 目前仅支持两点 旋转 缩放
             * @property isMultiTouch
             * @since 1.0.3
             * @type {boolean}
             */
            _this.isMultiTouch = false;
            /**
             * 开启或关闭多个手指的鼠标事件 目前仅支持两点 旋转 缩放
             * @property isMultiMouse
             * @since 1.1.3
             * @type {boolean}
             */
            _this.isMultiMouse = false;
            /**
             * 舞台的尺寸宽,也就是我们常说的设计尺寸
             * @property desWidth
             * @public
             * @since 1.0.0
             * @default 320
             * @type {number}
             * @readonly
             */
            _this.desWidth = 0;
            /**
             * 舞台的尺寸高,也就是我们常说的设计尺寸
             * @property desHeight
             * @public
             * @since 1.0.0
             * @default 240
             * @type {number}
             * @readonly
             */
            _this.desHeight = 0;
            /**
             * 舞台在当前设备中的真实高
             * @property divHeight
             * @public
             * @since 1.0.0
             * @default 320
             * @type {number}
             * @readonly
             */
            _this.divHeight = 0;
            /**
             * 舞台在当前设备中的真实宽
             * @property divWidth
             * @public
             * @since 1.0.0
             * @default 240
             * @readonly
             * @type {number}
             */
            _this.divWidth = 0;
            /**
             * 舞台的背景色
             * 默认就是透明背景
             * 可能设置一个颜色值改变舞台背景
             * @property bgColor
             * @public
             * @since 1.0.0
             * @type {string}
             * @default "";
             */
            _this.bgColor = "";
            _this._scaleMode = "onScale";
            /**
             * 原始为60的刷新速度时的计数器
             * @property _flush
             * @private
             * @since 1.0.0
             * @default 0
             * @type {number}
             */
            _this._flush = 0;
            /**
             * 当前的刷新次数计数器
             * @property _currentFlush
             * @private
             * @since 1.0.0
             * @default 0
             * @type {number}
             */
            _this._currentFlush = 0;
            /**
             * 上一次鼠标或触碰经过的显示对象列表
             * @type {Array}
             * @private
             */
            _this._lastDpList = {};
            /**
             * 这个是鼠标事件的MouseEvent对象池,因为如果用户有监听鼠标事件,如果不建立对象池,那每一秒将会new Fps个数的事件对象,影响性能
             * @type {Array}
             * @private
             */
            _this._ml = [];
            /**
             * 这个是事件中用到的Point对象池,以提高性能
             * @type {Array}
             * @private
             */
            _this._mp = [];
            //每一个手指事件的对象池
            _this._mouseDownPoint = {};
            /**
             * html的鼠标或单点触摸对应的引擎事件类型名
             * @type {{mousedown: string, mouseup: string, mousemove: string, touchstart: string, touchmove: string, touchend: string}}
             * @private
             */
            _this._mouseEventTypes = {
                mousedown: "onMouseDown",
                mouseup: "onMouseUp",
                mousemove: "onMouseMove",
                touchstart: "onMouseDown",
                touchmove: "onMouseMove",
                touchend: "onMouseUp"
            };
            _this.muliPoints = [];
            /**
             * 当document有鼠标或触摸事件时调用
             * @param e
             */
            _this._mP1 = new annie.Point();
            _this._mP2 = new annie.Point();
            _this._onMouseEvent = function (e) {
                //检查是否有
                var s = this;
                //判断是否有drag的显示对象
                var sd = Stage._dragDisplay;
                if (s.isMultiTouch && e.targetTouches && e.targetTouches.length > 1) {
                    if (e.targetTouches.length == 2) {
                        //求角度和距离
                        s._mP1.x = e.targetTouches[0].pageX - e.target.offsetLeft;
                        s._mP1.y = e.targetTouches[0].pageY - e.target.offsetTop;
                        s._mP2.x = e.targetTouches[1].pageX - e.target.offsetLeft;
                        s._mP2.y = e.targetTouches[1].pageY - e.target.offsetTop;
                        var angle = Math.atan2(s._mP1.y - s._mP2.y, s._mP1.x - s._mP2.x) / Math.PI * 180;
                        var dis = annie.Point.distance(s._mP1, s._mP2);
                        s.muliPoints.push({ p1: s._mP1, p2: s._mP2, angle: angle, dis: dis });
                        if (s.muliPoints.length >= 2) {
                            //如果有事件，抛事件
                            if (!s._touchEvent) {
                                s._touchEvent = new annie.TouchEvent(annie.TouchEvent.ON_MULTI_TOUCH);
                                s._touchEvent.target = s;
                            }
                            var len = s.muliPoints.length;
                            s._touchEvent.rotate = (s.muliPoints[len - 1].angle - s.muliPoints[len - 2].angle) * 2;
                            s._touchEvent.scale = (s.muliPoints[len - 1].dis - s.muliPoints[len - 2].dis) / (s.divHeight > s.divWidth ? s.desWidth : s.desHeight) * 4;
                            s._touchEvent.clientPoint1.x = s.muliPoints[len - 1].p1.x;
                            s._touchEvent.clientPoint2.x = s.muliPoints[len - 1].p2.x;
                            s._touchEvent.clientPoint1.y = s.muliPoints[len - 1].p1.y;
                            s._touchEvent.clientPoint2.y = s.muliPoints[len - 1].p2.y;
                            s.dispatchEvent(s._touchEvent);
                            s.muliPoints.shift();
                        }
                    }
                    else {
                        s.muliPoints.length = 0;
                    }
                    if (sd) {
                        sd._lastDragPoint.x = Number.MAX_VALUE;
                        sd._lastDragPoint.y = Number.MAX_VALUE;
                    }
                    s._mouseDownPoint = {};
                    s._lastDpList = {};
                }
                else {
                    if (s.muliPoints.length > 0) {
                        s._touchEvent.rotate = 0;
                        s._touchEvent.scale = 0;
                        s._touchEvent.clientPoint1.x = 0;
                        s._touchEvent.clientPoint2.x = 0;
                        s._touchEvent.clientPoint1.y = 0;
                        s._touchEvent.clientPoint2.y = 0;
                        s.dispatchEvent(s._touchEvent);
                        s.muliPoints.length = 0;
                    }
                    //检查mouse或touch事件是否有，如果有的话，就触发事件函数
                    if (annie.EventDispatcher._totalMEC > 0) {
                        var points = void 0;
                        var item = s._mouseEventTypes[e.type];
                        var events = void 0;
                        var event_1;
                        //stageMousePoint
                        var sp = void 0;
                        //localPoint;
                        var lp = void 0;
                        //clientPoint
                        var cp = void 0;
                        //事件个数
                        var eLen = void 0;
                        var identifier = void 0;
                        if (s.isMultiMouse) {
                            points = e.changedTouches;
                        }
                        else {
                            points = [e.changedTouches[0]];
                        }
                        for (var o = 0; o < points.length; o++) {
                            eLen = 0;
                            events = [];
                            identifier = points[o].identifier;
                            if (s._mp.length > 0) {
                                cp = s._mp.shift();
                            }
                            else {
                                cp = new annie.Point();
                            }
                            cp.x = points[o].pageX;
                            cp.y = points[o].pageY;
                            //这个地方检查是所有显示对象列表里是否有添加任何鼠标或触碰事件,有的话就检测,没有的话就算啦。
                            sp = s.globalToLocal(cp, annie.DisplayObject._bp);
                            if (annie.EventDispatcher.getMouseEventCount() > 0) {
                                if (!s._ml[eLen]) {
                                    event_1 = new annie.MouseEvent(item);
                                    s._ml[eLen] = event_1;
                                }
                                else {
                                    event_1 = s._ml[eLen];
                                    event_1.type = item;
                                }
                                events[events.length] = event_1;
                                s._initMouseEvent(event_1, cp, sp, identifier);
                                eLen++;
                            }
                            if (item == "onMouseDown") {
                                s._mouseDownPoint[identifier] = cp;
                                //清空上次存在的显示列表
                            }
                            else if (item == "onMouseUp") {
                                if (s._mouseDownPoint[identifier]) {
                                    if (annie.Point.distance(s._mouseDownPoint[identifier], cp) < 20) {
                                        //click事件
                                        //这个地方检查是所有显示对象列表里是否有添加对应的事件
                                        if (annie.EventDispatcher.getMouseEventCount("onMouseClick") > 0) {
                                            if (!s._ml[eLen]) {
                                                event_1 = new annie.MouseEvent("onMouseClick");
                                                s._ml[eLen] = event_1;
                                            }
                                            else {
                                                event_1 = s._ml[eLen];
                                                event_1.type = "onMouseClick";
                                            }
                                            events[events.length] = event_1;
                                            s._initMouseEvent(event_1, cp, sp, identifier);
                                            eLen++;
                                        }
                                    }
                                }
                            }
                            if (eLen > 0) {
                                //证明有事件那么就开始遍历显示列表。就算有多个事件也不怕，因为坐标点相同，所以只需要遍历一次
                                var d_1 = s.hitTestPoint(cp, true);
                                var displayList = [];
                                if (d_1) {
                                    //证明有点击到事件,然后从最底层追上来,看看一路是否有人添加过mouse或touch事件,还要考虑mousechildren和阻止事件方法
                                    //找出真正的target,因为有些父级可能会mouseChildren=false;
                                    while (d_1) {
                                        if (d_1["mouseChildren"] === false) {
                                            //丢掉之前的层级,因为根本没用了
                                            displayList.length = 0;
                                        }
                                        displayList[displayList.length] = d_1;
                                        d_1 = d_1.parent;
                                    }
                                }
                                else {
                                    displayList[displayList.length] = s;
                                }
                                var len = displayList.length;
                                for (var i = 0; i < len; i++) {
                                    d_1 = displayList[i];
                                    for (var j = eLen - 1; j >= 0; j--) {
                                        if (events[j]["_pd"] === false) {
                                            if (d_1.hasEventListener(events[j].type)) {
                                                events[j].currentTarget = d_1;
                                                events[j].target = displayList[0];
                                                lp = d_1.globalToLocal(cp, annie.DisplayObject._bp);
                                                events[j].localX = lp.x;
                                                events[j].localY = lp.y;
                                                d_1.dispatchEvent(events[j]);
                                            }
                                        }
                                    }
                                }
                                //TODO 冒泡
                                /*for (let i = 0; i < len; i++) {
                                    d = displayList[i];
                                    for (let j = 0; j < eLen; j++) {
                                        if (events[j]["_pd"] === false){
                                            if (d.hasEventListener(events[j].type)) {
                                                events[j].currentTarget = d;
                                                events[j].target = displayList[0];
                                                lp = d.globalToLocal(cp, DisplayObject._bp);
                                                events[j].localX = lp.x;
                                                events[j].localY = lp.y;
                                                d.dispatchEvent(events[j]);
                                            }
                                        }
                                    }
                                }*/
                                //这里一定要反转一下，因为会影响mouseOut mouseOver
                                displayList.reverse();
                                //最后要和上一次的遍历者对比下，如果不相同则要触发onMouseOver和onMouseOut
                                if (item != "onMouseDown") {
                                    if (annie.EventDispatcher.getMouseEventCount("onMouseOver") > 0 || annie.EventDispatcher.getMouseEventCount("onMouseOut") > 0) {
                                        if (s._lastDpList[identifier]) {
                                            //从第二个开始，因为第一个对象始终是stage顶级对象
                                            var len1 = s._lastDpList[identifier].length;
                                            var len2 = displayList.length;
                                            len = len1 > len2 ? len1 : len2;
                                            var isDiff = false;
                                            var overEvent = void 0;
                                            var outEvent = void 0;
                                            for (var i = 1; i < len; i++) {
                                                if (!isDiff) {
                                                    if (s._lastDpList[identifier][i] != displayList[i]) {
                                                        //好就是这里，需要确定哪些有onMouseOver,哪些有onMouseOut
                                                        isDiff = true;
                                                        if (!s._ml[eLen]) {
                                                            overEvent = new annie.MouseEvent("onMouseOver");
                                                            s._ml[eLen] = overEvent;
                                                        }
                                                        else {
                                                            overEvent = s._ml[eLen];
                                                            overEvent.type = "onMouseOver";
                                                        }
                                                        s._initMouseEvent(overEvent, cp, sp, identifier);
                                                        eLen++;
                                                        if (!s._ml[eLen]) {
                                                            outEvent = new annie.MouseEvent("onMouseOut");
                                                            s._ml[eLen] = outEvent;
                                                        }
                                                        else {
                                                            outEvent = s._ml[eLen];
                                                            outEvent.type = "onMouseOut";
                                                        }
                                                        s._initMouseEvent(outEvent, cp, sp, identifier);
                                                    }
                                                }
                                                if (isDiff) {
                                                    if (s._lastDpList[identifier][i]) {
                                                        //触发onMouseOut事件
                                                        if (outEvent["_pd"] === false) {
                                                            d_1 = s._lastDpList[identifier][i];
                                                            if (d_1.hasEventListener("onMouseOut")) {
                                                                outEvent.currentTarget = d_1;
                                                                outEvent.target = s._lastDpList[identifier][len1 - 1];
                                                                lp = d_1.globalToLocal(cp, annie.DisplayObject._bp);
                                                                outEvent.localX = lp.x;
                                                                outEvent.localY = lp.y;
                                                                d_1.dispatchEvent(outEvent);
                                                            }
                                                        }
                                                    }
                                                    if (displayList[i]) {
                                                        //触发onMouseOver事件
                                                        if (overEvent["_pd"] === false) {
                                                            d_1 = displayList[i];
                                                            if (d_1.hasEventListener("onMouseOver")) {
                                                                overEvent.currentTarget = d_1;
                                                                overEvent.target = displayList[len2 - 1];
                                                                lp = d_1.globalToLocal(cp, annie.DisplayObject._bp);
                                                                overEvent.localX = lp.x;
                                                                overEvent.localY = lp.y;
                                                                d_1.dispatchEvent(overEvent);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    s._mp[s._mp.length] = cp;
                                }
                                if (sd && sd.stage && sd.parent) {
                                    var x1 = sd.x, y1 = sd.y;
                                    lp = sd.parent.globalToLocal(cp, annie.DisplayObject._bp);
                                    if (!sd._isDragCenter) {
                                        if (sd._lastDragPoint.x != Number.MAX_VALUE) {
                                            x1 += lp.x - sd._lastDragPoint.x;
                                            y1 += lp.y - sd._lastDragPoint.y;
                                        }
                                        sd._lastDragPoint.x = lp.x;
                                        sd._lastDragPoint.y = lp.y;
                                    }
                                    else {
                                        x1 = lp.x;
                                        y1 = lp.y;
                                    }
                                    lp.x = x1;
                                    lp.y = y1;
                                    if (sd._dragBounds.width != 0) {
                                        if (!sd._dragBounds.isPointIn(lp)) {
                                            if (x1 < sd._dragBounds.x) {
                                                x1 = sd._dragBounds.x;
                                            }
                                            else if (x1 > sd._dragBounds.x + sd._dragBounds.width) {
                                                x1 = sd._dragBounds.x + sd._dragBounds.width;
                                            }
                                            if (y1 < sd._dragBounds.y) {
                                                y1 = sd._dragBounds.y;
                                            }
                                            else if (y1 > sd._dragBounds.y + sd._dragBounds.height) {
                                                y1 = sd._dragBounds.y + sd._dragBounds.height;
                                            }
                                        }
                                    }
                                    sd.x = x1;
                                    sd.y = y1;
                                }
                                if (item == "onMouseUp") {
                                    if (sd) {
                                        sd._lastDragPoint.x = Number.MAX_VALUE;
                                        sd._lastDragPoint.y = Number.MAX_VALUE;
                                    }
                                    delete s._mouseDownPoint[identifier];
                                    delete s._lastDpList[identifier];
                                }
                                else {
                                    s._lastDpList[identifier] = displayList;
                                }
                            }
                        }
                    }
                }
                if (s._cp) {
                    s.update();
                }
            };
            /**
             * 设置舞台的对齐模式
             */
            _this.setAlign = function () {
                var s = this;
                var divH = s.divHeight;
                var divW = s.divWidth;
                var desH = s.desHeight;
                var desW = s.desWidth;
                s.anchorX = desW >> 1;
                s.anchorY = desH >> 1;
                //设备是否为竖屏
                var isDivH = divH > divW;
                //内容是否为竖屏内容
                var isDesH = desH > desW;
                var scaleY = 1;
                var scaleX = 1;
                s.x = (divW - desW) >> 1;
                s.y = (divH - desH) >> 1;
                if (s.autoSteering) {
                    if (isDesH != isDivH) {
                        var d_2 = divH;
                        divH = divW;
                        divW = d_2;
                    }
                }
                if (s._scaleMode != "noScale") {
                    scaleY = divH / desH;
                    scaleX = divW / desW;
                    switch (s._scaleMode) {
                        case "noBorder":
                            if (scaleX > scaleY) {
                                scaleY = scaleX;
                            }
                            else {
                                scaleX = scaleY;
                            }
                            break;
                        case "showAll":
                            if (scaleX < scaleY) {
                                scaleY = scaleX;
                            }
                            else {
                                scaleX = scaleY;
                            }
                            break;
                        case "fixedWidth":
                            scaleY = scaleX;
                            break;
                        case "fixedHeight":
                            scaleX = scaleY;
                            break;
                    }
                }
                s.scaleX = scaleX;
                s.scaleY = scaleY;
                // s.viewRect=new annie.Rectangle();
                s.viewRect.x = (desW - divW / scaleX) >> 1;
                s.viewRect.y = (desH - divH / scaleY) >> 1;
                s.viewRect.width = desW - s.viewRect.x * 2;
                s.viewRect.height = desH - s.viewRect.y * 2;
                if (isDesH == isDivH) {
                    s.rotation = 0;
                }
                else {
                    if (desH > desW) {
                        s.rotation = -90;
                    }
                    else {
                        s.rotation = 90;
                    }
                }
            };
            var s = _this;
            _this._instanceType = "annie.Stage";
            s.stage = _this;
            s.name = "stageInstance" + s._instanceId;
            s.desWidth = desW;
            s.desHeight = desH;
            s.divWidth = canW;
            s.divHeight = canH;
            s.setFrameRate(frameRate);
            s.anchorX = desW >> 1;
            s.anchorY = desH >> 1;
            //目前具支持canvas
            s.renderObj = new annie.CanvasRender(s, ctx);
            //同时添加到主更新循环中
            Stage.addUpdateObj(s);
            s.onTouchEvent = s._onMouseEvent.bind(s);
            s._scaleMode = scaleMode;
            s.setAlign();
            return _this;
        }
        Object.defineProperty(Stage.prototype, "scaleMode", {
            /**
             * 舞台的缩放模式
             * 默认为空就是无缩放的真实大小
             * "noBorder" 无边框模式
             * ”showAll" 显示所有内容
             * “fixedWidth" 固定宽
             * ”fixedHeight" 固定高
             * @property scaleMode
             * @public
             * @since 1.0.0
             * @default "onScale"
             * @type {string}
             * @example
             *      //动态更改stage的对齐方式示例
             *      //以下代码放到一个舞台的显示对象的构造函数中
             *      let s=this;
             *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
             *          let i=0;
             *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
             *              let aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
             *              let state=e.currentTarget;
             *              state.scaleMode=aList[i];
             *              state.resize();
             *              if(i>5){i=0;}
             *          }
             *      }
             *
             */
            get: function () {
                return this._scaleMode;
            },
            set: function (value) {
                var s = this;
                if (value != s._scaleMode) {
                    s._scaleMode = value;
                    s.setAlign();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 重写刷新
         * @method update
         * @public
         * @since 1.0.0
         */
        Stage.prototype.update = function (isDrawUpdate) {
            if (isDrawUpdate === void 0) { isDrawUpdate = true; }
            var s = this;
            if (!s.pause) {
                _super.prototype.update.call(this, isDrawUpdate);
            }
        };
        /**
         * 渲染函数
         * @method render
         * @param renderObj
         */
        Stage.prototype.render = function (renderObj) {
            var s = this;
            if (!s.pause) {
                renderObj.begin();
                _super.prototype.render.call(this, renderObj);
                renderObj.end();
            }
        };
        /**
         * 刷新mouse或者touch事件
         * @private
         */
        Stage.prototype._initMouseEvent = function (event, cp, sp, identifier) {
            event["_pd"] = false;
            event.clientX = cp.x;
            event.clientY = cp.y;
            event.stageX = sp.x;
            event.stageY = sp.y;
            event.identifier = identifier;
        };
        /**
         * 循环刷新页面的函数
         */
        Stage.prototype.flush = function () {
            var s = this;
            if (s._flush == 0) {
                s.update(true);
                s.render(s.renderObj);
            }
            else {
                //将更新和渲染分放到两个不同的时间更新值来执行,这样可以减轻cpu同时执行的压力。
                if (s._currentFlush == 0) {
                    s.update(true);
                    s.render(s.renderObj);
                    s._currentFlush = s._flush;
                }
                else {
                    // if (s._currentFlush == s._flush) {
                    //     s.render(s.renderObj);
                    // }
                    s._currentFlush--;
                }
            }
        };
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method setFrameRate
         * @param {number} fps 最好是60的倍数如 1 2 3 6 10 12 15 20 30 60
         * @since 1.0.0
         * @public
         */
        Stage.prototype.setFrameRate = function (fps) {
            var s = this;
            s._flush = 60 / fps - 1 >> 0;
            if (s._flush < 0) {
                s._flush = 0;
            }
        };
        /**
         * 引擎的刷新率,就是一秒中执行多少次刷新
         * @method getFrameRate
         * @since 1.0.0
         * @public
         */
        Stage.prototype.getFrameRate = function () {
            return 60 / (this._flush + 1);
        };
        /**
         * 当一个stage不再需要使用,或者要从浏览器移除之前,请先停止它,避免内存泄漏
         * @method kill
         * @since 1.0.0
         * @public
         */
        Stage.prototype.kill = function () {
            Stage.removeUpdateObj(this);
        };
        Stage.prototype.getBounds = function () {
            return this.viewRect;
        };
        /**
         * 刷新所有定时器
         * @static
         * @private
         * @since 1.0.0
         * @method flushAll
         */
        Stage.flushAll = function () {
            setInterval(function () {
                var len = Stage.allUpdateObjList.length;
                for (var i = 0; i < len; i++) {
                    Stage.allUpdateObjList[i] && Stage.allUpdateObjList[i].flush();
                }
            }, 20);
            //requestAnimationFrame(Stage.flushAll);
        };
        /**
         * 添加一个刷新对象，这个对象里一定要有一个 flush 函数。
         * 因为一但添加，这个对象的 flush 函数会以stage的fps间隔调用
         * 如，你的stage是30fps 那么你这个对象的 flush 函数1秒会调用30次。
         * @method addUpdateObj
         * @param target 要循化调用 flush 函数的对象
         * @public
         * @static
         * @since
         */
        Stage.addUpdateObj = function (target) {
            var isHave = false;
            var len = Stage.allUpdateObjList.length;
            for (var i = 0; i < len; i++) {
                if (Stage.allUpdateObjList[i] === target) {
                    isHave = true;
                    break;
                }
            }
            if (!isHave) {
                Stage.allUpdateObjList.unshift(target);
            }
        };
        /**
         * 移除掉已经添加的循环刷新对象
         * @method removeUpdateObj
         * @param target
         * @public
         * @static
         * @since 1.0.0
         */
        Stage.removeUpdateObj = function (target) {
            var len = Stage.allUpdateObjList.length;
            for (var i = 0; i < len; i++) {
                if (Stage.allUpdateObjList[i] === target) {
                    Stage.allUpdateObjList.splice(i, 1);
                    break;
                }
            }
        };
        Stage.prototype.destroy = function () {
            var s = this;
            Stage.removeUpdateObj(s);
            s.pause = true;
            s.renderObj = null;
            s.viewRect = null;
            s._lastDpList = null;
            s._touchEvent = null;
            s.muliPoints = null;
            s._mP1 = null;
            s._mP2 = null;
            s._ml = null;
            _super.prototype.destroy.call(this);
        };
        Stage._dragDisplay = null;
        /**
         * 要循环调用 flush 函数对象列表
         * @method allUpdateObjList
         * @static
         * @since 1.0.0
         * @type {Array}
         */
        Stage.allUpdateObjList = [];
        return Stage;
    }(annie.Sprite));
    annie.Stage = Stage;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    //declare let WeixinJSBridge:any;
    /**
     * 声音类
     * @class annie.Sound
     * @extends annie.EventDispatcher
     * @public
     * @since 1.0.0
     */
    var Sound = (function (_super) {
        __extends(Sound, _super);
        /**
         * 构造函数
         * @method Sound
         * @param {string|HtmlElement} src
         * @param {string} type
         * @since 1.0.0
         */
        function Sound(src) {
            var _this = _super.call(this) || this;
            /**
             * html 标签 有可能是audio 或者 video
             * @property media
             * @type {Video|Audio}
             * @public
             * @since 1.0.0
             */
            _this.media = null;
            _this._loop = 0;
            var s = _this;
            s._instanceType = "annie.Sound";
            s.media = annie.createAudio();
            s.media.src = src;
            s.media.onEnded = function () {
                if (s._loop > 1) {
                    s._loop--;
                    s.media.play();
                }
            };
            return _this;
        }
        /**
         * 开始播放媒体
         * @method play
         * @param {number} start 开始点 默认为0
         * @param {number} loop 循环次数 默认为1
         * @public
         * @since 1.0.0
         */
        Sound.prototype.play = function (start, loop) {
            if (start === void 0) { start = 0; }
            if (loop === void 0) { loop = 1; }
            var s = this;
            s.media.startTime = start;
            s._loop = loop;
            s.media.play();
        };
        /**
         * 停止播放
         * @method stop
         * @public
         * @since 1.0.0
         */
        Sound.prototype.stop = function () {
            this.media.stop();
        };
        /**
         * 暂停播放,或者恢复播放
         * @method pause
         * @public
         * @param isPause  默认为true;是否要暂停，如果要暂停，则暂停；否则则播放
         * @since 1.0.4
         */
        Sound.prototype.pause = function (isPause) {
            if (isPause === void 0) { isPause = true; }
            if (isPause) {
                this.media.pause();
            }
            else {
                this.media.play();
            }
        };
        Object.defineProperty(Sound.prototype, "volume", {
            /**
             * 设置或者获取音量 从0-1
             * @since 1.1.0
             * @property volume
             * @returns {number}
             */
            get: function () {
                return this.media.volume;
            },
            set: function (value) {
                this.media.volume = value;
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    }(annie.EventDispatcher));
    annie.Sound = Sound;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 投影或者发光滤镜
     * @class annie.ShadowFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var ShadowFilter = (function (_super) {
        __extends(ShadowFilter, _super);
        /**
         * @method ShadowFilter
         * @param {string} color
         * @param {number} offsetX
         * @param {number} offsetY
         * @param {number} blur
         */
        function ShadowFilter(color, offsetX, offsetY, blur) {
            if (color === void 0) { color = "black"; }
            if (offsetX === void 0) { offsetX = 2; }
            if (offsetY === void 0) { offsetY = 2; }
            if (blur === void 0) { blur = 2; }
            var _this = _super.call(this) || this;
            /**
             * 颜色值
             * @property color
             * @public
             * @readonly
             * @since 1.0.0
             * @default black
             * @type {string}
             */
            _this.color = "black";
            /**
             * x方向投影距离
             * @property offsetX
             * @public
             * @readonly
             * @since 1.0.0
             * @default 2
             * @type {number}
             */
            _this.offsetX = 2;
            /**
             * y方向投影距离
             * @property offsetY
             * @public
             * @readonly
             * @since 1.0.0
             * @default 2
             * @type {number}
             */
            _this.offsetY = 2;
            /**
             * 模糊值
             * @property blur
             * @public
             * @readonly
             * @since 1.0.0
             * @default 2
             * @type {number}
             */
            _this.blur = 2;
            /**
             * 滤镜类型 只读
             * @property color
             * @public
             * @readonly
             * @since 1.0.0
             * @default Shadow
             * @type {string}
             */
            _this.type = "Shadow";
            var s = _this;
            s._instanceType = "annie.ShadowFilter";
            s.offsetX = offsetX;
            s.offsetY = offsetY;
            s.blur = blur;
            s.color = color;
            return _this;
        }
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        ShadowFilter.prototype.toString = function () {
            var s = this;
            return s.type + s.offsetX + s.offsetY + s.blur + s.color;
        };
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @public
         * @since 1.0.0
         * @param {ImageData} imageData
         */
        ShadowFilter.prototype.drawFilter = function (imageData) {
            if (imageData === void 0) { imageData = null; }
            //什么也不要做
        };
        ShadowFilter.prototype.destroy = function () {
        };
        return ShadowFilter;
    }(annie.AObject));
    annie.ShadowFilter = ShadowFilter;
    /**
     * 普通变色滤镜
     * @class annie.ColorFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var ColorFilter = (function (_super) {
        __extends(ColorFilter, _super);
        /**
         * @method ColorFilter
         * @colorArrays 颜色值数据
         */
        function ColorFilter(colorArrays) {
            var _this = _super.call(this) || this;
            /**
             * @property redMultiplier
             * @public
             * @since 1.0.0
             * @readonly
             * @type {number}
             */
            _this.redMultiplier = 0;
            /**
             * @property redOffset
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.redOffset = 0;
            /**
             * @property greenMultiplier
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.greenMultiplier = 0;
            /**
             * @property greenOffset
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.greenOffset = 0;
            /**
             * @property blueMultiplier
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.blueMultiplier = 0;
            /**
             * @property blueOffset
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.blueOffset = 0;
            /**
             * @property alphaMultiplier
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.alphaMultiplier = 0;
            /**
             * @property alphaOffset
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.alphaOffset = 0;
            /**
             * @property type
             * @public
             * @readonly
             * @since 1.0.0
             * @type {string}
             */
            _this.type = "Color";
            var s = _this;
            s._instanceType = "annie.ColorFilter";
            s.redMultiplier = colorArrays[0];
            s.greenMultiplier = colorArrays[1];
            s.blueMultiplier = colorArrays[2];
            s.alphaMultiplier = colorArrays[3];
            s.redOffset = colorArrays[4];
            s.greenOffset = colorArrays[5];
            s.blueOffset = colorArrays[6];
            s.alphaOffset = colorArrays[7];
            return _this;
        }
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        ColorFilter.prototype.drawFilter = function (imageData) {
            if (imageData === void 0) { imageData = null; }
            if (!imageData)
                return;
            var s = this;
            var data = imageData.data;
            var l = data.length;
            for (var i = 0; i < l; i += 4) {
                data[i] = data[i] * s.redMultiplier + s.redOffset;
                data[i + 1] = data[i + 1] * s.greenMultiplier + s.greenOffset;
                data[i + 2] = data[i + 2] * s.blueMultiplier + s.blueOffset;
                data[i + 3] = data[i + 3] * s.alphaMultiplier + s.alphaOffset;
            }
        };
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        ColorFilter.prototype.toString = function () {
            var s = this;
            return s.type + s.redMultiplier + s.greenMultiplier + s.blueMultiplier + s.alphaMultiplier + s.redOffset + s.greenOffset + s.blueOffset + s.alphaOffset;
        };
        ColorFilter.prototype.destroy = function () {
        };
        return ColorFilter;
    }(annie.AObject));
    annie.ColorFilter = ColorFilter;
    /**
     * 矩阵变色滤镜
     * @class annie.ColorMatrixFilter
     * @extends annie.AObject
     * @public
     * @since 1.0.0
     */
    var ColorMatrixFilter = (function (_super) {
        __extends(ColorMatrixFilter, _super);
        /**
         * @method ColorMatrixFilter
         * @param {number} brightness
         * @param {number} contrast
         * @param {number} saturation
         * @param {number} hue
         * @public
         * @since 1.0.0
         */
        function ColorMatrixFilter(brightness, contrast, saturation, hue) {
            var _this = _super.call(this) || this;
            /**
             * @property brightness
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.brightness = 0;
            /**
             * @property contrast
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.contrast = 0;
            /**
             * @property saturation
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.saturation = 0;
            /**
             * @property hue
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.hue = 0;
            /**
             * 滤镜类型 只读
             * @property type
             * @public
             * @readonly
             * @since 1.0.0
             * @type {string}
             */
            _this.type = "ColorMatrix";
            var s = _this;
            s._instanceType = "annie.ColorMatrixFilter";
            s.brightness = brightness;
            s.contrast = contrast;
            s.saturation = saturation;
            s.hue = hue;
            s.colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0,
                0, 0, 0, 0, 1
            ];
            //brightness
            brightness = s._cleanValue(brightness, 255);
            if (brightness != 0) {
                s._multiplyMatrix([
                    1, 0, 0, 0, brightness,
                    0, 1, 0, 0, brightness,
                    0, 0, 1, 0, brightness,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            //contrast
            contrast = _this._cleanValue(contrast, 100);
            var x;
            if (contrast != 0) {
                if (contrast < 0) {
                    x = 127 + contrast / 100 * 127;
                }
                else {
                    x = contrast % 1;
                    if (x == 0) {
                        x = ColorMatrixFilter.DELTA_INDEX[contrast];
                    }
                    else {
                        x = ColorMatrixFilter.DELTA_INDEX[(contrast << 0)] * (1 - x) + ColorMatrixFilter.DELTA_INDEX[(contrast << 0) + 1] * x; // use linear interpolation for more granularity.
                    }
                    x = x * 127 + 127;
                }
                s._multiplyMatrix([
                    x / 127, 0, 0, 0, 0.5 * (127 - x),
                    0, x / 127, 0, 0, 0.5 * (127 - x),
                    0, 0, x / 127, 0, 0.5 * (127 - x),
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            //saturation
            saturation = _this._cleanValue(saturation, 100);
            if (saturation != 0) {
                x = 1 + ((saturation > 0) ? 3 * saturation / 100 : saturation / 100);
                var lumR = 0.3086;
                var lumG = 0.6094;
                var lumB = 0.0820;
                s._multiplyMatrix([
                    lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
                    lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
                    lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            //hue
            hue = _this._cleanValue(hue, 180) / 180 * Math.PI;
            if (hue != 0) {
                var cosVal = Math.cos(hue);
                var sinVal = Math.sin(hue);
                var lumR = 0.213;
                var lumG = 0.715;
                var lumB = 0.072;
                s._multiplyMatrix([
                    lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG), lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
                    lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140), lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
                    lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG), lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
                    0, 0, 0, 1, 0,
                    0, 0, 0, 0, 1
                ]);
            }
            return _this;
        }
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        ColorMatrixFilter.prototype.drawFilter = function (imageData) {
            if (imageData === void 0) { imageData = null; }
            if (!imageData)
                return;
            var data = imageData.data;
            var l = data.length;
            var r, g, b, a;
            var mtx = this.colorMatrix;
            var m0 = mtx[0], m1 = mtx[1], m2 = mtx[2], m3 = mtx[3], m4 = mtx[4];
            var m5 = mtx[5], m6 = mtx[6], m7 = mtx[7], m8 = mtx[8], m9 = mtx[9];
            var m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
            var m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];
            for (var i = 0; i < l; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                a = data[i + 3];
                data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4; //red
                data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9; //green
                data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14; //blue
                data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19; //alpha
            }
        };
        ColorMatrixFilter.prototype._multiplyMatrix = function (colorMat) {
            var i, j, k, col = [];
            for (i = 0; i < 5; i++) {
                for (j = 0; j < 5; j++) {
                    col[j] = this.colorMatrix[j + i * 5];
                }
                for (j = 0; j < 5; j++) {
                    var val = 0;
                    for (k = 0; k < 5; k++) {
                        val += colorMat[j + k * 5] * col[k];
                    }
                    this.colorMatrix[j + i * 5] = val;
                }
            }
        };
        ColorMatrixFilter.prototype._cleanValue = function (value, limit) {
            return Math.min(limit, Math.max(-limit, value));
        };
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        ColorMatrixFilter.prototype.toString = function () {
            var s = this;
            return s.type + s.brightness + s.hue + s.saturation + s.contrast;
        };
        ColorMatrixFilter.prototype.destroy = function () {
            this.colorMatrix = null;
        };
        ColorMatrixFilter.DELTA_INDEX = [
            0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11,
            0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
            0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
            0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
            0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
            1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
            1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25,
            2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8,
            4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0,
            7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8,
            10.0
        ];
        return ColorMatrixFilter;
    }(annie.AObject));
    annie.ColorMatrixFilter = ColorMatrixFilter;
    /**
     * 模糊滤镜
     * @class annie.BlurFilter
     * @extends annie.AOjbect
     * @public
     * @since 1.0.0
     */
    var BlurFilter = (function (_super) {
        __extends(BlurFilter, _super);
        /**
         * @method BlurFilter
         * @public
         * @since 1.0.0
         * @param {number} blurX
         * @param {number} blurY
         * @param {number} quality
         * @example
         *      var imgEle = new Image();
         *           imgEle.onload = function (e) {
         *       var rect = new annie.Rectangle(0, 0, 200, 200),
         *           rectBitmap = new annie.Bitmap(imgEle, rect);
         *           rectBitmap.x = (s.stage.desWidth - bitmap.width) / 2;
         *           rectBitmap.y = (s.stage.desHeight - bitmap.height) / 2;
         *           var blur=new annie.BlurFilter(30,30,1);//实例化模糊滤镜
         *           rectBitmap.filters=[blur];//为bitmap添加模糊滤镜效果
         *           s.addChild(rectBitmap);
         *       }
         *       imgEle.src = 'http://test.annie2x.com/biglong/logo.jpg';
         */
        function BlurFilter(blurX, blurY, quality) {
            if (blurX === void 0) { blurX = 2; }
            if (blurY === void 0) { blurY = 2; }
            if (quality === void 0) { quality = 1; }
            var _this = _super.call(this) || this;
            /**
             * 滤镜类型 只读
             * @property type
             * @public
             * @readonly
             * @since 1.0.0
             * @type {string}
             */
            _this.type = "blur";
            /**
             * 水平模糊量
             * @property blurX
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.blurX = 0;
            /**
             * 垂直模糊量
             * @property blurY
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.blurY = 0;
            /**
             * 模糊品质
             * @property quality
             * @public
             * @readonly
             * @since 1.0.0
             * @type {number}
             */
            _this.quality = 1;
            var s = _this;
            s._instanceType = "annie.BlurFilter";
            s.blurX = blurX;
            s.blurY = blurY;
            s.quality = quality;
            return _this;
        }
        /**
         *获取滤镜的字符串表现形式以方便比较两个滤镜是否效果一样
         * @method toString
         * @public
         * @since 1.0.0
         * @return {string}
         */
        BlurFilter.prototype.toString = function () {
            var s = this;
            return s.type + s.blurX + s.blurY + s.quality;
        };
        /**
         * 绘画滤镜效果
         * @method drawFilter
         * @param {ImageData} imageData
         * @since 1.0.0
         * @public
         */
        BlurFilter.prototype.drawFilter = function (imageData) {
            if (imageData === void 0) { imageData = null; }
            var s = this;
            var radiusX = s.blurX >> 1;
            if (isNaN(radiusX) || radiusX < 0)
                return false;
            var radiusY = s.blurY >> 1;
            if (isNaN(radiusY) || radiusY < 0)
                return false;
            if (radiusX == 0 && radiusY == 0)
                return false;
            var iterations = s.quality;
            if (isNaN(iterations) || iterations < 1)
                iterations = 1;
            iterations |= 0;
            if (iterations > 3)
                iterations = 3;
            if (iterations < 1)
                iterations = 1;
            var px = imageData.data;
            var x = 0, y = 0, i = 0, p = 0, yp = 0, yi = 0, yw = 0, r = 0, g = 0, b = 0, a = 0, pr = 0, pg = 0, pb = 0, pa = 0;
            var divx = (radiusX + radiusX + 1) | 0;
            var divy = (radiusY + radiusY + 1) | 0;
            var w = imageData.width | 0;
            var h = imageData.height | 0;
            var w1 = (w - 1) | 0;
            var h1 = (h - 1) | 0;
            var rxp1 = (radiusX + 1) | 0;
            var ryp1 = (radiusY + 1) | 0;
            var ssx = { r: 0, b: 0, g: 0, a: 0 };
            var sx = ssx;
            for (i = 1; i < divx; i++) {
                sx = sx.n = { r: 0, b: 0, g: 0, a: 0 };
            }
            sx.n = ssx;
            var ssy = { r: 0, b: 0, g: 0, a: 0 };
            var sy = ssy;
            for (i = 1; i < divy; i++) {
                sy = sy.n = { r: 0, b: 0, g: 0, a: 0 };
            }
            sy.n = ssy;
            var si = null;
            var mtx = BlurFilter.MUL_TABLE[radiusX] | 0;
            var stx = BlurFilter.SHG_TABLE[radiusX] | 0;
            var mty = BlurFilter.MUL_TABLE[radiusY] | 0;
            var sty = BlurFilter.SHG_TABLE[radiusY] | 0;
            while (iterations-- > 0) {
                yw = yi = 0;
                var ms = mtx;
                var ss = stx;
                for (y = h; --y > -1;) {
                    r = rxp1 * (pr = px[(yi) | 0]);
                    g = rxp1 * (pg = px[(yi + 1) | 0]);
                    b = rxp1 * (pb = px[(yi + 2) | 0]);
                    a = rxp1 * (pa = px[(yi + 3) | 0]);
                    sx = ssx;
                    for (i = rxp1; --i > -1;) {
                        sx.r = pr;
                        sx.g = pg;
                        sx.b = pb;
                        sx.a = pa;
                        sx = sx.n;
                    }
                    for (i = 1; i < rxp1; i++) {
                        p = (yi + ((w1 < i ? w1 : i) << 2)) | 0;
                        r += (sx.r = px[p]);
                        g += (sx.g = px[p + 1]);
                        b += (sx.b = px[p + 2]);
                        a += (sx.a = px[p + 3]);
                        sx = sx.n;
                    }
                    si = ssx;
                    for (x = 0; x < w; x++) {
                        px[yi++] = (r * ms) >>> ss;
                        px[yi++] = (g * ms) >>> ss;
                        px[yi++] = (b * ms) >>> ss;
                        px[yi++] = (a * ms) >>> ss;
                        p = ((yw + ((p = x + radiusX + 1) < w1 ? p : w1)) << 2);
                        r -= si.r - (si.r = px[p]);
                        g -= si.g - (si.g = px[p + 1]);
                        b -= si.b - (si.b = px[p + 2]);
                        a -= si.a - (si.a = px[p + 3]);
                        si = si.n;
                    }
                    yw += w;
                }
                ms = mty;
                ss = sty;
                for (x = 0; x < w; x++) {
                    yi = (x << 2) | 0;
                    r = (ryp1 * (pr = px[yi])) | 0;
                    g = (ryp1 * (pg = px[(yi + 1) | 0])) | 0;
                    b = (ryp1 * (pb = px[(yi + 2) | 0])) | 0;
                    a = (ryp1 * (pa = px[(yi + 3) | 0])) | 0;
                    sy = ssy;
                    for (i = 0; i < ryp1; i++) {
                        sy.r = pr;
                        sy.g = pg;
                        sy.b = pb;
                        sy.a = pa;
                        sy = sy.n;
                    }
                    yp = w;
                    for (i = 1; i <= radiusY; i++) {
                        yi = (yp + x) << 2;
                        r += (sy.r = px[yi]);
                        g += (sy.g = px[yi + 1]);
                        b += (sy.b = px[yi + 2]);
                        a += (sy.a = px[yi + 3]);
                        sy = sy.n;
                        if (i < h1) {
                            yp += w;
                        }
                    }
                    yi = x;
                    si = ssy;
                    if (iterations > 0) {
                        for (y = 0; y < h; y++) {
                            p = yi << 2;
                            px[p + 3] = pa = (a * ms) >>> ss;
                            if (pa > 0) {
                                px[p] = ((r * ms) >>> ss);
                                px[p + 1] = ((g * ms) >>> ss);
                                px[p + 2] = ((b * ms) >>> ss);
                            }
                            else {
                                px[p] = px[p + 1] = px[p + 2] = 0;
                            }
                            p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;
                            r -= si.r - (si.r = px[p]);
                            g -= si.g - (si.g = px[p + 1]);
                            b -= si.b - (si.b = px[p + 2]);
                            a -= si.a - (si.a = px[p + 3]);
                            si = si.n;
                            yi += w;
                        }
                    }
                    else {
                        for (y = 0; y < h; y++) {
                            p = yi << 2;
                            px[p + 3] = pa = (a * ms) >>> ss;
                            if (pa > 0) {
                                pa = 255 / pa;
                                px[p] = ((r * ms) >>> ss) * pa;
                                px[p + 1] = ((g * ms) >>> ss) * pa;
                                px[p + 2] = ((b * ms) >>> ss) * pa;
                            }
                            else {
                                px[p] = px[p + 1] = px[p + 2] = 0;
                            }
                            p = (x + (((p = y + ryp1) < h1 ? p : h1) * w)) << 2;
                            r -= si.r - (si.r = px[p]);
                            g -= si.g - (si.g = px[p + 1]);
                            b -= si.b - (si.b = px[p + 2]);
                            a -= si.a - (si.a = px[p + 3]);
                            si = si.n;
                            yi += w;
                        }
                    }
                }
            }
        };
        BlurFilter.prototype.destroy = function () {
        };
        BlurFilter.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];
        BlurFilter.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
        return BlurFilter;
    }(annie.AObject));
    annie.BlurFilter = BlurFilter;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * Canvas 渲染器
     * @class annie.CanvasRender
     * @extends annie.AObject
     * @implements IRender
     * @public
     * @since 1.0.0
     */
    var CanvasRender = (function (_super) {
        __extends(CanvasRender, _super);
        /**
         * @CanvasRender
         * @param {annie.Stage} stage
         * @public
         * @since 1.0.0
         */
        function CanvasRender(stage, ctx) {
            var _this = _super.call(this) || this;
            var s = _this;
            s._instanceType = "annie.CanvasRender";
            s._stage = stage;
            CanvasRender.drawCtx = ctx;
            return _this;
        }
        /**
         * 开始渲染时执行
         * @method begin
         * @since 1.0.0
         * @public
         */
        CanvasRender.prototype.begin = function () {
            CanvasRender.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        };
        /**
         * 开始有遮罩时调用
         * @method beginMask
         * @param {annie.DisplayObject} target
         * @public
         * @since 1.0.0
         */
        CanvasRender.prototype.beginMask = function (target) {
            var _ctx = CanvasRender.drawCtx;
            var tm = target.cMatrix;
            _ctx.save();
            _ctx.globalAlpha = 0;
            _ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            target._draw(_ctx);
            _ctx.clip();
        };
        /**
         * 结束遮罩时调用
         * @method endMask
         * @public
         * @since 1.0.0
         */
        CanvasRender.prototype.endMask = function () {
            CanvasRender.drawCtx.restore();
        };
        CanvasRender.prototype.end = function () {
            CanvasRender.drawCtx.draw();
        };
        /**
         * 调用渲染
         * @public
         * @since 1.0.0
         * @method draw
         * @param {annie.DisplayObject} target 显示对象
         */
        CanvasRender.prototype.draw = function (target) {
            //由于某些原因导致有些元件没来的及更新就开始渲染了,就不渲染，过滤它
            if (target._cp)
                return;
            var ctx = CanvasRender.drawCtx;
            ctx.globalAlpha = target.cAlpha;
            var tm = target.cMatrix;
            ctx.setTransform(tm.a, tm.b, tm.c, tm.d, tm.tx, tm.ty);
            var texture = target._texture;
            if (texture) {
                ctx.drawImage(texture, 0, 0);
            }
            else {
                target._draw(ctx);
            }
        };
        CanvasRender.prototype.destroy = function () {
            var s = this;
            s._stage = null;
        };
        CanvasRender.drawCtx = null;
        return CanvasRender;
    }(annie.AObject));
    annie.CanvasRender = CanvasRender;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    var isUpdateTween = true;
    var TweenObj = (function (_super) {
        __extends(TweenObj, _super);
        function TweenObj() {
            var _this = _super.call(this) || this;
            _this.currentFrame = 0;
            _this.totalFrames = 0;
            _this._isLoop = 0;
            _this._delay = 0;
            _this._isFront = true;
            _this._cParams = null;
            _this._loop = false;
            return _this;
        }
        /**
         * 初始化数据
         * @method init
         * @param target
         * @param times
         * @param data
         * @param isTo
         * @public
         * @since 1.0.0
         */
        TweenObj.prototype.init = function (target, times, data, isTo) {
            if (isTo === void 0) { isTo = true; }
            if (times <= 0 || typeof (times) != "number") {
                throw new Error("annie.Tween.to()或者annie.Tween.from()方法的第二个参数一定要是大于0的数字");
            }
            var s = this;
            s.currentFrame = 1;
            var tTime = times * 60 >> 0;
            s.totalFrames = tTime > 0 ? tTime : 1;
            s.target = target;
            s._isTo = isTo;
            s._isLoop = 0;
            s._startData = {};
            s._disData = {};
            s._delay = 0;
            s._isFront = true;
            s._ease = null;
            s._update = null;
            s._cParams = null;
            s._loop = false;
            s._completeFun = null;
            for (var item in data) {
                switch (item) {
                    case "useFrame":
                        if (data[item] == true) {
                            s.totalFrames = times;
                        }
                        break;
                    case "yoyo":
                        if (data[item] === false) {
                            s._isLoop = 0;
                        }
                        else if (data[item] === true) {
                            s._isLoop = Number.MAX_VALUE;
                        }
                        else {
                            s._isLoop = data[item];
                        }
                        break;
                    case "delay":
                        if (data.useFrame) {
                            s._delay = data[item];
                        }
                        else {
                            s._delay = data[item] * 60 >> 0;
                        }
                        break;
                    case "ease":
                        s._ease = data[item];
                        break;
                    case "onUpdate":
                        s._update = data[item];
                        break;
                    case "onComplete":
                        s._completeFun = data[item];
                        break;
                    case "completeParams":
                        s._cParams = data[item];
                        break;
                    case "loop":
                        s._loop = data[item];
                        break;
                    default:
                        if (typeof (data[item]) == "number") {
                            if (isTo) {
                                s._startData[item] = target[item];
                                s._disData[item] = data[item] - target[item];
                            }
                            else {
                                s._startData[item] = data[item];
                                s._disData[item] = target[item] - data[item];
                                target[item] = data[item];
                            }
                        }
                }
            }
        };
        /**
         * 更新数据
         * @method update
         * @since 1.0.0
         * @public
         */
        TweenObj.prototype.update = function () {
            var s = this;
            if (s._isFront && s._delay > 0) {
                s._delay--;
                return;
            }
            //更新数据
            var per = s.currentFrame / s.totalFrames;
            if (per < 0 || per > 1)
                return;
            if (s._ease) {
                per = s._ease(per);
            }
            var isHave = false;
            for (var item in s._disData) {
                isHave = true;
                s.target[item] = s._startData[item] + s._disData[item] * per;
            }
            if (!isHave) {
                //如果发现tween被全新的tween全部给替换了，那就直接回收这个
                Tween.kill(s.instanceId);
                return;
            }
            if (s._update) {
                s._update(per);
            }
            var cf = s._completeFun;
            var pm = s._cParams;
            if (s._isFront) {
                s.currentFrame++;
                if (s.currentFrame > s.totalFrames) {
                    if (s._loop) {
                        s.currentFrame = 1;
                    }
                    else {
                        if (s._isLoop > 0) {
                            s._isFront = false;
                            s.currentFrame = s.totalFrames;
                            s._isLoop--;
                        }
                        else {
                            Tween.kill(s.instanceId);
                        }
                    }
                    if (cf) {
                        cf(pm);
                    }
                }
            }
            else {
                s.currentFrame--;
                if (s.currentFrame < 0) {
                    if (s._isLoop > 0) {
                        s._isFront = true;
                        s.currentFrame = 1;
                    }
                    else {
                        Tween.kill(s.instanceId);
                    }
                    if (cf) {
                        cf(pm);
                    }
                }
            }
        };
        TweenObj.prototype.destroy = function () {
            var s = this;
            s._update = null;
            s._completeFun = null;
            s._ease = null;
        };
        return TweenObj;
    }(annie.AObject));
    annie.TweenObj = TweenObj;
    /**
     * 全局静态单列类,不要实例化此类
     * @class annie.Tween
     * @public
     * @since 1.0.0
     */
    var Tween = (function () {
        function Tween() {
        }
        /**
         * 将target对象的属性数值渐变到data中对应属性指定的数值
         * @method to
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 如果data.useFrame为true 这里就是帧数，如果data.useFrame为false则这里就是时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否向摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成函数. 默认为null
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数,回传参数是当前的Tween时间比.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位,默认以秒为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        Tween.to = function (target, totalFrame, data) {
            return Tween.createTween(target, totalFrame, data, true);
        };
        /**
         * 将target对象从data中指定的属性数值渐变到target属性当前的数值
         * @method from
         * @static
         * @param {Object} target
         * @param {number} totalFrame 总时间长度 如果data.useFrame为true 这里就是帧数，如果data.useFrame为false则这里就是时间
         * @param {Object} data 包含target对象的各种数字类型属性及其他一些方法属性
         * @param {number:boolean} data.yoyo 是否向摆钟一样来回循环,默认为false.设置为true则会无限循环,或想只运行指定的摆动次数,将此参数设置为数字就行了。
         * @param {number:boolean} data.loop 是否循环播放。
         * @param {Function} data.onComplete 完成结束函数. 默认为null
         * @param {Array} data.completeParams 完成函数参数. 默认为null，可以给完成函数里传参数
         * @param {Function} data.onUpdate 进入每帧后执行函数,回传参数是当前的Tween时间比.默认为null
         * @param {Function} data.ease 缓动类型方法
         * @param {boolean} data.useFrame 为false用时间秒值;为true则是以帧为单位
         * @param {number} data.delay 延时，useFrame为true以帧为单位 useFrame为false以秒为单位
         * @public
         * @since 1.0.0
         */
        Tween.from = function (target, totalFrame, data) {
            return Tween.createTween(target, totalFrame, data, false);
        };
        Tween.createTween = function (target, totalFrame, data, isTo) {
            var tweenObj;
            var len = Tween._tweenList.length;
            for (var i = 0; i < len; i++) {
                tweenObj = Tween._tweenList[i];
                if (target == tweenObj.target) {
                    for (var item in tweenObj._startData) {
                        if (data[item] != undefined) {
                            delete tweenObj._startData[item];
                            delete tweenObj._disData[item];
                        }
                    }
                }
            }
            len = Tween._tweenPool.length;
            if (len > 0) {
                tweenObj = Tween._tweenPool.shift();
                //考虑到对象池回收后需要变更id
                tweenObj._instanceId = annie.AObject["_object_id"]++;
            }
            else {
                tweenObj = new TweenObj();
            }
            Tween._tweenList.push(tweenObj);
            tweenObj.init(target, totalFrame, data, isTo);
            return tweenObj.instanceId;
        };
        /**
         * 销毁所有正在运行的Tween对象
         * @method killAll
         * @static
         * @public
         * @since 1.0.0
         */
        Tween.killAll = function () {
            var len = Tween._tweenList.length;
            var tweenObj;
            for (var i = 0; i < len; i++) {
                tweenObj = Tween._tweenList[i];
                tweenObj.target = null;
                tweenObj._completeFun = null;
                tweenObj._cParams = null;
                tweenObj._update = null;
                tweenObj._ease = null;
                tweenObj._loop = false;
                Tween._tweenPool.push(tweenObj);
            }
            Tween._tweenList.length = 0;
        };
        /**
         * @通过创建Tween对象返回时的唯一id来销毁对应的Tween对象
         * @method kill
         * @static
         * @public
         * @param {annie.Tween} tween
         * @since 1.0.0
         */
        Tween.kill = function (tweenId) {
            var len = Tween._tweenList.length;
            var tweenObj;
            for (var i = 0; i < len; i++) {
                tweenObj = Tween._tweenList[i];
                if (tweenObj.instanceId == tweenId) {
                    tweenObj.target = null;
                    tweenObj._completeFun = null;
                    tweenObj._cParams = null;
                    tweenObj._update = null;
                    tweenObj._ease = null;
                    tweenObj._loop = null;
                    Tween._tweenPool.push(tweenObj);
                    Tween._tweenList.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * quadraticIn缓动类型
         * @method quadraticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quadraticIn = function (k) {
            return k * k;
        };
        /**
         * quadraticOut 缓动类型
         * @method quadraticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quadraticOut = function (k) {
            return k * (2 - k);
        };
        /**
         * quadraticInOut 缓动类型
         * @method quadraticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quadraticInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        };
        /**
         * cubicIn 缓动类型
         * @method cubicIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.cubicIn = function (k) {
            return k * k * k;
        };
        /**
         * cubicOut 缓动类型
         * @method cubicOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.cubicOut = function (k) {
            return --k * k * k + 1;
        };
        /**
         * cubicInOut 缓动类型
         * @method cubicInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.cubicInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        };
        /**
         * quarticIn 缓动类型
         * @method quarticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quarticIn = function (k) {
            return k * k * k * k;
        };
        /**
         * quarticOut 缓动类型
         * @method quarticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quarticOut = function (k) {
            return 1 - (--k * k * k * k);
        };
        /**
         * quarticInOut 缓动类型
         * @method quarticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quarticInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        };
        /**
         * quinticIn 缓动类型
         * @method quinticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quinticIn = function (k) {
            return k * k * k * k * k;
        };
        /**
         * quinticOut 缓动类型
         * @method quinticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quinticOut = function (k) {
            return --k * k * k * k * k + 1;
        };
        /**
         * quinticInOut 缓动类型
         * @method quinticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.quinticInOut = function (k) {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        };
        /**
         * sinusoidalIn 缓动类型
         * @method sinusoidalIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.sinusoidalIn = function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        };
        /**
         * sinusoidalOut 缓动类型
         * @method sinusoidalOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.sinusoidalOut = function (k) {
            return Math.sin(k * Math.PI / 2);
        };
        /**
         * sinusoidalInOut 缓动类型
         * @method sinusoidalInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.sinusoidalInOut = function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        };
        /**
         * exponentialIn 缓动类型
         * @method exponentialIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.exponentialIn = function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        };
        /**
         * exponentialOut 缓动类型
         * @method exponentialOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.exponentialOut = function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        };
        /**
         * exponentialInOut 缓动类型
         * @method exponentialInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.exponentialInOut = function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        };
        /**
         * circularIn 缓动类型
         * @method circularIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.circularIn = function (k) {
            return 1 - Math.sqrt(1 - k * k);
        };
        /**
         * circularOut 缓动类型
         * @method circularOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.circularOut = function (k) {
            return Math.sqrt(1 - (--k * k));
        };
        /**
         * circularInOut 缓动类型
         * @method circularInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.circularInOut = function (k) {
            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        };
        /**
         * elasticIn 缓动类型
         * @method elasticIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.elasticIn = function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        };
        /**
         * elasticOut 缓动类型
         * @method elasticOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.elasticOut = function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
        };
        /**
         * elasticInOut 缓动类型
         * @method elasticInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.elasticInOut = function (k) {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            k *= 2;
            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        };
        /**
         * backIn 缓动类型
         * @method backIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.backIn = function (k) {
            var s = 1.70158;
            return k * k * ((s + 1) * k - s);
        };
        /**
         * backOut 缓动类型
         * @method backOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.backOut = function (k) {
            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        };
        /**
         * backInOut 缓动类型
         * @method backInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.backInOut = function (k) {
            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        };
        /**
         * bounceIn 缓动类型
         * @method bounceIn
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.bounceIn = function (k) {
            return 1 - Tween.bounceOut(1 - k);
        };
        /**
         * bounceOut 缓动类型
         * @method bounceOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.bounceOut = function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            }
            else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            }
            else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            }
            else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        };
        /**
         * bounceInOut 缓动类型
         * @method bounceInOut
         * @static
         * @public
         * @since 1.0.0
         * @param {number}k
         * @returns {number}
         */
        Tween.bounceInOut = function (k) {
            if (k < 0.5) {
                return Tween.bounceIn(k * 2) * 0.5;
            }
            return Tween.bounceOut(k * 2 - 1) * 0.5 + 0.5;
        };
        /**
         * 这里之所有要独立运行,是因为可能存在多个stage，不能把这个跟其中任何一个stage放在一起update
         * @method flush
         * @private
         * @since 1.0.0
         */
        Tween.flush = function () {
            if (isUpdateTween) {
                var len = Tween._tweenList.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (Tween._tweenList[i]) {
                        Tween._tweenList[i].update();
                    }
                    else {
                        Tween._tweenList.splice(i, 1);
                    }
                }
            }
            isUpdateTween = !isUpdateTween;
        };
        Tween._tweenPool = [];
        Tween._tweenList = [];
        return Tween;
    }());
    annie.Tween = Tween;
})(annie || (annie = {}));
/**
 * @module annie
 */
var annie;
(function (annie) {
    /**
     * 定时器类
     * @class annie.Timer
     * @public
     * @since 1.0.9
     */
    var Timer = (function (_super) {
        __extends(Timer, _super);
        /**
         * 构造函数，初始化
         * @method Timer
         * @param {number} delay
         * @param {number} repeatCount
         * @example
         *      var timer=new annie.Timer(1000,10);
         *      timer.addEventListener(annie.Event.TIMER,function (e) {
         *          trace("once");
         *      })
         *      timer.addEventListener(annie.Event.TIMER_COMPLETE, function (e) {
         *          trace("complete");
         *          e.target.kill();
         *      })
         *      timer.start();
         */
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            var _this = _super.call(this) || this;
            _this._currentCount = 0;
            _this._delay = 0;
            _this._frameDelay = 0;
            _this._currentFrameDelay = 0;
            _this._repeatCount = 0;
            _this._running = false;
            if (delay <= 0) {
                delay = 1;
            }
            var s = _this;
            s._delay = delay;
            s._frameDelay = Math.ceil(delay * 0.001 * 60);
            s._repeatCount = repeatCount;
            Timer._timerList.push(s);
            return _this;
        }
        /**
         * 重置定时器
         * @method reset
         * @public
         * @since 1.0.9
         */
        Timer.prototype.reset = function () {
            var s = this;
            s._running = false;
            s._currentCount = 0;
            s._currentFrameDelay = 0;
        };
        /**
         * 开始执行定时器
         * @method start
         * @public
         * @since 1.0.9
         */
        Timer.prototype.start = function () {
            var s = this;
            s._running = true;
            if (s._currentCount == s._repeatCount) {
                s._currentCount = 0;
            }
        };
        /**
         * 停止执行定时器，通过再次调用start方法可以接着之前未完成的状态运行
         * @method stop
         * @public
         * @since 1.0.9
         */
        Timer.prototype.stop = function () {
            this._running = false;
        };
        Object.defineProperty(Timer.prototype, "currentCount", {
            /**
             * 当前触发了多少次Timer事件
             * @property currentCount
             * @readonly
             * @public
             * @since 1.0.9
             * @returns {number}
             */
            get: function () {
                return this._currentCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "delay", {
            /**
             * 设置或者获取当前定时器之间的执行间隔
             * @property delay
             * @since 1.0.9
             * @public
             * @returns {number}
             */
            get: function () {
                return this._delay;
            },
            set: function (value) {
                this._delay = value;
                this._frameDelay = Math.ceil(value * 0.001 * 60);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "repeatCount", {
            /**
             * 执行触发Timer 的总次数
             * @public
             * @since 1.0.9
             * @returns {number}
             */
            get: function () {
                return this._repeatCount;
            },
            set: function (value) {
                if (value < 0) {
                    value = 0;
                }
                this._repeatCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "running", {
            /**
             * 当前是否在运行中
             * @property running
             * @since 1.0.9
             * @returns {boolean}
             */
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时残绕着你
         * @method kill
         * @public
         * @since 1.0.9
         */
        Timer.prototype.kill = function () {
            var len = Timer._timerList.length;
            var s = this;
            for (var i = 0; i < len; i++) {
                if (Timer._timerList[i]._instanceId == s._instanceId) {
                    Timer._timerList.splice(i, 1);
                    break;
                }
            }
        };
        Timer.prototype.update = function () {
            var s = this;
            if (s._running) {
                s._currentFrameDelay++;
                if (s._currentFrameDelay == s._frameDelay) {
                    if (s._repeatCount) {
                        s._currentCount++;
                    }
                    s._currentFrameDelay = 0;
                    //触发事件
                    s.dispatchEvent("onTimer");
                    if (s._repeatCount && s._currentCount == s._repeatCount) {
                        //触发完成时事件
                        s._running = false;
                        s.dispatchEvent("onTimerComplete");
                    }
                }
            }
        };
        Timer.flush = function () {
            var len = Timer._timerList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (Timer._timerList[i]) {
                    Timer._timerList[i].update();
                }
                else {
                    Timer._timerList.splice(i, 1);
                }
            }
        };
        Timer.prototype.destroy = function () {
            var s = this;
            s.kill();
            _super.prototype.destroy.call(this);
        };
        Timer._timerList = [];
        return Timer;
    }(annie.EventDispatcher));
    annie.Timer = Timer;
})(annie || (annie = {}));
/**
 * @class annie2x
 */
var annie;
(function (annie) {
    var res = {};
    /**
     * 创建一个声音对象
     * @type {Audio}
     */
    annie.createAudio = null;
    annie.getImageInfo = null;
    /**
     * 继承类方法
     * @type {Function}
     */
    annie.A2xExtend = null;
    /**
     * 加载后的类引用全放在这里
     * @type {Object}
     */
    annie.classPool = null;
    /**
     * 加载场景的方法
     * @method loadScene
     * @param {String|Array} 单个场景名或者多个场景名组成的数组
     * @type {Function}
     */
    annie.loadScene = null;
    /**
     * 是否已经加载过场景
     * @method isLoadedScene
     * @param {string} sceneName
     * @return {boolean}
     */
    function isLoadedScene(sceneName) {
        if (annie.classPool[sceneName]) {
            return true;
        }
        return false;
    }
    annie.isLoadedScene = isLoadedScene;
    /**
     * 删除加载过的场景
     * @method unLoadScene
     * @param {string} sceneName
     */
    function unLoadScene(sceneName) {
        annie.classPool[sceneName] = null;
        delete annie.classPool[sceneName];
    }
    annie.unLoadScene = unLoadScene;
    /**
     * 解析资源
     * @method parseScene
     * @param {string} sceneName
     * @param sceneRes
     * @param sceneData
     */
    function parseScene(sceneName, sceneRes, sceneData) {
        res[sceneName] = {};
        res[sceneName]._a2x_con = sceneData;
        for (var i = 0; i < sceneRes.length; i++) {
            if (sceneRes[i].type == "image" || sceneRes[i].type == "sound") {
                res[sceneName][sceneRes[i].id] = sceneRes[i].src;
            }
        }
        var mc;
        for (var item in sceneData) {
            mc = sceneData[item];
            if (mc.t == 1) {
                if (!mc.f) {
                    mc.f = [];
                    mc.tf = 1;
                    continue;
                }
                if (mc.tf > 1) {
                    var frameList = mc.f;
                    var count = frameList.length;
                    var frameCon = null;
                    var children = {};
                    var children2 = {};
                    for (var i = 0; i < count; i++) {
                        frameCon = frameList[i].c;
                        if (frameCon) {
                            for (var j in frameCon) {
                                if (i == 0) {
                                    children[j] = [frameCon[j]][0];
                                }
                                else {
                                    if (frameCon[j].a != 3) {
                                        children2[j] = frameCon[j];
                                    }
                                    if (frameCon[j].a != 1) {
                                        if (frameCon[j].a == 2) {
                                            for (var o in children[j]) {
                                                if (frameCon[j][o] == undefined) {
                                                    frameCon[j][o] = children[j][o];
                                                }
                                            }
                                        }
                                        else {
                                            delete frameCon[j];
                                        }
                                        children[j] = null;
                                        delete children[j];
                                    }
                                }
                            }
                            if (i > 0) {
                                for (var o in children) {
                                    frameCon[o] = children2[o] = children[o];
                                }
                                children = children2;
                                children2 = {};
                            }
                        }
                    }
                }
            }
        }
    }
    annie.parseScene = parseScene;
    /**
     * 获取已经加载场景中的资源
     * @method getResource
     * @public
     * @static
     * @since 2.0.0
     * @param {string} sceneName
     * @param {string} resName
     * @returns {any}
     */
    function getResource(sceneName, resName) {
        if (res[sceneName][resName]) {
            return res[sceneName][resName];
        }
        return null;
    }
    annie.getResource = getResource;
    /**
     * 通过已经加载场景中的图片资源创建Bitmap对象实例,此方法一般给Flash2x工具自动调用
     * @method b
     * @public
     * @since 1.0.0
     * @static
     * @param {string} sceneName
     * @param {string} resName
     * @returns {any}
     */
    function b(sceneName, resName) {
        return new annie.Bitmap(res[sceneName][resName]);
    }
    /**
     * 用一个对象批量设置另一个对象的属性值,此方法一般给Flash2x工具自动调用
     * @method d
     * @public
     * @static
     * @since 1.0.0
     * @param {Object} target
     * @param {Object} info
     */
    function d(target, info) {
        if (target._a2x_res_obj == info) {
            return;
        }
        else {
            //是不是文本
            var lastInfo = target._a2x_res_obj;
            if (info.w != undefined) {
                target.textWidth = info.w;
                target.textHeight = info.h;
            }
            //信息设置的时候看看是不是文本，如果有文本的话还需要设置宽和高
            if (info.tr == undefined || info.tr.length == 1) {
                info.tr = [0, 0, 1, 1, 0, 0];
            }
            if (lastInfo.tr != info.tr) {
                _a = info.tr, target.x = _a[0], target.y = _a[1], target.scaleX = _a[2], target.scaleY = _a[3], target.skewX = _a[4], target.skewY = _a[5];
            }
            /*if (info.v == undefined) {
                info.v = 1;
            }*/
            //target.visible = new Boolean(info.v);
            target.alpha = info.al == undefined ? 1 : info.al;
            //动画播放模式 图形 按钮 动画
            if (info.t == 1) {
                //initButton
                if (target.initButton) {
                    target.initButton();
                }
            }
            target._a2x_res_obj = info;
        }
        var _a;
    }
    annie.d = d;
    var _textLineType = ["single", "multiline"];
    var _textAlign = ["left", "center", "right"];
    /**
     * 创建一个动态文本或输入文本,此方法一般给Flash2x工具自动调用
     * @method t
     * @public
     * @static
     * @since 1.0.0
     * @returns {annie.TextFiled|annie.InputText}
     */
    function t(sceneName, resName) {
        var textDate = res[sceneName]._a2x_con[resName];
        var textObj;
        var text = decodeURIComponent(textDate[9]);
        var font = decodeURIComponent(textDate[4]);
        var size = textDate[5];
        var textAlign = _textAlign[textDate[3]];
        var lineType = _textLineType[textDate[2]];
        var italic = textDate[11];
        var bold = textDate[10];
        var color = textDate[6];
        var textAlpha = textDate[7];
        var border = textDate[12];
        var lineSpacing = textDate[8];
        if (textDate[1] == 0 || textDate[1] == 1) {
            textObj = new annie.TextField();
            textObj.text = text;
            textObj.font = font;
            textObj.size = size;
            textObj.textAlign = textAlign;
            textObj.lineType = lineType;
            textObj.italic = italic;
            textObj.bold = bold;
            textObj.color = color;
            textObj.textAlpha = textAlpha;
            textObj.border = border;
            textObj.lineSpacing = lineSpacing;
        }
        else {
            /*textObj = new annie.InputText(textDate[2]);
            textObj.initInfo(text, color, textAlign, size, font, border, lineSpacing);
            textObj.italic = italic;
            textObj.bold = bold;*/
            console.log("wxApp isn't support inputText");
        }
        return textObj;
    }
    /**
     * 创建一个Shape矢量对象,此方法一般给Flash2x工具自动调用
     * @method g
     * @public
     * @static
     * @since 1.0.0
     * @returns {annie.Shape}
     */
    function g(sceneName, resName) {
        var shapeDate = res[sceneName]._a2x_con[resName][1];
        var shape = new annie.Shape();
        for (var i = 0; i < shapeDate.length; i++) {
            if (shapeDate[i][0] == 1) {
                if (shapeDate[i][1] == 0) {
                    shape.beginFill(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]));
                }
                else if (shapeDate[i][1] == 1) {
                    shape.beginLinearGradientFill(shapeDate[i][2][0], shapeDate[i][2][1]);
                }
                else if (shapeDate[i][1] == 2) {
                    shape.beginRadialGradientFill(shapeDate[i][2][0], shapeDate[i][2][1]);
                }
                else {
                    //shape.beginBitmapFill(b(sceneName, shapeDate[i][2][0]).bitmapData, shapeDate[i][2][1]);
                    shape.beginFill(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]));
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endFill();
            }
            else {
                if (shapeDate[i][1] == 0) {
                    shape.beginStroke(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]), shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                else if (shapeDate[i][1] == 1) {
                    shape.beginLinearGradientStroke(shapeDate[i][2][0], shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                else if (shapeDate[i][1] == 2) {
                    shape.beginRadialGradientStroke(shapeDate[i][2][0], shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                else {
                    shape.beginStroke(annie.Shape.getRGBA(shapeDate[i][2][0], shapeDate[i][2][1]), shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                    //shape.beginBitmapStroke(b(sceneName, shapeDate[i][2][0]).bitmapData, shapeDate[i][2][1], shapeDate[i][4], shapeDate[i][5], shapeDate[i][6], shapeDate[i][7]);
                }
                shape.decodePath(shapeDate[i][3]);
                shape.endStroke();
            }
        }
        return shape;
    }
    function s(sceneName, resName) {
        return new annie.Sound(res[sceneName][resName]);
    }
    /**
     * 引擎自调用.初始化 sprite和movieClip用
     * @param target
     * @param {string} _resId
     * @private
     */
    function _initRes(target, sceneName, resName) {
        var Root = window;
        //资源树最顶层
        var resRoot = res[sceneName];
        //资源树里类对象json数据
        var classRoot = resRoot._a2x_con;
        //资源树里类对象json数据里非资源类数据
        var resClass = classRoot[resName];
        //时间轴
        target._a2x_res_class = resClass;
        var isMc = false;
        var i;
        if (resClass.tf > 1) {
            isMc = true;
            if (resClass.timeLine == undefined) {
                //将时间轴丰满,抽出脚本，抽出标签
                var keyFrameCount = resClass.f.length;
                var timeLine = [];
                var curKeyFrame = keyFrameCount > 0 ? resClass.f[0].i : resClass.tf;
                var nextFrame = 0;
                if (curKeyFrame > 0) {
                    var frameValue = -1;
                    for (var j = 0; j < curKeyFrame; j++) {
                        timeLine[timeLine.length] = frameValue;
                    }
                }
                if (keyFrameCount > 0) {
                    for (i = 0; i < keyFrameCount; i++) {
                        if (i + 1 < keyFrameCount) {
                            nextFrame = resClass.f[i + 1].i;
                        }
                        else {
                            nextFrame = resClass.tf;
                        }
                        curKeyFrame = resClass.f[i].i;
                        //将时间线补齐
                        for (var j = 0; j < nextFrame - curKeyFrame; j++) {
                            timeLine[timeLine.length] = i;
                        }
                    }
                }
                resClass.timeLine = timeLine;
                //初始化标签对象方便gotoAndStop gotoAndPlay
                if (!resClass.f)
                    resClass.f = [];
                if (!resClass.c)
                    resClass.c = [];
                if (!resClass.a)
                    resClass.a = {};
                if (!resClass.s)
                    resClass.s = {};
                if (!resClass.e)
                    resClass.e = {};
                var label = {};
                if (!resClass.l) {
                    resClass.l = [];
                }
                else {
                    for (var index in resClass.l) {
                        for (var n = 0; n < resClass.l[index].length; n++) {
                            label[resClass.l[index][n]] = parseInt(index);
                        }
                    }
                }
                resClass.label = label;
            }
        }
        if (resClass.c) {
            var children = resClass.c;
            var objCount = children.length;
            var obj = null;
            var objId = 0;
            var maskObj = null;
            var maskTillId = 0;
            for (i = 0; i < objCount; i++) {
                if (children[i].indexOf("_$") == 0) {
                    if (Array.isArray(classRoot[children[i]])) {
                        objId = classRoot[children[i]][0];
                    }
                    else {
                        objId = classRoot[children[i]].t;
                    }
                    switch (objId) {
                        case 1:
                            //displayObject
                            if (classRoot[children[i]].tf > 1) {
                                obj = new annie.MovieClip();
                            }
                            else {
                                obj = new annie.Sprite();
                            }
                            _initRes(obj, sceneName, children[i]);
                            break;
                        case 2:
                            //bitmap
                            obj = b(sceneName, children[i]);
                            break;
                        case 3:
                            //shape
                            obj = g(sceneName, children[i]);
                            break;
                        case 4:
                            //text
                            obj = t(sceneName, children[i]);
                            break;
                        case 5:
                            //sound
                            obj = s(sceneName, children[i]);
                            target.addSound(obj);
                    }
                }
                else {
                    obj = new Root[sceneName][children[i]]();
                }
                //这里一定把要声音添加到里面，以保证objectId与数组下标对应
                target._a2x_res_children[target._a2x_res_children.length] = obj;
                if (!isMc) {
                    var index = i + 1;
                    if (objId == 5) {
                        obj._repeate = resClass.s[0][index];
                    }
                    else {
                        d(obj, resClass.f[0].c[index]);
                        // 检查是否有遮罩
                        if (resClass.f[0].c[index].ma != undefined) {
                            maskObj = obj;
                            maskTillId = resClass.f[0].c[index].ma - 1;
                        }
                        else {
                            if (maskObj && i <= maskTillId) {
                                obj.mask = maskObj;
                                if (i == maskTillId) {
                                    maskObj = null;
                                }
                            }
                        }
                        //检查是否有名字
                        if (resClass.f[0].c[index].n != undefined) {
                            target[resClass.f[0].c[index].n] = obj;
                            obj.name = resClass.f[0].c[index].n;
                        }
                        target.addChildAt(obj, 0);
                    }
                }
            }
        }
    }
    annie._initRes = _initRes;
})(annie || (annie = {}));
/**
 * @class annie
 */
var annie;
(function (annie) {
    /**
     * annie引擎的版本号
     * @public
     * @since 1.0.1
     * @property annie.version
     * @type {string}
     * @example
     *      //打印当前引擎的版本号
     *      trace(annie.version);
     */
    annie.version = "2.0.0";
    /**
     * 一个 StageScaleMode 中指定要使用哪种缩放模式的值。以下是有效值：
     * StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。
     * StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的两侧可能会显示边框。
     * StageScaleMode.NO_BORDER -- 整个应用程序填满指定区域，不发生扭曲，但有可能进行一些裁切，同时保持应用程序的原始高宽比。
     * StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * StageScaleMode.FIXED_WIDTH -- 整个应用程序的宽固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * StageScaleMode.FIXED_HEIGHT -- 整个应用程序的高固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
     * @property annie.StageScaleMode
     * @type {Object}
     * @public
     * @since 1.0.0
     * @static
     * @example
     *      //动态更改stage的对齐方式示例
     *      //以下代码放到一个舞台的显示对象的构造函数中
     *      let s=this;
     *      s.addEventListener(annie.Event.ADD_TO_STAGE,function(e){
     *          let i=0;
     *          s.stage.addEventListener(annie.MouseEvent.CLICK,function(e){
     *              let aList=[annie.StageScaleMode.EXACT_FIT,annie.StageScaleMode.NO_BORDER,annie.StageScaleMode.NO_SCALE,annie.StageScaleMode.SHOW_ALL,annie.StageScaleMode.FIXED_WIDTH,annie.StageScaleMode.FIXED_HEIGHT]
     *              let state=e.currentTarget;
     *              state.scaleMode=aList[i];
     *              state.resize();
     *              if(i>5){i=0;}
     *          }
     *      }
     *
     */
    annie.StageScaleMode = {
        EXACT_FIT: "exactFit",
        NO_BORDER: "noBorder",
        NO_SCALE: "noScale",
        SHOW_ALL: "showAll",
        FIXED_WIDTH: "fixedWidth",
        FIXED_HEIGHT: "fixedHeight"
    };
})(annie || (annie = {}));
/// <reference path="./display/Stage.ts" />
/// <reference path="./utils/Tween.ts" />
/// <reference path="./utils/Timer.ts" />
annie.Stage["addUpdateObj"](annie.Tween);
annie.Stage["addUpdateObj"](annie.Timer);
annie.Stage["flushAll"]();
