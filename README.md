# deferJsonp ![license|MIT][1]


简单精致的JSONP异步流程控制库，查看和下载[**deferJsonp.js**][2]。

## 异步控制
过去的代码：
```javascript
    window.demo1 = function (data) {//jsonp请求回调函数
        window.demo2 = function (data2) {
            window.demo3 = function (data3) {
                console.log(data, data2, data3);
            };
            writeJsonp('/test?callback=demo3')
        };
        writeJsonp('/test?callback=demo2');
    };
    writeJsonp('/test?callback=demo1');//发起jsonp请求
```

现在：
```javascript
    var defer = new deferJsonp,
        callback = function (data) { return data; };
    defer.defer('/test?callback=demo1',callback)
         .defer('/test?callback=demo2',callback)
         .defer('/test?callback=demo3', function (data3, data2, data) {
				console.log(data, data2, data3);
         });
```
   

&nbsp;&nbsp;

----------

&nbsp;&nbsp;

最大化利用浏览器HTTP线程并行，并维持每一个JSONP的执行顺序。

 - 传统的JSONP进行三次请求，三次请求分别阻塞2000ms、3000ms和1000ms。完成所有请求共计约6000ms：

![jsonp][3]
  


 - deferJsonp同样的请求，共计约3000ms：

![deferJsonp][4]

&nbsp;&nbsp;

特性：
 - 根据url定义的条件自动管理jsonp回调函数
 - 抹平了JSONP的异步，脱离回调地狱
 - 最大化浏览器并行请求，速度更快
 - 处理了JSONP的超时失败
 - 简单，精湛
  
更多请参考[延伸][5]。

  &nbsp;&nbsp;

## API
### deferJsonp.prototype.defer(url,done[,fail,time])
> 发送一个JSONP请求(url)，设置成功后执行的函数(done)，失败后执行的函数(fail，可略)，超时时间(time，可略)，从load发起请求的回调函数，返回值会一直传递，如果没有返回值，则该次请求返回的默认值是`undefined`。

```javascript
    var defer = new deferJsonp;
    defer.defer('/test?callback=demo1', function () {
        return true;//done
    }, function () {
        return false;//fail
    }, 1000)
		.defer('/test?callback=demo2', function (data) {
			return 'linkFly';
		})
		.defer('/test?callback=demo3', function (data3, data2, data) {
			console.log(data, data2, data3);//[true,'linkFly','data3']
		});
```

&nbsp;

### deferJsonp.prototype.getJSONP(url,done[,fail,time])
> 发送一个传统的JSONP请求(url)，设置成功后执行的函数(done)，失败后执行的函数(fail，可略)，超时时间(time，可略)


## 延伸
在[这里][6]中详细描述了deferJsonp。

## 计划
根据deferJsonp的需求量，后期**可能**提供这些API：

 1. deferJsonp.prototype.done(callback,data) - 多次委托成功后执行的回调函数，并追加参数
 2. deferJsonp.prototype.fail(callback,data) - 多次委托失败后执行的回调函数，并追加参数
 3. deferJsonp.prototype.ajax(options) - 支持ajax
 4. 兼容&lt;IE9的浏览器
 5. ~~提供没有依赖关系的API，纯JSONP加载，例如deferJsonp.prototype.send~~**（已完成）**
 
## 更新

**2015-07-17**
> 
 - Callbacks对象重命名为Asyncqueue对象
 - 现在默认并不处理超时异常，需要处理超时异常请传递`time`参数
 - `deferJsonp.prototype.load`重命名为`deferJsonp.prototype.defer`
 - 添加了API `deferJsonp.prototype.getJSONP`
 - 强化内部Asyncqueue对象的工作能力
 - 支持回调函数的多参
 - 超时时间作为可选项
 
**2015-06-09**
> 
 - 重新调整委托函数的逻辑，当JSONP委托的回调函数没有返回值（undefined），则默认该函数返回服务器传递下来的源数据，如果有返回值，则覆盖源数据（override）。
 - 支持deferJsonp.prototype.done(url&#91;,time&#93;) API。
 - 修正了请求超时，但仍然触发done(成功后执行的回调函数)的bug。

  
  
 
## License

    The MIT License (MIT)

    Copyright (c) 2004 linkFly, and a number of other contributors. 

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.


  [1]: https://camo.githubusercontent.com/11b46a2fb2858bbfcaf16cd73aa05f851230d0f5/687474703a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d79656c6c6f77677265656e2e737667
  [2]: https://github.com/linkFly6/deferJsonp/blob/master/src/deferJsonp.js
  [3]: https://github.com/linkFly6/deferJsonp/blob/master/external/jsonp.gif
  [4]: https://github.com/linkFly6/deferJsonp/blob/master/external/deferJsonp.gif
  [5]: #%E5%BB%B6%E4%BC%B8
  [6]: https://github.com/linkFly6/deferJsonp/tree/master/doc