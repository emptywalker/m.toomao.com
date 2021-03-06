!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(factory );
  } else {
    factory( );
  }
}(function( ){

  // Code form Zepto.js
  // @see https://github.com/madrobby/zepto/blob/master/src/form.js#files
  var serializeArray = function() {
    var name, type, result = [],
        add = function(value) {
          if (value.forEach) return value.forEach(add)
          result.push({ name: name, value: value })
        };

    [].slice.apply(this.elements || this.querySelectorAll('input,textarea')).forEach(function(field) {

      type = field.type, name = field.name
      if (name && field.nodeName.toLowerCase() !== 'fieldset' &&
        !field.disabled && type !== 'submit' && type !== 'reset' && type !== 'button' && type !== 'file' &&
        ((type !== 'radio' && type !== 'checkbox') || field.checked))
          add(field.value)
    })
    return result
  }

  var serialize = function(){
    var result = []
    serializeArray.call(this).forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  var serializeJSONForGET = function(){
    var result = []
    serializeArray.call(this).forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

    /**
   * Set obj's value by keys
   * @param  {[object]}           obj   The target you want to set.
   * @param  {[array]}            keys  The value's path.
   * @param  {[string, array...]} value Target's value.
   * @return {[object]}                 The target after setting value.
   *
   * Example: obj = {'a':'a'}, keys = ['b','bb'], value = 'b-value'
   * return {
   *         'a': 'a',
   *         'b': {
   *           'bb': 'b-value'
   *          }
   *        }
   */
  var deepSet = function(obj, keys, value) {

    var curKey = keys[0];
    if(keys.length === 1) {

      curKey === '' ? obj.push(value) : obj[curKey] = value;

      return;
    }
    if (keys.length > 1) {
      if (typeof obj[curKey] === 'undefined')
        obj[curKey] = keys[1] === '' ? [] : {};
    }

    var o = obj[curKey];
    keys.shift();
    return deepSet(o, keys, value);
  }

  var integerKeysAsArrayIndexes = function(obj, keys, value) {

    var allKeysIsInteger = true;
    var arr = [];
    var temp;
    keys = keys || [];
    value = value || obj;



    for (var key in value) {

      temp = keys.concat();

      if (isNaN(+key)) {
        allKeysIsInteger = false;
      } else {
        arr.push(value[key]);
      }
      temp.push(key);

      if ((typeof value[key] === 'object') && !Array.isArray(value[key])) {
        integerKeysAsArrayIndexes(obj, temp, value[key]);
      }
    }

    if (allKeysIsInteger) {

      if (keys.length === 0) {
        obj = arr;
      } else {
        deepSet(obj, keys, arr)
      }
    }
    return obj;
  }
  // TEST: integerKeysAsArrayIndexes
  // var json = integerKeysAsArrayIndexes({
  //   a: {
  //     0: {
  //       aa: "aa",
  //       bb: {
  //         0: "bb0",
  //         1: "bb1",
  //         3: "bb3"
  //       }
  //     },
  //     1: "a"
  //   },
  //   b: "b"
  // })
  // console.log(JSON.stringify(json));
  // var json = integerKeysAsArrayIndexes({
  //   0: "a",
  //   1: {
  //     "a": "b"
  //   }
  // })
  // console.log(JSON.stringify(json));


  // keys: ["a", ""]
  // ["a", "b", "c"], ["a", "b", "d"]
  // types: "string", "array", "number", "bool", "object"
  //
  // TEST
  // form.json
  // input(name='a')
  // input(name='images.')
  // input(name='images.')
  // input(name='b.b')
  // input(name='c.c.:number')
  // input(name='c.c.')
  // input(type='submit')
  //
  var submitHandler = function(e, options, action) {

    var self = this;
    var method = self.getAttribute('method') || 'POST';
    var res;

    if (self['_running']) {
      console.log('form submiting. return.')
      return;
    }
    res = {};
    serializeArray.call(self).forEach(function(t){
      var keys  = t.name.split('.');
      var len   = keys.length - 1;
      var index = keys[len].indexOf(':');
      var value = t.value;
      var type;
      if (index !== -1) {
        type    = keys[len].substr(index + 1);
        keys[len] = keys[len].substr(0, index);
      } else {
        type = 'string';
      }

      if (type === 'array' || type === 'object') {

        value  = JSON.parse(value);

      } else if (type === 'number') {

        value = +value;
      } else if (type === 'datetime') {

        // var value = '2016-05-05 05:05:05';
        // Not an UTC-time. Convert it to an UTC-time.
        if (value.indexOf('T') === -1) {

          value = value.replace(' ', 'T');
          value = new Date(value + 'Z');
          value = new Date(value.getTime() + value.getTimezoneOffset() * 60 * 1000);

        // var value = '2016-05-05T05:05:05';
        // An UTC-time, just new it directly.
        } else {
          value = new Date(value + 'Z');
        }

        if (value.toString() === 'Invalid Date') {
          value = '';
        } else {
          value = value.getTime();
        }

      } else if (type === 'date') {

        value = new Date(value);
        if (value.toString() === 'Invalid Date') {
          value = '';
        } else {
          value = value.getTime();
        }

      } else if (type === 'bool' || type === 'boolean') {
        if (value === 'false')
          value = false
        else
          value = !!value;

      }

      deepSet(res, keys, value);
    });

    if (options.parseInteger)
      res = integerKeysAsArrayIndexes(res);
    res = options.data.call(self, res);


    // Stringify result object.
    if (method === "GET") {

      var keys = Object.keys(res || {});
      var arr = []
      for (var i = 0, max = keys.length; i < max; i ++) {
        if (typeof res[keys[i]] === 'string') {

          arr.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent( res[keys[i]]) )
        } else {
          arr.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent( JSON.stringify(res[keys[i]])) );
        }
      }
      res = arr.join('&')

    } else {
      res = JSON.stringify(res);
    }




    /**
     * If there are no data should be sent, just return.
     */
    if (res === 'null') {
      return;
    }

    /**
     *
     * AJAX request
     *
     */
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.timeout = 20000;
    action = (action === undefined ? (self.getAttribute('action') || location.href) : action);

    if (method === 'GET') {
      action += action.indexOf('?') === -1 ? ('?' + res) : ( '&' + res);
    }

    xmlHttp.open(method, action, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');

    /**
    * Add session header for cross-domain request.
    * You can't set cookies for ajax
    * and you have to response #options request# like:
    * "Access-Control-Allow-Headers: X-CUSTOME-HEADERS"
    * before you send it.
    *
    * Call beforeSend function before send xhr.
    * */
    self._beforeSend && self._beforeSend.call(self, xmlHttp);

    xmlHttp.responseType = 'json';

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {

        self['_running'] = false;

        var done  = self._done && self._done(xmlHttp);
        if (done === null) {
          return;
        } else {
          xmlHttp = done || xmlHttp;
        }

        // xmlHttp.response is read-only. So we shoud copy it. xmlHttp.responseType is not accessiable.
        // responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was 'json').
        var fakeXMLHttp = {};
        ["status", "response", "statusText", "readyState", "responseText"].forEach(function(i) {
          try {
            fakeXMLHttp[i] = xmlHttp[i];
          } catch (e) {}
        })

        if (xmlHttp.status >= 200 && xmlHttp.status < 300) {

          if (typeof xmlHttp.response === 'string') {
            try {
              fakeXMLHttp.response = JSON.parse(fakeXMLHttp.response);
            } catch (e) {
              fakeXMLHttp.response = {};
            }
            options.ended.call(self, fakeXMLHttp.response , fakeXMLHttp);
            self['_XMLHttpRequest'] = fakeXMLHttp;
          } else {
            options.ended.call(self, xmlHttp.response, xmlHttp);
            self['_XMLHttpRequest'] = xmlHttp;
          }
          self.dispatchEvent(new Event('formJSON-ended', {bubbles: true}));

        } else {

          if (typeof xmlHttp.response === 'string') {
            try {
              fakeXMLHttp.response = JSON.parse(fakeXMLHttp.response);
            } catch (e) {
              fakeXMLHttp.response = {};
            }
            options.error.call(self, fakeXMLHttp);
            self['_XMLHttpRequest'] = fakeXMLHttp;
          } else {
            options.error.call(self, xmlHttp);
            self['_XMLHttpRequest'] = xmlHttp;
          }

          self.dispatchEvent(new Event('formJSON-error', {bubbles: true}));
        }
      }
    }

    self['_running'] = true;
    if (method === 'GET')
      xmlHttp.send();
    else
      xmlHttp.send(res);
  }




  /**
   * Example:
   * <form action='/action/a'>
   * <input type='submit'>
   * <input type='submit' formAction='/action/b'>
   * </form>
   */
  var formAction;
  document.addEventListener('click', function(e) {
    var target = e.target;

    if (target.type === 'submit' && target.getAttribute('formAction')) {
      formAction = target.getAttribute('formAction');
    }

    setTimeout(function() {
      formAction = undefined;
    }, 1000);

  })

  /**
   * Submit form's handler.
   * Example:
   * <form data-role='formJSON'>
   * </form>
   */
  var submitListener = function(e) {

    var target = e.target;
    if (target.getAttribute('data-role') === 'formJSON') {

      e.preventDefault();
      e.stopPropagation();

      var temp = (temp = target.getAttribute('data-target')) && document.querySelector(temp);
      var parseInteger = target.getAttribute('data-parseInteger') === 'false' ? false : true;

      var options = {
        parseInteger: parseInteger,
        ended: target.onended || ( temp && temp.onended ) || function(){},
        // to change data
        data: target._data || ( temp && temp._data ) || function(d){return d},
        error: target.onerror || ( temp && temp.onerror ) || function(){}
      };

      submitHandler.call(target, e, options, formAction);

    }

  }
  document.addEventListener('submit', submitListener)
  document.addEventListener('formJSON-submit', submitListener)

  // Fix.
  // Submit a form by javascript won't fire submit event.
  // @see http://stackoverflow.com/questions/12819357/form-submitted-using-submit-from-a-link-cannot-be-caught-by-onsubmit-handler

  var _submit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function() {

    if (this.getAttribute('data-role') === 'formJSON') {
      this.dispatchEvent(new Event('formJSON-submit', {bubbles: true}));
    } else {
      _submit.call(this);
    }
  }

  return null;

}));
