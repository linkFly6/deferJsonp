# deferJsonp ![license|MIT][1]


�򵥾��µ�web jsonp���첽���̿��ƿ⡣
������У�`_deferJsonp.1.0.js`�Ѿ������������õ���[`deferJsonp.2.0.js`][2]��

## �첽����
��ȥ�Ĵ��룺
```javascript
    window.demo1 = function (data) {//jsonp����ص�����
        window.demo2 = function (data2) {
            window.demo3 = function (data3) {
                console.log(data, data2, data3);
            };
            writeJsonp('/test?callback=demo3')
        };
        writeJsonp('/test?callback=demo2');
    };
    writeJsonp('/test?callback=demo1');//����jsonp����
```

���ڣ�
```javascript
    var defer = new deferJsonp;
    defer.load('/test?callback=demo1')
         .load('/test?callback=demo2')
         .load('/test?callback=demo3', function (data3, data2, data) {
				console.log(data, data2, data3);
         });
```
   

> *��Promise������ͬ��Promiseǿ���ȴ���һ��Promise����Ľ������deferJsonp������һ��deferJsonp�����ͬʱ���������Լ����ڷ��ؽ����ʱ����˳��ִ��*��

&nbsp;&nbsp;

----------

&nbsp;&nbsp;

������������http�̲߳��У���ά��ÿһ��jsonp��ִ��˳��

 - ��ͳ��jsonp��������������������ֱ�����2000ms��3000ms��1000ms������������󹲼�Լ6000ms��

![jsonp][3]
  


 - deferJsonpͬ�������󣬹���Լ3000ms��

![deferJsonp][4]

������ο�[����][5]��

  &nbsp;&nbsp;

## API
### deferJsonp.prototype.load(url,done[,fail,time])
>����һ��jsonp����(url)�����óɹ���ִ�еĺ���(done)��ʧ�ܺ�ִ�еĺ���(fail������)����ʱʱ��(time������)����load��������Ļص�����������ֵ��һֱ���ݣ����û�з���ֵ����ô����󷵻ص�Ĭ��ֵ��`undefined`��

```javascript
    var defer = new deferJsonp;
    defer.load('/test?callback=demo1', function () {
        return true;//done
    }, function () {
        return false;//fail
    }, 1000)
		.load('/test?callback=demo2', function (data) {
			return 'linkFly';
		})
		.load('/test?callback=demo3', function (data3, data2, data) {
			console.log(data, data2, data3);//[true,'linkFly','data3']
		});
```



## ����
��[DESCRIPTION][6]����ϸ������deferJsonp�Ĺ���ģ�ͺ͸�ǿ�Ȳ��ԡ�

## �ƻ�
����deferJsonp��������������**����**�ṩ��ЩAPI��

 1. deferJsonp.prototype.done(callback) - ���ί�гɹ���ִ�еĻص�����
 2. deferJsonp.prototype.fail(callback) - ���ί��ʧ�ܺ�ִ�еĻص�����
 3. deferJsonp.prototype.ajax(options) - ֧��ajax
 4. ����&lt;IE9�������

 
## License

    The MIT License (MIT)

    Copyright (c) 2004 Kohsuke Kawaguchi, Sun Microsystems Inc., and a number of other contributors. 

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
  [2]: https://github.com/linkFly6/linkfly.so/blob/master/LinkFLy/Code/DeferJsonp/deferJsonp.2.0.js
  [3]: https://github.com/linkFly6/linkfly.so/blob/master/LinkFLy/Code/deferJsonp/images/jsonp.gif
  [4]: https://github.com/linkFly6/linkfly.so/blob/master/LinkFLy/Code/deferJsonp/images/deferJsonp.gif
  [5]: https://github.com/linkFly6/linkfly.so/tree/master/LinkFLy/Code/deferJsonp#%E5%BB%B6%E4%BC%B8
  [6]: https://github.com/linkFly6/linkfly.so/tree/master/LinkFLy/Code/deferJsonp/DESCRIPTION.md