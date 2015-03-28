# LiveReactload browser API

This API is meant to be used along with [LiveReactload](https://github.com/milankinen/livereactload). 
Check it to get more information.

This project contains very lightweight browser API which can be used if
your application needs to:

 * Propagate state between reloading events that is not managed by React components
 * Expose private (non-exported) components so that their state propagation can be properly
   handled during reloading events

This API does not depend on LiveReactload server and browserify transformation
so it can be mixed with the production code - if browserify transformation is not
enabled, then these API methods are practically no-ops.

## API

    // npm install --save livereactload-api
    var lrApi = require('livereactload-api')

### .onLoad(callback)

This method sets the event listener to the first `window.onload` event 
and every reloading event. It takes one callback function which is called
with the previous state that should be propagated across the reload events.

    lrApi.onLoad(function(state) {
      var currentState = state || window.INITIAL_STATE_FROM_SERVER
      React.render(...use currentState to render your root component ...)
    })

If LiveReactload transformer is not set, then this method is equivalent to
`window.onload = callback` (state = undefined).
    
### .setState(newState)
    
This method sets the state that should be propagated across the next reload
events. Calling this method sequentially overrides the old values.
  
    lrApi.onLoad(function(state) {
      var initialModel = state || window.INITIAL_STATE_FROM_SERVER
      // modelStream handles the state when user interacts with the application
      var modelStream = Bacon.combineTemplate({
        ...construct stream with initialModel...
      })
      modelStream.onValue(function(model) {
        // next time when reloading occurs, the .onLoad state will receive this model
        // -> state is propagated 
        lrApi.setState(model)
        React.render(...model...)
      })
    })

If LiveReactload transformer is not set, then this method does nothing.

### .expose(cls, id)

Provides a way to expose private inner components to LiveReactload so that
their state can be propagated across reload events.

    var List = lrApi.expose(React.createClass({...}), 'MyUniqueListId')
    
    module.exports = React.createClass({
      render: function() {
        return (
          <div>
            <List items={this.props.items} />
          </div>
        )
      }
    })
    
Note that id is mandatory and it must be unique. You can for example use `__dirname` 
to ensure uniqueness.

If LiveReactload transformer is not set, then this method does nothing.
