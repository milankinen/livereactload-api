
module.exports = {

  onReload: function(callback) {
    withLiveReactload(function(lrload) {
      if (!lrload.onReloadCallbacks) {
        lrload.onReloadCallbacks = [];
      }
      lrload.onReloadCallbacks.push(callback);
    });
  },

  setState: function(name, state) {
    var numArgs = arguments.length;
    withLiveReactload(function(lrload) {
      if (numArgs > 1) {
        if (!lrload.namedStates) {
          lrload.namedStates = {};
        }
        lrload.namedStates[name] = state;
      } else {
        state = name;
        lrload.state = state;
      }
    });
  },

  getState: function(name) {
    var state;
    var numArgs = arguments.length;
    withLiveReactload(function(lrload) {
      if (numArgs > 0) {
        state = lrload.namedStates ? lrload.namedStates[name] : undefined;
      } else {
        state = lrload.state;
      }
    });
    return state;
  },

  expose: function(clz, id) {
    if (!id) {
      throw new Error('ID is mandatory for class exposing');
    }
    withLiveReactload(function(lrload) {
      if (lrload.exposeClass) {
        clz = lrload.exposeClass(lrload, clz, id);
      }
    });
    return clz;
  }

};

function withLiveReactload(cb) {
  if (typeof window !== 'undefined') {
    var lrload = window.__livereactload;
    if (lrload) {
      cb(lrload);
    }
  }
}
