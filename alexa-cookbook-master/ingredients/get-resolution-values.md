# Getting Values From Entity Resolution

When retrieving a slot value from the Alexa response, you can also rely on the matching values provided by Entity Resolution:
`this.event.request.intent.slots.SLOTNAME.resolutions.resolutionsPerAuthority[0].values`

It is possible that your intent may have been called appropriately, but Alexa
did not recognize a slot value.  In this case, the syntax above would result
in an undefined reference and throw an error.

From your intent you can call `getResolvedValue` and it will either return the
resolved values, or 'undefined' if it is not available.

    var resolvedValues = getResolvedValues.call(this, slotName);

You can drop the following helper function, `getResolvedValues` into your code
and finish the rest of your intent code.

    function getResolvedValues(slotName)
    {
        if (this &&
            this.event &&
            this.event.request &&
            this.event.request.intent &&
            this.event.request.intent.slots &&
            this.event.request.intent.slots[slotName] &&
            this.event.request.intent.slots[slotName].resolutions &&
            this.event.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
            this.event.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
            this.event.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values)
        {
            return this.event.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values;
        }
        else return undefined;
    }
