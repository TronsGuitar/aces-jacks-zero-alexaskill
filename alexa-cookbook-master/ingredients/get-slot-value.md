# Getting A Slot Value

When retrieving a slot value from the Alexa response, you can use the syntax (where SLOTNAME is the name of your slot):
`this.event.request.intent.slots.SLOTNAME.value`

It is possible that your intent may have been called appropriately, but Alexa
did not recognize a slot value.  In this case, the syntax above would result
in an undefined reference and throw an error.

From your intent you can call `getSpokenValue` and it will either return the
slot value, or 'undefined' if it is not available.

    var spokenValue = getSpokenValue.call(this, slotName);

You can drop the following helper function, `getSpokenValue` into your code
and finish the rest of your intent code.

    function getSpokenValue(slotName)
    {
        if (this &&
            this.event &&
            this.event.request &&
            this.event.request.intent &&
            this.event.request.intent.slots &&
            this.event.request.intent.slots[slotName] &&
            this.event.request.intent.slots[slotName].value)
        {
            return this.event.request.intent.slots[slotName].value;    
        }
        else return undefined;
    }
