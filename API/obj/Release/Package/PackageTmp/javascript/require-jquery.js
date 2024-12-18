var requirejs, require, define;
(function (global) {
  function isFunction(e) {
    return ostring.call(e) === "[object Function]"
  }

  function isArray(e) {
    return ostring.call(e) === "[object Array]"
  }

  function each(e, t) {
    if (e) {
      var n;
      for (n = 0; n < e.length; n += 1) {
        if (e[n] && t(e[n], n, e)) {
          break
        }
      }
    }
  }

  function eachReverse(e, t) {
    if (e) {
      var n;
      for (n = e.length - 1; n > -1; n -= 1) {
        if (e[n] && t(e[n], n, e)) {
          break
        }
      }
    }
  }

  function hasProp(e, t) {
    return hasOwn.call(e, t)
  }

  function getOwn(e, t) {
    return hasProp(e, t) && e[t]
  }

  function eachProp(e, t) {
    var n;
    for (n in e) {
      if (hasProp(e, n)) {
        if (t(e[n], n)) {
          break
        }
      }
    }
  }

  function mixin(e, t, n, r) {
    if (t) {
      eachProp(t, function (t, i) {
        if (n || !hasProp(e, i)) {
          if (r && typeof t !== "string") {
            if (!e[i]) {
              e[i] = {}
            }
            mixin(e[i], t, n, r)
          } else {
            e[i] = t
          }
        }
      })
    }
    return e
  }

  function bind(e, t) {
    return function () {
      return t.apply(e, arguments)
    }
  }

  function scripts() {
    return document.getElementsByTagName("script")
  }

  function getGlobal(e) {
    if (!e) {
      return e
    }
    var t = global;
    each(e.split("."), function (e) {
      t = t[e]
    });
    return t
  }

  function makeError(e, t, n, r) {
    var i = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
    i.requireType = e;
    i.requireModules = r;
    if (n) {
      i.originalError = n
    }
    return i
  }

  function newContext(e) {
    function v(e) {
      var t, n;
      for (t = 0; e[t]; t += 1) {
        n = e[t];
        if (n === ".") {
          e.splice(t, 1);
          t -= 1
        } else if (n === "..") {
          if (t === 1 && (e[2] === ".." || e[0] === "..")) {
            break
          } else if (t > 0) {
            e.splice(t - 1, 2);
            t -= 2
          }
        }
      }
    }

    function m(e, t, n) {
      var r, i, s, u, a, f, l, c, h, p, d, m = t && t.split("/"),
        g = m,
        y = o.map,
        b = y && y["*"];
      if (e && e.charAt(0) === ".") {
        if (t) {
          if (getOwn(o.pkgs, t)) {
            g = m = [t]
          } else {
            g = m.slice(0, m.length - 1)
          }
          e = g.concat(e.split("/"));
          v(e);
          i = getOwn(o.pkgs, r = e[0]);
          e = e.join("/");
          if (i && e === r + "/" + i.main) {
            e = r
          }
        } else if (e.indexOf("./") === 0) {
          e = e.substring(2)
        }
      }
      if (n && y && (m || b)) {
        u = e.split("/");
        for (a = u.length; a > 0; a -= 1) {
          l = u.slice(0, a).join("/");
          if (m) {
            for (f = m.length; f > 0; f -= 1) {
              s = getOwn(y, m.slice(0, f).join("/"));
              if (s) {
                s = getOwn(s, l);
                if (s) {
                  c = s;
                  h = a;
                  break
                }
              }
            }
          }
          if (c) {
            break
          }
          if (!p && b && getOwn(b, l)) {
            p = getOwn(b, l);
            d = a
          }
        }
        if (!c && p) {
          c = p;
          h = d
        }
        if (c) {
          u.splice(0, h, c);
          e = u.join("/")
        }
      }
      return e
    }

    function g(e) {
      if (isBrowser) {
        each(scripts(), function (t) {
          if (t.getAttribute("data-requiremodule") === e && t.getAttribute("data-requirecontext") === r.contextName) {
            t.parentNode.removeChild(t);
            return true
          }
        })
      }
    }

    function y(e) {
      var t = getOwn(o.paths, e);
      if (t && isArray(t) && t.length > 1) {
        g(e);
        t.shift();
        r.require.undef(e);
        r.require([e]);
        return true
      }
    }

    function b(e) {
      var t, n = e ? e.indexOf("!") : -1;
      if (n > -1) {
        t = e.substring(0, n);
        e = e.substring(n + 1, e.length)
      }
      return [t, e]
    }

    function w(e, t, n, i) {
      var s, o, u, a, f = null,
        l = t ? t.name : null,
        h = e,
        v = true,
        g = "";
      if (!e) {
        v = false;
        e = "_@r" + (p += 1)
      }
      a = b(e);
      f = a[0];
      e = a[1];
      if (f) {
        f = m(f, l, i);
        o = getOwn(c, f)
      }
      if (e) {
        if (f) {
          if (o && o.normalize) {
            g = o.normalize(e, function (e) {
              return m(e, l, i)
            })
          } else {
            g = m(e, l, i)
          }
        } else {
          g = m(e, l, i);
          a = b(g);
          f = a[0];
          g = a[1];
          n = true;
          s = r.nameToUrl(g)
        }
      }
      u = f && !o && !n ? "_unnormalized" + (d += 1) : "";
      return {
        prefix: f,
        name: g,
        parentMap: t,
        unnormalized: !! u,
        url: s,
        originalName: h,
        isDefine: v,
        id: (f ? f + "!" + g : g) + u
      }
    }

    function E(e) {
      var t = e.id,
        n = getOwn(u, t);
      if (!n) {
        n = u[t] = new r.Module(e)
      }
      return n
    }

    function S(e, t, n) {
      var r = e.id,
        i = getOwn(u, r);
      if (hasProp(c, r) && (!i || i.defineEmitComplete)) {
        if (t === "defined") {
          n(c[r])
        }
      } else {
        E(e).on(t, n)
      }
    }

    function x(e, t) {
      var n = e.requireModules,
        r = false;
      if (t) {
        t(e)
      } else {
        each(n, function (t) {
          var n = getOwn(u, t);
          if (n) {
            n.error = e;
            if (n.events.error) {
              r = true;
              n.emit("error", e)
            }
          }
        });
        if (!r) {
          req.onError(e)
        }
      }
    }

    function T() {
      if (globalDefQueue.length) {
        apsp.apply(l, [l.length - 1, 0].concat(globalDefQueue));
        globalDefQueue = []
      }
    }

    function N(e) {
      delete u[e];
      delete a[e]
    }

    function C(e, t, n) {
      var r = e.map.id;
      if (e.error) {
        e.emit("error", e.error)
      } else {
        t[r] = true;
        each(e.depMaps, function (r, i) {
          var s = r.id,
            o = getOwn(u, s);
          if (o && !e.depMatched[i] && !n[s]) {
            if (getOwn(t, s)) {
              e.defineDep(i, c[s]);
              e.check()
            } else {
              C(o, t, n)
            }
          }
        });
        n[r] = true
      }
    }

    function k() {
      var e, n, i, u, f = o.waitSeconds * 1e3,
        l = f && r.startTime + f < (new Date).getTime(),
        c = [],
        h = [],
        p = false,
        d = true;
      if (t) {
        return
      }
      t = true;
      eachProp(a, function (t) {
        e = t.map;
        n = e.id;
        if (!t.enabled) {
          return
        }
        if (!e.isDefine) {
          h.push(t)
        }
        if (!t.error) {
          if (!t.inited && l) {
            if (y(n)) {
              u = true;
              p = true
            } else {
              c.push(n);
              g(n)
            }
          } else if (!t.inited && t.fetched && e.isDefine) {
            p = true;
            if (!e.prefix) {
              return d = false
            }
          }
        }
      });
      if (l && c.length) {
        i = makeError("timeout", "Load timeout for modules: " + c, null, c);
        i.contextName = r.contextName;
        return x(i)
      }
      if (d) {
        each(h, function (e) {
          C(e, {}, {})
        })
      }
      if ((!l || u) && p) {
        if ((isBrowser || isWebWorker) && !s) {
          s = setTimeout(function () {
            s = 0;
            k()
          }, 50)
        }
      }
      t = false
    }

    function L(e) {
      if (!hasProp(c, e[0])) {
        E(w(e[0], null, true)).init(e[1], e[2])
      }
    }

    function A(e, t, n, r) {
      if (e.detachEvent && !isOpera) {
        if (r) {
          e.detachEvent(r, t)
        }
      } else {
        e.removeEventListener(n, t, false)
      }
    }

    function O(e) {
      var t = e.currentTarget || e.srcElement;
      A(t, r.onScriptLoad, "load", "onreadystatechange");
      A(t, r.onScriptError, "error");
      return {
        node: t,
        id: t && t.getAttribute("data-requiremodule")
      }
    }

    function M() {
      var e;
      T();
      while (l.length) {
        e = l.shift();
        if (e[0] === null) {
          return x(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]))
        } else {
          L(e)
        }
      }
    }
    var t, n, r, i, s, o = {
        waitSeconds: 7,
        baseUrl: "./",
        paths: {},
        pkgs: {},
        shim: {},
        config: {}
      }, u = {}, a = {}, f = {}, l = [],
      c = {}, h = {}, p = 1,
      d = 1;
    i = {
      require: function (e) {
        if (e.require) {
          return e.require
        } else {
          return e.require = r.makeRequire(e.map)
        }
      },
      exports: function (e) {
        e.usingExports = true;
        if (e.map.isDefine) {
          if (e.exports) {
            return e.exports
          } else {
            return e.exports = c[e.map.id] = {}
          }
        }
      },
      module: function (e) {
        if (e.module) {
          return e.module
        } else {
          return e.module = {
            id: e.map.id,
            uri: e.map.url,
            config: function () {
              return o.config && getOwn(o.config, e.map.id) || {}
            },
            exports: c[e.map.id]
          }
        }
      }
    };
    n = function (e) {
      this.events = getOwn(f, e.id) || {};
      this.map = e;
      this.shim = getOwn(o.shim, e.id);
      this.depExports = [];
      this.depMaps = [];
      this.depMatched = [];
      this.pluginMaps = {};
      this.depCount = 0
    };
    n.prototype = {
      init: function (e, t, n, r) {
        r = r || {};
        if (this.inited) {
          return
        }
        this.factory = t;
        if (n) {
          this.on("error", n)
        } else if (this.events.error) {
          n = bind(this, function (e) {
            this.emit("error", e)
          })
        }
        this.depMaps = e && e.slice(0);
        this.errback = n;
        this.inited = true;
        this.ignore = r.ignore;
        if (r.enabled || this.enabled) {
          this.enable()
        } else {
          this.check()
        }
      },
      defineDep: function (e, t) {
        if (!this.depMatched[e]) {
          this.depMatched[e] = true;
          this.depCount -= 1;
          this.depExports[e] = t
        }
      },
      fetch: function () {
        if (this.fetched) {
          return
        }
        this.fetched = true;
        r.startTime = (new Date).getTime();
        var e = this.map;
        if (this.shim) {
          r.makeRequire(this.map, {
            enableBuildCallback: true
          })(this.shim.deps || [], bind(this, function () {
            return e.prefix ? this.callPlugin() : this.load()
          }))
        } else {
          return e.prefix ? this.callPlugin() : this.load()
        }
      },
      load: function () {
        var e = this.map.url;
        if (!h[e]) {
          h[e] = true;
          r.load(this.map.id, e)
        }
      },
      check: function () {
        if (!this.enabled || this.enabling) {
          return
        }
        var e, t, n = this.map.id,
          i = this.depExports,
          s = this.exports,
          o = this.factory;
        if (!this.inited) {
          this.fetch()
        } else if (this.error) {
          this.emit("error", this.error)
        } else if (!this.defining) {
          this.defining = true;
          if (this.depCount < 1 && !this.defined) {
            if (isFunction(o)) {
              if (this.events.error) {
                try {
                  s = r.execCb(n, o, i, s)
                } catch (u) {
                  e = u
                }
              } else {
                s = r.execCb(n, o, i, s)
              } if (this.map.isDefine) {
                t = this.module;
                if (t && t.exports !== undefined && t.exports !== this.exports) {
                  s = t.exports
                } else if (s === undefined && this.usingExports) {
                  s = this.exports
                }
              }
              if (e) {
                e.requireMap = this.map;
                e.requireModules = [this.map.id];
                e.requireType = "define";
                return x(this.error = e)
              }
            } else {
              s = o
            }
            this.exports = s;
            if (this.map.isDefine && !this.ignore) {
              c[n] = s;
              if (req.onResourceLoad) {
                req.onResourceLoad(r, this.map, this.depMaps)
              }
            }
            N(n);
            this.defined = true
          }
          this.defining = false;
          if (this.defined && !this.defineEmitted) {
            this.defineEmitted = true;
            this.emit("defined", this.exports);
            this.defineEmitComplete = true
          }
        }
      },
      callPlugin: function () {
        var e = this.map,
          t = e.id,
          n = w(e.prefix);
        this.depMaps.push(n);
        S(n, "defined", bind(this, function (n) {
          var i, s, a, f = this.map.name,
            l = this.map.parentMap ? this.map.parentMap.name : null,
            c = r.makeRequire(e.parentMap, {
              enableBuildCallback: true
            });
          if (this.map.unnormalized) {
            if (n.normalize) {
              f = n.normalize(f, function (e) {
                return m(e, l, true)
              }) || ""
            }
            s = w(e.prefix + "!" + f, this.map.parentMap);
            S(s, "defined", bind(this, function (e) {
              this.init([], function () {
                return e
              }, null, {
                enabled: true,
                ignore: true
              })
            }));
            a = getOwn(u, s.id);
            if (a) {
              this.depMaps.push(s);
              if (this.events.error) {
                a.on("error", bind(this, function (e) {
                  this.emit("error", e)
                }))
              }
              a.enable()
            }
            return
          }
          i = bind(this, function (e) {
            this.init([], function () {
              return e
            }, null, {
              enabled: true
            })
          });
          i.error = bind(this, function (e) {
            this.inited = true;
            this.error = e;
            e.requireModules = [t];
            eachProp(u, function (e) {
              if (e.map.id.indexOf(t + "_unnormalized") === 0) {
                N(e.map.id)
              }
            });
            x(e)
          });
          i.fromText = bind(this, function (n, s) {
            var u = e.name,
              a = w(u),
              f = useInteractive;
            if (s) {
              n = s
            }
            if (f) {
              useInteractive = false
            }
            E(a);
            if (hasProp(o.config, t)) {
              o.config[u] = o.config[t]
            }
            try {
              req.exec(n)
            } catch (l) {
              return x(makeError("fromtexteval", "fromText eval for " + t + " failed: " + l, l, [t]))
            }
            if (f) {
              useInteractive = true
            }
            this.depMaps.push(a);
            r.completeLoad(u);
            c([u], i)
          });
          n.load(e.name, c, i, o)
        }));
        r.enable(n, this);
        this.pluginMaps[n.id] = n
      },
      enable: function () {
        a[this.map.id] = this;
        this.enabled = true;
        this.enabling = true;
        each(this.depMaps, bind(this, function (e, t) {
          var n, s, o;
          if (typeof e === "string") {
            e = w(e, this.map.isDefine ? this.map : this.map.parentMap, false, !this.skipMap);
            this.depMaps[t] = e;
            o = getOwn(i, e.id);
            if (o) {
              this.depExports[t] = o(this);
              return
            }
            this.depCount += 1;
            S(e, "defined", bind(this, function (e) {
              this.defineDep(t, e);
              this.check()
            }));
            if (this.errback) {
              S(e, "error", this.errback)
            }
          }
          n = e.id;
          s = u[n];
          if (!hasProp(i, n) && s && !s.enabled) {
            r.enable(e, this)
          }
        }));
        eachProp(this.pluginMaps, bind(this, function (e) {
          var t = getOwn(u, e.id);
          if (t && !t.enabled) {
            r.enable(e, this)
          }
        }));
        this.enabling = false;
        this.check()
      },
      on: function (e, t) {
        var n = this.events[e];
        if (!n) {
          n = this.events[e] = []
        }
        n.push(t)
      },
      emit: function (e, t) {
        each(this.events[e], function (e) {
          e(t)
        });
        if (e === "error") {
          delete this.events[e]
        }
      }
    };
    r = {
      config: o,
      contextName: e,
      registry: u,
      defined: c,
      urlFetched: h,
      defQueue: l,
      Module: n,
      makeModuleMap: w,
      nextTick: req.nextTick,
      onError: x,
      configure: function (e) {
        if (e.baseUrl) {
          if (e.baseUrl.charAt(e.baseUrl.length - 1) !== "/") {
            e.baseUrl += "/"
          }
        }
        var t = o.pkgs,
          n = o.shim,
          i = {
            paths: true,
            config: true,
            map: true
          };
        eachProp(e, function (e, t) {
          if (i[t]) {
            if (t === "map") {
              if (!o.map) {
                o.map = {}
              }
              mixin(o[t], e, true, true)
            } else {
              mixin(o[t], e, true)
            }
          } else {
            o[t] = e
          }
        });
        if (e.shim) {
          eachProp(e.shim, function (e, t) {
            if (isArray(e)) {
              e = {
                deps: e
              }
            }
            if ((e.exports || e.init) && !e.exportsFn) {
              e.exportsFn = r.makeShimExports(e)
            }
            n[t] = e
          });
          o.shim = n
        }
        if (e.packages) {
          each(e.packages, function (e) {
            var n;
            e = typeof e === "string" ? {
              name: e
            } : e;
            n = e.location;
            t[e.name] = {
              name: e.name,
              location: n || e.name,
              main: (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
            }
          });
          o.pkgs = t
        }
        eachProp(u, function (e, t) {
          if (!e.inited && !e.map.unnormalized) {
            e.map = w(t)
          }
        });
        if (e.deps || e.callback) {
          r.require(e.deps || [], e.callback)
        }
      },
      makeShimExports: function (e) {
        function t() {
          var t;
          if (e.init) {
            t = e.init.apply(global, arguments)
          }
          return t || e.exports && getGlobal(e.exports)
        }
        return t
      },
      makeRequire: function (t, n) {
        function s(o, a, f) {
          var l, h, p;
          if (n.enableBuildCallback && a && isFunction(a)) {
            a.__requireJsBuild = true
          }
          if (typeof o === "string") {
            if (isFunction(a)) {
              return x(makeError("requireargs", "Invalid require call"), f)
            }
            if (t && hasProp(i, o)) {
              return i[o](u[t.id])
            }
            if (req.get) {
              return req.get(r, o, t, s)
            }
            h = w(o, t, false, true);
            l = h.id;
            if (!hasProp(c, l)) {
              return x(makeError("notloaded", 'Module name "' + l + '" has not been loaded yet for context: ' + e + (t ? "" : ". Use require([])")))
            }
            return c[l]
          }
          M();
          r.nextTick(function () {
            M();
            p = E(w(null, t));
            p.skipMap = n.skipMap;
            p.init(o, a, f, {
              enabled: true
            });
            k()
          });
          return s
        }
        n = n || {};
        mixin(s, {
          isBrowser: isBrowser,
          toUrl: function (e) {
            var n, i = e.lastIndexOf("."),
              s = e.split("/")[0],
              o = s === "." || s === "..";
            if (i !== -1 && (!o || i > 1)) {
              n = e.substring(i, e.length);
              e = e.substring(0, i)
            }
            return r.nameToUrl(m(e, t && t.id, true), n, true)
          },
          defined: function (e) {
            return hasProp(c, w(e, t, false, true).id)
          },
          specified: function (e) {
            e = w(e, t, false, true).id;
            return hasProp(c, e) || hasProp(u, e)
          }
        });
        if (!t) {
          s.undef = function (e) {
            T();
            var n = w(e, t, true),
              r = getOwn(u, e);
            delete c[e];
            delete h[n.url];
            delete f[e];
            if (r) {
              if (r.events.defined) {
                f[e] = r.events
              }
              N(e)
            }
          }
        }
        return s
      },
      enable: function (e) {
        var t = getOwn(u, e.id);
        if (t) {
          E(e).enable()
        }
      },
      completeLoad: function (e) {
        var t, n, r, i = getOwn(o.shim, e) || {}, s = i.exports;
        T();
        while (l.length) {
          n = l.shift();
          if (n[0] === null) {
            n[0] = e;
            if (t) {
              break
            }
            t = true
          } else if (n[0] === e) {
            t = true
          }
          L(n)
        }
        r = getOwn(u, e);
        if (!t && !hasProp(c, e) && r && !r.inited) {
          if (o.enforceDefine && (!s || !getGlobal(s))) {
            if (y(e)) {
              return
            } else {
              return x(makeError("nodefine", "No define call for " + e, null, [e]))
            }
          } else {
            L([e, i.deps || [], i.exportsFn])
          }
        }
        k()
      },
      nameToUrl: function (e, t, n) {
        var r, i, s, u, a, f, l, c, h;
        if (req.jsExtRegExp.test(e)) {
          c = e + (t || "")
        } else {
          r = o.paths;
          i = o.pkgs;
          a = e.split("/");
          for (f = a.length; f > 0; f -= 1) {
            l = a.slice(0, f).join("/");
            s = getOwn(i, l);
            h = getOwn(r, l);
            if (h) {
              if (isArray(h)) {
                h = h[0]
              }
              a.splice(0, f, h);
              break
            } else if (s) {
              if (e === s.name) {
                u = s.location + "/" + s.main
              } else {
                u = s.location
              }
              a.splice(0, f, u);
              break
            }
          }
          c = a.join("/");
          c += t || (/\?/.test(c) || n ? "" : ".js");
          c = (c.charAt(0) === "/" || c.match(/^[\w\+\.\-]+:/) ? "" : o.baseUrl) + c
        }
        return o.urlArgs ? c + ((c.indexOf("?") === -1 ? "?" : "&") + o.urlArgs) : c
      },
      load: function (e, t) {
        req.load(r, e, t)
      },
      execCb: function (e, t, n, r) {
        return t.apply(r, n)
      },
      onScriptLoad: function (e) {
        if (e.type === "load" || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
          interactiveScript = null;
          var t = O(e);
          r.completeLoad(t.id)
        }
      },
      onScriptError: function (e) {
        var t = O(e);
        if (!y(t.id)) {
          return x(makeError("scripterror", "Script error", e, [t.id]))
        }
      }
    };
    r.require = r.makeRequire();
    return r
  }

  function getInteractiveScript() {
    if (interactiveScript && interactiveScript.readyState === "interactive") {
      return interactiveScript
    }
    eachReverse(scripts(), function (e) {
      if (e.readyState === "interactive") {
        return interactiveScript = e
      }
    });
    return interactiveScript
  }
  var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.5",
    commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
    cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
    jsSuffixRegExp = /\.js$/,
    currDirRegExp = /^\.\//,
    op = Object.prototype,
    ostring = op.toString,
    hasOwn = op.hasOwnProperty,
    ap = Array.prototype,
    apsp = ap.splice,
    isBrowser = !! (typeof window !== "undefined" && navigator && document),
    isWebWorker = !isBrowser && typeof importScripts !== "undefined",
    readyRegExp = isBrowser && navigator.platform === "PLAYSTATION 3" ? /^complete$/ : /^(complete|loaded)$/,
    defContextName = "_",
    isOpera = typeof opera !== "undefined" && opera.toString() === "[object Opera]",
    contexts = {}, cfg = {}, globalDefQueue = [],
    useInteractive = false;
  if (typeof define !== "undefined") {
    return
  }
  if (typeof requirejs !== "undefined") {
    if (isFunction(requirejs)) {
      return
    }
    cfg = requirejs;
    requirejs = undefined
  }
  if (typeof require !== "undefined" && !isFunction(require)) {
    cfg = require;
    require = undefined
  }
  req = requirejs = function (e, t, n, r) {
    var i, s, o = defContextName;
    if (!isArray(e) && typeof e !== "string") {
      s = e;
      if (isArray(t)) {
        e = t;
        t = n;
        n = r
      } else {
        e = []
      }
    }
    if (s && s.context) {
      o = s.context
    }
    i = getOwn(contexts, o);
    if (!i) {
      i = contexts[o] = req.s.newContext(o)
    }
    if (s) {
      i.configure(s)
    }
    return i.require(e, t, n)
  };
  req.config = function (e) {
    return req(e)
  };
  req.nextTick = typeof setTimeout !== "undefined" ? function (e) {
    setTimeout(e, 4)
  } : function (e) {
    e()
  };
  if (!require) {
    require = req
  }
  req.version = version;
  req.jsExtRegExp = /^\/|:|\?|\.js$/;
  req.isBrowser = isBrowser;
  s = req.s = {
    contexts: contexts,
    newContext: newContext
  };
  req({});
  each(["toUrl", "undef", "defined", "specified"], function (e) {
    req[e] = function () {
      var t = contexts[defContextName];
      return t.require[e].apply(t, arguments)
    }
  });
  if (isBrowser) {
    head = s.head = document.getElementsByTagName("head")[0];
    baseElement = document.getElementsByTagName("base")[0];
    if (baseElement) {
      head = s.head = baseElement.parentNode
    }
  }
  req.onError = function (e) {
    throw e
  };
  req.load = function (e, t, n) {
    var r = e && e.config || {}, i;
    if (isBrowser) {
      i = r.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
      i.type = r.scriptType || "text/javascript";
      i.charset = "utf-8";
      i.async = true;
      i.setAttribute("data-requirecontext", e.contextName);
      i.setAttribute("data-requiremodule", t);
      if (i.attachEvent && !(i.attachEvent.toString && i.attachEvent.toString().indexOf("[native code") < 0) && !isOpera) {
        useInteractive = true;
        i.attachEvent("onreadystatechange", e.onScriptLoad)
      } else {
        i.addEventListener("load", e.onScriptLoad, false);
        i.addEventListener("error", e.onScriptError, false)
      }
      i.src = n;
      currentlyAddingScript = i;
      if (baseElement) {
        head.insertBefore(i, baseElement)
      } else {
        head.appendChild(i)
      }
      currentlyAddingScript = null;
      return i
    } else if (isWebWorker) {
      try {
        importScripts(n);
        e.completeLoad(t)
      } catch (s) {
        e.onError(makeError("importscripts", "importScripts failed for " + t + " at " + n, s, [t]))
      }
    }
  };
  if (isBrowser) {
    eachReverse(scripts(), function (e) {
      if (!head) {
        head = e.parentNode
      }
      dataMain = e.getAttribute("data-main");
      if (dataMain) {
        if (!cfg.baseUrl) {
          src = dataMain.split("/");
          mainScript = src.pop();
          subPath = src.length ? src.join("/") + "/" : "./";
          cfg.baseUrl = subPath;
          dataMain = mainScript
        }
        dataMain = dataMain.replace(jsSuffixRegExp, "");
        cfg.deps = cfg.deps ? cfg.deps.concat(dataMain) : [dataMain];
        return true
      }
    })
  }
  define = function (e, t, n) {
    var r, i;
    if (typeof e !== "string") {
      n = t;
      t = e;
      e = null
    }
    if (!isArray(t)) {
      n = t;
      t = []
    }
    if (!t.length && isFunction(n)) {
      if (n.length) {
        n.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function (e, n) {
          t.push(n)
        });
        t = (n.length === 1 ? ["require"] : ["require", "exports", "module"]).concat(t)
      }
    }
    if (useInteractive) {
      r = currentlyAddingScript || getInteractiveScript();
      if (r) {
        if (!e) {
          e = r.getAttribute("data-requiremodule")
        }
        i = contexts[r.getAttribute("data-requirecontext")]
      }
    }(i ? i.defQueue : globalDefQueue).push([e, t, n])
  };
  define.amd = {
    jQuery: true
  };
  req.exec = function (text) {
    return eval(text)
  };
  req(cfg)
})(this);
(function (e, t) {
  function P(e) {
    var t = e.length,
      n = b.type(e);
    if (b.isWindow(e)) {
      return false
    }
    if (e.nodeType === 1 && t) {
      return true
    }
    return n === "array" || n !== "function" && (t === 0 || typeof t === "number" && t > 0 && t - 1 in e)
  }

  function B(e) {
    var t = H[e] = {};
    b.each(e.match(E) || [], function (e, n) {
      t[n] = true
    });
    return t
  }

  function I(e, n, r, i) {
    if (!b.acceptData(e)) {
      return
    }
    var s, o, u = b.expando,
      a = typeof n === "string",
      f = e.nodeType,
      c = f ? b.cache : e,
      h = f ? e[u] : e[u] && u;
    if ((!h || !c[h] || !i && !c[h].data) && a && r === t) {
      return
    }
    if (!h) {
      if (f) {
        e[u] = h = l.pop() || b.guid++
      } else {
        h = u
      }
    }
    if (!c[h]) {
      c[h] = {};
      if (!f) {
        c[h].toJSON = b.noop
      }
    }
    if (typeof n === "object" || typeof n === "function") {
      if (i) {
        c[h] = b.extend(c[h], n)
      } else {
        c[h].data = b.extend(c[h].data, n)
      }
    }
    s = c[h];
    if (!i) {
      if (!s.data) {
        s.data = {}
      }
      s = s.data
    }
    if (r !== t) {
      s[b.camelCase(n)] = r
    }
    if (a) {
      o = s[n];
      if (o == null) {
        o = s[b.camelCase(n)]
      }
    } else {
      o = s
    }
    return o
  }

  function q(e, t, n) {
    if (!b.acceptData(e)) {
      return
    }
    var r, i, s, o = e.nodeType,
      u = o ? b.cache : e,
      a = o ? e[b.expando] : b.expando;
    if (!u[a]) {
      return
    }
    if (t) {
      s = n ? u[a] : u[a].data;
      if (s) {
        if (!b.isArray(t)) {
          if (t in s) {
            t = [t]
          } else {
            t = b.camelCase(t);
            if (t in s) {
              t = [t]
            } else {
              t = t.split(" ")
            }
          }
        } else {
          t = t.concat(b.map(t, b.camelCase))
        }
        for (r = 0, i = t.length; r < i; r++) {
          delete s[t[r]]
        }
        if (!(n ? U : b.isEmptyObject)(s)) {
          return
        }
      }
    }
    if (!n) {
      delete u[a].data;
      if (!U(u[a])) {
        return
      }
    }
    if (o) {
      b.cleanData([e], true)
    } else if (b.support.deleteExpando || u != u.window) {
      delete u[a]
    } else {
      u[a] = null
    }
  }

  function R(e, n, r) {
    if (r === t && e.nodeType === 1) {
      var i = "data-" + n.replace(F, "-$1").toLowerCase();
      r = e.getAttribute(i);
      if (typeof r === "string") {
        try {
          r = r === "true" ? true : r === "false" ? false : r === "null" ? null : +r + "" === r ? +r : j.test(r) ? b.parseJSON(r) : r
        } catch (s) {}
        b.data(e, n, r)
      } else {
        r = t
      }
    }
    return r
  }

  function U(e) {
    var t;
    for (t in e) {
      if (t === "data" && b.isEmptyObject(e[t])) {
        continue
      }
      if (t !== "toJSON") {
        return false
      }
    }
    return true
  }

  function it() {
    return true
  }

  function st() {
    return false
  }

  function ct(e, t) {
    do {
      e = e[t]
    } while (e && e.nodeType !== 1);
    return e
  }

  function ht(e, t, n) {
    t = t || 0;
    if (b.isFunction(t)) {
      return b.grep(e, function (e, r) {
        var i = !! t.call(e, r, e);
        return i === n
      })
    } else if (t.nodeType) {
      return b.grep(e, function (e) {
        return e === t === n
      })
    } else if (typeof t === "string") {
      var r = b.grep(e, function (e) {
        return e.nodeType === 1
      });
      if (at.test(t)) {
        return b.filter(t, r, !n)
      } else {
        t = b.filter(t, r)
      }
    }
    return b.grep(e, function (e) {
      return b.inArray(e, t) >= 0 === n
    })
  }

  function pt(e) {
    var t = dt.split("|"),
      n = e.createDocumentFragment();
    if (n.createElement) {
      while (t.length) {
        n.createElement(t.pop())
      }
    }
    return n
  }

  function Mt(e, t) {
    return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t))
  }

  function _t(e) {
    var t = e.getAttributeNode("type");
    e.type = (t && t.specified) + "/" + e.type;
    return e
  }

  function Dt(e) {
    var t = Ct.exec(e.type);
    if (t) {
      e.type = t[1]
    } else {
      e.removeAttribute("type")
    }
    return e
  }

  function Pt(e, t) {
    var n, r = 0;
    for (;
      (n = e[r]) != null; r++) {
      b._data(n, "globalEval", !t || b._data(t[r], "globalEval"))
    }
  }

  function Ht(e, t) {
    if (t.nodeType !== 1 || !b.hasData(e)) {
      return
    }
    var n, r, i, s = b._data(e),
      o = b._data(t, s),
      u = s.events;
    if (u) {
      delete o.handle;
      o.events = {};
      for (n in u) {
        for (r = 0, i = u[n].length; r < i; r++) {
          b.event.add(t, n, u[n][r])
        }
      }
    }
    if (o.data) {
      o.data = b.extend({}, o.data)
    }
  }

  function Bt(e, t) {
    var n, r, i;
    if (t.nodeType !== 1) {
      return
    }
    n = t.nodeName.toLowerCase();
    if (!b.support.noCloneEvent && t[b.expando]) {
      i = b._data(t);
      for (r in i.events) {
        b.removeEvent(t, r, i.handle)
      }
      t.removeAttribute(b.expando)
    }
    if (n === "script" && t.text !== e.text) {
      _t(t).text = e.text;
      Dt(t)
    } else if (n === "object") {
      if (t.parentNode) {
        t.outerHTML = e.outerHTML
      }
      if (b.support.html5Clone && e.innerHTML && !b.trim(t.innerHTML)) {
        t.innerHTML = e.innerHTML
      }
    } else if (n === "input" && xt.test(e.type)) {
      t.defaultChecked = t.checked = e.checked;
      if (t.value !== e.value) {
        t.value = e.value
      }
    } else if (n === "option") {
      t.defaultSelected = t.selected = e.defaultSelected
    } else if (n === "input" || n === "textarea") {
      t.defaultValue = e.defaultValue
    }
  }

  function jt(e, n) {
    var r, s, o = 0,
      u = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
    if (!u) {
      for (u = [], r = e.childNodes || e;
        (s = r[o]) != null; o++) {
        if (!n || b.nodeName(s, n)) {
          u.push(s)
        } else {
          b.merge(u, jt(s, n))
        }
      }
    }
    return n === t || n && b.nodeName(e, n) ? b.merge([e], u) : u
  }

  function Ft(e) {
    if (xt.test(e.type)) {
      e.defaultChecked = e.checked
    }
  }

  function tn(e, t) {
    if (t in e) {
      return t
    }
    var n = t.charAt(0).toUpperCase() + t.slice(1),
      r = t,
      i = en.length;
    while (i--) {
      t = en[i] + n;
      if (t in e) {
        return t
      }
    }
    return r
  }

  function nn(e, t) {
    e = t || e;
    return b.css(e, "display") === "none" || !b.contains(e.ownerDocument, e)
  }

  function rn(e, t) {
    var n, r, i, s = [],
      o = 0,
      u = e.length;
    for (; o < u; o++) {
      r = e[o];
      if (!r.style) {
        continue
      }
      s[o] = b._data(r, "olddisplay");
      n = r.style.display;
      if (t) {
        if (!s[o] && n === "none") {
          r.style.display = ""
        }
        if (r.style.display === "" && nn(r)) {
          s[o] = b._data(r, "olddisplay", an(r.nodeName))
        }
      } else {
        if (!s[o]) {
          i = nn(r);
          if (n && n !== "none" || !i) {
            b._data(r, "olddisplay", i ? n : b.css(r, "display"))
          }
        }
      }
    }
    for (o = 0; o < u; o++) {
      r = e[o];
      if (!r.style) {
        continue
      }
      if (!t || r.style.display === "none" || r.style.display === "") {
        r.style.display = t ? s[o] || "" : "none"
      }
    }
    return e
  }

  function sn(e, t, n) {
    var r = $t.exec(t);
    return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
  }

  function on(e, t, n, r, i) {
    var s = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0,
      o = 0;
    for (; s < 4; s += 2) {
      if (n === "margin") {
        o += b.css(e, n + Zt[s], true, i)
      }
      if (r) {
        if (n === "content") {
          o -= b.css(e, "padding" + Zt[s], true, i)
        }
        if (n !== "margin") {
          o -= b.css(e, "border" + Zt[s] + "Width", true, i)
        }
      } else {
        o += b.css(e, "padding" + Zt[s], true, i);
        if (n !== "padding") {
          o += b.css(e, "border" + Zt[s] + "Width", true, i)
        }
      }
    }
    return o
  }

  function un(e, t, n) {
    var r = true,
      i = t === "width" ? e.offsetWidth : e.offsetHeight,
      s = qt(e),
      o = b.support.boxSizing && b.css(e, "boxSizing", false, s) === "border-box";
    if (i <= 0 || i == null) {
      i = Rt(e, t, s);
      if (i < 0 || i == null) {
        i = e.style[t]
      }
      if (Jt.test(i)) {
        return i
      }
      r = o && (b.support.boxSizingReliable || i === e.style[t]);
      i = parseFloat(i) || 0
    }
    return i + on(e, t, n || (o ? "border" : "content"), r, s) + "px"
  }

  function an(e) {
    var t = s,
      n = Qt[e];
    if (!n) {
      n = fn(e, t);
      if (n === "none" || !n) {
        It = (It || b("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement);
        t = (It[0].contentWindow || It[0].contentDocument).document;
        t.write("<!doctype html><html><body>");
        t.close();
        n = fn(e, t);
        It.detach()
      }
      Qt[e] = n
    }
    return n
  }

  function fn(e, t) {
    var n = b(t.createElement(e)).appendTo(t.body),
      r = b.css(n[0], "display");
    n.remove();
    return r
  }

  function vn(e, t, n, r) {
    var i;
    if (b.isArray(t)) {
      b.each(t, function (t, i) {
        if (n || cn.test(e)) {
          r(e, i)
        } else {
          vn(e + "[" + (typeof i === "object" ? t : "") + "]", i, n, r)
        }
      })
    } else if (!n && b.type(t) === "object") {
      for (i in t) {
        vn(e + "[" + i + "]", t[i], n, r)
      }
    } else {
      r(e, t)
    }
  }

  function _n(e) {
    return function (t, n) {
      if (typeof t !== "string") {
        n = t;
        t = "*"
      }
      var r, i = 0,
        s = t.toLowerCase().match(E) || [];
      if (b.isFunction(n)) {
        while (r = s[i++]) {
          if (r[0] === "+") {
            r = r.slice(1) || "*";
            (e[r] = e[r] || []).unshift(n)
          } else {
            (e[r] = e[r] || []).push(n)
          }
        }
      }
    }
  }

  function Dn(e, t, n, r) {
    function o(u) {
      var a;
      i[u] = true;
      b.each(e[u] || [], function (e, u) {
        var f = u(t, n, r);
        if (typeof f === "string" && !s && !i[f]) {
          t.dataTypes.unshift(f);
          o(f);
          return false
        } else if (s) {
          return !(a = f)
        }
      });
      return a
    }
    var i = {}, s = e === An;
    return o(t.dataTypes[0]) || !i["*"] && o("*")
  }

  function Pn(e, n) {
    var r, i, s = b.ajaxSettings.flatOptions || {};
    for (i in n) {
      if (n[i] !== t) {
        (s[i] ? e : r || (r = {}))[i] = n[i]
      }
    }
    if (r) {
      b.extend(true, e, r)
    }
    return e
  }

  function Hn(e, n, r) {
    var i, s, o, u, a = e.contents,
      f = e.dataTypes,
      l = e.responseFields;
    for (u in l) {
      if (u in r) {
        n[l[u]] = r[u]
      }
    }
    while (f[0] === "*") {
      f.shift();
      if (s === t) {
        s = e.mimeType || n.getResponseHeader("Content-Type")
      }
    }
    if (s) {
      for (u in a) {
        if (a[u] && a[u].test(s)) {
          f.unshift(u);
          break
        }
      }
    }
    if (f[0] in r) {
      o = f[0]
    } else {
      for (u in r) {
        if (!f[0] || e.converters[u + " " + f[0]]) {
          o = u;
          break
        }
        if (!i) {
          i = u
        }
      }
      o = o || i
    } if (o) {
      if (o !== f[0]) {
        f.unshift(o)
      }
      return r[o]
    }
  }

  function Bn(e, t) {
    var n, r, i, s, o = {}, u = 0,
      a = e.dataTypes.slice(),
      f = a[0];
    if (e.dataFilter) {
      t = e.dataFilter(t, e.dataType)
    }
    if (a[1]) {
      for (i in e.converters) {
        o[i.toLowerCase()] = e.converters[i]
      }
    }
    for (; r = a[++u];) {
      if (r !== "*") {
        if (f !== "*" && f !== r) {
          i = o[f + " " + r] || o["* " + r];
          if (!i) {
            for (n in o) {
              s = n.split(" ");
              if (s[1] === r) {
                i = o[f + " " + s[0]] || o["* " + s[0]];
                if (i) {
                  if (i === true) {
                    i = o[n]
                  } else if (o[n] !== true) {
                    r = s[0];
                    a.splice(u--, 0, r)
                  }
                  break
                }
              }
            }
          }
          if (i !== true) {
            if (i && e["throws"]) {
              t = i(t)
            } else {
              try {
                t = i(t)
              } catch (l) {
                return {
                  state: "parsererror",
                  error: i ? l : "No conversion from " + f + " to " + r
                }
              }
            }
          }
        }
        f = r
      }
    }
    return {
      state: "success",
      data: t
    }
  }

  function zn() {
    try {
      return new e.XMLHttpRequest
    } catch (t) {}
  }

  function Wn() {
    try {
      return new e.ActiveXObject("Microsoft.XMLHTTP")
    } catch (t) {}
  }

  function Yn() {
    setTimeout(function () {
      Xn = t
    });
    return Xn = b.now()
  }

  function Zn(e, t) {
    b.each(t, function (t, n) {
      var r = (Gn[t] || []).concat(Gn["*"]),
        i = 0,
        s = r.length;
      for (; i < s; i++) {
        if (r[i].call(e, t, n)) {
          return
        }
      }
    })
  }

  function er(e, t, n) {
    var r, i, s = 0,
      o = Qn.length,
      u = b.Deferred().always(function () {
        delete a.elem
      }),
      a = function () {
        if (i) {
          return false
        }
        var t = Xn || Yn(),
          n = Math.max(0, f.startTime + f.duration - t),
          r = n / f.duration || 0,
          s = 1 - r,
          o = 0,
          a = f.tweens.length;
        for (; o < a; o++) {
          f.tweens[o].run(s)
        }
        u.notifyWith(e, [f, s, n]);
        if (s < 1 && a) {
          return n
        } else {
          u.resolveWith(e, [f]);
          return false
        }
      }, f = u.promise({
        elem: e,
        props: b.extend({}, t),
        opts: b.extend(true, {
          specialEasing: {}
        }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: Xn || Yn(),
        duration: n.duration,
        tweens: [],
        createTween: function (t, n) {
          var r = b.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
          f.tweens.push(r);
          return r
        },
        stop: function (t) {
          var n = 0,
            r = t ? f.tweens.length : 0;
          if (i) {
            return this
          }
          i = true;
          for (; n < r; n++) {
            f.tweens[n].run(1)
          }
          if (t) {
            u.resolveWith(e, [f, t])
          } else {
            u.rejectWith(e, [f, t])
          }
          return this
        }
      }),
      l = f.props;
    tr(l, f.opts.specialEasing);
    for (; s < o; s++) {
      r = Qn[s].call(f, e, l, f.opts);
      if (r) {
        return r
      }
    }
    Zn(f, l);
    if (b.isFunction(f.opts.start)) {
      f.opts.start.call(e, f)
    }
    b.fx.timer(b.extend(a, {
      elem: e,
      anim: f,
      queue: f.opts.queue
    }));
    return f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
  }

  function tr(e, t) {
    var n, r, i, s, o;
    for (i in e) {
      r = b.camelCase(i);
      s = t[r];
      n = e[i];
      if (b.isArray(n)) {
        s = n[1];
        n = e[i] = n[0]
      }
      if (i !== r) {
        e[r] = n;
        delete e[i]
      }
      o = b.cssHooks[r];
      if (o && "expand" in o) {
        n = o.expand(n);
        delete e[r];
        for (i in n) {
          if (!(i in e)) {
            e[i] = n[i];
            t[i] = s
          }
        }
      } else {
        t[r] = s
      }
    }
  }

  function nr(e, t, n) {
    var r, i, s, o, u, a, f, l, c, h = this,
      p = e.style,
      d = {}, v = [],
      m = e.nodeType && nn(e);
    if (!n.queue) {
      l = b._queueHooks(e, "fx");
      if (l.unqueued == null) {
        l.unqueued = 0;
        c = l.empty.fire;
        l.empty.fire = function () {
          if (!l.unqueued) {
            c()
          }
        }
      }
      l.unqueued++;
      h.always(function () {
        h.always(function () {
          l.unqueued--;
          if (!b.queue(e, "fx").length) {
            l.empty.fire()
          }
        })
      })
    }
    if (e.nodeType === 1 && ("height" in t || "width" in t)) {
      n.overflow = [p.overflow, p.overflowX, p.overflowY];
      if (b.css(e, "display") === "inline" && b.css(e, "float") === "none") {
        if (!b.support.inlineBlockNeedsLayout || an(e.nodeName) === "inline") {
          p.display = "inline-block"
        } else {
          p.zoom = 1
        }
      }
    }
    if (n.overflow) {
      p.overflow = "hidden";
      if (!b.support.shrinkWrapBlocks) {
        h.always(function () {
          p.overflow = n.overflow[0];
          p.overflowX = n.overflow[1];
          p.overflowY = n.overflow[2]
        })
      }
    }
    for (i in t) {
      o = t[i];
      if ($n.exec(o)) {
        delete t[i];
        a = a || o === "toggle";
        if (o === (m ? "hide" : "show")) {
          continue
        }
        v.push(i)
      }
    }
    s = v.length;
    if (s) {
      u = b._data(e, "fxshow") || b._data(e, "fxshow", {});
      if ("hidden" in u) {
        m = u.hidden
      }
      if (a) {
        u.hidden = !m
      }
      if (m) {
        b(e).show()
      } else {
        h.done(function () {
          b(e).hide()
        })
      }
      h.done(function () {
        var t;
        b._removeData(e, "fxshow");
        for (t in d) {
          b.style(e, t, d[t])
        }
      });
      for (i = 0; i < s; i++) {
        r = v[i];
        f = h.createTween(r, m ? u[r] : 0);
        d[r] = u[r] || b.style(e, r);
        if (!(r in u)) {
          u[r] = f.start;
          if (m) {
            f.end = f.start;
            f.start = r === "width" || r === "height" ? 1 : 0
          }
        }
      }
    }
  }

  function rr(e, t, n, r, i) {
    return new rr.prototype.init(e, t, n, r, i)
  }

  function ir(e, t) {
    var n, r = {
        height: e
      }, i = 0;
    t = t ? 1 : 0;
    for (; i < 4; i += 2 - t) {
      n = Zt[i];
      r["margin" + n] = r["padding" + n] = e
    }
    if (t) {
      r.opacity = r.width = e
    }
    return r
  }

  function sr(e) {
    return b.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : false
  }
  var n, r, i = typeof t,
    s = e.document,
    o = e.location,
    u = e.jQuery,
    a = e.$,
    f = {}, l = [],
    c = "1.9.1",
    h = l.concat,
    p = l.push,
    d = l.slice,
    v = l.indexOf,
    m = f.toString,
    g = f.hasOwnProperty,
    y = c.trim,
    b = function (e, t) {
      return new b.fn.init(e, t, r)
    }, w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    E = /\S+/g,
    S = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    x = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    T = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    N = /^[\],:{}\s]*$/,
    C = /(?:^|:|,)(?:\s*\[)+/g,
    k = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    L = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
    A = /^-ms-/,
    O = /-([\da-z])/gi,
    M = function (e, t) {
      return t.toUpperCase()
    }, _ = function (e) {
      if (s.addEventListener || e.type === "load" || s.readyState === "complete") {
        D();
        b.ready()
      }
    }, D = function () {
      if (s.addEventListener) {
        s.removeEventListener("DOMContentLoaded", _, false);
        e.removeEventListener("load", _, false)
      } else {
        s.detachEvent("onreadystatechange", _);
        e.detachEvent("onload", _)
      }
    };
  b.fn = b.prototype = {
    jquery: c,
    constructor: b,
    init: function (e, n, r) {
      var i, o;
      if (!e) {
        return this
      }
      if (typeof e === "string") {
        if (e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3) {
          i = [null, e, null]
        } else {
          i = x.exec(e)
        } if (i && (i[1] || !n)) {
          if (i[1]) {
            n = n instanceof b ? n[0] : n;
            b.merge(this, b.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : s, true));
            if (T.test(i[1]) && b.isPlainObject(n)) {
              for (i in n) {
                if (b.isFunction(this[i])) {
                  this[i](n[i])
                } else {
                  this.attr(i, n[i])
                }
              }
            }
            return this
          } else {
            o = s.getElementById(i[2]);
            if (o && o.parentNode) {
              if (o.id !== i[2]) {
                return r.find(e)
              }
              this.length = 1;
              this[0] = o
            }
            this.context = s;
            this.selector = e;
            return this
          }
        } else if (!n || n.jquery) {
          return (n || r).find(e)
        } else {
          return this.constructor(n).find(e)
        }
      } else if (e.nodeType) {
        this.context = this[0] = e;
        this.length = 1;
        return this
      } else if (b.isFunction(e)) {
        return r.ready(e)
      }
      if (e.selector !== t) {
        this.selector = e.selector;
        this.context = e.context
      }
      return b.makeArray(e, this)
    },
    selector: "",
    length: 0,
    size: function () {
      return this.length
    },
    toArray: function () {
      return d.call(this)
    },
    get: function (e) {
      return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
    },
    pushStack: function (e) {
      var t = b.merge(this.constructor(), e);
      t.prevObject = this;
      t.context = this.context;
      return t
    },
    each: function (e, t) {
      return b.each(this, e, t)
    },
    ready: function (e) {
      b.ready.promise().done(e);
      return this
    },
    slice: function () {
      return this.pushStack(d.apply(this, arguments))
    },
    first: function () {
      return this.eq(0)
    },
    last: function () {
      return this.eq(-1)
    },
    eq: function (e) {
      var t = this.length,
        n = +e + (e < 0 ? t : 0);
      return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
    },
    map: function (e) {
      return this.pushStack(b.map(this, function (t, n) {
        return e.call(t, n, t)
      }))
    },
    end: function () {
      return this.prevObject || this.constructor(null)
    },
    push: p,
    sort: [].sort,
    splice: [].splice
  };
  b.fn.init.prototype = b.fn;
  b.extend = b.fn.extend = function () {
    var e, n, r, i, s, o, u = arguments[0] || {}, a = 1,
      f = arguments.length,
      l = false;
    if (typeof u === "boolean") {
      l = u;
      u = arguments[1] || {};
      a = 2
    }
    if (typeof u !== "object" && !b.isFunction(u)) {
      u = {}
    }
    if (f === a) {
      u = this;
      --a
    }
    for (; a < f; a++) {
      if ((s = arguments[a]) != null) {
        for (i in s) {
          e = u[i];
          r = s[i];
          if (u === r) {
            continue
          }
          if (l && r && (b.isPlainObject(r) || (n = b.isArray(r)))) {
            if (n) {
              n = false;
              o = e && b.isArray(e) ? e : []
            } else {
              o = e && b.isPlainObject(e) ? e : {}
            }
            u[i] = b.extend(l, o, r)
          } else if (r !== t) {
            u[i] = r
          }
        }
      }
    }
    return u
  };
  b.extend({
    noConflict: function (t) {
      if (e.$ === b) {
        e.$ = a
      }
      if (t && e.jQuery === b) {
        e.jQuery = u
      }
      return b
    },
    isReady: false,
    readyWait: 1,
    holdReady: function (e) {
      if (e) {
        b.readyWait++
      } else {
        b.ready(true)
      }
    },
    ready: function (e) {
      if (e === true ? --b.readyWait : b.isReady) {
        return
      }
      if (!s.body) {
        return setTimeout(b.ready)
      }
      b.isReady = true;
      if (e !== true && --b.readyWait > 0) {
        return
      }
      n.resolveWith(s, [b]);
      if (b.fn.trigger) {
        b(s).trigger("ready").off("ready")
      }
    },
    isFunction: function (e) {
      return b.type(e) === "function"
    },
    isArray: Array.isArray || function (e) {
      return b.type(e) === "array"
    },
    isWindow: function (e) {
      return e != null && e == e.window
    },
    isNumeric: function (e) {
      return !isNaN(parseFloat(e)) && isFinite(e)
    },
    type: function (e) {
      if (e == null) {
        return String(e)
      }
      return typeof e === "object" || typeof e === "function" ? f[m.call(e)] || "object" : typeof e
    },
    isPlainObject: function (e) {
      if (!e || b.type(e) !== "object" || e.nodeType || b.isWindow(e)) {
        return false
      }
      try {
        if (e.constructor && !g.call(e, "constructor") && !g.call(e.constructor.prototype, "isPrototypeOf")) {
          return false
        }
      } catch (n) {
        return false
      }
      var r;
      for (r in e) {}
      return r === t || g.call(e, r)
    },
    isEmptyObject: function (e) {
      var t;
      for (t in e) {
        return false
      }
      return true
    },
    error: function (e) {
      throw new Error(e)
    },
    parseHTML: function (e, t, n) {
      if (!e || typeof e !== "string") {
        return null
      }
      if (typeof t === "boolean") {
        n = t;
        t = false
      }
      t = t || s;
      var r = T.exec(e),
        i = !n && [];
      if (r) {
        return [t.createElement(r[1])]
      }
      r = b.buildFragment([e], t, i);
      if (i) {
        b(i).remove()
      }
      return b.merge([], r.childNodes)
    },
    parseJSON: function (t) {
      if (e.JSON && e.JSON.parse) {
        return e.JSON.parse(t)
      }
      if (t === null) {
        return t
      }
      if (typeof t === "string") {
        t = b.trim(t);
        if (t) {
          if (N.test(t.replace(k, "@").replace(L, "]").replace(C, ""))) {
            return (new Function("return " + t))()
          }
        }
      }
      b.error("Invalid JSON: " + t)
    },
    parseXML: function (n) {
      var r, i;
      if (!n || typeof n !== "string") {
        return null
      }
      try {
        if (e.DOMParser) {
          i = new DOMParser;
          r = i.parseFromString(n, "text/xml")
        } else {
          r = new ActiveXObject("Microsoft.XMLDOM");
          r.async = "false";
          r.loadXML(n)
        }
      } catch (s) {
        r = t
      }
      if (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) {
        b.error("Invalid XML: " + n)
      }
      return r
    },
    noop: function () {},
    globalEval: function (t) {
      if (t && b.trim(t)) {
        (e.execScript || function (t) {
          e["eval"].call(e, t)
        })(t)
      }
    },
    camelCase: function (e) {
      return e.replace(A, "ms-").replace(O, M)
    },
    nodeName: function (e, t) {
      return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    },
    each: function (e, t, n) {
      var r, i = 0,
        s = e.length,
        o = P(e);
      if (n) {
        if (o) {
          for (; i < s; i++) {
            r = t.apply(e[i], n);
            if (r === false) {
              break
            }
          }
        } else {
          for (i in e) {
            r = t.apply(e[i], n);
            if (r === false) {
              break
            }
          }
        }
      } else {
        if (o) {
          for (; i < s; i++) {
            r = t.call(e[i], i, e[i]);
            if (r === false) {
              break
            }
          }
        } else {
          for (i in e) {
            r = t.call(e[i], i, e[i]);
            if (r === false) {
              break
            }
          }
        }
      }
      return e
    },
    trim: y && !y.call("﻿ ") ? function (e) {
      return e == null ? "" : y.call(e)
    } : function (e) {
      return e == null ? "" : (e + "").replace(S, "")
    },
    makeArray: function (e, t) {
      var n = t || [];
      if (e != null) {
        if (P(Object(e))) {
          b.merge(n, typeof e === "string" ? [e] : e)
        } else {
          p.call(n, e)
        }
      }
      return n
    },
    inArray: function (e, t, n) {
      var r;
      if (t) {
        if (v) {
          return v.call(t, e, n)
        }
        r = t.length;
        n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
        for (; n < r; n++) {
          if (n in t && t[n] === e) {
            return n
          }
        }
      }
      return -1
    },
    merge: function (e, n) {
      var r = n.length,
        i = e.length,
        s = 0;
      if (typeof r === "number") {
        for (; s < r; s++) {
          e[i++] = n[s]
        }
      } else {
        while (n[s] !== t) {
          e[i++] = n[s++]
        }
      }
      e.length = i;
      return e
    },
    grep: function (e, t, n) {
      var r, i = [],
        s = 0,
        o = e.length;
      n = !! n;
      for (; s < o; s++) {
        r = !! t(e[s], s);
        if (n !== r) {
          i.push(e[s])
        }
      }
      return i
    },
    map: function (e, t, n) {
      var r, i = 0,
        s = e.length,
        o = P(e),
        u = [];
      if (o) {
        for (; i < s; i++) {
          r = t(e[i], i, n);
          if (r != null) {
            u[u.length] = r
          }
        }
      } else {
        for (i in e) {
          r = t(e[i], i, n);
          if (r != null) {
            u[u.length] = r
          }
        }
      }
      return h.apply([], u)
    },
    guid: 1,
    proxy: function (e, n) {
      var r, i, s;
      if (typeof n === "string") {
        s = e[n];
        n = e;
        e = s
      }
      if (!b.isFunction(e)) {
        return t
      }
      r = d.call(arguments, 2);
      i = function () {
        return e.apply(n || this, r.concat(d.call(arguments)))
      };
      i.guid = e.guid = e.guid || b.guid++;
      return i
    },
    access: function (e, n, r, i, s, o, u) {
      var a = 0,
        f = e.length,
        l = r == null;
      if (b.type(r) === "object") {
        s = true;
        for (a in r) {
          b.access(e, n, a, r[a], true, o, u)
        }
      } else if (i !== t) {
        s = true;
        if (!b.isFunction(i)) {
          u = true
        }
        if (l) {
          if (u) {
            n.call(e, i);
            n = null
          } else {
            l = n;
            n = function (e, t, n) {
              return l.call(b(e), n)
            }
          }
        }
        if (n) {
          for (; a < f; a++) {
            n(e[a], r, u ? i : i.call(e[a], a, n(e[a], r)))
          }
        }
      }
      return s ? e : l ? n.call(e) : f ? n(e[0], r) : o
    },
    now: function () {
      return (new Date).getTime()
    }
  });
  b.ready.promise = function (t) {
    if (!n) {
      n = b.Deferred();
      if (s.readyState === "complete") {
        setTimeout(b.ready)
      } else if (s.addEventListener) {
        s.addEventListener("DOMContentLoaded", _, false);
        e.addEventListener("load", _, false)
      } else {
        s.attachEvent("onreadystatechange", _);
        e.attachEvent("onload", _);
        var r = false;
        try {
          r = e.frameElement == null && s.documentElement
        } catch (i) {}
        if (r && r.doScroll) {
          (function o() {
            if (!b.isReady) {
              try {
                r.doScroll("left")
              } catch (e) {
                return setTimeout(o, 50)
              }
              D();
              b.ready()
            }
          })()
        }
      }
    }
    return n.promise(t)
  };
  b.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
    f["[object " + t + "]"] = t.toLowerCase()
  });
  r = b(s);
  var H = {};
  b.Callbacks = function (e) {
    e = typeof e === "string" ? H[e] || B(e) : b.extend({}, e);
    var n, r, i, s, o, u, a = [],
      f = !e.once && [],
      l = function (t) {
        r = e.memory && t;
        i = true;
        o = u || 0;
        u = 0;
        s = a.length;
        n = true;
        for (; a && o < s; o++) {
          if (a[o].apply(t[0], t[1]) === false && e.stopOnFalse) {
            r = false;
            break
          }
        }
        n = false;
        if (a) {
          if (f) {
            if (f.length) {
              l(f.shift())
            }
          } else if (r) {
            a = []
          } else {
            c.disable()
          }
        }
      }, c = {
        add: function () {
          if (a) {
            var t = a.length;
            (function i(t) {
              b.each(t, function (t, n) {
                var r = b.type(n);
                if (r === "function") {
                  if (!e.unique || !c.has(n)) {
                    a.push(n)
                  }
                } else if (n && n.length && r !== "string") {
                  i(n)
                }
              })
            })(arguments);
            if (n) {
              s = a.length
            } else if (r) {
              u = t;
              l(r)
            }
          }
          return this
        },
        remove: function () {
          if (a) {
            b.each(arguments, function (e, t) {
              var r;
              while ((r = b.inArray(t, a, r)) > -1) {
                a.splice(r, 1);
                if (n) {
                  if (r <= s) {
                    s--
                  }
                  if (r <= o) {
                    o--
                  }
                }
              }
            })
          }
          return this
        },
        has: function (e) {
          return e ? b.inArray(e, a) > -1 : !! (a && a.length)
        },
        empty: function () {
          a = [];
          return this
        },
        disable: function () {
          a = f = r = t;
          return this
        },
        disabled: function () {
          return !a
        },
        lock: function () {
          f = t;
          if (!r) {
            c.disable()
          }
          return this
        },
        locked: function () {
          return !f
        },
        fireWith: function (e, t) {
          t = t || [];
          t = [e, t.slice ? t.slice() : t];
          if (a && (!i || f)) {
            if (n) {
              f.push(t)
            } else {
              l(t)
            }
          }
          return this
        },
        fire: function () {
          c.fireWith(this, arguments);
          return this
        },
        fired: function () {
          return !!i
        }
      };
    return c
  };
  b.extend({
    Deferred: function (e) {
      var t = [
        ["resolve", "done", b.Callbacks("once memory"), "resolved"],
        ["reject", "fail", b.Callbacks("once memory"), "rejected"],
        ["notify", "progress", b.Callbacks("memory")]
      ],
        n = "pending",
        r = {
          state: function () {
            return n
          },
          always: function () {
            i.done(arguments).fail(arguments);
            return this
          },
          then: function () {
            var e = arguments;
            return b.Deferred(function (n) {
              b.each(t, function (t, s) {
                var o = s[0],
                  u = b.isFunction(e[t]) && e[t];
                i[s[1]](function () {
                  var e = u && u.apply(this, arguments);
                  if (e && b.isFunction(e.promise)) {
                    e.promise().done(n.resolve).fail(n.reject).progress(n.notify)
                  } else {
                    n[o + "With"](this === r ? n.promise() : this, u ? [e] : arguments)
                  }
                })
              });
              e = null
            }).promise()
          },
          promise: function (e) {
            return e != null ? b.extend(e, r) : r
          }
        }, i = {};
      r.pipe = r.then;
      b.each(t, function (e, s) {
        var o = s[2],
          u = s[3];
        r[s[1]] = o.add;
        if (u) {
          o.add(function () {
            n = u
          }, t[e ^ 1][2].disable, t[2][2].lock)
        }
        i[s[0]] = function () {
          i[s[0] + "With"](this === i ? r : this, arguments);
          return this
        };
        i[s[0] + "With"] = o.fireWith
      });
      r.promise(i);
      if (e) {
        e.call(i, i)
      }
      return i
    },
    when: function (e) {
      var t = 0,
        n = d.call(arguments),
        r = n.length,
        i = r !== 1 || e && b.isFunction(e.promise) ? r : 0,
        s = i === 1 ? e : b.Deferred(),
        o = function (e, t, n) {
          return function (r) {
            t[e] = this;
            n[e] = arguments.length > 1 ? d.call(arguments) : r;
            if (n === u) {
              s.notifyWith(t, n)
            } else if (!--i) {
              s.resolveWith(t, n)
            }
          }
        }, u, a, f;
      if (r > 1) {
        u = new Array(r);
        a = new Array(r);
        f = new Array(r);
        for (; t < r; t++) {
          if (n[t] && b.isFunction(n[t].promise)) {
            n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u))
          } else {
            --i
          }
        }
      }
      if (!i) {
        s.resolveWith(f, n)
      }
      return s.promise()
    }
  });
  b.support = function () {
    var t, n, r, o, u, a, f, l, c, h, p = s.createElement("div");
    p.setAttribute("className", "t");
    p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    n = p.getElementsByTagName("*");
    r = p.getElementsByTagName("a")[0];
    if (!n || !r || !n.length) {
      return {}
    }
    u = s.createElement("select");
    f = u.appendChild(s.createElement("option"));
    o = p.getElementsByTagName("input")[0];
    r.style.cssText = "top:1px;float:left;opacity:.5";
    t = {
      getSetAttribute: p.className !== "t",
      leadingWhitespace: p.firstChild.nodeType === 3,
      tbody: !p.getElementsByTagName("tbody").length,
      htmlSerialize: !! p.getElementsByTagName("link").length,
      style: /top/.test(r.getAttribute("style")),
      hrefNormalized: r.getAttribute("href") === "/a",
      opacity: /^0.5/.test(r.style.opacity),
      cssFloat: !! r.style.cssFloat,
      checkOn: !! o.value,
      optSelected: f.selected,
      enctype: !! s.createElement("form").enctype,
      html5Clone: s.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",
      boxModel: s.compatMode === "CSS1Compat",
      deleteExpando: true,
      noCloneEvent: true,
      inlineBlockNeedsLayout: false,
      shrinkWrapBlocks: false,
      reliableMarginRight: true,
      boxSizingReliable: true,
      pixelPosition: false
    };
    o.checked = true;
    t.noCloneChecked = o.cloneNode(true).checked;
    u.disabled = true;
    t.optDisabled = !f.disabled;
    try {
      delete p.test
    } catch (d) {
      t.deleteExpando = false
    }
    o = s.createElement("input");
    o.setAttribute("value", "");
    t.input = o.getAttribute("value") === "";
    o.value = "t";
    o.setAttribute("type", "radio");
    t.radioValue = o.value === "t";
    o.setAttribute("checked", "t");
    o.setAttribute("name", "t");
    a = s.createDocumentFragment();
    a.appendChild(o);
    t.appendChecked = o.checked;
    t.checkClone = a.cloneNode(true).cloneNode(true).lastChild.checked;
    if (p.attachEvent) {
      p.attachEvent("onclick", function () {
        t.noCloneEvent = false
      });
      p.cloneNode(true).click()
    }
    for (h in {
      submit: true,
      change: true,
      focusin: true
    }) {
      p.setAttribute(l = "on" + h, "t");
      t[h + "Bubbles"] = l in e || p.attributes[l].expando === false
    }
    p.style.backgroundClip = "content-box";
    p.cloneNode(true).style.backgroundClip = "";
    t.clearCloneStyle = p.style.backgroundClip === "content-box";
    b(function () {
      var n, r, o, u = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
        a = s.getElementsByTagName("body")[0];
      if (!a) {
        return
      }
      n = s.createElement("div");
      n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
      a.appendChild(n).appendChild(p);
      p.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
      o = p.getElementsByTagName("td");
      o[0].style.cssText = "padding:0;margin:0;border:0;display:none";
      c = o[0].offsetHeight === 0;
      o[0].style.display = "";
      o[1].style.display = "none";
      t.reliableHiddenOffsets = c && o[0].offsetHeight === 0;
      p.innerHTML = "";
      p.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
      t.boxSizing = p.offsetWidth === 4;
      t.doesNotIncludeMarginInBodyOffset = a.offsetTop !== 1;
      if (e.getComputedStyle) {
        t.pixelPosition = (e.getComputedStyle(p, null) || {}).top !== "1%";
        t.boxSizingReliable = (e.getComputedStyle(p, null) || {
          width: "4px"
        }).width === "4px";
        r = p.appendChild(s.createElement("div"));
        r.style.cssText = p.style.cssText = u;
        r.style.marginRight = r.style.width = "0";
        p.style.width = "1px";
        t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)
      }
      if (typeof p.style.zoom !== i) {
        p.innerHTML = "";
        p.style.cssText = u + "width:1px;padding:1px;display:inline;zoom:1";
        t.inlineBlockNeedsLayout = p.offsetWidth === 3;
        p.style.display = "block";
        p.innerHTML = "<div></div>";
        p.firstChild.style.width = "5px";
        t.shrinkWrapBlocks = p.offsetWidth !== 3;
        if (t.inlineBlockNeedsLayout) {
          a.style.zoom = 1
        }
      }
      a.removeChild(n);
      n = p = o = r = null
    });
    n = u = a = f = r = o = null;
    return t
  }();
  var j = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    F = /([A-Z])/g;
  b.extend({
    cache: {},
    expando: "jQuery" + (c + Math.random()).replace(/\D/g, ""),
    noData: {
      embed: true,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      applet: true
    },
    hasData: function (e) {
      e = e.nodeType ? b.cache[e[b.expando]] : e[b.expando];
      return !!e && !U(e)
    },
    data: function (e, t, n) {
      return I(e, t, n)
    },
    removeData: function (e, t) {
      return q(e, t)
    },
    _data: function (e, t, n) {
      return I(e, t, n, true)
    },
    _removeData: function (e, t) {
      return q(e, t, true)
    },
    acceptData: function (e) {
      if (e.nodeType && e.nodeType !== 1 && e.nodeType !== 9) {
        return false
      }
      var t = e.nodeName && b.noData[e.nodeName.toLowerCase()];
      return !t || t !== true && e.getAttribute("classid") === t
    }
  });
  b.fn.extend({
    data: function (e, n) {
      var r, i, s = this[0],
        o = 0,
        u = null;
      if (e === t) {
        if (this.length) {
          u = b.data(s);
          if (s.nodeType === 1 && !b._data(s, "parsedAttrs")) {
            r = s.attributes;
            for (; o < r.length; o++) {
              i = r[o].name;
              if (!i.indexOf("data-")) {
                i = b.camelCase(i.slice(5));
                R(s, i, u[i])
              }
            }
            b._data(s, "parsedAttrs", true)
          }
        }
        return u
      }
      if (typeof e === "object") {
        return this.each(function () {
          b.data(this, e)
        })
      }
      return b.access(this, function (n) {
        if (n === t) {
          return s ? R(s, e, b.data(s, e)) : null
        }
        this.each(function () {
          b.data(this, e, n)
        })
      }, null, n, arguments.length > 1, null, true)
    },
    removeData: function (e) {
      return this.each(function () {
        b.removeData(this, e)
      })
    }
  });
  b.extend({
    queue: function (e, t, n) {
      var r;
      if (e) {
        t = (t || "fx") + "queue";
        r = b._data(e, t);
        if (n) {
          if (!r || b.isArray(n)) {
            r = b._data(e, t, b.makeArray(n))
          } else {
            r.push(n)
          }
        }
        return r || []
      }
    },
    dequeue: function (e, t) {
      t = t || "fx";
      var n = b.queue(e, t),
        r = n.length,
        i = n.shift(),
        s = b._queueHooks(e, t),
        o = function () {
          b.dequeue(e, t)
        };
      if (i === "inprogress") {
        i = n.shift();
        r--
      }
      s.cur = i;
      if (i) {
        if (t === "fx") {
          n.unshift("inprogress")
        }
        delete s.stop;
        i.call(e, o, s)
      }
      if (!r && s) {
        s.empty.fire()
      }
    },
    _queueHooks: function (e, t) {
      var n = t + "queueHooks";
      return b._data(e, n) || b._data(e, n, {
        empty: b.Callbacks("once memory").add(function () {
          b._removeData(e, t + "queue");
          b._removeData(e, n)
        })
      })
    }
  });
  b.fn.extend({
    queue: function (e, n) {
      var r = 2;
      if (typeof e !== "string") {
        n = e;
        e = "fx";
        r--
      }
      if (arguments.length < r) {
        return b.queue(this[0], e)
      }
      return n === t ? this : this.each(function () {
        var t = b.queue(this, e, n);
        b._queueHooks(this, e);
        if (e === "fx" && t[0] !== "inprogress") {
          b.dequeue(this, e)
        }
      })
    },
    dequeue: function (e) {
      return this.each(function () {
        b.dequeue(this, e)
      })
    },
    delay: function (e, t) {
      e = b.fx ? b.fx.speeds[e] || e : e;
      t = t || "fx";
      return this.queue(t, function (t, n) {
        var r = setTimeout(t, e);
        n.stop = function () {
          clearTimeout(r)
        }
      })
    },
    clearQueue: function (e) {
      return this.queue(e || "fx", [])
    },
    promise: function (e, n) {
      var r, i = 1,
        s = b.Deferred(),
        o = this,
        u = this.length,
        a = function () {
          if (!--i) {
            s.resolveWith(o, [o])
          }
        };
      if (typeof e !== "string") {
        n = e;
        e = t
      }
      e = e || "fx";
      while (u--) {
        r = b._data(o[u], e + "queueHooks");
        if (r && r.empty) {
          i++;
          r.empty.add(a)
        }
      }
      a();
      return s.promise(n)
    }
  });
  var z, W, X = /[\t\r\n]/g,
    V = /\r/g,
    $ = /^(?:input|select|textarea|button|object)$/i,
    J = /^(?:a|area)$/i,
    K = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
    Q = /^(?:checked|selected)$/i,
    G = b.support.getSetAttribute,
    Y = b.support.input;
  b.fn.extend({
    attr: function (e, t) {
      return b.access(this, b.attr, e, t, arguments.length > 1)
    },
    removeAttr: function (e) {
      return this.each(function () {
        b.removeAttr(this, e)
      })
    },
    prop: function (e, t) {
      return b.access(this, b.prop, e, t, arguments.length > 1)
    },
    removeProp: function (e) {
      e = b.propFix[e] || e;
      return this.each(function () {
        try {
          this[e] = t;
          delete this[e]
        } catch (n) {}
      })
    },
    addClass: function (e) {
      var t, n, r, i, s, o = 0,
        u = this.length,
        a = typeof e === "string" && e;
      if (b.isFunction(e)) {
        return this.each(function (t) {
          b(this).addClass(e.call(this, t, this.className))
        })
      }
      if (a) {
        t = (e || "").match(E) || [];
        for (; o < u; o++) {
          n = this[o];
          r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(X, " ") : " ");
          if (r) {
            s = 0;
            while (i = t[s++]) {
              if (r.indexOf(" " + i + " ") < 0) {
                r += i + " "
              }
            }
            n.className = b.trim(r)
          }
        }
      }
      return this
    },
    removeClass: function (e) {
      var t, n, r, i, s, o = 0,
        u = this.length,
        a = arguments.length === 0 || typeof e === "string" && e;
      if (b.isFunction(e)) {
        return this.each(function (t) {
          b(this).removeClass(e.call(this, t, this.className))
        })
      }
      if (a) {
        t = (e || "").match(E) || [];
        for (; o < u; o++) {
          n = this[o];
          r = n.nodeType === 1 && (n.className ? (" " + n.className + " ").replace(X, " ") : "");
          if (r) {
            s = 0;
            while (i = t[s++]) {
              while (r.indexOf(" " + i + " ") >= 0) {
                r = r.replace(" " + i + " ", " ")
              }
            }
            n.className = e ? b.trim(r) : ""
          }
        }
      }
      return this
    },
    toggleClass: function (e, t) {
      var n = typeof e,
        r = typeof t === "boolean";
      if (b.isFunction(e)) {
        return this.each(function (n) {
          b(this).toggleClass(e.call(this, n, this.className, t), t)
        })
      }
      return this.each(function () {
        if (n === "string") {
          var s, o = 0,
            u = b(this),
            a = t,
            f = e.match(E) || [];
          while (s = f[o++]) {
            a = r ? a : !u.hasClass(s);
            u[a ? "addClass" : "removeClass"](s)
          }
        } else if (n === i || n === "boolean") {
          if (this.className) {
            b._data(this, "__className__", this.className)
          }
          this.className = this.className || e === false ? "" : b._data(this, "__className__") || ""
        }
      })
    },
    hasClass: function (e) {
      var t = " " + e + " ",
        n = 0,
        r = this.length;
      for (; n < r; n++) {
        if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(X, " ").indexOf(t) >= 0) {
          return true
        }
      }
      return false
    },
    val: function (e) {
      var n, r, i, s = this[0];
      if (!arguments.length) {
        if (s) {
          r = b.valHooks[s.type] || b.valHooks[s.nodeName.toLowerCase()];
          if (r && "get" in r && (n = r.get(s, "value")) !== t) {
            return n
          }
          n = s.value;
          return typeof n === "string" ? n.replace(V, "") : n == null ? "" : n
        }
        return
      }
      i = b.isFunction(e);
      return this.each(function (n) {
        var s, o = b(this);
        if (this.nodeType !== 1) {
          return
        }
        if (i) {
          s = e.call(this, n, o.val())
        } else {
          s = e
        } if (s == null) {
          s = ""
        } else if (typeof s === "number") {
          s += ""
        } else if (b.isArray(s)) {
          s = b.map(s, function (e) {
            return e == null ? "" : e + ""
          })
        }
        r = b.valHooks[this.type] || b.valHooks[this.nodeName.toLowerCase()];
        if (!r || !("set" in r) || r.set(this, s, "value") === t) {
          this.value = s
        }
      })
    }
  });
  b.extend({
    valHooks: {
      option: {
        get: function (e) {
          var t = e.attributes.value;
          return !t || t.specified ? e.value : e.text
        }
      },
      select: {
        get: function (e) {
          var t, n, r = e.options,
            i = e.selectedIndex,
            s = e.type === "select-one" || i < 0,
            o = s ? null : [],
            u = s ? i + 1 : r.length,
            a = i < 0 ? u : s ? i : 0;
          for (; a < u; a++) {
            n = r[a];
            if ((n.selected || a === i) && (b.support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !b.nodeName(n.parentNode, "optgroup"))) {
              t = b(n).val();
              if (s) {
                return t
              }
              o.push(t)
            }
          }
          return o
        },
        set: function (e, t) {
          var n = b.makeArray(t);
          b(e).find("option").each(function () {
            this.selected = b.inArray(b(this).val(), n) >= 0
          });
          if (!n.length) {
            e.selectedIndex = -1
          }
          return n
        }
      }
    },
    attr: function (e, n, r) {
      var s, o, u, a = e.nodeType;
      if (!e || a === 3 || a === 8 || a === 2) {
        return
      }
      if (typeof e.getAttribute === i) {
        return b.prop(e, n, r)
      }
      o = a !== 1 || !b.isXMLDoc(e);
      if (o) {
        n = n.toLowerCase();
        s = b.attrHooks[n] || (K.test(n) ? W : z)
      }
      if (r !== t) {
        if (r === null) {
          b.removeAttr(e, n)
        } else if (s && o && "set" in s && (u = s.set(e, r, n)) !== t) {
          return u
        } else {
          e.setAttribute(n, r + "");
          return r
        }
      } else if (s && o && "get" in s && (u = s.get(e, n)) !== null) {
        return u
      } else {
        if (typeof e.getAttribute !== i) {
          u = e.getAttribute(n)
        }
        return u == null ? t : u
      }
    },
    removeAttr: function (e, t) {
      var n, r, i = 0,
        s = t && t.match(E);
      if (s && e.nodeType === 1) {
        while (n = s[i++]) {
          r = b.propFix[n] || n;
          if (K.test(n)) {
            if (!G && Q.test(n)) {
              e[b.camelCase("default-" + n)] = e[r] = false
            } else {
              e[r] = false
            }
          } else {
            b.attr(e, n, "")
          }
          e.removeAttribute(G ? n : r)
        }
      }
    },
    attrHooks: {
      type: {
        set: function (e, t) {
          if (!b.support.radioValue && t === "radio" && b.nodeName(e, "input")) {
            var n = e.value;
            e.setAttribute("type", t);
            if (n) {
              e.value = n
            }
            return t
          }
        }
      }
    },
    propFix: {
      tabindex: "tabIndex",
      readonly: "readOnly",
      "for": "htmlFor",
      "class": "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
    },
    prop: function (e, n, r) {
      var i, s, o, u = e.nodeType;
      if (!e || u === 3 || u === 8 || u === 2) {
        return
      }
      o = u !== 1 || !b.isXMLDoc(e);
      if (o) {
        n = b.propFix[n] || n;
        s = b.propHooks[n]
      }
      if (r !== t) {
        if (s && "set" in s && (i = s.set(e, r, n)) !== t) {
          return i
        } else {
          return e[n] = r
        }
      } else {
        if (s && "get" in s && (i = s.get(e, n)) !== null) {
          return i
        } else {
          return e[n]
        }
      }
    },
    propHooks: {
      tabIndex: {
        get: function (e) {
          var n = e.getAttributeNode("tabindex");
          return n && n.specified ? parseInt(n.value, 10) : $.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : t
        }
      }
    }
  });
  W = {
    get: function (e, n) {
      var r = b.prop(e, n),
        i = typeof r === "boolean" && e.getAttribute(n),
        s = typeof r === "boolean" ? Y && G ? i != null : Q.test(n) ? e[b.camelCase("default-" + n)] : !! i : e.getAttributeNode(n);
      return s && s.value !== false ? n.toLowerCase() : t
    },
    set: function (e, t, n) {
      if (t === false) {
        b.removeAttr(e, n)
      } else if (Y && G || !Q.test(n)) {
        e.setAttribute(!G && b.propFix[n] || n, n)
      } else {
        e[b.camelCase("default-" + n)] = e[n] = true
      }
      return n
    }
  };
  if (!Y || !G) {
    b.attrHooks.value = {
      get: function (e, n) {
        var r = e.getAttributeNode(n);
        return b.nodeName(e, "input") ? e.defaultValue : r && r.specified ? r.value : t
      },
      set: function (e, t, n) {
        if (b.nodeName(e, "input")) {
          e.defaultValue = t
        } else {
          return z && z.set(e, t, n)
        }
      }
    }
  }
  if (!G) {
    z = b.valHooks.button = {
      get: function (e, n) {
        var r = e.getAttributeNode(n);
        return r && (n === "id" || n === "name" || n === "coords" ? r.value !== "" : r.specified) ? r.value : t
      },
      set: function (e, n, r) {
        var i = e.getAttributeNode(r);
        if (!i) {
          e.setAttributeNode(i = e.ownerDocument.createAttribute(r))
        }
        i.value = n += "";
        return r === "value" || n === e.getAttribute(r) ? n : t
      }
    };
    b.attrHooks.contenteditable = {
      get: z.get,
      set: function (e, t, n) {
        z.set(e, t === "" ? false : t, n)
      }
    };
    b.each(["width", "height"], function (e, t) {
      b.attrHooks[t] = b.extend(b.attrHooks[t], {
        set: function (e, n) {
          if (n === "") {
            e.setAttribute(t, "auto");
            return n
          }
        }
      })
    })
  }
  if (!b.support.hrefNormalized) {
    b.each(["href", "src", "width", "height"], function (e, n) {
      b.attrHooks[n] = b.extend(b.attrHooks[n], {
        get: function (e) {
          var r = e.getAttribute(n, 2);
          return r == null ? t : r
        }
      })
    });
    b.each(["href", "src"], function (e, t) {
      b.propHooks[t] = {
        get: function (e) {
          return e.getAttribute(t, 4)
        }
      }
    })
  }
  if (!b.support.style) {
    b.attrHooks.style = {
      get: function (e) {
        return e.style.cssText || t
      },
      set: function (e, t) {
        return e.style.cssText = t + ""
      }
    }
  }
  if (!b.support.optSelected) {
    b.propHooks.selected = b.extend(b.propHooks.selected, {
      get: function (e) {
        var t = e.parentNode;
        if (t) {
          t.selectedIndex;
          if (t.parentNode) {
            t.parentNode.selectedIndex
          }
        }
        return null
      }
    })
  }
  if (!b.support.enctype) {
    b.propFix.enctype = "encoding"
  }
  if (!b.support.checkOn) {
    b.each(["radio", "checkbox"], function () {
      b.valHooks[this] = {
        get: function (e) {
          return e.getAttribute("value") === null ? "on" : e.value
        }
      }
    })
  }
  b.each(["radio", "checkbox"], function () {
    b.valHooks[this] = b.extend(b.valHooks[this], {
      set: function (e, t) {
        if (b.isArray(t)) {
          return e.checked = b.inArray(b(e).val(), t) >= 0
        }
      }
    })
  });
  var Z = /^(?:input|select|textarea)$/i,
    et = /^key/,
    tt = /^(?:mouse|contextmenu)|click/,
    nt = /^(?:focusinfocus|focusoutblur)$/,
    rt = /^([^.]*)(?:\.(.+)|)$/;
  b.event = {
    global: {},
    add: function (e, n, r, s, o) {
      var u, a, f, l, c, h, p, d, v, m, g, y = b._data(e);
      if (!y) {
        return
      }
      if (r.handler) {
        l = r;
        r = l.handler;
        o = l.selector
      }
      if (!r.guid) {
        r.guid = b.guid++
      }
      if (!(a = y.events)) {
        a = y.events = {}
      }
      if (!(h = y.handle)) {
        h = y.handle = function (e) {
          return typeof b !== i && (!e || b.event.triggered !== e.type) ? b.event.dispatch.apply(h.elem, arguments) : t
        };
        h.elem = e
      }
      n = (n || "").match(E) || [""];
      f = n.length;
      while (f--) {
        u = rt.exec(n[f]) || [];
        v = g = u[1];
        m = (u[2] || "").split(".").sort();
        c = b.event.special[v] || {};
        v = (o ? c.delegateType : c.bindType) || v;
        c = b.event.special[v] || {};
        p = b.extend({
          type: v,
          origType: g,
          data: s,
          handler: r,
          guid: r.guid,
          selector: o,
          needsContext: o && b.expr.match.needsContext.test(o),
          namespace: m.join(".")
        }, l);
        if (!(d = a[v])) {
          d = a[v] = [];
          d.delegateCount = 0;
          if (!c.setup || c.setup.call(e, s, m, h) === false) {
            if (e.addEventListener) {
              e.addEventListener(v, h, false)
            } else if (e.attachEvent) {
              e.attachEvent("on" + v, h)
            }
          }
        }
        if (c.add) {
          c.add.call(e, p);
          if (!p.handler.guid) {
            p.handler.guid = r.guid
          }
        }
        if (o) {
          d.splice(d.delegateCount++, 0, p)
        } else {
          d.push(p)
        }
        b.event.global[v] = true
      }
      e = null
    },
    remove: function (e, t, n, r, i) {
      var s, o, u, a, f, l, c, h, p, d, v, m = b.hasData(e) && b._data(e);
      if (!m || !(l = m.events)) {
        return
      }
      t = (t || "").match(E) || [""];
      f = t.length;
      while (f--) {
        u = rt.exec(t[f]) || [];
        p = v = u[1];
        d = (u[2] || "").split(".").sort();
        if (!p) {
          for (p in l) {
            b.event.remove(e, p + t[f], n, r, true)
          }
          continue
        }
        c = b.event.special[p] || {};
        p = (r ? c.delegateType : c.bindType) || p;
        h = l[p] || [];
        u = u[2] && new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)");
        a = s = h.length;
        while (s--) {
          o = h[s];
          if ((i || v === o.origType) && (!n || n.guid === o.guid) && (!u || u.test(o.namespace)) && (!r || r === o.selector || r === "**" && o.selector)) {
            h.splice(s, 1);
            if (o.selector) {
              h.delegateCount--
            }
            if (c.remove) {
              c.remove.call(e, o)
            }
          }
        }
        if (a && !h.length) {
          if (!c.teardown || c.teardown.call(e, d, m.handle) === false) {
            b.removeEvent(e, p, m.handle)
          }
          delete l[p]
        }
      }
      if (b.isEmptyObject(l)) {
        delete m.handle;
        b._removeData(e, "events")
      }
    },
    trigger: function (n, r, i, o) {
      var u, a, f, l, c, h, p, d = [i || s],
        v = g.call(n, "type") ? n.type : n,
        m = g.call(n, "namespace") ? n.namespace.split(".") : [];
      f = h = i = i || s;
      if (i.nodeType === 3 || i.nodeType === 8) {
        return
      }
      if (nt.test(v + b.event.triggered)) {
        return
      }
      if (v.indexOf(".") >= 0) {
        m = v.split(".");
        v = m.shift();
        m.sort()
      }
      a = v.indexOf(":") < 0 && "on" + v;
      n = n[b.expando] ? n : new b.Event(v, typeof n === "object" && n);
      n.isTrigger = true;
      n.namespace = m.join(".");
      n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
      n.result = t;
      if (!n.target) {
        n.target = i
      }
      r = r == null ? [n] : b.makeArray(r, [n]);
      c = b.event.special[v] || {};
      if (!o && c.trigger && c.trigger.apply(i, r) === false) {
        return
      }
      if (!o && !c.noBubble && !b.isWindow(i)) {
        l = c.delegateType || v;
        if (!nt.test(l + v)) {
          f = f.parentNode
        }
        for (; f; f = f.parentNode) {
          d.push(f);
          h = f
        }
        if (h === (i.ownerDocument || s)) {
          d.push(h.defaultView || h.parentWindow || e)
        }
      }
      p = 0;
      while ((f = d[p++]) && !n.isPropagationStopped()) {
        n.type = p > 1 ? l : c.bindType || v;
        u = (b._data(f, "events") || {})[n.type] && b._data(f, "handle");
        if (u) {
          u.apply(f, r)
        }
        u = a && f[a];
        if (u && b.acceptData(f) && u.apply && u.apply(f, r) === false) {
          n.preventDefault()
        }
      }
      n.type = v;
      if (!o && !n.isDefaultPrevented()) {
        if ((!c._default || c._default.apply(i.ownerDocument, r) === false) && !(v === "click" && b.nodeName(i, "a")) && b.acceptData(i)) {
          if (a && i[v] && !b.isWindow(i)) {
            h = i[a];
            if (h) {
              i[a] = null
            }
            b.event.triggered = v;
            try {
              i[v]()
            } catch (y) {}
            b.event.triggered = t;
            if (h) {
              i[a] = h
            }
          }
        }
      }
      return n.result
    },
    dispatch: function (e) {
      e = b.event.fix(e);
      var n, r, i, s, o, u = [],
        a = d.call(arguments),
        f = (b._data(this, "events") || {})[e.type] || [],
        l = b.event.special[e.type] || {};
      a[0] = e;
      e.delegateTarget = this;
      if (l.preDispatch && l.preDispatch.call(this, e) === false) {
        return
      }
      u = b.event.handlers.call(this, e, f);
      n = 0;
      while ((s = u[n++]) && !e.isPropagationStopped()) {
        e.currentTarget = s.elem;
        o = 0;
        while ((i = s.handlers[o++]) && !e.isImmediatePropagationStopped()) {
          if (!e.namespace_re || e.namespace_re.test(i.namespace)) {
            e.handleObj = i;
            e.data = i.data;
            r = ((b.event.special[i.origType] || {}).handle || i.handler).apply(s.elem, a);
            if (r !== t) {
              if ((e.result = r) === false) {
                e.preventDefault();
                e.stopPropagation()
              }
            }
          }
        }
      }
      if (l.postDispatch) {
        l.postDispatch.call(this, e)
      }
      return e.result
    },
    handlers: function (e, n) {
      var r, i, s, o, u = [],
        a = n.delegateCount,
        f = e.target;
      if (a && f.nodeType && (!e.button || e.type !== "click")) {
        for (; f != this; f = f.parentNode || this) {
          if (f.nodeType === 1 && (f.disabled !== true || e.type !== "click")) {
            s = [];
            for (o = 0; o < a; o++) {
              i = n[o];
              r = i.selector + " ";
              if (s[r] === t) {
                s[r] = i.needsContext ? b(r, this).index(f) >= 0 : b.find(r, this, null, [f]).length
              }
              if (s[r]) {
                s.push(i)
              }
            }
            if (s.length) {
              u.push({
                elem: f,
                handlers: s
              })
            }
          }
        }
      }
      if (a < n.length) {
        u.push({
          elem: this,
          handlers: n.slice(a)
        })
      }
      return u
    },
    fix: function (e) {
      if (e[b.expando]) {
        return e
      }
      var t, n, r, i = e.type,
        o = e,
        u = this.fixHooks[i];
      if (!u) {
        this.fixHooks[i] = u = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}
      }
      r = u.props ? this.props.concat(u.props) : this.props;
      e = new b.Event(o);
      t = r.length;
      while (t--) {
        n = r[t];
        e[n] = o[n]
      }
      if (!e.target) {
        e.target = o.srcElement || s
      }
      if (e.target.nodeType === 3) {
        e.target = e.target.parentNode
      }
      e.metaKey = !! e.metaKey;
      return u.filter ? u.filter(e, o) : e
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (e, t) {
        if (e.which == null) {
          e.which = t.charCode != null ? t.charCode : t.keyCode
        }
        return e
      }
    },
    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function (e, n) {
        var r, i, o, u = n.button,
          a = n.fromElement;
        if (e.pageX == null && n.clientX != null) {
          i = e.target.ownerDocument || s;
          o = i.documentElement;
          r = i.body;
          e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0);
          e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)
        }
        if (!e.relatedTarget && a) {
          e.relatedTarget = a === e.target ? n.toElement : a
        }
        if (!e.which && u !== t) {
          e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0
        }
        return e
      }
    },
    special: {
      load: {
        noBubble: true
      },
      click: {
        trigger: function () {
          if (b.nodeName(this, "input") && this.type === "checkbox" && this.click) {
            this.click();
            return false
          }
        }
      },
      focus: {
        trigger: function () {
          if (this !== s.activeElement && this.focus) {
            try {
              this.focus();
              return false
            } catch (e) {}
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function () {
          if (this === s.activeElement && this.blur) {
            this.blur();
            return false
          }
        },
        delegateType: "focusout"
      },
      beforeunload: {
        postDispatch: function (e) {
          if (e.result !== t) {
            e.originalEvent.returnValue = e.result
          }
        }
      }
    },
    simulate: function (e, t, n, r) {
      var i = b.extend(new b.Event, n, {
        type: e,
        isSimulated: true,
        originalEvent: {}
      });
      if (r) {
        b.event.trigger(i, null, t)
      } else {
        b.event.dispatch.call(t, i)
      } if (i.isDefaultPrevented()) {
        n.preventDefault()
      }
    }
  };
  b.removeEvent = s.removeEventListener ? function (e, t, n) {
    if (e.removeEventListener) {
      e.removeEventListener(t, n, false)
    }
  } : function (e, t, n) {
    var r = "on" + t;
    if (e.detachEvent) {
      if (typeof e[r] === i) {
        e[r] = null
      }
      e.detachEvent(r, n)
    }
  };
  b.Event = function (e, t) {
    if (!(this instanceof b.Event)) {
      return new b.Event(e, t)
    }
    if (e && e.type) {
      this.originalEvent = e;
      this.type = e.type;
      this.isDefaultPrevented = e.defaultPrevented || e.returnValue === false || e.getPreventDefault && e.getPreventDefault() ? it : st
    } else {
      this.type = e
    } if (t) {
      b.extend(this, t)
    }
    this.timeStamp = e && e.timeStamp || b.now();
    this[b.expando] = true
  };
  b.Event.prototype = {
    isDefaultPrevented: st,
    isPropagationStopped: st,
    isImmediatePropagationStopped: st,
    preventDefault: function () {
      var e = this.originalEvent;
      this.isDefaultPrevented = it;
      if (!e) {
        return
      }
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
    },
    stopPropagation: function () {
      var e = this.originalEvent;
      this.isPropagationStopped = it;
      if (!e) {
        return
      }
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      e.cancelBubble = true
    },
    stopImmediatePropagation: function () {
      this.isImmediatePropagationStopped = it;
      this.stopPropagation()
    }
  };
  b.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function (e, t) {
    b.event.special[e] = {
      delegateType: t,
      bindType: t,
      handle: function (e) {
        var n, r = this,
          i = e.relatedTarget,
          s = e.handleObj;
        if (!i || i !== r && !b.contains(r, i)) {
          e.type = s.origType;
          n = s.handler.apply(this, arguments);
          e.type = t
        }
        return n
      }
    }
  });
  if (!b.support.submitBubbles) {
    b.event.special.submit = {
      setup: function () {
        if (b.nodeName(this, "form")) {
          return false
        }
        b.event.add(this, "click._submit keypress._submit", function (e) {
          var n = e.target,
            r = b.nodeName(n, "input") || b.nodeName(n, "button") ? n.form : t;
          if (r && !b._data(r, "submitBubbles")) {
            b.event.add(r, "submit._submit", function (e) {
              e._submit_bubble = true
            });
            b._data(r, "submitBubbles", true)
          }
        })
      },
      postDispatch: function (e) {
        if (e._submit_bubble) {
          delete e._submit_bubble;
          if (this.parentNode && !e.isTrigger) {
            b.event.simulate("submit", this.parentNode, e, true)
          }
        }
      },
      teardown: function () {
        if (b.nodeName(this, "form")) {
          return false
        }
        b.event.remove(this, "._submit")
      }
    }
  }
  if (!b.support.changeBubbles) {
    b.event.special.change = {
      setup: function () {
        if (Z.test(this.nodeName)) {
          if (this.type === "checkbox" || this.type === "radio") {
            b.event.add(this, "propertychange._change", function (e) {
              if (e.originalEvent.propertyName === "checked") {
                this._just_changed = true
              }
            });
            b.event.add(this, "click._change", function (e) {
              if (this._just_changed && !e.isTrigger) {
                this._just_changed = false
              }
              b.event.simulate("change", this, e, true)
            })
          }
          return false
        }
        b.event.add(this, "beforeactivate._change", function (e) {
          var t = e.target;
          if (Z.test(t.nodeName) && !b._data(t, "changeBubbles")) {
            b.event.add(t, "change._change", function (e) {
              if (this.parentNode && !e.isSimulated && !e.isTrigger) {
                b.event.simulate("change", this.parentNode, e, true)
              }
            });
            b._data(t, "changeBubbles", true)
          }
        })
      },
      handle: function (e) {
        var t = e.target;
        if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox") {
          return e.handleObj.handler.apply(this, arguments)
        }
      },
      teardown: function () {
        b.event.remove(this, "._change");
        return !Z.test(this.nodeName)
      }
    }
  }
  if (!b.support.focusinBubbles) {
    b.each({
      focus: "focusin",
      blur: "focusout"
    }, function (e, t) {
      var n = 0,
        r = function (e) {
          b.event.simulate(t, e.target, b.event.fix(e), true)
        };
      b.event.special[t] = {
        setup: function () {
          if (n++ === 0) {
            s.addEventListener(e, r, true)
          }
        },
        teardown: function () {
          if (--n === 0) {
            s.removeEventListener(e, r, true)
          }
        }
      }
    })
  }
  b.fn.extend({
    on: function (e, n, r, i, s) {
      var o, u;
      if (typeof e === "object") {
        if (typeof n !== "string") {
          r = r || n;
          n = t
        }
        for (o in e) {
          this.on(o, n, r, e[o], s)
        }
        return this
      }
      if (r == null && i == null) {
        i = n;
        r = n = t
      } else if (i == null) {
        if (typeof n === "string") {
          i = r;
          r = t
        } else {
          i = r;
          r = n;
          n = t
        }
      }
      if (i === false) {
        i = st
      } else if (!i) {
        return this
      }
      if (s === 1) {
        u = i;
        i = function (e) {
          b().off(e);
          return u.apply(this, arguments)
        };
        i.guid = u.guid || (u.guid = b.guid++)
      }
      return this.each(function () {
        b.event.add(this, e, i, r, n)
      })
    },
    one: function (e, t, n, r) {
      return this.on(e, t, n, r, 1)
    },
    off: function (e, n, r) {
      var i, s;
      if (e && e.preventDefault && e.handleObj) {
        i = e.handleObj;
        b(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler);
        return this
      }
      if (typeof e === "object") {
        for (s in e) {
          this.off(s, n, e[s])
        }
        return this
      }
      if (n === false || typeof n === "function") {
        r = n;
        n = t
      }
      if (r === false) {
        r = st
      }
      return this.each(function () {
        b.event.remove(this, e, r, n)
      })
    },
    bind: function (e, t, n) {
      return this.on(e, null, t, n)
    },
    unbind: function (e, t) {
      return this.off(e, null, t)
    },
    delegate: function (e, t, n, r) {
      return this.on(t, e, n, r)
    },
    undelegate: function (e, t, n) {
      return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
    },
    trigger: function (e, t) {
      return this.each(function () {
        b.event.trigger(e, t, this)
      })
    },
    triggerHandler: function (e, t) {
      var n = this[0];
      if (n) {
        return b.event.trigger(e, t, n, true)
      }
    }
  });
  (function (e, t) {
    function rt(e) {
      return J.test(e + "")
    }

    function it() {
      var e, t = [];
      return e = function (n, r) {
        if (t.push(n += " ") > i.cacheLength) {
          delete e[t.shift()]
        }
        return e[n] = r
      }
    }

    function st(e) {
      e[w] = true;
      return e
    }

    function ot(e) {
      var t = c.createElement("div");
      try {
        return e(t)
      } catch (n) {
        return false
      } finally {
        t = null
      }
    }

    function ut(e, t, n, r) {
      var i, s, o, u, a, f, h, v, m, y;
      if ((t ? t.ownerDocument || t : E) !== c) {
        l(t)
      }
      t = t || c;
      n = n || [];
      if (!e || typeof e !== "string") {
        return n
      }
      if ((u = t.nodeType) !== 1 && u !== 9) {
        return []
      }
      if (!p && !r) {
        if (i = K.exec(e)) {
          if (o = i[1]) {
            if (u === 9) {
              s = t.getElementById(o);
              if (s && s.parentNode) {
                if (s.id === o) {
                  n.push(s);
                  return n
                }
              } else {
                return n
              }
            } else {
              if (t.ownerDocument && (s = t.ownerDocument.getElementById(o)) && g(t, s) && s.id === o) {
                n.push(s);
                return n
              }
            }
          } else if (i[2]) {
            _.apply(n, D.call(t.getElementsByTagName(e), 0));
            return n
          } else if ((o = i[3]) && S.getByClassName && t.getElementsByClassName) {
            _.apply(n, D.call(t.getElementsByClassName(o), 0));
            return n
          }
        }
        if (S.qsa && !d.test(e)) {
          h = true;
          v = w;
          m = t;
          y = u === 9 && e;
          if (u === 1 && t.nodeName.toLowerCase() !== "object") {
            f = ht(e);
            if (h = t.getAttribute("id")) {
              v = h.replace(Y, "\\$&")
            } else {
              t.setAttribute("id", v)
            }
            v = "[id='" + v + "'] ";
            a = f.length;
            while (a--) {
              f[a] = v + pt(f[a])
            }
            m = $.test(e) && t.parentNode || t;
            y = f.join(",")
          }
          if (y) {
            try {
              _.apply(n, D.call(m.querySelectorAll(y), 0));
              return n
            } catch (b) {} finally {
              if (!h) {
                t.removeAttribute("id")
              }
            }
          }
        }
      }
      return Et(e.replace(R, "$1"), t, n, r)
    }

    function at(e, t) {
      var n = t && e,
        r = n && (~t.sourceIndex || A) - (~e.sourceIndex || A);
      if (r) {
        return r
      }
      if (n) {
        while (n = n.nextSibling) {
          if (n === t) {
            return -1
          }
        }
      }
      return e ? 1 : -1
    }

    function ft(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return n === "input" && t.type === e
      }
    }

    function lt(e) {
      return function (t) {
        var n = t.nodeName.toLowerCase();
        return (n === "input" || n === "button") && t.type === e
      }
    }

    function ct(e) {
      return st(function (t) {
        t = +t;
        return st(function (n, r) {
          var i, s = e([], n.length, t),
            o = s.length;
          while (o--) {
            if (n[i = s[o]]) {
              n[i] = !(r[i] = n[i])
            }
          }
        })
      })
    }

    function ht(e, t) {
      var n, r, s, o, u, a, f, l = C[e + " "];
      if (l) {
        return t ? 0 : l.slice(0)
      }
      u = e;
      a = [];
      f = i.preFilter;
      while (u) {
        if (!n || (r = U.exec(u))) {
          if (r) {
            u = u.slice(r[0].length) || u
          }
          a.push(s = [])
        }
        n = false;
        if (r = z.exec(u)) {
          n = r.shift();
          s.push({
            value: n,
            type: r[0].replace(R, " ")
          });
          u = u.slice(n.length)
        }
        for (o in i.filter) {
          if ((r = V[o].exec(u)) && (!f[o] || (r = f[o](r)))) {
            n = r.shift();
            s.push({
              value: n,
              type: o,
              matches: r
            });
            u = u.slice(n.length)
          }
        }
        if (!n) {
          break
        }
      }
      return t ? u.length : u ? ut.error(e) : C(e, a).slice(0)
    }

    function pt(e) {
      var t = 0,
        n = e.length,
        r = "";
      for (; t < n; t++) {
        r += e[t].value
      }
      return r
    }

    function dt(e, t, n) {
      var i = t.dir,
        s = n && i === "parentNode",
        o = T++;
      return t.first ? function (t, n, r) {
        while (t = t[i]) {
          if (t.nodeType === 1 || s) {
            return e(t, n, r)
          }
        }
      } : function (t, n, u) {
        var a, f, l, c = x + " " + o;
        if (u) {
          while (t = t[i]) {
            if (t.nodeType === 1 || s) {
              if (e(t, n, u)) {
                return true
              }
            }
          }
        } else {
          while (t = t[i]) {
            if (t.nodeType === 1 || s) {
              l = t[w] || (t[w] = {});
              if ((f = l[i]) && f[0] === c) {
                if ((a = f[1]) === true || a === r) {
                  return a === true
                }
              } else {
                f = l[i] = [c];
                f[1] = e(t, n, u) || r;
                if (f[1] === true) {
                  return true
                }
              }
            }
          }
        }
      }
    }

    function vt(e) {
      return e.length > 1 ? function (t, n, r) {
        var i = e.length;
        while (i--) {
          if (!e[i](t, n, r)) {
            return false
          }
        }
        return true
      } : e[0]
    }

    function mt(e, t, n, r, i) {
      var s, o = [],
        u = 0,
        a = e.length,
        f = t != null;
      for (; u < a; u++) {
        if (s = e[u]) {
          if (!n || n(s, r, i)) {
            o.push(s);
            if (f) {
              t.push(u)
            }
          }
        }
      }
      return o
    }

    function gt(e, t, n, r, i, s) {
      if (r && !r[w]) {
        r = gt(r)
      }
      if (i && !i[w]) {
        i = gt(i, s)
      }
      return st(function (s, o, u, a) {
        var f, l, c, h = [],
          p = [],
          d = o.length,
          v = s || wt(t || "*", u.nodeType ? [u] : u, []),
          m = e && (s || !t) ? mt(v, h, e, u, a) : v,
          g = n ? i || (s ? e : d || r) ? [] : o : m;
        if (n) {
          n(m, g, u, a)
        }
        if (r) {
          f = mt(g, p);
          r(f, [], u, a);
          l = f.length;
          while (l--) {
            if (c = f[l]) {
              g[p[l]] = !(m[p[l]] = c)
            }
          }
        }
        if (s) {
          if (i || e) {
            if (i) {
              f = [];
              l = g.length;
              while (l--) {
                if (c = g[l]) {
                  f.push(m[l] = c)
                }
              }
              i(null, g = [], f, a)
            }
            l = g.length;
            while (l--) {
              if ((c = g[l]) && (f = i ? P.call(s, c) : h[l]) > -1) {
                s[f] = !(o[f] = c)
              }
            }
          }
        } else {
          g = mt(g === o ? g.splice(d, g.length) : g);
          if (i) {
            i(null, o, g, a)
          } else {
            _.apply(o, g)
          }
        }
      })
    }

    function yt(e) {
      var t, n, r, s = e.length,
        o = i.relative[e[0].type],
        u = o || i.relative[" "],
        a = o ? 1 : 0,
        l = dt(function (e) {
          return e === t
        }, u, true),
        c = dt(function (e) {
          return P.call(t, e) > -1
        }, u, true),
        h = [

          function (e, n, r) {
            return !o && (r || n !== f) || ((t = n).nodeType ? l(e, n, r) : c(e, n, r))
          }
        ];
      for (; a < s; a++) {
        if (n = i.relative[e[a].type]) {
          h = [dt(vt(h), n)]
        } else {
          n = i.filter[e[a].type].apply(null, e[a].matches);
          if (n[w]) {
            r = ++a;
            for (; r < s; r++) {
              if (i.relative[e[r].type]) {
                break
              }
            }
            return gt(a > 1 && vt(h), a > 1 && pt(e.slice(0, a - 1)).replace(R, "$1"), n, a < r && yt(e.slice(a, r)), r < s && yt(e = e.slice(r)), r < s && pt(e))
          }
          h.push(n)
        }
      }
      return vt(h)
    }

    function bt(e, t) {
      var n = 0,
        s = t.length > 0,
        o = e.length > 0,
        u = function (u, a, l, h, p) {
          var d, v, m, g = [],
            y = 0,
            b = "0",
            w = u && [],
            E = p != null,
            S = f,
            T = u || o && i.find["TAG"]("*", p && a.parentNode || a),
            N = x += S == null ? 1 : Math.random() || .1;
          if (E) {
            f = a !== c && a;
            r = n
          }
          for (;
            (d = T[b]) != null; b++) {
            if (o && d) {
              v = 0;
              while (m = e[v++]) {
                if (m(d, a, l)) {
                  h.push(d);
                  break
                }
              }
              if (E) {
                x = N;
                r = ++n
              }
            }
            if (s) {
              if (d = !m && d) {
                y--
              }
              if (u) {
                w.push(d)
              }
            }
          }
          y += b;
          if (s && b !== y) {
            v = 0;
            while (m = t[v++]) {
              m(w, g, a, l)
            }
            if (u) {
              if (y > 0) {
                while (b--) {
                  if (!(w[b] || g[b])) {
                    g[b] = M.call(h)
                  }
                }
              }
              g = mt(g)
            }
            _.apply(h, g);
            if (E && !u && g.length > 0 && y + t.length > 1) {
              ut.uniqueSort(h)
            }
          }
          if (E) {
            x = N;
            f = S
          }
          return w
        };
      return s ? st(u) : u
    }

    function wt(e, t, n) {
      var r = 0,
        i = t.length;
      for (; r < i; r++) {
        ut(e, t[r], n)
      }
      return n
    }

    function Et(e, t, n, r) {
      var s, o, a, f, l, c = ht(e);
      if (!r) {
        if (c.length === 1) {
          o = c[0] = c[0].slice(0);
          if (o.length > 2 && (a = o[0]).type === "ID" && t.nodeType === 9 && !p && i.relative[o[1].type]) {
            t = i.find["ID"](a.matches[0].replace(et, tt), t)[0];
            if (!t) {
              return n
            }
            e = e.slice(o.shift().value.length)
          }
          s = V["needsContext"].test(e) ? 0 : o.length;
          while (s--) {
            a = o[s];
            if (i.relative[f = a.type]) {
              break
            }
            if (l = i.find[f]) {
              if (r = l(a.matches[0].replace(et, tt), $.test(o[0].type) && t.parentNode || t)) {
                o.splice(s, 1);
                e = r.length && pt(o);
                if (!e) {
                  _.apply(n, D.call(r, 0));
                  return n
                }
                break
              }
            }
          }
        }
      }
      u(e, c)(r, t, p, n, $.test(e));
      return n
    }

    function St() {}
    var n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, w = "sizzle" + -(new Date),
      E = e.document,
      S = {}, x = 0,
      T = 0,
      N = it(),
      C = it(),
      k = it(),
      L = typeof t,
      A = 1 << 31,
      O = [],
      M = O.pop,
      _ = O.push,
      D = O.slice,
      P = O.indexOf || function (e) {
        var t = 0,
          n = this.length;
        for (; t < n; t++) {
          if (this[t] === e) {
            return t
          }
        }
        return -1
      }, H = "[\\x20\\t\\r\\n\\f]",
      B = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
      j = B.replace("w", "w#"),
      F = "([*^$|!~]?=)",
      I = "\\[" + H + "*(" + B + ")" + H + "*(?:" + F + H + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + j + ")|)|)" + H + "*\\]",
      q = ":(" + B + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + I.replace(3, 8) + ")*)|.*)\\)|)",
      R = new RegExp("^" + H + "+|((?:^|[^\\\\])(?:\\\\.)*)" + H + "+$", "g"),
      U = new RegExp("^" + H + "*," + H + "*"),
      z = new RegExp("^" + H + "*([\\x20\\t\\r\\n\\f>+~])" + H + "*"),
      W = new RegExp(q),
      X = new RegExp("^" + j + "$"),
      V = {
        ID: new RegExp("^#(" + B + ")"),
        CLASS: new RegExp("^\\.(" + B + ")"),
        NAME: new RegExp("^\\[name=['\"]?(" + B + ")['\"]?\\]"),
        TAG: new RegExp("^(" + B.replace("w", "w*") + ")"),
        ATTR: new RegExp("^" + I),
        PSEUDO: new RegExp("^" + q),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + H + "*(even|odd|(([+-]|)(\\d*)n|)" + H + "*(?:([+-]|)" + H + "*(\\d+)|))" + H + "*\\)|)", "i"),
        needsContext: new RegExp("^" + H + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + H + "*((?:-\\d)?\\d*)" + H + "*\\)|)(?=[^-]|$)", "i")
      }, $ = /[\x20\t\r\n\f]*[+~]/,
      J = /^[^{]+\{\s*\[native code/,
      K = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      Q = /^(?:input|select|textarea|button)$/i,
      G = /^h\d$/i,
      Y = /'|\\/g,
      Z = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
      et = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
      tt = function (e, t) {
        var n = "0x" + t - 65536;
        return n !== n ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, n & 1023 | 56320)
      };
    try {
      D.call(E.documentElement.childNodes, 0)[0].nodeType
    } catch (nt) {
      D = function (e) {
        var t, n = [];
        while (t = this[e++]) {
          n.push(t)
        }
        return n
      }
    }
    o = ut.isXML = function (e) {
      var t = e && (e.ownerDocument || e).documentElement;
      return t ? t.nodeName !== "HTML" : false
    };
    l = ut.setDocument = function (e) {
      var n = e ? e.ownerDocument || e : E;
      if (n === c || n.nodeType !== 9 || !n.documentElement) {
        return c
      }
      c = n;
      h = n.documentElement;
      p = o(n);
      S.tagNameNoComments = ot(function (e) {
        e.appendChild(n.createComment(""));
        return !e.getElementsByTagName("*").length
      });
      S.attributes = ot(function (e) {
        e.innerHTML = "<select></select>";
        var t = typeof e.lastChild.getAttribute("multiple");
        return t !== "boolean" && t !== "string"
      });
      S.getByClassName = ot(function (e) {
        e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
        if (!e.getElementsByClassName || !e.getElementsByClassName("e").length) {
          return false
        }
        e.lastChild.className = "e";
        return e.getElementsByClassName("e").length === 2
      });
      S.getByName = ot(function (e) {
        e.id = w + 0;
        e.innerHTML = "<a name='" + w + "'></a><div name='" + w + "'></div>";
        h.insertBefore(e, h.firstChild);
        var t = n.getElementsByName && n.getElementsByName(w).length === 2 + n.getElementsByName(w + 0).length;
        S.getIdNotName = !n.getElementById(w);
        h.removeChild(e);
        return t
      });
      i.attrHandle = ot(function (e) {
        e.innerHTML = "<a href='#'></a>";
        return e.firstChild && typeof e.firstChild.getAttribute !== L && e.firstChild.getAttribute("href") === "#"
      }) ? {} : {
        href: function (e) {
          return e.getAttribute("href", 2)
        },
        type: function (e) {
          return e.getAttribute("type")
        }
      };
      if (S.getIdNotName) {
        i.find["ID"] = function (e, t) {
          if (typeof t.getElementById !== L && !p) {
            var n = t.getElementById(e);
            return n && n.parentNode ? [n] : []
          }
        };
        i.filter["ID"] = function (e) {
          var t = e.replace(et, tt);
          return function (e) {
            return e.getAttribute("id") === t
          }
        }
      } else {
        i.find["ID"] = function (e, n) {
          if (typeof n.getElementById !== L && !p) {
            var r = n.getElementById(e);
            return r ? r.id === e || typeof r.getAttributeNode !== L && r.getAttributeNode("id").value === e ? [r] : t : []
          }
        };
        i.filter["ID"] = function (e) {
          var t = e.replace(et, tt);
          return function (e) {
            var n = typeof e.getAttributeNode !== L && e.getAttributeNode("id");
            return n && n.value === t
          }
        }
      }
      i.find["TAG"] = S.tagNameNoComments ? function (e, t) {
        if (typeof t.getElementsByTagName !== L) {
          return t.getElementsByTagName(e)
        }
      } : function (e, t) {
        var n, r = [],
          i = 0,
          s = t.getElementsByTagName(e);
        if (e === "*") {
          while (n = s[i++]) {
            if (n.nodeType === 1) {
              r.push(n)
            }
          }
          return r
        }
        return s
      };
      i.find["NAME"] = S.getByName && function (e, t) {
        if (typeof t.getElementsByName !== L) {
          return t.getElementsByName(name)
        }
      };
      i.find["CLASS"] = S.getByClassName && function (e, t) {
        if (typeof t.getElementsByClassName !== L && !p) {
          return t.getElementsByClassName(e)
        }
      };
      v = [];
      d = [":focus"];
      if (S.qsa = rt(n.querySelectorAll)) {
        ot(function (e) {
          e.innerHTML = "<select><option selected=''></option></select>";
          if (!e.querySelectorAll("[selected]").length) {
            d.push("\\[" + H + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)")
          }
          if (!e.querySelectorAll(":checked").length) {
            d.push(":checked")
          }
        });
        ot(function (e) {
          e.innerHTML = "<input type='hidden' i=''/>";
          if (e.querySelectorAll("[i^='']").length) {
            d.push("[*^$]=" + H + "*(?:\"\"|'')")
          }
          if (!e.querySelectorAll(":enabled").length) {
            d.push(":enabled", ":disabled")
          }
          e.querySelectorAll("*,:x");
          d.push(",.*:")
        })
      }
      if (S.matchesSelector = rt(m = h.matchesSelector || h.mozMatchesSelector || h.webkitMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) {
        ot(function (e) {
          S.disconnectedMatch = m.call(e, "div");
          m.call(e, "[s!='']:x");
          v.push("!=", q)
        })
      }
      d = new RegExp(d.join("|"));
      v = new RegExp(v.join("|"));
      g = rt(h.contains) || h.compareDocumentPosition ? function (e, t) {
        var n = e.nodeType === 9 ? e.documentElement : e,
          r = t && t.parentNode;
        return e === r || !! (r && r.nodeType === 1 && (n.contains ? n.contains(r) : e.compareDocumentPosition && e.compareDocumentPosition(r) & 16))
      } : function (e, t) {
        if (t) {
          while (t = t.parentNode) {
            if (t === e) {
              return true
            }
          }
        }
        return false
      };
      y = h.compareDocumentPosition ? function (e, t) {
        var r;
        if (e === t) {
          a = true;
          return 0
        }
        if (r = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t)) {
          if (r & 1 || e.parentNode && e.parentNode.nodeType === 11) {
            if (e === n || g(E, e)) {
              return -1
            }
            if (t === n || g(E, t)) {
              return 1
            }
            return 0
          }
          return r & 4 ? -1 : 1
        }
        return e.compareDocumentPosition ? -1 : 1
      } : function (e, t) {
        var r, i = 0,
          s = e.parentNode,
          o = t.parentNode,
          u = [e],
          f = [t];
        if (e === t) {
          a = true;
          return 0
        } else if (!s || !o) {
          return e === n ? -1 : t === n ? 1 : s ? -1 : o ? 1 : 0
        } else if (s === o) {
          return at(e, t)
        }
        r = e;
        while (r = r.parentNode) {
          u.unshift(r)
        }
        r = t;
        while (r = r.parentNode) {
          f.unshift(r)
        }
        while (u[i] === f[i]) {
          i++
        }
        return i ? at(u[i], f[i]) : u[i] === E ? -1 : f[i] === E ? 1 : 0
      };
      a = false;
      [0, 0].sort(y);
      S.detectDuplicates = a;
      return c
    };
    ut.matches = function (e, t) {
      return ut(e, null, null, t)
    };
    ut.matchesSelector = function (e, t) {
      if ((e.ownerDocument || e) !== c) {
        l(e)
      }
      t = t.replace(Z, "='$1']");
      if (S.matchesSelector && !p && (!v || !v.test(t)) && !d.test(t)) {
        try {
          var n = m.call(e, t);
          if (n || S.disconnectedMatch || e.document && e.document.nodeType !== 11) {
            return n
          }
        } catch (r) {}
      }
      return ut(t, c, null, [e]).length > 0
    };
    ut.contains = function (e, t) {
      if ((e.ownerDocument || e) !== c) {
        l(e)
      }
      return g(e, t)
    };
    ut.attr = function (e, t) {
      var n;
      if ((e.ownerDocument || e) !== c) {
        l(e)
      }
      if (!p) {
        t = t.toLowerCase()
      }
      if (n = i.attrHandle[t]) {
        return n(e)
      }
      if (p || S.attributes) {
        return e.getAttribute(t)
      }
      return ((n = e.getAttributeNode(t)) || e.getAttribute(t)) && e[t] === true ? t : n && n.specified ? n.value : null
    };
    ut.error = function (e) {
      throw new Error("Syntax error, unrecognized expression: " + e)
    };
    ut.uniqueSort = function (e) {
      var t, n = [],
        r = 1,
        i = 0;
      a = !S.detectDuplicates;
      e.sort(y);
      if (a) {
        for (; t = e[r]; r++) {
          if (t === e[r - 1]) {
            i = n.push(r)
          }
        }
        while (i--) {
          e.splice(n[i], 1)
        }
      }
      return e
    };
    s = ut.getText = function (e) {
      var t, n = "",
        r = 0,
        i = e.nodeType;
      if (!i) {
        for (; t = e[r]; r++) {
          n += s(t)
        }
      } else if (i === 1 || i === 9 || i === 11) {
        if (typeof e.textContent === "string") {
          return e.textContent
        } else {
          for (e = e.firstChild; e; e = e.nextSibling) {
            n += s(e)
          }
        }
      } else if (i === 3 || i === 4) {
        return e.nodeValue
      }
      return n
    };
    i = ut.selectors = {
      cacheLength: 50,
      createPseudo: st,
      match: V,
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function (e) {
          e[1] = e[1].replace(et, tt);
          e[3] = (e[4] || e[5] || "").replace(et, tt);
          if (e[2] === "~=") {
            e[3] = " " + e[3] + " "
          }
          return e.slice(0, 4)
        },
        CHILD: function (e) {
          e[1] = e[1].toLowerCase();
          if (e[1].slice(0, 3) === "nth") {
            if (!e[3]) {
              ut.error(e[0])
            }
            e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd"));
            e[5] = +(e[7] + e[8] || e[3] === "odd")
          } else if (e[3]) {
            ut.error(e[0])
          }
          return e
        },
        PSEUDO: function (e) {
          var t, n = !e[5] && e[2];
          if (V["CHILD"].test(e[0])) {
            return null
          }
          if (e[4]) {
            e[2] = e[4]
          } else if (n && W.test(n) && (t = ht(n, true)) && (t = n.indexOf(")", n.length - t) - n.length)) {
            e[0] = e[0].slice(0, t);
            e[2] = n.slice(0, t)
          }
          return e.slice(0, 3)
        }
      },
      filter: {
        TAG: function (e) {
          if (e === "*") {
            return function () {
              return true
            }
          }
          e = e.replace(et, tt).toLowerCase();
          return function (t) {
            return t.nodeName && t.nodeName.toLowerCase() === e
          }
        },
        CLASS: function (e) {
          var t = N[e + " "];
          return t || (t = new RegExp("(^|" + H + ")" + e + "(" + H + "|$)")) && N(e, function (e) {
            return t.test(e.className || typeof e.getAttribute !== L && e.getAttribute("class") || "")
          })
        },
        ATTR: function (e, t, n) {
          return function (r) {
            var i = ut.attr(r, e);
            if (i == null) {
              return t === "!="
            }
            if (!t) {
              return true
            }
            i += "";
            return t === "=" ? i === n : t === "!=" ? i !== n : t === "^=" ? n && i.indexOf(n) === 0 : t === "*=" ? n && i.indexOf(n) > -1 : t === "$=" ? n && i.slice(-n.length) === n : t === "~=" ? (" " + i + " ").indexOf(n) > -1 : t === "|=" ? i === n || i.slice(0, n.length + 1) === n + "-" : false
          }
        },
        CHILD: function (e, t, n, r, i) {
          var s = e.slice(0, 3) !== "nth",
            o = e.slice(-4) !== "last",
            u = t === "of-type";
          return r === 1 && i === 0 ? function (e) {
            return !!e.parentNode
          } : function (t, n, a) {
            var f, l, c, h, p, d, v = s !== o ? "nextSibling" : "previousSibling",
              m = t.parentNode,
              g = u && t.nodeName.toLowerCase(),
              y = !a && !u;
            if (m) {
              if (s) {
                while (v) {
                  c = t;
                  while (c = c[v]) {
                    if (u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) {
                      return false
                    }
                  }
                  d = v = e === "only" && !d && "nextSibling"
                }
                return true
              }
              d = [o ? m.firstChild : m.lastChild];
              if (o && y) {
                l = m[w] || (m[w] = {});
                f = l[e] || [];
                p = f[0] === x && f[1];
                h = f[0] === x && f[2];
                c = p && m.childNodes[p];
                while (c = ++p && c && c[v] || (h = p = 0) || d.pop()) {
                  if (c.nodeType === 1 && ++h && c === t) {
                    l[e] = [x, p, h];
                    break
                  }
                }
              } else if (y && (f = (t[w] || (t[w] = {}))[e]) && f[0] === x) {
                h = f[1]
              } else {
                while (c = ++p && c && c[v] || (h = p = 0) || d.pop()) {
                  if ((u ? c.nodeName.toLowerCase() === g : c.nodeType === 1) && ++h) {
                    if (y) {
                      (c[w] || (c[w] = {}))[e] = [x, h]
                    }
                    if (c === t) {
                      break
                    }
                  }
                }
              }
              h -= i;
              return h === r || h % r === 0 && h / r >= 0
            }
          }
        },
        PSEUDO: function (e, t) {
          var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || ut.error("unsupported pseudo: " + e);
          if (r[w]) {
            return r(t)
          }
          if (r.length > 1) {
            n = [e, e, "", t];
            return i.setFilters.hasOwnProperty(e.toLowerCase()) ? st(function (e, n) {
              var i, s = r(e, t),
                o = s.length;
              while (o--) {
                i = P.call(e, s[o]);
                e[i] = !(n[i] = s[o])
              }
            }) : function (e) {
              return r(e, 0, n)
            }
          }
          return r
        }
      },
      pseudos: {
        not: st(function (e) {
          var t = [],
            n = [],
            r = u(e.replace(R, "$1"));
          return r[w] ? st(function (e, t, n, i) {
            var s, o = r(e, null, i, []),
              u = e.length;
            while (u--) {
              if (s = o[u]) {
                e[u] = !(t[u] = s)
              }
            }
          }) : function (e, i, s) {
            t[0] = e;
            r(t, null, s, n);
            return !n.pop()
          }
        }),
        has: st(function (e) {
          return function (t) {
            return ut(e, t).length > 0
          }
        }),
        contains: st(function (e) {
          return function (t) {
            return (t.textContent || t.innerText || s(t)).indexOf(e) > -1
          }
        }),
        lang: st(function (e) {
          if (!X.test(e || "")) {
            ut.error("unsupported lang: " + e)
          }
          e = e.replace(et, tt).toLowerCase();
          return function (t) {
            var n;
            do {
              if (n = p ? t.getAttribute("xml:lang") || t.getAttribute("lang") : t.lang) {
                n = n.toLowerCase();
                return n === e || n.indexOf(e + "-") === 0
              }
            } while ((t = t.parentNode) && t.nodeType === 1);
            return false
          }
        }),
        target: function (t) {
          var n = e.location && e.location.hash;
          return n && n.slice(1) === t.id
        },
        root: function (e) {
          return e === h
        },
        focus: function (e) {
          return e === c.activeElement && (!c.hasFocus || c.hasFocus()) && !! (e.type || e.href || ~e.tabIndex)
        },
        enabled: function (e) {
          return e.disabled === false
        },
        disabled: function (e) {
          return e.disabled === true
        },
        checked: function (e) {
          var t = e.nodeName.toLowerCase();
          return t === "input" && !! e.checked || t === "option" && !! e.selected
        },
        selected: function (e) {
          if (e.parentNode) {
            e.parentNode.selectedIndex
          }
          return e.selected === true
        },
        empty: function (e) {
          for (e = e.firstChild; e; e = e.nextSibling) {
            if (e.nodeName > "@" || e.nodeType === 3 || e.nodeType === 4) {
              return false
            }
          }
          return true
        },
        parent: function (e) {
          return !i.pseudos["empty"](e)
        },
        header: function (e) {
          return G.test(e.nodeName)
        },
        input: function (e) {
          return Q.test(e.nodeName)
        },
        button: function (e) {
          var t = e.nodeName.toLowerCase();
          return t === "input" && e.type === "button" || t === "button"
        },
        text: function (e) {
          var t;
          return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === e.type)
        },
        first: ct(function () {
          return [0]
        }),
        last: ct(function (e, t) {
          return [t - 1]
        }),
        eq: ct(function (e, t, n) {
          return [n < 0 ? n + t : n]
        }),
        even: ct(function (e, t) {
          var n = 0;
          for (; n < t; n += 2) {
            e.push(n)
          }
          return e
        }),
        odd: ct(function (e, t) {
          var n = 1;
          for (; n < t; n += 2) {
            e.push(n)
          }
          return e
        }),
        lt: ct(function (e, t, n) {
          var r = n < 0 ? n + t : n;
          for (; --r >= 0;) {
            e.push(r)
          }
          return e
        }),
        gt: ct(function (e, t, n) {
          var r = n < 0 ? n + t : n;
          for (; ++r < t;) {
            e.push(r)
          }
          return e
        })
      }
    };
    for (n in {
      radio: true,
      checkbox: true,
      file: true,
      password: true,
      image: true
    }) {
      i.pseudos[n] = ft(n)
    }
    for (n in {
      submit: true,
      reset: true
    }) {
      i.pseudos[n] = lt(n)
    }
    u = ut.compile = function (e, t) {
      var n, r = [],
        i = [],
        s = k[e + " "];
      if (!s) {
        if (!t) {
          t = ht(e)
        }
        n = t.length;
        while (n--) {
          s = yt(t[n]);
          if (s[w]) {
            r.push(s)
          } else {
            i.push(s)
          }
        }
        s = k(e, bt(i, r))
      }
      return s
    };
    i.pseudos["nth"] = i.pseudos["eq"];
    i.filters = St.prototype = i.pseudos;
    i.setFilters = new St;
    l();
    ut.attr = b.attr;
    b.find = ut;
    b.expr = ut.selectors;
    b.expr[":"] = b.expr.pseudos;
    b.unique = ut.uniqueSort;
    b.text = ut.getText;
    b.isXMLDoc = ut.isXML;
    b.contains = ut.contains
  })(e);
  var ot = /Until$/,
    ut = /^(?:parents|prev(?:Until|All))/,
    at = /^.[^:#\[\.,]*$/,
    ft = b.expr.match.needsContext,
    lt = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };
  b.fn.extend({
    find: function (e) {
      var t, n, r, i = this.length;
      if (typeof e !== "string") {
        r = this;
        return this.pushStack(b(e).filter(function () {
          for (t = 0; t < i; t++) {
            if (b.contains(r[t], this)) {
              return true
            }
          }
        }))
      }
      n = [];
      for (t = 0; t < i; t++) {
        b.find(e, this[t], n)
      }
      n = this.pushStack(i > 1 ? b.unique(n) : n);
      n.selector = (this.selector ? this.selector + " " : "") + e;
      return n
    },
    has: function (e) {
      var t, n = b(e, this),
        r = n.length;
      return this.filter(function () {
        for (t = 0; t < r; t++) {
          if (b.contains(this, n[t])) {
            return true
          }
        }
      })
    },
    not: function (e) {
      return this.pushStack(ht(this, e, false))
    },
    filter: function (e) {
      return this.pushStack(ht(this, e, true))
    },
    is: function (e) {
      return !!e && (typeof e === "string" ? ft.test(e) ? b(e, this.context).index(this[0]) >= 0 : b.filter(e, this).length > 0 : this.filter(e).length > 0)
    },
    closest: function (e, t) {
      var n, r = 0,
        i = this.length,
        s = [],
        o = ft.test(e) || typeof e !== "string" ? b(e, t || this.context) : 0;
      for (; r < i; r++) {
        n = this[r];
        while (n && n.ownerDocument && n !== t && n.nodeType !== 11) {
          if (o ? o.index(n) > -1 : b.find.matchesSelector(n, e)) {
            s.push(n);
            break
          }
          n = n.parentNode
        }
      }
      return this.pushStack(s.length > 1 ? b.unique(s) : s)
    },
    index: function (e) {
      if (!e) {
        return this[0] && this[0].parentNode ? this.first().prevAll().length : -1
      }
      if (typeof e === "string") {
        return b.inArray(this[0], b(e))
      }
      return b.inArray(e.jquery ? e[0] : e, this)
    },
    add: function (e, t) {
      var n = typeof e === "string" ? b(e, t) : b.makeArray(e && e.nodeType ? [e] : e),
        r = b.merge(this.get(), n);
      return this.pushStack(b.unique(r))
    },
    addBack: function (e) {
      return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
    }
  });
  b.fn.andSelf = b.fn.addBack;
  b.each({
    parent: function (e) {
      var t = e.parentNode;
      return t && t.nodeType !== 11 ? t : null
    },
    parents: function (e) {
      return b.dir(e, "parentNode")
    },
    parentsUntil: function (e, t, n) {
      return b.dir(e, "parentNode", n)
    },
    next: function (e) {
      return ct(e, "nextSibling")
    },
    prev: function (e) {
      return ct(e, "previousSibling")
    },
    nextAll: function (e) {
      return b.dir(e, "nextSibling")
    },
    prevAll: function (e) {
      return b.dir(e, "previousSibling")
    },
    nextUntil: function (e, t, n) {
      return b.dir(e, "nextSibling", n)
    },
    prevUntil: function (e, t, n) {
      return b.dir(e, "previousSibling", n)
    },
    siblings: function (e) {
      return b.sibling((e.parentNode || {}).firstChild, e)
    },
    children: function (e) {
      return b.sibling(e.firstChild)
    },
    contents: function (e) {
      return b.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : b.merge([], e.childNodes)
    }
  }, function (e, t) {
    b.fn[e] = function (n, r) {
      var i = b.map(this, t, n);
      if (!ot.test(e)) {
        r = n
      }
      if (r && typeof r === "string") {
        i = b.filter(r, i)
      }
      i = this.length > 1 && !lt[e] ? b.unique(i) : i;
      if (this.length > 1 && ut.test(e)) {
        i = i.reverse()
      }
      return this.pushStack(i)
    }
  });
  b.extend({
    filter: function (e, t, n) {
      if (n) {
        e = ":not(" + e + ")"
      }
      return t.length === 1 ? b.find.matchesSelector(t[0], e) ? [t[0]] : [] : b.find.matches(e, t)
    },
    dir: function (e, n, r) {
      var i = [],
        s = e[n];
      while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !b(s).is(r))) {
        if (s.nodeType === 1) {
          i.push(s)
        }
        s = s[n]
      }
      return i
    },
    sibling: function (e, t) {
      var n = [];
      for (; e; e = e.nextSibling) {
        if (e.nodeType === 1 && e !== t) {
          n.push(e)
        }
      }
      return n
    }
  });
  var dt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    vt = / jQuery\d+="(?:null|\d+)"/g,
    mt = new RegExp("<(?:" + dt + ")[\\s/>]", "i"),
    gt = /^\s+/,
    yt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    bt = /<([\w:]+)/,
    wt = /<tbody/i,
    Et = /<|&#?\w+;/,
    St = /<(?:script|style|link)/i,
    xt = /^(?:checkbox|radio)$/i,
    Tt = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Nt = /^$|\/(?:java|ecma)script/i,
    Ct = /^true\/(.*)/,
    kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    Lt = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: b.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }, At = pt(s),
    Ot = At.appendChild(s.createElement("div"));
  Lt.optgroup = Lt.option;
  Lt.tbody = Lt.tfoot = Lt.colgroup = Lt.caption = Lt.thead;
  Lt.th = Lt.td;
  b.fn.extend({
    text: function (e) {
      return b.access(this, function (e) {
        return e === t ? b.text(this) : this.empty().append((this[0] && this[0].ownerDocument || s).createTextNode(e))
      }, null, e, arguments.length)
    },
    wrapAll: function (e) {
      if (b.isFunction(e)) {
        return this.each(function (t) {
          b(this).wrapAll(e.call(this, t))
        })
      }
      if (this[0]) {
        var t = b(e, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          t.insertBefore(this[0])
        }
        t.map(function () {
          var e = this;
          while (e.firstChild && e.firstChild.nodeType === 1) {
            e = e.firstChild
          }
          return e
        }).append(this)
      }
      return this
    },
    wrapInner: function (e) {
      if (b.isFunction(e)) {
        return this.each(function (t) {
          b(this).wrapInner(e.call(this, t))
        })
      }
      return this.each(function () {
        var t = b(this),
          n = t.contents();
        if (n.length) {
          n.wrapAll(e)
        } else {
          t.append(e)
        }
      })
    },
    wrap: function (e) {
      var t = b.isFunction(e);
      return this.each(function (n) {
        b(this).wrapAll(t ? e.call(this, n) : e)
      })
    },
    unwrap: function () {
      return this.parent().each(function () {
        if (!b.nodeName(this, "body")) {
          b(this).replaceWith(this.childNodes)
        }
      }).end()
    },
    append: function () {
      return this.domManip(arguments, true, function (e) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          this.appendChild(e)
        }
      })
    },
    prepend: function () {
      return this.domManip(arguments, true, function (e) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          this.insertBefore(e, this.firstChild)
        }
      })
    },
    before: function () {
      return this.domManip(arguments, false, function (e) {
        if (this.parentNode) {
          this.parentNode.insertBefore(e, this)
        }
      })
    },
    after: function () {
      return this.domManip(arguments, false, function (e) {
        if (this.parentNode) {
          this.parentNode.insertBefore(e, this.nextSibling)
        }
      })
    },
    remove: function (e, t) {
      var n, r = 0;
      for (;
        (n = this[r]) != null; r++) {
        if (!e || b.filter(e, [n]).length > 0) {
          if (!t && n.nodeType === 1) {
            b.cleanData(jt(n))
          }
          if (n.parentNode) {
            if (t && b.contains(n.ownerDocument, n)) {
              Pt(jt(n, "script"))
            }
            n.parentNode.removeChild(n)
          }
        }
      }
      return this
    },
    empty: function () {
      var e, t = 0;
      for (;
        (e = this[t]) != null; t++) {
        if (e.nodeType === 1) {
          b.cleanData(jt(e, false))
        }
        while (e.firstChild) {
          e.removeChild(e.firstChild)
        }
        if (e.options && b.nodeName(e, "select")) {
          e.options.length = 0
        }
      }
      return this
    },
    clone: function (e, t) {
      e = e == null ? false : e;
      t = t == null ? e : t;
      return this.map(function () {
        return b.clone(this, e, t)
      })
    },
    html: function (e) {
      return b.access(this, function (e) {
        var n = this[0] || {}, r = 0,
          i = this.length;
        if (e === t) {
          return n.nodeType === 1 ? n.innerHTML.replace(vt, "") : t
        }
        if (typeof e === "string" && !St.test(e) && (b.support.htmlSerialize || !mt.test(e)) && (b.support.leadingWhitespace || !gt.test(e)) && !Lt[(bt.exec(e) || ["", ""])[1].toLowerCase()]) {
          e = e.replace(yt, "<$1></$2>");
          try {
            for (; r < i; r++) {
              n = this[r] || {};
              if (n.nodeType === 1) {
                b.cleanData(jt(n, false));
                n.innerHTML = e
              }
            }
            n = 0
          } catch (s) {}
        }
        if (n) {
          this.empty().append(e)
        }
      }, null, e, arguments.length)
    },
    replaceWith: function (e) {
      var t = b.isFunction(e);
      if (!t && typeof e !== "string") {
        e = b(e).not(this).detach()
      }
      return this.domManip([e], true, function (e) {
        var t = this.nextSibling,
          n = this.parentNode;
        if (n) {
          b(this).remove();
          n.insertBefore(e, t)
        }
      })
    },
    detach: function (e) {
      return this.remove(e, true)
    },
    domManip: function (e, n, r) {
      e = h.apply([], e);
      var i, s, o, u, a, f, l = 0,
        c = this.length,
        p = this,
        d = c - 1,
        v = e[0],
        m = b.isFunction(v);
      if (m || !(c <= 1 || typeof v !== "string" || b.support.checkClone || !Tt.test(v))) {
        return this.each(function (i) {
          var s = p.eq(i);
          if (m) {
            e[0] = v.call(this, i, n ? s.html() : t)
          }
          s.domManip(e, n, r)
        })
      }
      if (c) {
        f = b.buildFragment(e, this[0].ownerDocument, false, this);
        i = f.firstChild;
        if (f.childNodes.length === 1) {
          f = i
        }
        if (i) {
          n = n && b.nodeName(i, "tr");
          u = b.map(jt(f, "script"), _t);
          o = u.length;
          for (; l < c; l++) {
            s = f;
            if (l !== d) {
              s = b.clone(s, true, true);
              if (o) {
                b.merge(u, jt(s, "script"))
              }
            }
            r.call(n && b.nodeName(this[l], "table") ? Mt(this[l], "tbody") : this[l], s, l)
          }
          if (o) {
            a = u[u.length - 1].ownerDocument;
            b.map(u, Dt);
            for (l = 0; l < o; l++) {
              s = u[l];
              if (Nt.test(s.type || "") && !b._data(s, "globalEval") && b.contains(a, s)) {
                if (s.src) {
                  b.ajax({
                    url: s.src,
                    type: "GET",
                    dataType: "script",
                    async: false,
                    global: false,
                    "throws": true
                  })
                } else {
                  b.globalEval((s.text || s.textContent || s.innerHTML || "").replace(kt, ""))
                }
              }
            }
          }
          f = i = null
        }
      }
      return this
    }
  });
  b.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (e, t) {
    b.fn[e] = function (e) {
      var n, r = 0,
        i = [],
        s = b(e),
        o = s.length - 1;
      for (; r <= o; r++) {
        n = r === o ? this : this.clone(true);
        b(s[r])[t](n);
        p.apply(i, n.get())
      }
      return this.pushStack(i)
    }
  });
  b.extend({
    clone: function (e, t, n) {
      var r, i, s, o, u, a = b.contains(e.ownerDocument, e);
      if (b.support.html5Clone || b.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">")) {
        s = e.cloneNode(true)
      } else {
        Ot.innerHTML = e.outerHTML;
        Ot.removeChild(s = Ot.firstChild)
      } if ((!b.support.noCloneEvent || !b.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !b.isXMLDoc(e)) {
        r = jt(s);
        u = jt(e);
        for (o = 0;
          (i = u[o]) != null; ++o) {
          if (r[o]) {
            Bt(i, r[o])
          }
        }
      }
      if (t) {
        if (n) {
          u = u || jt(e);
          r = r || jt(s);
          for (o = 0;
            (i = u[o]) != null; o++) {
            Ht(i, r[o])
          }
        } else {
          Ht(e, s)
        }
      }
      r = jt(s, "script");
      if (r.length > 0) {
        Pt(r, !a && jt(e, "script"))
      }
      r = u = i = null;
      return s
    },
    buildFragment: function (e, t, n, r) {
      var i, s, o, u, a, f, l, c = e.length,
        h = pt(t),
        p = [],
        d = 0;
      for (; d < c; d++) {
        s = e[d];
        if (s || s === 0) {
          if (b.type(s) === "object") {
            b.merge(p, s.nodeType ? [s] : s)
          } else if (!Et.test(s)) {
            p.push(t.createTextNode(s))
          } else {
            u = u || h.appendChild(t.createElement("div"));
            a = (bt.exec(s) || ["", ""])[1].toLowerCase();
            l = Lt[a] || Lt._default;
            u.innerHTML = l[1] + s.replace(yt, "<$1></$2>") + l[2];
            i = l[0];
            while (i--) {
              u = u.lastChild
            }
            if (!b.support.leadingWhitespace && gt.test(s)) {
              p.push(t.createTextNode(gt.exec(s)[0]))
            }
            if (!b.support.tbody) {
              s = a === "table" && !wt.test(s) ? u.firstChild : l[1] === "<table>" && !wt.test(s) ? u : 0;
              i = s && s.childNodes.length;
              while (i--) {
                if (b.nodeName(f = s.childNodes[i], "tbody") && !f.childNodes.length) {
                  s.removeChild(f)
                }
              }
            }
            b.merge(p, u.childNodes);
            u.textContent = "";
            while (u.firstChild) {
              u.removeChild(u.firstChild)
            }
            u = h.lastChild
          }
        }
      }
      if (u) {
        h.removeChild(u)
      }
      if (!b.support.appendChecked) {
        b.grep(jt(p, "input"), Ft)
      }
      d = 0;
      while (s = p[d++]) {
        if (r && b.inArray(s, r) !== -1) {
          continue
        }
        o = b.contains(s.ownerDocument, s);
        u = jt(h.appendChild(s), "script");
        if (o) {
          Pt(u)
        }
        if (n) {
          i = 0;
          while (s = u[i++]) {
            if (Nt.test(s.type || "")) {
              n.push(s)
            }
          }
        }
      }
      u = null;
      return h
    },
    cleanData: function (e, t) {
      var n, r, s, o, u = 0,
        a = b.expando,
        f = b.cache,
        c = b.support.deleteExpando,
        h = b.event.special;
      for (;
        (n = e[u]) != null; u++) {
        if (t || b.acceptData(n)) {
          s = n[a];
          o = s && f[s];
          if (o) {
            if (o.events) {
              for (r in o.events) {
                if (h[r]) {
                  b.event.remove(n, r)
                } else {
                  b.removeEvent(n, r, o.handle)
                }
              }
            }
            if (f[s]) {
              delete f[s];
              if (c) {
                delete n[a]
              } else if (typeof n.removeAttribute !== i) {
                n.removeAttribute(a)
              } else {
                n[a] = null
              }
              l.push(s)
            }
          }
        }
      }
    }
  });
  var It, qt, Rt, Ut = /alpha\([^)]*\)/i,
    zt = /opacity\s*=\s*([^)]*)/,
    Wt = /^(top|right|bottom|left)$/,
    Xt = /^(none|table(?!-c[ea]).+)/,
    Vt = /^margin/,
    $t = new RegExp("^(" + w + ")(.*)$", "i"),
    Jt = new RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"),
    Kt = new RegExp("^([+-])=(" + w + ")", "i"),
    Qt = {
      BODY: "block"
    }, Gt = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    }, Yt = {
      letterSpacing: 0,
      fontWeight: 400
    }, Zt = ["Top", "Right", "Bottom", "Left"],
    en = ["Webkit", "O", "Moz", "ms"];
  b.fn.extend({
    css: function (e, n) {
      return b.access(this, function (e, n, r) {
        var i, s, o = {}, u = 0;
        if (b.isArray(n)) {
          s = qt(e);
          i = n.length;
          for (; u < i; u++) {
            o[n[u]] = b.css(e, n[u], false, s)
          }
          return o
        }
        return r !== t ? b.style(e, n, r) : b.css(e, n)
      }, e, n, arguments.length > 1)
    },
    show: function () {
      return rn(this, true)
    },
    hide: function () {
      return rn(this)
    },
    toggle: function (e) {
      var t = typeof e === "boolean";
      return this.each(function () {
        if (t ? e : nn(this)) {
          b(this).show()
        } else {
          b(this).hide()
        }
      })
    }
  });
  b.extend({
    cssHooks: {
      opacity: {
        get: function (e, t) {
          if (t) {
            var n = Rt(e, "opacity");
            return n === "" ? "1" : n
          }
        }
      }
    },
    cssNumber: {
      columnCount: true,
      fillOpacity: true,
      fontWeight: true,
      lineHeight: true,
      opacity: true,
      orphans: true,
      widows: true,
      zIndex: true,
      zoom: true
    },
    cssProps: {
      "float": b.support.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function (e, n, r, i) {
      if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
        return
      }
      var s, o, u, a = b.camelCase(n),
        f = e.style;
      n = b.cssProps[a] || (b.cssProps[a] = tn(f, a));
      u = b.cssHooks[n] || b.cssHooks[a];
      if (r !== t) {
        o = typeof r;
        if (o === "string" && (s = Kt.exec(r))) {
          r = (s[1] + 1) * s[2] + parseFloat(b.css(e, n));
          o = "number"
        }
        if (r == null || o === "number" && isNaN(r)) {
          return
        }
        if (o === "number" && !b.cssNumber[a]) {
          r += "px"
        }
        if (!b.support.clearCloneStyle && r === "" && n.indexOf("background") === 0) {
          f[n] = "inherit"
        }
        if (!u || !("set" in u) || (r = u.set(e, r, i)) !== t) {
          try {
            f[n] = r
          } catch (l) {}
        }
      } else {
        if (u && "get" in u && (s = u.get(e, false, i)) !== t) {
          return s
        }
        return f[n]
      }
    },
    css: function (e, n, r, i) {
      var s, o, u, a = b.camelCase(n);
      n = b.cssProps[a] || (b.cssProps[a] = tn(e.style, a));
      u = b.cssHooks[n] || b.cssHooks[a];
      if (u && "get" in u) {
        o = u.get(e, true, r)
      }
      if (o === t) {
        o = Rt(e, n, i)
      }
      if (o === "normal" && n in Yt) {
        o = Yt[n]
      }
      if (r === "" || r) {
        s = parseFloat(o);
        return r === true || b.isNumeric(s) ? s || 0 : o
      }
      return o
    },
    swap: function (e, t, n, r) {
      var i, s, o = {};
      for (s in t) {
        o[s] = e.style[s];
        e.style[s] = t[s]
      }
      i = n.apply(e, r || []);
      for (s in t) {
        e.style[s] = o[s]
      }
      return i
    }
  });
  if (e.getComputedStyle) {
    qt = function (t) {
      return e.getComputedStyle(t, null)
    };
    Rt = function (e, n, r) {
      var i, s, o, u = r || qt(e),
        a = u ? u.getPropertyValue(n) || u[n] : t,
        f = e.style;
      if (u) {
        if (a === "" && !b.contains(e.ownerDocument, e)) {
          a = b.style(e, n)
        }
        if (Jt.test(a) && Vt.test(n)) {
          i = f.width;
          s = f.minWidth;
          o = f.maxWidth;
          f.minWidth = f.maxWidth = f.width = a;
          a = u.width;
          f.width = i;
          f.minWidth = s;
          f.maxWidth = o
        }
      }
      return a
    }
  } else if (s.documentElement.currentStyle) {
    qt = function (e) {
      return e.currentStyle
    };
    Rt = function (e, n, r) {
      var i, s, o, u = r || qt(e),
        a = u ? u[n] : t,
        f = e.style;
      if (a == null && f && f[n]) {
        a = f[n]
      }
      if (Jt.test(a) && !Wt.test(n)) {
        i = f.left;
        s = e.runtimeStyle;
        o = s && s.left;
        if (o) {
          s.left = e.currentStyle.left
        }
        f.left = n === "fontSize" ? "1em" : a;
        a = f.pixelLeft + "px";
        f.left = i;
        if (o) {
          s.left = o
        }
      }
      return a === "" ? "auto" : a
    }
  }
  b.each(["height", "width"], function (e, t) {
    b.cssHooks[t] = {
      get: function (e, n, r) {
        if (n) {
          return e.offsetWidth === 0 && Xt.test(b.css(e, "display")) ? b.swap(e, Gt, function () {
            return un(e, t, r)
          }) : un(e, t, r)
        }
      },
      set: function (e, n, r) {
        var i = r && qt(e);
        return sn(e, n, r ? on(e, t, r, b.support.boxSizing && b.css(e, "boxSizing", false, i) === "border-box", i) : 0)
      }
    }
  });
  if (!b.support.opacity) {
    b.cssHooks.opacity = {
      get: function (e, t) {
        return zt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
      },
      set: function (e, t) {
        var n = e.style,
          r = e.currentStyle,
          i = b.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
          s = r && r.filter || n.filter || "";
        n.zoom = 1;
        if ((t >= 1 || t === "") && b.trim(s.replace(Ut, "")) === "" && n.removeAttribute) {
          n.removeAttribute("filter");
          if (t === "" || r && !r.filter) {
            return
          }
        }
        n.filter = Ut.test(s) ? s.replace(Ut, i) : s + " " + i
      }
    }
  }
  b(function () {
    if (!b.support.reliableMarginRight) {
      b.cssHooks.marginRight = {
        get: function (e, t) {
          if (t) {
            return b.swap(e, {
              display: "inline-block"
            }, Rt, [e, "marginRight"])
          }
        }
      }
    }
    if (!b.support.pixelPosition && b.fn.position) {
      b.each(["top", "left"], function (e, t) {
        b.cssHooks[t] = {
          get: function (e, n) {
            if (n) {
              n = Rt(e, t);
              return Jt.test(n) ? b(e).position()[t] + "px" : n
            }
          }
        }
      })
    }
  });
  if (b.expr && b.expr.filters) {
    b.expr.filters.hidden = function (e) {
      return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !b.support.reliableHiddenOffsets && (e.style && e.style.display || b.css(e, "display")) === "none"
    };
    b.expr.filters.visible = function (e) {
      return !b.expr.filters.hidden(e)
    }
  }
  b.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (e, t) {
    b.cssHooks[e + t] = {
      expand: function (n) {
        var r = 0,
          i = {}, s = typeof n === "string" ? n.split(" ") : [n];
        for (; r < 4; r++) {
          i[e + Zt[r] + t] = s[r] || s[r - 2] || s[0]
        }
        return i
      }
    };
    if (!Vt.test(e)) {
      b.cssHooks[e + t].set = sn
    }
  });
  var ln = /%20/g,
    cn = /\[\]$/,
    hn = /\r?\n/g,
    pn = /^(?:submit|button|image|reset|file)$/i,
    dn = /^(?:input|select|textarea|keygen)/i;
  b.fn.extend({
    serialize: function () {
      return b.param(this.serializeArray())
    },
    serializeArray: function () {
      return this.map(function () {
        var e = b.prop(this, "elements");
        return e ? b.makeArray(e) : this
      }).filter(function () {
        var e = this.type;
        return this.name && !b(this).is(":disabled") && dn.test(this.nodeName) && !pn.test(e) && (this.checked || !xt.test(e))
      }).map(function (e, t) {
        var n = b(this).val();
        return n == null ? null : b.isArray(n) ? b.map(n, function (e) {
          return {
            name: t.name,
            value: e.replace(hn, "\r\n")
          }
        }) : {
          name: t.name,
          value: n.replace(hn, "\r\n")
        }
      }).get()
    }
  });
  b.param = function (e, n) {
    var r, i = [],
      s = function (e, t) {
        t = b.isFunction(t) ? t() : t == null ? "" : t;
        i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
      };
    if (n === t) {
      n = b.ajaxSettings && b.ajaxSettings.traditional
    }
    if (b.isArray(e) || e.jquery && !b.isPlainObject(e)) {
      b.each(e, function () {
        s(this.name, this.value)
      })
    } else {
      for (r in e) {
        vn(r, e[r], n, s)
      }
    }
    return i.join("&").replace(ln, "+")
  };
  b.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function (e, t) {
    b.fn[t] = function (e, n) {
      return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
    }
  });
  b.fn.hover = function (e, t) {
    return this.mouseenter(e).mouseleave(t || e)
  };
  var mn, gn, yn = b.now(),
    bn = /\?/,
    wn = /#.*$/,
    En = /([?&])_=[^&]*/,
    Sn = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
    xn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Tn = /^(?:GET|HEAD)$/,
    Nn = /^\/\//,
    Cn = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    kn = b.fn.load,
    Ln = {}, An = {}, On = "*/".concat("*");
  try {
    gn = o.href
  } catch (Mn) {
    gn = s.createElement("a");
    gn.href = "";
    gn = gn.href
  }
  mn = Cn.exec(gn.toLowerCase()) || [];
  b.fn.load = function (e, n, r) {
    if (typeof e !== "string" && kn) {
      return kn.apply(this, arguments)
    }
    var i, s, o, u = this,
      a = e.indexOf(" ");
    if (a >= 0) {
      i = e.slice(a, e.length);
      e = e.slice(0, a)
    }
    if (b.isFunction(n)) {
      r = n;
      n = t
    } else if (n && typeof n === "object") {
      o = "POST"
    }
    if (u.length > 0) {
      b.ajax({
        url: e,
        type: o,
        dataType: "html",
        data: n
      }).done(function (e) {
        s = arguments;
        u.html(i ? b("<div>").append(b.parseHTML(e)).find(i) : e)
      }).complete(r && function (e, t) {
        u.each(r, s || [e.responseText, t, e])
      })
    }
    return this
  };
  b.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
    b.fn[t] = function (e) {
      return this.on(t, e)
    }
  });
  b.each(["get", "post"], function (e, n) {
    b[n] = function (e, r, i, s) {
      if (b.isFunction(r)) {
        s = s || i;
        i = r;
        r = t
      }
      return b.ajax({
        url: e,
        type: n,
        dataType: s,
        data: r,
        success: i
      })
    }
  });
  b.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: gn,
      type: "GET",
      isLocal: xn.test(mn[1]),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": On,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText"
      },
      converters: {
        "* text": e.String,
        "text html": true,
        "text json": b.parseJSON,
        "text xml": b.parseXML
      },
      flatOptions: {
        url: true,
        context: true
      }
    },
    ajaxSetup: function (e, t) {
      return t ? Pn(Pn(e, b.ajaxSettings), t) : Pn(b.ajaxSettings, e)
    },
    ajaxPrefilter: _n(Ln),
    ajaxTransport: _n(An),
    ajax: function (e, n) {
      function N(e, n, r, i) {
        var l, g, y, E, S, T = n;
        if (w === 2) {
          return
        }
        w = 2;
        if (u) {
          clearTimeout(u)
        }
        f = t;
        o = i || "";
        x.readyState = e > 0 ? 4 : 0;
        if (r) {
          E = Hn(c, x, r)
        }
        if (e >= 200 && e < 300 || e === 304) {
          if (c.ifModified) {
            S = x.getResponseHeader("Last-Modified");
            if (S) {
              b.lastModified[s] = S
            }
            S = x.getResponseHeader("etag");
            if (S) {
              b.etag[s] = S
            }
          }
          if (e === 204) {
            l = true;
            T = "nocontent"
          } else if (e === 304) {
            l = true;
            T = "notmodified"
          } else {
            l = Bn(c, E);
            T = l.state;
            g = l.data;
            y = l.error;
            l = !y
          }
        } else {
          y = T;
          if (e || !T) {
            T = "error";
            if (e < 0) {
              e = 0
            }
          }
        }
        x.status = e;
        x.statusText = (n || T) + "";
        if (l) {
          d.resolveWith(h, [g, T, x])
        } else {
          d.rejectWith(h, [x, T, y])
        }
        x.statusCode(m);
        m = t;
        if (a) {
          p.trigger(l ? "ajaxSuccess" : "ajaxError", [x, c, l ? g : y])
        }
        v.fireWith(h, [x, T]);
        if (a) {
          p.trigger("ajaxComplete", [x, c]);
          if (!--b.active) {
            b.event.trigger("ajaxStop")
          }
        }
      }
      if (typeof e === "object") {
        n = e;
        e = t
      }
      n = n || {};
      var r, i, s, o, u, a, f, l, c = b.ajaxSetup({}, n),
        h = c.context || c,
        p = c.context && (h.nodeType || h.jquery) ? b(h) : b.event,
        d = b.Deferred(),
        v = b.Callbacks("once memory"),
        m = c.statusCode || {}, g = {}, y = {}, w = 0,
        S = "canceled",
        x = {
          readyState: 0,
          getResponseHeader: function (e) {
            var t;
            if (w === 2) {
              if (!l) {
                l = {};
                while (t = Sn.exec(o)) {
                  l[t[1].toLowerCase()] = t[2]
                }
              }
              t = l[e.toLowerCase()]
            }
            return t == null ? null : t
          },
          getAllResponseHeaders: function () {
            return w === 2 ? o : null
          },
          setRequestHeader: function (e, t) {
            var n = e.toLowerCase();
            if (!w) {
              e = y[n] = y[n] || e;
              g[e] = t
            }
            return this
          },
          overrideMimeType: function (e) {
            if (!w) {
              c.mimeType = e
            }
            return this
          },
          statusCode: function (e) {
            var t;
            if (e) {
              if (w < 2) {
                for (t in e) {
                  m[t] = [m[t], e[t]]
                }
              } else {
                x.always(e[x.status])
              }
            }
            return this
          },
          abort: function (e) {
            var t = e || S;
            if (f) {
              f.abort(t)
            }
            N(0, t);
            return this
          }
        };
      d.promise(x).complete = v.add;
      x.success = x.done;
      x.error = x.fail;
      c.url = ((e || c.url || gn) + "").replace(wn, "").replace(Nn, mn[1] + "//");
      c.type = n.method || n.type || c.method || c.type;
      c.dataTypes = b.trim(c.dataType || "*").toLowerCase().match(E) || [""];
      if (c.crossDomain == null) {
        r = Cn.exec(c.url.toLowerCase());
        c.crossDomain = !! (r && (r[1] !== mn[1] || r[2] !== mn[2] || (r[3] || (r[1] === "http:" ? 80 : 443)) != (mn[3] || (mn[1] === "http:" ? 80 : 443))))
      }
      if (c.data && c.processData && typeof c.data !== "string") {
        c.data = b.param(c.data, c.traditional)
      }
      Dn(Ln, c, n, x);
      if (w === 2) {
        return x
      }
      a = c.global;
      if (a && b.active++ === 0) {
        b.event.trigger("ajaxStart")
      }
      c.type = c.type.toUpperCase();
      c.hasContent = !Tn.test(c.type);
      s = c.url;
      if (!c.hasContent) {
        if (c.data) {
          s = c.url += (bn.test(s) ? "&" : "?") + c.data;
          delete c.data
        }
        if (c.cache === false) {
          c.url = En.test(s) ? s.replace(En, "$1_=" + yn++) : s + (bn.test(s) ? "&" : "?") + "_=" + yn++
        }
      }
      if (c.ifModified) {
        if (b.lastModified[s]) {
          x.setRequestHeader("If-Modified-Since", b.lastModified[s])
        }
        if (b.etag[s]) {
          x.setRequestHeader("If-None-Match", b.etag[s])
        }
      }
      if (c.data && c.hasContent && c.contentType !== false || n.contentType) {
        x.setRequestHeader("Content-Type", c.contentType)
      }
      x.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + (c.dataTypes[0] !== "*" ? ", " + On + "; q=0.01" : "") : c.accepts["*"]);
      for (i in c.headers) {
        x.setRequestHeader(i, c.headers[i])
      }
      if (c.beforeSend && (c.beforeSend.call(h, x, c) === false || w === 2)) {
        return x.abort()
      }
      S = "abort";
      for (i in {
        success: 1,
        error: 1,
        complete: 1
      }) {
        x[i](c[i])
      }
      f = Dn(An, c, n, x);
      if (!f) {
        N(-1, "No Transport")
      } else {
        x.readyState = 1;
        if (a) {
          p.trigger("ajaxSend", [x, c])
        }
        if (c.async && c.timeout > 0) {
          u = setTimeout(function () {
            x.abort("timeout")
          }, c.timeout)
        }
        try {
          w = 1;
          f.send(g, N)
        } catch (T) {
          if (w < 2) {
            N(-1, T)
          } else {
            throw T
          }
        }
      }
      return x
    },
    getScript: function (e, n) {
      return b.get(e, t, n, "script")
    },
    getJSON: function (e, t, n) {
      return b.get(e, t, n, "json")
    }
  });
  b.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function (e) {
        b.globalEval(e);
        return e
      }
    }
  });
  b.ajaxPrefilter("script", function (e) {
    if (e.cache === t) {
      e.cache = false
    }
    if (e.crossDomain) {
      e.type = "GET";
      e.global = false
    }
  });
  b.ajaxTransport("script", function (e) {
    if (e.crossDomain) {
      var n, r = s.head || b("head")[0] || s.documentElement;
      return {
        send: function (t, i) {
          n = s.createElement("script");
          n.async = true;
          if (e.scriptCharset) {
            n.charset = e.scriptCharset
          }
          n.src = e.url;
          n.onload = n.onreadystatechange = function (e, t) {
            if (t || !n.readyState || /loaded|complete/.test(n.readyState)) {
              n.onload = n.onreadystatechange = null;
              if (n.parentNode) {
                n.parentNode.removeChild(n)
              }
              n = null;
              if (!t) {
                i(200, "success")
              }
            }
          };
          r.insertBefore(n, r.firstChild)
        },
        abort: function () {
          if (n) {
            n.onload(t, true)
          }
        }
      }
    }
  });
  var jn = [],
    Fn = /(=)\?(?=&|$)|\?\?/;
  b.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var e = jn.pop() || b.expando + "_" + yn++;
      this[e] = true;
      return e
    }
  });
  b.ajaxPrefilter("json jsonp", function (n, r, i) {
    var s, o, u, a = n.jsonp !== false && (Fn.test(n.url) ? "url" : typeof n.data === "string" && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Fn.test(n.data) && "data");
    if (a || n.dataTypes[0] === "jsonp") {
      s = n.jsonpCallback = b.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback;
      if (a) {
        n[a] = n[a].replace(Fn, "$1" + s)
      } else if (n.jsonp !== false) {
        n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + s
      }
      n.converters["script json"] = function () {
        if (!u) {
          b.error(s + " was not called")
        }
        return u[0]
      };
      n.dataTypes[0] = "json";
      o = e[s];
      e[s] = function () {
        u = arguments
      };
      i.always(function () {
        e[s] = o;
        if (n[s]) {
          n.jsonpCallback = r.jsonpCallback;
          jn.push(s)
        }
        if (u && b.isFunction(o)) {
          o(u[0])
        }
        u = o = t
      });
      return "script"
    }
  });
  var In, qn, Rn = 0,
    Un = e.ActiveXObject && function () {
      var e;
      for (e in In) {
        In[e](t, true)
      }
    };
  b.ajaxSettings.xhr = e.ActiveXObject ? function () {
    return !this.isLocal && zn() || Wn()
  } : zn;
  qn = b.ajaxSettings.xhr();
  b.support.cors = !! qn && "withCredentials" in qn;
  qn = b.support.ajax = !! qn;
  if (qn) {
    b.ajaxTransport(function (n) {
      if (!n.crossDomain || b.support.cors) {
        var r;
        return {
          send: function (i, s) {
            var o, u, a = n.xhr();
            if (n.username) {
              a.open(n.type, n.url, n.async, n.username, n.password)
            } else {
              a.open(n.type, n.url, n.async)
            } if (n.xhrFields) {
              for (u in n.xhrFields) {
                a[u] = n.xhrFields[u]
              }
            }
            if (n.mimeType && a.overrideMimeType) {
              a.overrideMimeType(n.mimeType)
            }
            if (!n.crossDomain && !i["X-Requested-With"]) {
              i["X-Requested-With"] = "XMLHttpRequest"
            }
            try {
              for (u in i) {
                a.setRequestHeader(u, i[u])
              }
            } catch (f) {}
            a.send(n.hasContent && n.data || null);
            r = function (e, i) {
              var u, f, l, c;
              try {
                if (r && (i || a.readyState === 4)) {
                  r = t;
                  if (o) {
                    a.onreadystatechange = b.noop;
                    if (Un) {
                      delete In[o]
                    }
                  }
                  if (i) {
                    if (a.readyState !== 4) {
                      a.abort()
                    }
                  } else {
                    c = {};
                    u = a.status;
                    f = a.getAllResponseHeaders();
                    if (typeof a.responseText === "string") {
                      c.text = a.responseText
                    }
                    try {
                      l = a.statusText
                    } catch (h) {
                      l = ""
                    }
                    if (!u && n.isLocal && !n.crossDomain) {
                      u = c.text ? 200 : 404
                    } else if (u === 1223) {
                      u = 204
                    }
                  }
                }
              } catch (p) {
                if (!i) {
                  s(-1, p)
                }
              }
              if (c) {
                s(u, l, c, f)
              }
            };
            if (!n.async) {
              r()
            } else if (a.readyState === 4) {
              setTimeout(r)
            } else {
              o = ++Rn;
              if (Un) {
                if (!In) {
                  In = {};
                  b(e).unload(Un)
                }
                In[o] = r
              }
              a.onreadystatechange = r
            }
          },
          abort: function () {
            if (r) {
              r(t, true)
            }
          }
        }
      }
    })
  }
  var Xn, Vn, $n = /^(?:toggle|show|hide)$/,
    Jn = new RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"),
    Kn = /queueHooks$/,
    Qn = [nr],
    Gn = {
      "*": [

        function (e, t) {
          var n, r, i = this.createTween(e, t),
            s = Jn.exec(t),
            o = i.cur(),
            u = +o || 0,
            a = 1,
            f = 20;
          if (s) {
            n = +s[2];
            r = s[3] || (b.cssNumber[e] ? "" : "px");
            if (r !== "px" && u) {
              u = b.css(i.elem, e, true) || n || 1;
              do {
                a = a || ".5";
                u = u / a;
                b.style(i.elem, e, u + r)
              } while (a !== (a = i.cur() / o) && a !== 1 && --f)
            }
            i.unit = r;
            i.start = u;
            i.end = s[1] ? u + (s[1] + 1) * n : n
          }
          return i
        }
      ]
    };
  b.Animation = b.extend(er, {
    tweener: function (e, t) {
      if (b.isFunction(e)) {
        t = e;
        e = ["*"]
      } else {
        e = e.split(" ")
      }
      var n, r = 0,
        i = e.length;
      for (; r < i; r++) {
        n = e[r];
        Gn[n] = Gn[n] || [];
        Gn[n].unshift(t)
      }
    },
    prefilter: function (e, t) {
      if (t) {
        Qn.unshift(e)
      } else {
        Qn.push(e)
      }
    }
  });
  b.Tween = rr;
  rr.prototype = {
    constructor: rr,
    init: function (e, t, n, r, i, s) {
      this.elem = e;
      this.prop = n;
      this.easing = i || "swing";
      this.options = t;
      this.start = this.now = this.cur();
      this.end = r;
      this.unit = s || (b.cssNumber[n] ? "" : "px")
    },
    cur: function () {
      var e = rr.propHooks[this.prop];
      return e && e.get ? e.get(this) : rr.propHooks._default.get(this)
    },
    run: function (e) {
      var t, n = rr.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = t = b.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration)
      } else {
        this.pos = t = e
      }
      this.now = (this.end - this.start) * t + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this)
      }
      if (n && n.set) {
        n.set(this)
      } else {
        rr.propHooks._default.set(this)
      }
      return this
    }
  };
  rr.prototype.init.prototype = rr.prototype;
  rr.propHooks = {
    _default: {
      get: function (e) {
        var t;
        if (e.elem[e.prop] != null && (!e.elem.style || e.elem.style[e.prop] == null)) {
          return e.elem[e.prop]
        }
        t = b.css(e.elem, e.prop, "");
        return !t || t === "auto" ? 0 : t
      },
      set: function (e) {
        if (b.fx.step[e.prop]) {
          b.fx.step[e.prop](e)
        } else if (e.elem.style && (e.elem.style[b.cssProps[e.prop]] != null || b.cssHooks[e.prop])) {
          b.style(e.elem, e.prop, e.now + e.unit)
        } else {
          e.elem[e.prop] = e.now
        }
      }
    }
  };
  rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
    set: function (e) {
      if (e.elem.nodeType && e.elem.parentNode) {
        e.elem[e.prop] = e.now
      }
    }
  };
  b.each(["toggle", "show", "hide"], function (e, t) {
    var n = b.fn[t];
    b.fn[t] = function (e, r, i) {
      return e == null || typeof e === "boolean" ? n.apply(this, arguments) : this.animate(ir(t, true), e, r, i)
    }
  });
  b.fn.extend({
    fadeTo: function (e, t, n, r) {
      return this.filter(nn).css("opacity", 0).show().end().animate({
        opacity: t
      }, e, n, r)
    },
    animate: function (e, t, n, r) {
      var i = b.isEmptyObject(e),
        s = b.speed(t, n, r),
        o = function () {
          var t = er(this, b.extend({}, e), s);
          o.finish = function () {
            t.stop(true)
          };
          if (i || b._data(this, "finish")) {
            t.stop(true)
          }
        };
      o.finish = o;
      return i || s.queue === false ? this.each(o) : this.queue(s.queue, o)
    },
    stop: function (e, n, r) {
      var i = function (e) {
        var t = e.stop;
        delete e.stop;
        t(r)
      };
      if (typeof e !== "string") {
        r = n;
        n = e;
        e = t
      }
      if (n && e !== false) {
        this.queue(e || "fx", [])
      }
      return this.each(function () {
        var t = true,
          n = e != null && e + "queueHooks",
          s = b.timers,
          o = b._data(this);
        if (n) {
          if (o[n] && o[n].stop) {
            i(o[n])
          }
        } else {
          for (n in o) {
            if (o[n] && o[n].stop && Kn.test(n)) {
              i(o[n])
            }
          }
        }
        for (n = s.length; n--;) {
          if (s[n].elem === this && (e == null || s[n].queue === e)) {
            s[n].anim.stop(r);
            t = false;
            s.splice(n, 1)
          }
        }
        if (t || !r) {
          b.dequeue(this, e)
        }
      })
    },
    finish: function (e) {
      if (e !== false) {
        e = e || "fx"
      }
      return this.each(function () {
        var t, n = b._data(this),
          r = n[e + "queue"],
          i = n[e + "queueHooks"],
          s = b.timers,
          o = r ? r.length : 0;
        n.finish = true;
        b.queue(this, e, []);
        if (i && i.cur && i.cur.finish) {
          i.cur.finish.call(this)
        }
        for (t = s.length; t--;) {
          if (s[t].elem === this && s[t].queue === e) {
            s[t].anim.stop(true);
            s.splice(t, 1)
          }
        }
        for (t = 0; t < o; t++) {
          if (r[t] && r[t].finish) {
            r[t].finish.call(this)
          }
        }
        delete n.finish
      })
    }
  });
  b.each({
    slideDown: ir("show"),
    slideUp: ir("hide"),
    slideToggle: ir("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function (e, t) {
    b.fn[e] = function (e, n, r) {
      return this.animate(t, e, n, r)
    }
  });
  b.speed = function (e, t, n) {
    var r = e && typeof e === "object" ? b.extend({}, e) : {
      complete: n || !n && t || b.isFunction(e) && e,
      duration: e,
      easing: n && t || t && !b.isFunction(t) && t
    };
    r.duration = b.fx.off ? 0 : typeof r.duration === "number" ? r.duration : r.duration in b.fx.speeds ? b.fx.speeds[r.duration] : b.fx.speeds._default;
    if (r.queue == null || r.queue === true) {
      r.queue = "fx"
    }
    r.old = r.complete;
    r.complete = function () {
      if (b.isFunction(r.old)) {
        r.old.call(this)
      }
      if (r.queue) {
        b.dequeue(this, r.queue)
      }
    };
    return r
  };
  b.easing = {
    linear: function (e) {
      return e
    },
    swing: function (e) {
      return .5 - Math.cos(e * Math.PI) / 2
    }
  };
  b.timers = [];
  b.fx = rr.prototype.init;
  b.fx.tick = function () {
    var e, n = b.timers,
      r = 0;
    Xn = b.now();
    for (; r < n.length; r++) {
      e = n[r];
      if (!e() && n[r] === e) {
        n.splice(r--, 1)
      }
    }
    if (!n.length) {
      b.fx.stop()
    }
    Xn = t
  };
  b.fx.timer = function (e) {
    if (e() && b.timers.push(e)) {
      b.fx.start()
    }
  };
  b.fx.interval = 13;
  b.fx.start = function () {
    if (!Vn) {
      Vn = setInterval(b.fx.tick, b.fx.interval)
    }
  };
  b.fx.stop = function () {
    clearInterval(Vn);
    Vn = null
  };
  b.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  };
  b.fx.step = {};
  if (b.expr && b.expr.filters) {
    b.expr.filters.animated = function (e) {
      return b.grep(b.timers, function (t) {
        return e === t.elem
      }).length
    }
  }
  b.fn.offset = function (e) {
    if (arguments.length) {
      return e === t ? this : this.each(function (t) {
        b.offset.setOffset(this, e, t)
      })
    }
    var n, r, s = {
        top: 0,
        left: 0
      }, o = this[0],
      u = o && o.ownerDocument;
    if (!u) {
      return
    }
    n = u.documentElement;
    if (!b.contains(n, o)) {
      return s
    }
    if (typeof o.getBoundingClientRect !== i) {
      s = o.getBoundingClientRect()
    }
    r = sr(u);
    return {
      top: s.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
      left: s.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
    }
  };
  b.offset = {
    setOffset: function (e, t, n) {
      var r = b.css(e, "position");
      if (r === "static") {
        e.style.position = "relative"
      }
      var i = b(e),
        s = i.offset(),
        o = b.css(e, "top"),
        u = b.css(e, "left"),
        a = (r === "absolute" || r === "fixed") && b.inArray("auto", [o, u]) > -1,
        f = {}, l = {}, c, h;
      if (a) {
        l = i.position();
        c = l.top;
        h = l.left
      } else {
        c = parseFloat(o) || 0;
        h = parseFloat(u) || 0
      } if (b.isFunction(t)) {
        t = t.call(e, n, s)
      }
      if (t.top != null) {
        f.top = t.top - s.top + c
      }
      if (t.left != null) {
        f.left = t.left - s.left + h
      }
      if ("using" in t) {
        t.using.call(e, f)
      } else {
        i.css(f)
      }
    }
  };
  b.fn.extend({
    position: function () {
      if (!this[0]) {
        return
      }
      var e, t, n = {
          top: 0,
          left: 0
        }, r = this[0];
      if (b.css(r, "position") === "fixed") {
        t = r.getBoundingClientRect()
      } else {
        e = this.offsetParent();
        t = this.offset();
        if (!b.nodeName(e[0], "html")) {
          n = e.offset()
        }
        n.top += b.css(e[0], "borderTopWidth", true);
        n.left += b.css(e[0], "borderLeftWidth", true)
      }
      return {
        top: t.top - n.top - b.css(r, "marginTop", true),
        left: t.left - n.left - b.css(r, "marginLeft", true)
      }
    },
    offsetParent: function () {
      return this.map(function () {
        var e = this.offsetParent || s.documentElement;
        while (e && !b.nodeName(e, "html") && b.css(e, "position") === "static") {
          e = e.offsetParent
        }
        return e || s.documentElement
      })
    }
  });
  b.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (e, n) {
    var r = /Y/.test(n);
    b.fn[e] = function (i) {
      return b.access(this, function (e, i, s) {
        var o = sr(e);
        if (s === t) {
          return o ? n in o ? o[n] : o.document.documentElement[i] : e[i]
        }
        if (o) {
          o.scrollTo(!r ? s : b(o).scrollLeft(), r ? s : b(o).scrollTop())
        } else {
          e[i] = s
        }
      }, e, i, arguments.length, null)
    }
  });
  b.each({
    Height: "height",
    Width: "width"
  }, function (e, n) {
    b.each({
      padding: "inner" + e,
      content: n,
      "": "outer" + e
    }, function (r, i) {
      b.fn[i] = function (i, s) {
        var o = arguments.length && (r || typeof i !== "boolean"),
          u = r || (i === true || s === true ? "margin" : "border");
        return b.access(this, function (n, r, i) {
          var s;
          if (b.isWindow(n)) {
            return n.document.documentElement["client" + e]
          }
          if (n.nodeType === 9) {
            s = n.documentElement;
            return Math.max(n.body["scroll" + e], s["scroll" + e], n.body["offset" + e], s["offset" + e], s["client" + e])
          }
          return i === t ? b.css(n, r, u) : b.style(n, r, i, u)
        }, n, o ? i : t, o, null)
      }
    })
  });
  e.jQuery = e.$ = b;
  if (typeof define === "function" && define.amd && define.amd.jQuery) {
    define("jquery", [], function () {
      return b
    })
  }
})(window)