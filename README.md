# deferJsonp ![license|MIT][1]


�򵥾��µ�JSONP�첽���̿��ƿ⣬�鿴������[**deferJsonp.js**][2]��

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

������������HTTP�̲߳��У���ά��ÿһ��JSONP��ִ��˳��

 - ��ͳ��JSONP��������������������ֱ�����2000ms��3000ms��1000ms������������󹲼�Լ6000ms��

![jsonp][3]
  


 - deferJsonpͬ�������󣬹���Լ3000ms��

![deferJsonp][4]

&nbsp;&nbsp;

���ԣ�
 - ����url����������Զ�����jsonp�ص�����
 - Ĩƽ��JSONP���첽������ص�����
 - �����������������ٶȸ���
 - ������JSONP�ĳ�ʱʧ��
 - �򵥣���տ
  
������ο�[����][5]��

  &nbsp;&nbsp;

## API
### deferJsonp.prototype.defer(url,done[,fail,time])
> ����һ��JSONP����(url)�����óɹ���ִ�еĺ���(done)��ʧ�ܺ�ִ�еĺ���(fail������)����ʱʱ��(time������)����load��������Ļص�����������ֵ��һֱ���ݣ����û�з���ֵ����ô����󷵻ص�Ĭ��ֵ��`undefined`��

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
> ����һ����ͳ��JSONP����(url)�����óɹ���ִ�еĺ���(done)��ʧ�ܺ�ִ�еĺ���(fail������)����ʱʱ��(time������)


## ����
��[����][6]����ϸ������deferJsonp��

## �ƻ�
����deferJsonp��������������**����**�ṩ��ЩAPI��

 1. deferJsonp.prototype.done(callback,data) - ���ί�гɹ���ִ�еĻص���������׷�Ӳ���
 2. deferJsonp.prototype.fail(callback,data) - ���ί��ʧ�ܺ�ִ�еĻص���������׷�Ӳ���
 3. deferJsonp.prototype.ajax(options) - ֧��ajax
 4. ����&lt;IE9�������
 5. ~~�ṩû��������ϵ��API����JSONP���أ�����deferJsonp.prototype.send~~**������ɣ�**
 
## ����

**2015-07-17**
> 
 - Callbacks����������ΪAsyncqueue����
 - ����Ĭ�ϲ�������ʱ�쳣����Ҫ����ʱ�쳣�봫��`time`����
 - `deferJsonp.prototype.load`������Ϊ`deferJsonp.prototype.defer`
 - �����API `deferJsonp.prototype.getJSONP`
 - ǿ���ڲ�Asyncqueue����Ĺ�������
 - ֧�ֻص������Ķ��
 - ��ʱʱ����Ϊ��ѡ��
 
**2015-06-09**
> 
 - ���µ���ί�к������߼�����JSONPί�еĻص�����û�з���ֵ��undefined������Ĭ�ϸú������ط���������������Դ���ݣ�����з���ֵ���򸲸�Դ���ݣ�override����
 - ֧��deferJsonp.prototype.done(url&#91;,time&#93;) API��
 - ����������ʱ������Ȼ����done(�ɹ���ִ�еĻص�����)��bug��

  
  
 
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