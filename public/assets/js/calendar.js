	var today = new Date();
	var year = today.getUTCFullYear();
	
	var mtbl  = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var mnames = new Array("Янв", "Фев", "Мар", "Апр", "Май", "Июнь",
		"Июль", "Авг", "Сен", "Окт", "Ноя", "Дек");
	
	// End-of-month Julian Day lookup tables for normal and leap years
	var jdtbln = new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334);
	var jdtbll = new Array(0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335);
	
	var leap = false;
	var jdtbl = jdtbln;
	var yearpattern = /^\d{4,5}$/;
	var abtlinkhidden = true;

	function isLeap(year) {
		return (year % 100 != 0) && (year % 4 == 0) || (year % 400 == 0);
	}
	function julianDay(day, month) {
		return day + jdtbl[month-1];
	}

	// returns the day of week as an integer: 1=Sun, 2=Mon, ..., 7=Sat
	function dayOfWeek(day, month, year) {
		leap = isLeap(year);
		jdtbl = leap? jdtbll : jdtbln;
		var dow = (year + julianDay(day, month)
			+ Math.floor((year-1)/4) - Math.floor((year-1)/100)
			+ Math.floor((year-1)/400)) % 7;
		return dow == 0? 7: dow;
	}

	function renderMonth(parent, month, year) {
		var dateCells = $(parent + " div.dt");
		var cellid = dayOfWeek(1, month, year) - 1;
		var max = mtbl[month-1];
		if (max == 28 && leap) max = 29;

		dateCells.eq(cellid++).html(1);
		for (var ix = 2; ix <= max; ix++) {
			let cell = dateCells.eq(cellid++);
			cell.html(ix);
			cell.addClass('empty');
		}
		$(parent + " div.mo").html(mnames[month-1]);
	}
	
	function getMonthSequence(mainMonth) {
		var tmp = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
		if (mainMonth == 0) return tmp;
		
		var monthseq = new Array();
		monthseq.push(mainMonth);
		if (mainMonth == 11) {
			// n+1 isn't possible
			monthseq.push(9);
			monthseq.push(10);
			tmp.splice(9, 3);
		} else {
			monthseq.push(mainMonth-1);
			monthseq.push(mainMonth+1);
			tmp.splice(mainMonth-1, 3);
		}
		return monthseq.concat(tmp);
	}

	function showSelective() {
		$("div#cal").show();
		$("p.prinvis").show();
		$("#mtoprow").show();
	}
	
	function renderCalendar(startMonth, stopMonth, year) {
		year = parseInt(year);

		var seqargs = 0;
		var monthHtml = $("span#m0").html();
		var monthseq = getMonthSequence(seqargs);

		$("#caltitle").text(year);
		$("title").text(year);
		$('#report').attr('href', window.location.origin + '/download/report/' + (year));
		$('#request').attr('href', window.location.origin + '/download/request/' + (year));
		$('#prev').attr('href', '#' + (year-1)).text(year-1);
		$('#next').attr('href', '#' + (year+1)).text(year+1);

		for (var ix = startMonth-1; ix < stopMonth; ix++) {
			var newId = '#p' + ix;
			if ($(newId).length == 1) {
				$(newId).html(monthHtml);
				renderMonth(newId, monthseq[ix]+1, year);
			}
		}

		showSelective();
	}

	$(window).on('hashchange', function() {
		if (window.location.hash) {
			var hash = window.location.hash.replace('#', '');
		}

		let year = /^\d{4}$/.test(hash) ? hash : year;
		query(window.location.origin , {year})
			.then(data => {
				renderCalendar(1, 12, year);
				data.forEach(e => 
					$("#p"+ (e.date_m - 1) + " .dt:contains('"+ e.date_d +"')")
						.removeClass('empty')
						.addClass('go')
						.data({ 'id': e.id })
				);
				$('.go').click(function() {
					window.location.href = window.location.origin + '/edit/' + $(this).data('id');
				});
				$('.empty').click(function() {
					let monthId = $(this)
						.parent()
						.parent()
						.attr('id'),
						month = parseInt(monthId.match(/p(\d{1,2})/)[1]) + 1,
						day = $(this).text();
					let date = [year, month, day].join('-');
					window.location.href = window.location.origin + '/add?date=' + date;
				});
				$(".go").hover(function() {
					let id = $(this).data('id');
					if ($(this).find('.tooltip').length === 0)
					query(window.location.origin + '/view' , {id})
					.then(data => {
						$(this).append(
							"<div class='tooltip'>" +
								"<span class='title'>"+ data.title +"</span>" +
								"<span>"+ data.status_name +"</span>" +
								"<span>"+ data.responsible +"</span>" +
							"</div>"
						);
					})
					.catch(error => console.error(error))
				});
			})
			.catch(error => console.error(error));
	});

	function query(url, data) {
		// Значения по умолчанию обозначены знаком *
		return fetch(url, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, cors, *same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json',
				  // 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: 'follow', // manual, *follow, error
			referrer: 'no-referrer', // no-referrer, *client
			body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
		})
		.then(response => response.json()); // парсит JSON ответ в Javascript объект
	}

	$.fn.nexists = function(callback) {
		var args = [].slice.call(arguments, 1);
	  
		if (!this.length) {
		  callback.call(this, args);
		}
	  
		return this;
	};

	// Lets get this shit started
	$(document).ready(function () {

		if (window.location.hash) {
			var hash = window.location.hash.replace('#', '');
		}
		
		let year = /^\d{4}$/.test(hash) ? hash : new Date().getFullYear();

		query(window.location.origin , {year})
			.then(data => {
				renderCalendar(1, 12, year);
				data.forEach(e => 
					$("#p"+ (e.date_m - 1) + " .dt:contains('"+ e.date_d +"')")
						.removeClass('empty')
						.addClass('go')
						.data({ 'id': e.id })
				);
				$('.go').click(function() {
					window.location.href = window.location.origin + '/edit/' + $(this).data('id');
				});
				$('.empty').click(function() {
					let monthId = $(this)
						.parent()
						.parent()
						.attr('id'),
						month = parseInt(monthId.match(/p(\d{1,2})/)[1]) + 1,
						day = $(this).text();
					let date = [year, month, day].join('-');
					window.location.href = window.location.origin + '/add?date=' + date;
				});
				$(".go").hover(function() {
					let id = $(this).data('id');
					if ($(this).find('.tooltip').length === 0)
					query(window.location.origin + '/view' , {id})
					.then(data => {
						$(this).append(
							"<div class='tooltip'>" +
								"<span class='title'>"+ data.title +"</span>" +
								"<span>"+ data.status_name +"</span>" +
								"<span>"+ data.responsible +"</span>" +
							"</div>"
						);
					})
					.catch(error => console.error(error))
				});
			})
			.catch(error => console.error(error));
	});