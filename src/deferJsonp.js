﻿/*!
* Copyright 2015 linkFLy - http://www.cnblogs.com/silin6/
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
* Help document：https://github.com/linkFly6/deferJsonp
* Date: 2015-06-05 00:12:25
*/
; (function (window, undefined) {
    'use strict';
    var domHead = document.getElementsByTagName('head')[0],
        writeJSONP = function (url, callback, fail, time) {
            var node = document.createElement('script'),
                callbackName = regGetCallbackName.test(url) ?
                      url.match(regGetCallbackName)[1] : 'djsonp' + jsonpID++,
                      timeoutHandle,
                      isLock = false;

            window[callbackName] = function () {
                if (isLock) return;
                isLock = true;
                clearTimeout(timeoutHandle);
                callback.apply(null, arguments);
            };
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.onerror = function () {
                if (isLock) return;
                isLock = true;
                clearTimeout(timeoutHandle);
                isFunction(fail) && fail({ code: 0, msg: "请求失败" });
            };
            node.src = url.replace(regCallbackName, '?$1=' + callbackName);
            domHead.appendChild(node);
            if (time > 0) {
                timeoutHandle = setTimeout(function () {
                    if (isLock) return;
                    isLock = true;
                    clearTimeout(timeoutHandle);
                    isFunction(fail) && fail({ code: 1, msg: '请求超时' });
                }, time);
            }
        },
        regGetCallbackName = /callback=([^&\b?]+)/,
        regCallbackName = /\?(.+)=\?/,
        jsonpID = +new Date,
        emptyArray = [],
        slice = emptyArray.slice,
        each = emptyArray.forEach,
        concat = emptyArray.concat,
        isArray = Array.isArray,
        toString = Object.prototype.toString,
        isFunction = function (obj) {
            return toString.call(obj) === '[object Function]';
        },
        isArrayLike = function (obj) {
            if (obj == null) return false;
            var length = obj.length;
            return isArray(obj) || !isFunction(obj) &&
            typeof obj !== 'string' &&
            (+length === length && //正数
            !(length % 1) && //整数
            (length - 1) in obj); //可以被索引
        },
        merge = function (data, arg) {
            var res = isArrayLike(data) ? slice.call(data, 0) : [data];
            //if (arg && arg.length)
            if (isArray(arg))
                res = res.concat(arg);
            else if (isArrayLike(arg))
                each.call(arg, function (item) {
                    res.push(item);
                });
            else
                res.push(arg);
            return res;
        };

    //Asyncqueue才是把控顺序执行链的主要对象
    var key = 'asyncqueue' + +(new Date),
        Asyncqueue = function () {
            if (!(this instanceof Asyncqueue))
                return new Asyncqueue();
            this.callbacks = [];
            this.data = [];
            this.waits = [];
        };
    Asyncqueue.prototype.guid = 0;
    Asyncqueue.prototype.lock = false;
    Asyncqueue.prototype.add = function (callback) {//添加一组回调函数
        //this.callbacks.push(callback);
        //callback[key] = this.guid++;//标识ID
        //this.params[callback[key]] = { params: null, done: false };
        var id = this.guid++;
        this.callbacks.push({
            id: id,
            params: undefined,
            done: false,
            func: callback
        });
        return id;
    };
    Asyncqueue.prototype.fire = function (id) {//执行一个id下的回调函数，该函数将查询上一个函数的状态
        var item,
            _id,
            flag = false,
            i = 0,
            args = slice.call(arguments, 1);
        //防止event loop冲突
        if (this.lock) {
            this.waits.push(arguments);
            return this;
        };
        this.lock = true;//锁定操作
        while ((item = this.callbacks[i++])) {
            _id = item.id;//获取当前函数的id
            if (!item.done && _id !== id) {
                flag = true;//标识这个函数之前是否有任务尚未完成
                continue;
            };
            if (_id === id) item.params = args;
            if (_id === id && flag) {
                item.done = true;//有任务尚未完成，等待
                break;
            } else if (!flag) {

                this.data.unshift(item.func.apply(this,
                                                      item.params === undefined ? this.data : merge(item.params, this.data)))
                //this.data = merge(
                //                item.func.apply(this,
                //                                      item.params === undefined ? this.data : concat.call(item.params, this.data)),
                //                this.data);
                this.callbacks.shift();//重复运行
                i = 0;//状态清零，永远从索引0开始
            }
        }
        this.lock = false;//解锁
        //处理event loop，动态获取length
        if (this.waits.length) {
            this.fire.apply(this.waits.shift());//任务队列还有任务，继续执行
        }
        return this;
    };

    //DeferJsonp对象
    var DeferJsonp = function () {
        if (!(this instanceof DeferJsonp))
            return new DeferJsonp();
        this.queue = new Asyncqueue;
        //this.defer(url, done, fail, time);
    };

    DeferJsonp.getJSONP = function (url, done, fail, time) {
        var timeoutHandle, time, status = -1;
        if (url == null || typeof url !== 'string' || !isFunction(done)) return this;
        if (fail > 0) {
            time = fail;
            fail = null;
        }
        writeJSONP(url, done, fail, time);
        return this;
    };

    DeferJsonp.prototype.defer = function (url, done, fail, time) {
        var defer = this, id;
        if (url == null || typeof url !== 'string') return this;
        if (done > 0) {
            time = done;
            done = null;
        } else if (fail > 0) {
            time = fail;
            fail = null;
        }
        id = defer.queue.add(function (isOK, data) {
            var res,
                args = slice.call(arguments, 2);
            if (isOK && isFunction(done)) {
                res = done.apply(defer, merge(data, args));
            } else if (isFunction(fail))
                res = fail.apply(defer, concat.call(data, args));//表示是超时情况

            //2015-06-09 修正：每个函数在没有返回值（undefined）的情况下自动追加服务器函数
            return res === undefined ? data : res;
        });
        writeJSONP(url, function () {
            defer.queue.fire(id, true, arguments);
        }, function (error) {
            defer.queue.fire(id, false, error);
        }, time)
        return this;
    };

    DeferJsonp.Asyncqueue = Asyncqueue;

    window.deferJsonp = DeferJsonp;
    return DeferJsonp;

})(window);