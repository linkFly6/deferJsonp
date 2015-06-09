# deferJsonp - 工作模型和细节

##工作模型
传统含有依赖关系的工作模型，需要等待上一次JSONP的加载完毕才可以进行下一次加载：

![jsonp][1]

&nbsp;&nbsp;

deferJsonp的工作模型，是直接进行加载，然后维持住回调函数的执行顺序：

![deferJsonp][2]

&nbsp;&nbsp;

> deferJsonp不仅抹平了JSONP的异步代码，同时最大的利用现有资源，立即请求的特性可以节省更多的网络传输时间，而后又巧妙的维持住异步链下回调函数的执行顺序。

关于浏览器并发连接数请看[这个博客][5]。

##API的支持
 deferJsonp.prototype.load提供了一系列非常强大的重载：
  - load(url) - 请求url，通过deferJsonp内建的参数传递机制仍然可以在后续的回调函数中接收到参数
  - load(url,time) - 请求url，设定超时时间，超时时间(ms)
  - load(url,done) - 请求url，成功回调函数
  - load(url,done,time) - 请求url，成功回调函数，超时时间(ms)
  - load(url,done,fail,time) - 完整的参数：请求url，成功回调函数，失败回调函数，超时时间(ms)
  

&nbsp;&nbsp;

 参数url支持这些格式：
  - url?callback=? - 使用?占位符，自动生成jsonp回调函数名称
  - url?callback=callbackName - callback参数指定jsonp回调函数名称


```javascript
        deferJsonp().load('/test?cb=?', function (str) {//通过?占位符自动生成回调函数
            return str;
        }, function () {
            console.log('fail');
        }, 1000)
        .load('/test?callback=callbackName', function (data, str) {//指定回调函数名称为callbackName
            console.log(str, data);
        });
```



 **默认超时时间是1200ms。**
 
 
##参数的传递

通过deferJsonp.prototype.load委托的回调函数我们称为：done（成功后执行的回调函数）和fail（失败后执行的回调函数），参数传递遵循下面的规则进行：

 - 当done/fail没有返回值(undefined)，则传递这次请求(load)服务器所返回的数据源。
 - 当done/fail拥有返回值，则传递返回值。
 - 所有的load()委托的回调函数都能接收到上一个load()回调函数的返回值或数据源。
 - 接收的数据/参数按照load()调用的顺序倒序排列
 
  
 ```javascript
        var url="/test?callback=?";
        
        deferJsonp().load(url + '&t=1000&data=one', function (data) {
            return [data, '1'];//data===one
        })
        .load(url + '&t=1100&data=two')//return two
        .load(url + '&t=1500&data=three', 100)//undefined
        .load(url + '&t=800&data=four', function (data) {
            console.log(arguments);//=> ["four", undefined, "two", ["one", "1"]]
        })
 
 ```


##测试

deferJsonp自身的实现只是发起和处理JSONP，真正控制回调函数的是内建的顺序控制对象`Callbacks`管理，我单独对Callbacks做了一次高强度的测试：
 - 委托100个回调函数
 - 随机延时完成回调函数
 
结果如下，内存约10kb：

![deferJsonp][3]

测试代码在[这里][4]。




  [1]: https://github.com/linkFly6/deferJsonp/blob/master/external/jsonp.gif
  [2]: https://github.com/linkFly6/deferJsonp/blob/master/external/deferJsonp.gif
  [3]: https://github.com/linkFly6/deferJsonp/blob/master/external/callbacks.gif
  [4]: https://github.com/linkFly6/deferJsonp/blob/master/test/callbacks.html
  [5]: http://www.cnblogs.com/zldream1106/p/Parallelize_downloads_across_hostnames.html
