Polymer({
  is: 'paper-autocomplete',

  properties: {

    /**
     * time in milliseconds after which an update is called
     */
    _changeTimeOut: Number,

    /**
     * time in milliseconds after which the menu is closed
     */
    _closeTimeout: Number,

    /**
     * milliseconds after which the menu is opened
     */
    _redrawFix: {
      type: Number,
      value: 500
    },

    /**
     * Returns true if the value is valid.
     * 
     * If `autoValidate` is true, the `valid` attribute is managed automatically, which can clobber attempts to manage it manually.
     */
    valid: {
      type: Boolean,
      value: true,
      notify: true
    },

    /**
     * Set to true to add values apart from the existing ones chosen from the drop-down
     * 
     */
    add: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * Set to true to auto-validate the input value.
     */
    autoValidate: {
      type: Boolean,
      value: false
    },

    /**
     * Value to be set in the element for each selection
     */
    attrForValue: {
      type: String,
      value: 'value',
      reflectToAttribute: true
    },

    /**
     * Text to be shown in the dropdown for each value
     */
    attrForLabel: {
      type: String,
      value: 'name'
    },

    /**
     * set to true when the element is in focus
     */
    focused: Boolean,

    /**
     * the list of values from which the value can be chosen
     */
    _suggestions: {
      type: Array,
      value: []
    },

    /**
     * Threshold after which the source is triggered
     */
    _threshold: {
      type: Number,
      value: 400,
    },

    /**
     * Selected value
     */
    value: {
      type: String,
      notify: true
    },

    /**
     * If true, value will be appended to the existing one, rather than replacing it, currently not implemented
     */
    append: {
      type: Boolean,
      value: false,
    },

    /**
     * the selected object
     */
    selected: {
      type: Object,
      notify: true
    },

    /**
     * Menu-close delay in milliseconds
     */
    _closeDelay: {
      type: Number,
      value: 150
    },

    /**
     * The suggestions source
     */
    source: {
      type: Object,
      notify: true
    },

    /**
     * The paper-input element
     */
    _paperInput: {
      type: Object
    }
  },
  behaviors: [Polymer.IronFormElementBehavior, Polymer.IronResizableBehavior],
  observers: ['_setValid(valid, _paperInput)', '_useSuggestion(selected)', '_onFocusedChanged(focused)'],

  /**
   * Prepares select/option item's value.
   * 
   * @param {object}
   *          Selected object.
   * @return {string} value.
   */
  _update: function() {
    var me = this;
    this.source(me._paperInput.value, function(suggestions) {
      me._suggestions = suggestions;
      if (suggestions.length <= 0) { return; }
      if (me.focused) {
        setTimeout(function() {
          me.menuDropdown = me.querySelector('#menudropdown');
          me.menuDropdown.open();
          me.menuDropdown.notifyResize();
          me.menuDropdown.focus();
        }, me._redrawFix);
      }
    });
  },

  /**
   * Prepares select/option item's value.
   * 
   * @param {object}
   *          Selected object.
   * @return {string} value.
   */
  _open: function() {
    this.focused = true;
    clearTimeout(this._changeTimeOut);
    this._changeTimeOut = setTimeout(this._update.bind(this), this._threshold);
  },

  /**
   * Clears the input text
   */
  _clear: function() {
    var me = this;
    me.selected = undefined;
    this._close();
  },

  /**
   * to close the drop-down
   * 
   * @param {object}
   *          Selected object.
   * @return {string} value.
   */
  _close: function() {
    var me = this;
    me.focused = false;
    clearTimeout(me._changeTimeOut);
    clearTimeout(me._closeTimeout);
    me._closeTimeout = setTimeout(function() {
      if (me.menuDropdown) {
        me.menuDropdown.close();
      }
    }, this._closeDelay);
  },

  /**
   * Setter
   * 
   * @param {object}
   *          Selected object.
   * @return {string} value.
   */
  setValue: function(hint) {
    return typeof hint === 'object' && hint ? hint[this.attrForValue] : hint || '';
  },

  /**
   * Getter
   * 
   * @return {string} value.
   */
  getValue: function() {
    return this.value;
  },

  /**
   * Prepares select/option item's display.
   * 
   * @param {object}
   *          Selected object.
   * @return {string} label.
   */
  _labelOf: function(hint) {
    if (this.attrForLabel === null) { return hint || ''; }
    return hint && typeof hint === 'object' ? hint[this.attrForLabel] : hint || '';
  },

  /**
   * Handler for each item selection from dropdown
   * 
   * @param {event}
   *          tap event.
   */
  _useSuggestion: function(item) {
    var me = this;
    me._paperInput = me.querySelector('paper-input');
    me.input = me._paperInput.$.input;
    me.value = me.setValue(item);
    me._paperInput.value = me._labelOf(item);
    this._handleAutoValidate();
    me._close();
  },

  /**
   * The intial setup, binding focus, keyup and blur event-handlers.
   */
  _setup: function() {
    var me = this;
    me._paperInput = me.querySelector('paper-input');
    me.input = me._paperInput.$.input;
    me.input.required = me.required;
    me.value = me.input.value;
    me._paperInput.addEventListener('keyup', me._valueObserver.bind(me));
    me._paperInput.addEventListener('focus', me._open.bind(me));
    me._paperInput.addEventListener('blur', me._close.bind(me));
  },

  /**
   * Validate function to be executed during form validate
   */
  validate: function() {
    this.valid = !this.required || (this.required && !!this.value);
    return this.valid;
  },

  /**
   * observer for valid attribute
   */
  _setValid: function(valid, input) {
    input.invalid = !valid;
  },

  /**
   * If `autoValidate` is true, then validates the element.
   */
  _handleAutoValidate: function() {
    if (this.autoValidate) {
      this.validate();
    }
  },

  /**
   * Observer for 'focused', to trigger validate() if autoValidate is enabled
   */
  _onFocusedChanged: function() {
    if (!this.focused) {
      this._handleAutoValidate();
    }
  },

  /**
   * observer for input value, this clears the element's selected option & value if it is not matching with the selected value.
   */
  _valueObserver: function() {
    var me = this;
    //adding new tags
    if (me.add) {
      me.selected = me._paperInput.value;
    }
    //from existing tags
    if (me.value !== me._paperInput.value && !me.add) {
      me.selected = undefined;
      //me.value = '';
    }
    me._open();
  },
  attached: function() {
    this._setup();
  }
});
