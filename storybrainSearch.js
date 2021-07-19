const script = document.createElement("script")
script.src = "https://code.jquery.com/jquery-3.4.1.min.js"
script.type = "text/javascript"

document.getElementsByTagName("head")[0].appendChild(script)

var historyArr = []

var dSettings = {
  theme: {
    textColor: "rgb(105,105,105)",
    backgroundColor: "rgb(229,229,229)",
    highlight: "rgb(255,255,0)",
    activeHighlight: "rgba(249, 105, 14, 1)",
  }
}

function validateSettings(settings=dSettings) {
  if ('theme' in settings) {
    let dtheme = dSettings.theme
    let theme = settings.theme
    if (!("textColor" in theme) || !theme["textColor"]) theme.textColor = dtheme.textColor
    if (!("backgroundColor" in theme) || !theme["backgroundColor"]) theme.backgroundColor = dtheme.backgroundColor
    if (!("highlight" in theme) || !theme["highlight"]) theme.highlight = dtheme.highlight
    if (!("activeHighlight" in theme) || !theme["activeHighlight"]) theme.activeHighlight = dtheme.activeHighlight
  } else {
    settings.theme = dSettings.theme
  }
  if (!("enableHistory" in settings)) settings.enableHistory = false
  if (!("historyItemsCount" in settings || !settings["historyItemsCount"])) settings.historyItemsCount = 3
  if (!("disableDesktop" in settings)) settings.disableDesktop = false
  console.log("validated setting", settings)
  return settings
}

