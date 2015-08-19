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
 deferJsonp.prototype.defer提供了一系列非常强大的重载：
  - defer(url) - 请求url，通过deferJsonp内建的参数传递机制仍然可以在后续的回调函数中接收到参数
  - defer(url,time) - 请求url，设定超时时间，超时时间(ms)
  - defer(url,done) - 请求url，成功回调函数
  - defer(url,done,time) - 请求url，成功回调函数，超时时间(ms)
  - defer(url,done,fail,time) - 完整的参数：请求url，成功回调函数，失败回调函数，超时时间(ms)
  

&nbsp;&nbsp;

 参数url支持这些格式：
  - url?callback=? - 使用?占位符，自动生成jsonp回调函数名称
  - url?callback=callbackName - callback参数指定jsonp回调函数名称


```javascript
        deferJsonp().defer('/test?cb=?', function (str) {//通过?占位符自动生成回调函数
            return str;
        }, function (error) {
            console.log(error);//输出异常信息
        }, 1000)
        .defer('/test?callback=callbackName', function (data, str) {//指定回调函数名称为callbackName
            console.log(str, data);
        });
```



 **默认没有超时处理，需要超时处理请传递time参数。**
 
 
##参数的传递

通过deferJsonp.prototype.load委托的回调函数我们称为：done（成功后执行的回调函数）和fail（失败后执行的回调函数），参数传递遵循下面的规则进行：

 - 当done/fail没有返回值(undefined)，则传递这次请求(load)服务器所返回的数据参数，并把所有的数据参数包装为Array。
 - 当done/fail拥有返回值，则传递返回值。
 - 所有的load()委托的回调函数都能接收到上一个load()回调函数的返回值或数据源（Array）。
 - 接收的数据/参数按照load()调用的顺序倒序排列
 
  
 ```javascript
    var url = '/Home/Async?callback=?';
        
    deferJsonp().defer(url + '&time=2000&data=one', function (data) {//data===one
        return { name: 'linkFly' };//Object { name="linkFly"}
    })
	.defer(url + '&time=3000&data=two')//two
	.defer(url + '&time=1000&data=three', function (data) {
		console.log(arguments);//=> ["three", ["two"], { name="linkFly"}]
	})
 
 ```


 ```javascript
	var url = '/Home/Async?callback=?';
	deferJsonp().defer(url + '&time=3000&data=test', 1000)//超时 - Object { code=1,  msg="请求超时"}
				.defer(url + '&time=1000&error=test')//error - Object { code=0,  msg="请求失败"}
				.defer(url + '&time=1000&data=linkFly', function (data) {
					console.info(data);// linkFly
					console.log(arguments);// => ["linkFly", { code=0,  msg="请求失败"}, { code=1,  msg="请求超时"}]
				});

 ```

##测试

deferJsonp自身的实现只是发起和处理JSONP，真正控制回调函数的是内建的顺序控制对象`Asyncqueue`管理，我单独对`Asyncqueue`做了一次高强度的测试：
 - 委托100个回调函数
 - 随机延时完成回调函数
 
结果如下，内存约10kb：

![deferJsonp][3]

测试代码在[这里][4]。




  [1]: https://github.com/linkFly6/deferJsonp/blob/master/external/jsonp.gif
  [2]: https://github.com/linkFly6/deferJsonp/blob/master/external/deferJsonp.gif
  [3]: https://github.com/linkFly6/deferJsonp/blob/master/external/callbacks.gif
  [4]: https://github.com/linkFly6/deferJsonp/blob/master/test/asyncqueue.html
  [5]: http://www.cnblogs.com/zldream1106/p/Parallelize_downloads_across_hostnames.html
