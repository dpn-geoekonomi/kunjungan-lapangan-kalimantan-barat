/*
 * dc-lite.js — penggerak kecil untuk halaman portal KKDN Kalbar.
 * Membaca template di <template id="tpl">, mengisi {{ ... }}, <sc-for>, <sc-if>,
 * memasang onClick, lalu menggambar ulang setiap kali state berubah.
 */
(function () {
  "use strict";

  function DCLogic(props) {
    this.props = props || {};
  }
  DCLogic.prototype.setState = function (update) {
    var next = typeof update === "function" ? update(this.state, this.props) : update;
    this.state = Object.assign({}, this.state, next);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () {
    if (this.__schedule) this.__schedule();
  };
  window.DCLogic = DCLogic;

  var HOLE = /\{\{([^}]+)\}\}/g;
  var WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;

  function look(scope, path) {
    path = path.trim();
    if (path === "true") return true;
    if (path === "false") return false;
    if (path === "null") return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var v = scope;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function interp(scope, text) {
    return text.replace(HOLE, function (_, p) {
      var v = look(scope, p);
      return v == null || typeof v === "function" ? "" : String(v);
    });
  }

  function holePath(value) {
    var m = WHOLE.exec(value || "");
    return m ? m[1] : null;
  }

  function nodePath(node, root) {
    var path = [];
    while (node && node !== root) {
      var parent = node.parentNode;
      if (!parent) return null;
      path.unshift(Array.prototype.indexOf.call(parent.childNodes, node));
      node = parent;
    }
    return node === root ? path : null;
  }

  function nodeAt(root, path) {
    var node = root;
    for (var i = 0; i < path.length && node; i++) node = node.childNodes[path[i]];
    return node;
  }

  window.mountDC = function (Component, template, root) {
    var inst = new Component({});
    if (!inst.state) inst.state = {};
    var refs = new Map();
    var pending = false;
    var mounted = false;

    function build(source, scope, out, mounts) {
      var kids = source.childNodes;
      for (var i = 0; i < kids.length; i++) {
        var ch = kids[i];
        if (ch.nodeType === 3) {
          var t = ch.nodeValue;
          out.appendChild(document.createTextNode(t.indexOf("{{") < 0 ? t : interp(scope, t)));
          continue;
        }
        if (ch.nodeType !== 1) continue;
        var tag = ch.localName;

        if (tag === "sc-for") {
          var list = look(scope, holePath(ch.getAttribute("list")) || "") || [];
          var as = ch.getAttribute("as") || "item";
          for (var k = 0; k < list.length; k++) {
            var inner = Object.assign({}, scope);
            inner[as] = list[k];
            inner.$index = k;
            build(ch, inner, out, mounts);
          }
          continue;
        }
        if (tag === "sc-if") {
          if (look(scope, holePath(ch.getAttribute("value")) || "false")) build(ch, scope, out, mounts);
          continue;
        }

        var refPath = holePath(ch.getAttribute("ref"));
        var refFn = refPath ? look(scope, refPath) : null;
        if (typeof refFn === "function" && refs.has(refFn)) {
          out.appendChild(refs.get(refFn));
          continue;
        }

        var el = document.importNode(ch, false);
        var attrs = Array.prototype.slice.call(el.attributes);
        for (var a = 0; a < attrs.length; a++) {
          var name = attrs[a].name, value = attrs[a].value;
          if (name.indexOf("hint-") === 0 || name === "ref") { el.removeAttribute(name); continue; }
          if (value.indexOf("{{") < 0) continue;
          var whole = holePath(value);
          if (whole !== null) {
            var v = look(scope, whole);
            if (name.indexOf("on") === 0) {
              el.removeAttribute(name);
              if (typeof v === "function") el.addEventListener(name.slice(2), v);
            } else if (v == null || typeof v === "function") {
              el.removeAttribute(name);
            } else {
              el.setAttribute(name, String(v));
            }
          } else {
            el.setAttribute(name, interp(scope, value));
          }
        }
        if (typeof refFn === "function") {
          refs.set(refFn, el);
          (function (fn, node) { mounts.push(function () { fn(node); }); })(refFn, el);
        }
        build(ch.content || ch, scope, el, mounts);
        out.appendChild(el);
      }
    }

    function render() {
      pending = false;
      var active = document.activeElement;
      var focusPath = active && root.contains(active) ? nodePath(active, root) : null;
      var mounts = [];
      var frag = document.createDocumentFragment();
      build(template.content, inst.renderVals(), frag, mounts);
      root.replaceChildren(frag);
      mounts.forEach(function (fn) { fn(); });
      if (focusPath) {
        var again = nodeAt(root, focusPath);
        if (again && typeof again.focus === "function") again.focus({ preventScroll: true });
      }
      if (!mounted) {
        mounted = true;
        if (typeof inst.componentDidMount === "function") inst.componentDidMount();
      }
    }

    inst.__schedule = function () {
      if (pending) return;
      pending = true;
      Promise.resolve().then(render);
    };
    render();
    return inst;
  };
})();
