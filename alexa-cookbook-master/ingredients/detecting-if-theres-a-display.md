# Display Detection

There are cases where you will want to check if you have access a display so
you can create a display directive. You can check
`this.event.context.System.device.supportedInterfaces.Display`

From your intent you can call `supportsDisplay` and if it returns `true` you
can build your display directive.

    if (supportsDisplay.call(this)) {
        // Build your display directive here
    }

You can drop the following helper function, `supportsDisplay` into your code
and go to town building your display directives.

    function supportsDisplay() {
      var hasDisplay =
        this.event.context &&
        this.event.context.System &&
        this.event.context.System.device &&
        this.event.context.System.device.supportedInterfaces &&
        this.event.context.System.device.supportedInterfaces.Display

      return hasDisplay;
    }

For a more in-depth look at creating a display directive and leveraging this
helper function see [display-directives/listTemplate/index.js](../display-directive/listTemplate/index.js)
