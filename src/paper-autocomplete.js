Polymer({
  is: 'paper-autocomplete',// attributes="selected"
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
     * value of each item in the list
     */
    valueField: {
      type: String,
      value: 'value'
    },
    /**
     * Text to be shown in the dropdown for each value
     */
    labelField: {
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
     * Threshold after which the supplier is triggered
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
     * Menu-close delay in milliseconds
     */
    _closeDelay: {
      type: Number,
      value: 150
    },
    /**
     * The suggestions supplier
     */
    supplier: {
      type: Object,
      notify: true
    }
  },
  /**
   * Prepares select/option item's value.
   *
   * @param {object} Selected object.
   * @return {string} value.
   */
  _update: function() {
    var me = this;
    this.supplier(this.input.value, function(suggestions) {
      if (suggestions.length <= 0) { return; }
      me._suggestions = me._prepareAvailable(suggestions);
      me.value = me.input.value;
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
   * @param {object} Selected object.
   * @return {string} value.
   */
  _open: function() {
    this.focused = true;
    clearTimeout(this._changeTimeOut);
    this._changeTimeOut = setTimeout(this._update.bind(this), this._threshold);
  },
  /**
   * to close the drop-down
   *
   * @param {object} Selected object.
   * @return {string} value.
   */
  _close: function() {
    var me = this;
    this.focused = false;
    clearTimeout(me._changeTimeOut);
    clearTimeout(me._closeTimeout);
    me._closeTimeout = setTimeout(function() {
      me.menuDropdown.close();
    }, this._closeDelay);
  },
  /**
   * Prepares the list of suggestions.
   *
   * @param {list} suggestions.
   * @return {string} value.
   */
  _prepareAvailable: function(values) {
    var me = this;
    var valueField = me.valueField;
    var labelField = me.labelField;
    return values.map(function(value, i) {
      if (typeof value === 'string') {
        if (!value || !value.length) { throw 'Can\'t accept falsy value in choices list. Item ' + i + ': `' + value + '`'; }
        var item = {};
        item[valueField] = value;
        item[labelField] = value;
        return item;
      } else {
        return value;
      }
    });
  },
  /**
   * Setter
   *
   * @param {object} Selected object.
   * @return {string} value.
   */
  setValue: function(e) {
    var me = this;
    me.$.select.selected = e.target.selected;
  },
  /**
   * Getter
   *
   * @return {string} value.
   */
  getValue: function() {
    return this.$.select.selected;
  },
  /**
   * Prepares select/option item's value.
   *
   * @param {object} Selected object.
   * @return {string} value.
   */
  _valueOf: function(hint) {
    if (this.valueField === null) {
      return hint || '';
    }
    return typeof hint === 'object' && hint ? hint[this.valueField] : hint || '';
  },
  /**
   * Prepares select/option item's display.
   *
   * @param {object} Selected object.
   * @return {string} label.
   */
  _labelOf: function(hint) {
    if (this.labelField === null) {
      return hint || '';
    }
    return typeof hint === 'object' && hint ? hint[this.labelField] : hint || '';
  },
  /**
   * Handler for each item selection from dropdown
   *
   * @param {event} tap event.
   */
  _useSuggestion: function(e) {
    if (this.append) {
      this.input.value = this.input.value.trim() + ' ' + e.target.value;
    } else {
      this.input.value = e.target.value;
    }
    this.querySelector('paper-input').value = this.input.value;
    this.set('value', this.input.value);
    this.input.focus();
    this._close();
  },
  /**
   * The intial setup, binding focus, keyup and blur event-handlers.
   */
  _setup: function() {
    var me = this;
    var input = me.input = me.querySelector('paper-input').$.input;
    me.value = input.value;
    input.addEventListener('keyup', me._open.bind(me));
    input.addEventListener('focus', me._open.bind(me));
    input.addEventListener('blur', me._close.bind(me));
  },
  attached: function() {
    this._setup();
  }
});
