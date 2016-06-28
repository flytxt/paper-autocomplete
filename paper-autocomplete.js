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
      reflectToAttribute: true,
      notify: true
    },

    /**
     * If true, value will be appended to the existing one, rather than replacing it
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
      notify: true,
      observer: '_useSuggestion'
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
    }
  },

  /**
   * Prepares select/option item's value.
   * 
   * @param {object}
   *          Selected object.
   * @return {string} value.
   */
  _update: function() {
    var me = this;
    this.source(this.input.value, function(suggestions) {
      if (suggestions.length <= 0) { return; }
      me._suggestions = suggestions;
      if (me.focused) {
        setTimeout(function() {
          me.menuDropdown = me.querySelector('#menudropdown');
          me.menuDropdown.open();
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
    this.selected = undefined;
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
    this.focused = false;
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
    me.value = me.input.value = me.setValue(item);
    me.paperInput.value = me._labelOf(item);
    me._close();
  },

  /**
   * The intial setup, binding focus, keyup and blur event-handlers.
   */
  _setup: function() {
    var me = this;
    var input = me.input = me.querySelector('paper-input').$.input;
    me.paperInput = me.querySelector('paper-input');
    this.value = input.value;
    input.addEventListener('keyup', me._open.bind(me));
    input.addEventListener('focus', me._open.bind(me));
    input.addEventListener('blur', me._close.bind(me));
  },

  attached: function() {
    this._setup();
  }
});