function storybrainSearch(settings) {
  console.log("settings", settings)
  settings = validateSettings(settings)
  $.ajaxSetup({
    async: false
  });

  $(document).ready(function () {
    if (settings.disableDesktop && $(window).width() > 700) {
      $("#searchIcon").hide();
    }
  });

  $("head").append(
    `<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta http-equiv="content-type" content="application/javascript; charset=UTF-8">
		<link rel="stylesheet" href="http://0aa1c4e725cf.ngrok.io/style.css" />
			<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
			<!-- CSS -->
		<script src="http://0aa1c4e725cf.ngrok.io/jquery.highlight.js"></script>
		<script src="http://0aa1c4e725cf.ngrok.io/jquery.scrollto.js"></script>`
  )

  const body = $("body")

  body.attr("data-finder-content", "")

  body.append(
    $(
      `
        <div class="app" data-finder-wrapper data-finder-scroll-offset="175">
		    </div>
      `
    )
  )

  body.css({
    position: "relative",
  })

  const searchIcon = $(
    `<div>
      <svg width="50" height="50" viewBox="0 0 204 204" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d)">
      <rect x="2.5" y="0.5" width="199" height="199" rx="99.5" fill=${settings.theme.backgroundColor} fill-opacity="0.9" stroke=${settings.theme.textColor}/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M98.25 70C83.7525 70 72 81.7525 72 96.25C72 110.747 83.7525 122.5 98.25 122.5C112.747 122.5 124.5 110.747 124.5 96.25C124.5 81.7525 112.747 70 98.25 70ZM64.5 96.25C64.5 77.6104 79.6104 62.5 98.25 62.5C116.89 62.5 132 77.6104 132 96.25C132 114.89 116.89 130 98.25 130C79.6104 130 64.5 114.89 64.5 96.25Z" fill=${settings.theme.textColor} stroke=${settings.theme.textColor} stroke-linecap="round" stroke-linejoin="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M116.786 114.785C118.25 113.321 120.625 113.321 122.089 114.785L138.402 131.098C139.866 132.562 139.866 134.937 138.402 136.401C136.937 137.866 134.563 137.866 133.098 136.401L116.786 120.089C115.321 118.624 115.321 116.25 116.786 114.785Z" fill=${settings.theme.textColor} stroke=${settings.theme.textColor} stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <filter id="filter0_d" x="0" y="0" width="204" height="204" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="2"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      </defs>
      </svg>
    </div>`
  ).attr({
    id: "searchIcon",
    class: "searchIcon",
  })
  body.append(searchIcon)

  const finder = {
    activator: "[data-finder-activator]",
    content: "[data-finder-content]",
    wrapper: "[data-finder-wrapper]",
    scrollOffset: () => $(finder.wrapper).data("finderScrollOffset"),
    activate: () => {
      // console.log("activate")
      if (!$("#finder").length) {
        finder.createFinder()
      }
      function showSuggestion(input) {
        if ($("#finderCount").length) {
          let result = []
          let counter = 0
          historyArr
            .slice()
            .reverse()
            .forEach(element => {
              // console.log("elem", element)
              if (
                element.includes(input.toLowerCase()) &&
                element.length > input.length &&
                counter < settings.historyItemsCount
              ) {
                result.push(element)
                counter += 1
              }
            })
          if (result.length) {
            // console.log("result", result)
            $(".suggestion-item").remove()
            result.forEach(elem => {
              if ($("#" + elem).length == 0) {
                $("<div />", {
                  click: function (elem) {
                    // console.log("elem", elem.target.innerHTML)
                    $("#finderInput").val(elem.target.innerHTML)
                    $("#finderInput").focus()
                    finder.findTerm($("#finderInput").val())
                    $("#finderbox").hide()
                  },
                })
                  .attr({
                    id: elem,
                    class: "suggestion-item",
                  })
                  .text(elem)
                  .appendTo($("#finderbox"))
              }
            })
            if (settings.enableHistory) $("#finderbox").show()
          }
        }
      }
      setTimeout(function () {
        $("#finder").addClass("active")
        $("#finderInput").focus()
        if ($("#finderInput").val()) {
          finder.findTerm($("#finderInput").val())
          showSuggestion($("#finderInput").val())
        }
        $("#finderInput").on("input", function () {
          $("#finderbox").hide()
          finder.findTerm($(this).val())
          showSuggestion($(this).val())
        })
      }, 50)
    },
    createFinder: () => {
      // console.log("crate fider")
      const finderElem = $("<div />")
        .attr({
          id: "finder",
          class: "finder",
        })
        .prependTo(finder.wrapper)

      const finderElemContent = $(`<div style="background-color:${settings.theme.backgroundColor} !important;"/>`)
        .attr({
          id: "findercontent",
          class: "findercontent",
        })
        .appendTo(finderElem)

      const finderBox = $(`<div style="background-color:${settings.theme.backgroundColor};"/>`)
        .attr({
          id: "finderbox",
          class: "finderbox",
        })
        .appendTo(finderElem)

      const searchText = $("<div />")
        .attr({
          id: "finderSearchText",
          type: "div",
          class: "finder-search-text",
        })
        .text("Search")
        .appendTo(finderElemContent)

      const input = $(
        `<input style="
          background-color:${settings.theme.backgroundColor} !important;
          color: ${settings.theme.textColor};
        "/>`
      ).attr({
          id: "finderInput",
          type: "text",
          class: "finder-input",
        })
        .on("input", function () {
          $(".finder-search-text").hide()
        })
        .appendTo(finderElemContent)

      const prev = $(
        `<div>
          <svg width="20" height="20" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M28.5 5.18182C15.6217 5.18182 5.18182 15.6217 5.18182 28.5C5.18182 41.3783 15.6217 51.8182 28.5 51.8182C41.3783 51.8182 51.8182 41.3783 51.8182 28.5C51.8182 15.6217 41.3783 5.18182 28.5 5.18182ZM0 28.5C0 12.7599 12.7599 0 28.5 0C44.2401 0 57 12.7599 57 28.5C57 44.2401 44.2401 57 28.5 57C12.7599 57 0 44.2401 0 28.5Z" fill=${settings.theme.textColor}/>
          <path d="M30.332 16.3043C29.3202 15.2925 27.6798 15.2925 26.6679 16.3043L16.3043 26.6679C15.2925 27.6798 15.2925 29.3202 16.3043 30.332C17.3161 31.3439 18.9566 31.3439 19.9684 30.332L25.9091 24.3914V38.8636C25.9091 40.2946 27.0691 41.4545 28.5 41.4545C29.9309 41.4545 31.0909 40.2946 31.0909 38.8636V24.3914L37.0316 30.332C38.0434 31.3439 39.6839 31.3439 40.6957 30.332C41.7075 29.3202 41.7075 27.6798 40.6957 26.6679L30.332 16.3043Z" fill=${settings.theme.textColor}/>
          </svg>
        </div>`
      ).attr({
          id: "finderPrev",
          class: "prev-btn-finder",
        })
        .appendTo(finderElemContent)

      const next = $(
        `<div>
          <svg width="20" height="20" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M28.5 51.8182C15.6217 51.8182 5.18182 41.3783 5.18182 28.5C5.18182 15.6217 15.6217 5.18182 28.5 5.18182C41.3783 5.18182 51.8182 15.6217 51.8182 28.5C51.8182 41.3783 41.3783 51.8182 28.5 51.8182ZM0 28.5C0 44.2401 12.7599 57 28.5 57C44.2401 57 57 44.2401 57 28.5C57 12.7599 44.2401 0 28.5 0C12.7599 0 0 12.7599 0 28.5Z" fill=${settings.theme.textColor}/>
          <path d="M30.332 40.6957C29.3202 41.7075 27.6798 41.7075 26.6679 40.6957L16.3043 30.332C15.2925 29.3202 15.2925 27.6798 16.3043 26.6679C17.3161 25.6561 18.9566 25.6561 19.9684 26.6679L25.9091 32.6086V18.1364C25.9091 16.7054 27.0691 15.5455 28.5 15.5455C29.9309 15.5455 31.0909 16.7054 31.0909 18.1364V32.6086L37.0316 26.6679C38.0434 25.6561 39.6839 25.6561 40.6957 26.6679C41.7075 27.6798 41.7075 29.3202 40.6957 30.332L30.332 40.6957Z" fill=${settings.theme.textColor}/>
          </svg>
        </div>`
      ).attr({
          id: "finderNext",
          class: "next-btn-finder",
        })
        .appendTo(finderElemContent)

      const close = $(
        `<div>
          <svg width="20" height="20" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0116 12.0116C2.90524 21.1179 2.90524 35.8821 12.0116 44.9884C21.1179 54.0948 35.8821 54.0948 44.9884 44.9884C54.0948 35.8821 54.0948 21.1179 44.9884 12.0116C35.8821 2.90524 21.1179 2.90524 12.0116 12.0116ZM8.34746 48.6525C-2.78249 37.5226 -2.78249 19.4774 8.34746 8.34746C19.4774 -2.78249 37.5226 -2.78249 48.6525 8.34746C59.7825 19.4774 59.7825 37.5226 48.6525 48.6525C37.5226 59.7825 19.4774 59.7825 8.34746 48.6525Z" fill=${settings.theme.textColor}/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3398 19.3398C20.3516 18.3279 21.992 18.3279 23.0039 19.3398L37.6602 33.9961C38.6721 35.008 38.6721 36.6484 37.6602 37.6602C36.6484 38.6721 35.008 38.6721 33.9961 37.6602L19.3398 23.0039C18.3279 21.992 18.3279 20.3516 19.3398 19.3398Z" fill=${settings.theme.textColor}/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3398 37.6602C18.3279 36.6484 18.3279 35.008 19.3398 33.9961L33.9961 19.3398C35.008 18.3279 36.6484 18.3279 37.6602 19.3398C38.6721 20.3516 38.6721 21.992 37.6602 23.0039L23.0039 37.6602C21.992 38.6721 20.3516 38.6721 19.3398 37.6602Z" fill=${settings.theme.textColor}/>
          </svg>
        </div >`
      ).attr({
          id: "finderClose",
          class: "close-btn-finder",
        })
        .appendTo(finderElemContent)
    },

    closeFinder: () => {
      $("#finder").removeClass("active")
      $("#finderbox").hide()
      $("#searchIcon").show()
      $(finder.content).unhighlight()
    },

    resultsCount: 0,

    currentResult: 0,

    findTerm: term => {
      // highlight results
      $(finder.content).unhighlight()
      $(finder.content).highlight(term, settings.theme)

      // count results
      finder.resultsCount = $(".highlight").length

      if (finder.resultsCount) {
        // there are results, scroll to first one
        finder.currentResult = 1
        finder.scrollToCurrent()
      } else {
        // no results
        finder.currentResult = 0
      }

      // term not found
      if (!finder.resultsCount && term) {
        $("#finderInput").addClass("not-found")
      } else {
        $("#finderInput").removeClass("not-found")
      }

      finder.updateCurrent()
    },

    scrollToCurrent: () => {
      // console.log("scrolltocurrent", finder.scrollOffset())
      let scrollingElement

      let i = finder.currentResult - 1
      $(".highlight").removeClass("active")
      $(`.highlight:eq(${i})`).addClass("active").css("background", settings.theme.activeHighlight)

      let offsetTop = -100
      if (finder.scrollOffset() !== null) {
        offsetTop = finder.scrollOffset() * -1
      }

      $(finder.content).scrollTo(".highlight.active", {
        offset: {
          left: 0,
          top: offsetTop,
        },
      })
    },

    prevResult: () => {
      if (finder.resultsCount) {
        if (finder.currentResult > 1) {
          finder.currentResult--
        } else {
          finder.currentResult = finder.resultsCount
        }
        finder.scrollToCurrent()
      }

      finder.updateCurrent()
    },

    nextResult: () => {
      if (finder.resultsCount) {
        if (finder.currentResult < finder.resultsCount) {
          finder.currentResult++
        } else {
          finder.currentResult = 1
        }
        finder.scrollToCurrent()
      }

      finder.updateCurrent()
    },

    updateCurrent: () => {
      if ($("#finderInput").val()) {
        if (!$("#finderCount").length) {
          $(".prev-btn-finder").show()
          $(".next-btn-finder").show()
          const countElem = $("<span />")
            .attr({
              id: "finderCount",
              class: "finder-count",
            })
            .insertAfter("#finderInput")
        }
        setTimeout(function () {
          $("#finderCount").text(
            finder.currentResult + "/" + finder.resultsCount
          )
        }, 50)
      } else {
        $(".prev-btn-finder").hide()
        $(".next-btn-finder").hide()
        $(".finder-search-icon").show()
        $(".finder-search-text").show()
        $("#finderCount").remove()
      }
    },
  }

  function addSuggestion() {
    document.activeElement.blur()
    let inputValue = $("#finderInput").val().toLowerCase()
    if ($("#finderCount").length && !historyArr.includes(inputValue)) {
      historyArr.push(inputValue)
    }
    console.log("historyrr", historyArr)
    $("#finderbox").hide()
  }

  searchIcon.click(() => {
    finder.activate()
    if (!$("#finderCount").length) {
      $(".prev-btn-finder").hide()
      $(".next-btn-finder").hide()
      $("#finderbox").hide()
    } else {
      if (settings.enableHistory) $("#finderbox").show()
    }
    $("#searchIcon").hide()
    $(document).mousedown(function (event) {
      if (event.which === 1) {
        switch (
          $(event.target).attr("id") ||
          $(event.target).parents().attr("id")
        ) {
          case "finderClose":
            finder.closeFinder()
            break
          case "finderPrev":
            addSuggestion()
            finder.prevResult()
            break
          case "finderNext":
            addSuggestion()
            finder.nextResult()
            break
          default:
            return true
        }
      }
    })
  })

  // $(".suggestion-item").click(function (event) {
  // console.log("here")
  //   event.preventDefault();
  //   var text = $(this).text(); // 'this' refers to the h3 element that you clicked.. not the div with the class .results
  //   alert(text.trim());
  // });

  $(".suggestion-item").on("click", function (event) {
    console.log("here")
  })
}

// class Search {
//   // constructor({color = "red"} = {color:'red'}) {
//   //   this.color = color;
//   // }
//   constructor(options = {}){
//     Object.assign(this, {
//       color : "black"
//     }, options);
//   }
//   classHandler() {
//     handler(this.color)
//   }

// }

// const searchClass = new Search({color:"green"})
// script.onreadystatechange = handler()
// script.onload = searchClass.classHandler()
// document.getElementsByTagName("head")[0].appendChild(script)