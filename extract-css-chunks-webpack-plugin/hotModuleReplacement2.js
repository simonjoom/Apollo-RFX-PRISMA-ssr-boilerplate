var normalizeUrl = require('normalize-url');
var srcByModuleId = Object.create(null);
var debounce = require('lodash/debounce');

var noDocument = typeof document === 'undefined';
var forEach = Array.prototype.forEach;

var noop = function () {};

var getCurrentScriptUrl = function(moduleId) {
  var src = srcByModuleId[moduleId];
  if (!src) {
    if (document.currentScript) {
      src = document.currentScript.src;
    } else {
      var scripts = document.getElementsByTagName('script');

      var lastScriptTag = scripts[scripts.length - 1];
      if (lastScriptTag) {
        src = lastScriptTag.src;
      }
    }
    srcByModuleId[moduleId] = src;
  }

  return function(fileMap) {
    var splitResult = /([^\\/]+)\.js$/.exec(src);
    var filename = splitResult && splitResult[1];
    if (!filename) {
      return [src.replace('.js', '.css')];
    }
    return fileMap.split(',').map(function(mapRule) {
      var reg = new RegExp(filename + '\\.js$', 'g')
      return normalizeUrl(src.replace(reg, mapRule.replace(/{fileName}/g, filename) + '.css'), { stripWWW: false });
    });
  };
};

function updateCss(el, url) {
  if (!url) {
    url = el.href.split('?')[0];
  }
  if (el.isLoaded === false) {
    // We seem to be about to replace a css link that hasn't loaded yet.
    // We're probably changing the same file more than once.
    return;
  }
  if (!url || !(url.indexOf('.css') > -1)) return;

  el.visited = true;
  var newEl = el.cloneNode();

  newEl.isLoaded = false;
  newEl.addEventListener('load', function () {
    newEl.isLoaded = true;
    el.remove();
  });
  newEl.addEventListener('error', function () {
    newEl.isLoaded = true;
    el.remove();
  });

  newEl.href = url + '?' + Date.now();
  el.parentNode.appendChild(newEl);
}

function reloadStyle(src) {
  var elements = document.querySelectorAll('link');
  var loaded = false;
  forEach.call(elements, function(el) {
    if (el.visited === true) return;

    var url = getReloadUrl(el.href, src);
     console.log(url)
    if (url) {
      updateCss(el, url);
      loaded = true;
    }
  });

  return loaded;
}

function getReloadUrl(href, src) {
  href = normalizeUrl(href, { stripWWW: false });
  var ret;
  console.log(href)
  src.some(function(url) {
    if (href.indexOf(url) > -1) {
      ret = url;
    }
  });
  return ret;
}

function reloadAll() {
  var elements = document.querySelectorAll('link');
  forEach.call(elements, function(el) {
    if (el.visited === true) return;
    updateCss(el);
  });
}

module.exports = function(src, options) {
  var getScriptSrc;

  if (noDocument) {
    return noop;
  }
   console.log(src)
  /*
    var splitResult = /([^\\/]+)\.css$/.exec(src[0]);
    var filename = splitResult && splitResult[1];

   var reg = new RegExp(filename, 'g')
console.log(normalizeUrl(src[0].replace(reg, options.fileMap.replace(/{fileName}/g, filename) + '.css'), { stripWWW: false }))*/
  //getScriptSrc = getCurrentScriptUrl(moduleId);

  function update() {
   // var src = getScriptSrc(options.fileMap);
    var reloaded = reloadStyle([src]);

    if (reloaded) {
      console.log('[HMR] css reload %s', src);
    } else {
      console.log('[HMR] Reload all css');
      reloadAll();
    }
  }
  return update() ;
};
