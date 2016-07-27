# paper-autocomplete [![Build Status](https://travis-ci.org/tinkerD/paper-autocomplete.svg?branch=master)](https://travis-ci.org/tinkerD/paper-autocomplete)
A type-ahead web component for Polymer 1.0.0 or above.

Example:

```html
<paper-autocomplete id="example" source="{{listProvider}}" value="{{inputValue}}">
  <paper-input label="Example"></paper-input>
</paper-autocomplete>
```

### Styling

The following custom properties and mixins are available for styling:

| Custom property | Description |
| --- | --- | --- |
| `--paper-autocomplete` | Mixin applied to the element |
| `--paper-autocomplete-dropdown` | Mixin applied to the dropdown |
| `--paper-autocomplete-item` | Mixin applied to the paper-item |
| `--paper-autocomplete-menu` | Mixin applied to the paper-menu |
