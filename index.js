

module.exports = {

  onLoad: function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('"onLoad" must have a callback function');
    }

    withLiveReactload(setupOnLoadHandlers)
    withoutLiveReactload(function() {
      setupOnLoadHandlers({})
    })

    function setupOnLoadHandlers(lrload) {
      var winOnload = window.onload;
      if (!winOnload || !winOnload.__is_livereactload) {
        window.onload = function () {
          // initial load event
          callback(lrload.state);
          lrload.winloadDone = true;
          if (typeof winOnload === 'function' && !winOnload.__is_livereactload) {
            winOnload();
          }
        }
      }
      window.onload.__is_livereactload = true;
      if (lrload.winloadDone) {
        // reload event
        callback(lrload.state)
      }
    }
  },

  setState: function(state) {
    withLiveReactload(function(lrload) {
      lrload.state = state;
    })
  },

  expose: function(cls, id) {
    withLiveReactload(function(lrload) {
      if (lrload.makeHot) {
        lrload.makeHot({exports: cls}, 'CUSTOM_' + id);
      }
    })
  }

}

function withLiveReactload(cb) {
  if (typeof window !== 'undefined') {
    var lrload = window.__livereactload;
    if (lrload) {
      cb(lrload);
    }
  }
}

function withoutLiveReactload(cb) {
  if (typeof window === 'undefined' || !window.__livereactload) {
    cb();
  }
}

