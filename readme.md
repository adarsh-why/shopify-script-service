## Integration

Add the below script in the head of the HTML page

```js
<script src="http://adarsh-why.github.io/shopify-script-service/storybrainSearch.js" type="textjavascript"></script>
```

## Basic Usage

Simply call the `storybrainSearch()` method on HTML body onload attribute.

This will initiate the search in the page with default settings.

```html
<Body onload="storybrainSearch()">
```

## Advanced Usage

Add the below script with custom values in the head of HTML
```js
<script>
  const settings = {
    theme: {
      textColor: "brown",
      backgroundColor: "#00FFFF",
      highlight: "rgba(232, 126, 4, 1)",
      activeHighlight: "rgb(0, 0, 255)"
    },
    enableHistory: false,
    historyItemsCount: 4,
    disableDesktop: true
  }
</script>
```
Then inovoke the the function `storybrainSearch()`  on HTML body onload attribute with the custom settings like

```js
<Body onload="storybrainSearch(settings)">
```

### Customization

Colors for the theme can be specified with predefined color names, or with RGB, HEX, HSL, RGBA, or HSLA values as shown below.

```js
theme: {
  textColor: "brown",
  backgroundColor: "#00FFFF",
  highlight: "rgba(232, 126, 4, 1)",
  activeHighlight: "rgb(0, 0, 255)"
}
```

`enableHistory`: `true` will enable the suggestion box which will show suggestions from the history which is `false` by default.

`historyItemsCount`: `3` will show only maximum of 3 items in the suggestion box. if the `enableHistory` is set to `false`, then this setting will be of no effect 

`disableDesktop`: `true` will hide the search for any device of width more than `700px`. By default, it is set to false


## Default Settings

Below object is the default settings used when the function `storybrainSearch()` is invoked without passing any parameters.

If the function `storybrainSearch(settings)` is invoked with a setting but missing any key or value, then that key or value in the default settings will be used.

```js
{
  theme: {
    textColor: "rgb(105,105,105)",
    backgroundColor: "rgb(229,229,229)",
    highlight: "rgb(255,255,0)",
    activeHighlight: "rgba(249, 105, 14, 1)",
  },
  enableHistory: false,
  historyItemsCount: 3,
  disableDesktop: false
}
```
