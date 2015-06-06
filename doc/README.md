# deferJsonp - 工作模型和测试

##工作模型
传统含有依赖关系的工作模型，需要等待上一次jsonp的加载完毕才可以进行下一次加载：

![jsonp][1]

&nbsp;&nbsp;

deferJsonp的工作模型，是直接进行加载，然后维持住回调函数的执行顺序：

![deferJsonp][2]

&nbsp;&nbsp;

> deferJsonp不仅抹平了jsonp的异步代码，同时最大的利用现有资源，立即请求的特性可以节省更多的网络传输时间，而后又巧妙的维持住异步链下，回调函数的执行顺序。


##API的支持
 deferJsonp.prototype.load提供三套重载API
  - load(url,done,fail,time) - 完整的参数：请求url，成功回调函数，失败回调函数，超时时间(ms)
  - load(url,done) - 请求url，成功回调函数
  - load(url,done,time) - 请求url，成功回调函数，超时时间(ms)

&nbsp;&nbsp;

 参数url支持这些格式：
  - url?callback=? - 使用?占位符，自动生成jsonp回调函数名称
  - url?callback=callbackName - callback参数指定jsonp回调函数名称

```javascript
        deferJsonp().load('/test?cb=?', function (str) {//通过?占位符自动生成回调函数
            return str;
        }, function () {
            console.log('fail');
        }, 2000)
        .load('/test?callback=callbackName', function (data, str) {//指定回调函数名称为callbackName
            console.log(str, data);
        }, 500);
```


 默认超时时间是1000ms。
 
##参数的传递


 每个jsonp请求想要在下一个jsonp中接收到，必须要把参数返回回去，注意如果返回值如果是Array则会拆开，同时参数是按照回调函数队列倒序排列的。
 
 ```javascript
        var callback = function (data) { return data; },
            url="/test?callback=?";
        
        deferJsonp().load(url + '&t=2000&data=one', function (data) {
            return [data, '1'];//data===one
        })
        .load(url + '&t=3000&data=two', function (data) {
            return data;//data===two
        })
        .load(url + '&t=1000&data=three', function (data) {
            console.log(arguments);//=> ["three", "two", "one","1"]
            return data;
        })
 
 ```


##测试

deferJsonp自身的实现只是发起和处理jsonp，真正控制回调函数的是内建的顺序控制对象`Callbacks`管理，我单独对Callbacks做了一次高强度的测试：
 - 委托100个回调函数
 - 随机延时完成回调函数
 
结果如下，内存约10kb：

![deferJsonp][3]

测试代码在[`这里`][4]。




  [1]: https://github.com/linkFly6/deferJsonp/blob/master/external/jsonp.gif
  [2]: https://github.com/linkFly6/deferJsonp/blob/master/external/deferJsonp.gif
  [3]: https://github.com/linkFly6/deferJsonp/blob/master/external/callbacks.gif
  [4]: https://github.com/linkFly6/deferJsonp/blob/master/test/callbacks.html
