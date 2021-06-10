const script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
script.type = "text/javascript";
script.onreadystatechange = handler;
script.onload = handler;
document.getElementsByTagName("head")[0].appendChild(script);


function handler() {

$('head').append(
		`<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta http-equiv="content-type" content="application/javascript; charset=UTF-8">
		<link rel="stylesheet" href="https://adarsh-why.github.io/shopify-script-service/style.css" />
			<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
			<!-- CSS -->
		<link
			rel="stylesheet"
			href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
			integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
			crossorigin="anonymous"
		/>
		<script src="https://adarsh-why.github.io/shopify-script-service/jquery.highlight.js"></script>
		<script src="https://adarsh-why.github.io/shopify-script-service/jquery.scrollto.js"></script>`
)

  const body = $('body');

  body.attr("data-finder-content", "")

    body.append($(
      `
        <div class="app" data-finder-wrapper data-finder-scroll-offset="175">
		    </div>
      `
    ))

  body.css({
    'position': 'relative'
  })

  const searchIcon = $('<div class="searchIcon"/>')
  //   .css(
  //   {
  //     'position': 'fixed',
  //     'background-color': '#ffffff',
  //     'width': '60px',
  //     'height': '60px',
  //     'border-radius': '30px',
  //     'bottom': '20px',
  //     'right': '20px',
  //     'cursor': 'pointer',
  //     'background-image': 'url(https://adarsh-why.github.io/shopify-script-service/search.png)',
  //     'background-repeat': 'no-repeat',
  //     'background-size': '60%',
  //     'background-position': 'center',
  //     'box-shadow': '0 0 10px rgba(0, 0, 0, 0.2)',
  //     '-webkit-tap-highlight-color': 'transparent'
  //   }
  // )

  body.append(searchIcon);

const finder = {
	activator: '[data-finder-activator]',
	content: '[data-finder-content]',
	wrapper: '[data-finder-wrapper]',
	scrollOffset: () => $(finder.wrapper).data('finderScrollOffset'),
  hideElem: () => {
	  $('.finder-search-text').hide();
  },
  activate: () => {
    // console.log("activate")
		if (!$('#finder').length) {
			finder.createFinder();
		}
		setTimeout(function () {
			$('#finder').addClass('active');
			$('#finderInput').focus();
			if ($('#finderInput').val()) {
				finder.findTerm($('#finderInput').val());
			}
			$('#finderInput').on('input', function () {
				finder.findTerm($(this).val());
			});
		}, 50);
	},
  createFinder: () => {
    // console.log("crate fider")
		const finderElem = $('<div />')
			.attr({
				'id': 'finder',
				'class': 'finder'
			})
			.prependTo(finder.wrapper);

		const finderElemContent = $('<div />')
			.attr({
				'id': 'findercontent',
				'class': 'findercontent'
			})
			.appendTo(finderElem);

		const sbLogo = $('<div />')
			.attr({
				'id': 'finderLogo',
				'type': 'div',
				'class': 'finder-logo',
			})
			.appendTo(finderElem);

		const searchIcon = $('<div />')
			.attr({
				'id': 'finderSearchIcon',
				'type': 'div',
				'class': 'finder-search-icon',
			})
			.appendTo(finderElemContent);

		const searchText = $('<div />')
			.attr({
				'id': 'finderSearchText',
				'type': 'div',
				'class': 'finder-search-text',
			}).text("Search")
			.appendTo(finderElemContent);

		const input = $('<input oninput="finder.hideElem()"/>')
			.attr({
				'id': 'finderInput',
				'type': 'text',
				'class': 'finder-input',
			})
			.appendTo(finderElemContent);

		const prev = $('<button />')
			.attr({
				'id': 'finderPrev',
				'class': 'prev-btn-finder btn-finder-prev',
			})
			.appendTo(finderElemContent);

		const prevIcon = $('<i />')
			.attr({
				'class': 'fas fa-angle-up',
			})
			.appendTo(prev);

		const next = $('<button />')
			.attr({
				'id': 'finderNext',
				'class': 'next-btn-finder btn-finder-next',
			})
			.appendTo(finderElemContent);

		const nextIcon = $('<i />')
			.attr({
				'class': 'fas fa-angle-down',
			})
			.appendTo(next);

		const close = $('<button />')
			.attr({
				'id': 'finderClose',
				'class': 'close-btn-finder btn-finder-close',
			})
			.appendTo(finderElemContent);

		const closeIcon = $('<i />')
			.attr({
				'class': 'fas fa-times',
			})
			.appendTo(close);
	},

	closeFinder: () => {
		$('#finder').removeClass('active');
		$(finder.content).unhighlight();
	},

	resultsCount: 0,

	currentResult: 0,

	findTerm: (term) => {
		// highlight results
		$(finder.content).unhighlight();
		$(finder.content).highlight(term);

		// count results
		finder.resultsCount = $('.highlight').length;

		if (finder.resultsCount) {
			// there are results, scroll to first one
			finder.currentResult = 1;
			finder.scrollToCurrent();
		} else {
			// no results
			finder.currentResult = 0;
		}

		// term not found
		if (!finder.resultsCount && term) {
			$('#finderInput').addClass('not-found');
		} else {
			$('#finderInput').removeClass('not-found');
		}

		finder.updateCurrent();
	},

  scrollToCurrent: () => {
    // console.log("scrolltocurrent", finder.scrollOffset())
		let scrollingElement;

		let i = finder.currentResult - 1;
		$('.highlight').removeClass('active');
		$(`.highlight:eq(${i})`).addClass('active');

		let offsetTop = -100;
		if (finder.scrollOffset() !== null) {
			offsetTop = finder.scrollOffset() * -1;
		}

		$(finder.content).scrollTo('.highlight.active', {
			offset: {
				left: 0,
				top: offsetTop,
			},
		});
	},

	prevResult: () => {
		if (finder.resultsCount) {
			if (finder.currentResult > 1) {
				finder.currentResult--;
			} else {
				finder.currentResult = finder.resultsCount;
			}
			finder.scrollToCurrent();
		}

		finder.updateCurrent();
	},

	nextResult: () => {
		if (finder.resultsCount) {
			if (finder.currentResult < finder.resultsCount) {
				finder.currentResult++;
			} else {
				finder.currentResult = 1;
			}
			finder.scrollToCurrent();
		}

		finder.updateCurrent();
	},

	updateCurrent: () => {
		if ($('#finderInput').val()) {
			if (!$('#finderCount').length) {
        $('.prev-btn-finder').show()
        $('.next-btn-finder').show()
				const countElem = $('<span />')
					.attr({
						'id': 'finderCount',
						'class': 'finder-count',
					})
					.insertAfter('#finderInput');
			}
			setTimeout(function () {
				$('#finderCount').text(finder.currentResult + ' of ' + finder.resultsCount);
			}, 50);
		} else {
      $('.prev-btn-finder').hide()
      $('.next-btn-finder').hide()
			$('.finder-search-icon').show();
			$('.finder-search-text').show();
			$('#finderCount').remove();
		}
	},
}

  searchIcon.click(() => {
    // const script = document.createElement("script");
    // script.src = "https://adarsh-why.github.io/shopify-script-service/jquery.finder.js";
    // script.type = "text/javascript";
    // body.append(script)

    finder.activate()
    $(document).mousedown(function (event) {
		if (event.which === 1) {
			switch ($(event.target).attr('id') || $(event.target).parents().attr('id')) {
				case 'finderClose':
					finder.closeFinder();
					break;
				case 'finderPrev':
					finder.prevResult();
					break;
				case 'finderNext':
					finder.nextResult();
					break;
				default:
					return true;
			}
		}
	});
  })
}

//function hideElem() {
//	$('.finder-search-text').hide();
//}
