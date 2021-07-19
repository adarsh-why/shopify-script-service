const script = document.createElement("script")
script.src = "https://code.jquery.com/jquery-3.4.1.min.js"
script.type = "text/javascript"
script.onreadystatechange = handler
script.onload = handler
document.getElementsByTagName("head")[0].appendChild(script)

// $("head").append(
//   `<meta charset="utf-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
//   <meta http-equiv="content-type" content="application/javascript; charset=UTF-8">
//   <link rel="stylesheet" href="http://0aa1c4e725cf.ngrok.io/style.css" />
//     <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
//     <!-- CSS -->
//   <script src="http://0aa1c4e725cf.ngrok.io/jquery.highlight.js"></script>
//   <script src="http://0aa1c4e725cf.ngrok.io/jquery.scrollto.js"></script>`
// )

var historyArr = []

// var settings = {}

function handler(color = "black") {
  console.log("colll", color)
  $.ajaxSetup({
    async: false
  });

  // $.getJSON("http://0aa1c4e725cf.ngrok.io/settings.json", function(data){
  //   settings = data
  //   console.log("data", data)
  // }).fail(function(){
  //     // console.log("An error has occurred.");
  // });

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
      <rect x="2.5" y="0.5" width="199" height="199" rx="99.5" fill="white" fill-opacity="0.9" stroke=${color}/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M98.25 70C83.7525 70 72 81.7525 72 96.25C72 110.747 83.7525 122.5 98.25 122.5C112.747 122.5 124.5 110.747 124.5 96.25C124.5 81.7525 112.747 70 98.25 70ZM64.5 96.25C64.5 77.6104 79.6104 62.5 98.25 62.5C116.89 62.5 132 77.6104 132 96.25C132 114.89 116.89 130 98.25 130C79.6104 130 64.5 114.89 64.5 96.25Z" fill=${color} stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M116.786 114.785C118.25 113.321 120.625 113.321 122.089 114.785L138.402 131.098C139.866 132.562 139.866 134.937 138.402 136.401C136.937 137.866 134.563 137.866 133.098 136.401L116.786 120.089C115.321 118.624 115.321 116.25 116.786 114.785Z" fill=${color} stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
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
                counter < 3
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
            $("#finderbox").show()
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

      const finderElemContent = $("<div />")
        .attr({
          id: "findercontent",
          class: "findercontent",
        })
        .appendTo(finderElem)

      const finderBox = $("<div />")
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

      const input = $("<input />")
        .attr({
          id: "finderInput",
          type: "text",
          class: "finder-input",
        })
        .on("input", function () {
          $(".finder-search-text").hide()
        })
        .appendTo(finderElemContent)

      const prev = $("<div />")
        .attr({
          id: "finderPrev",
          class: "prev-btn-finder",
        })
        .appendTo(finderElemContent)

      const next = $("<div />")
        .attr({
          id: "finderNext",
          class: "next-btn-finder",
        })
        .appendTo(finderElemContent)

      const close = $("<div />")
        .attr({
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
      $(finder.content).highlight(term)

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
      $(`.highlight:eq(${i})`).addClass("active")

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
      $("#finderbox").show()
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