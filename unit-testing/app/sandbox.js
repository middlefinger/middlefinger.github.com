function trim(text) {
  return (text || "").replace(/^\s+|\s+$/g, "");
}

function multiply(a,b){
	return a*b;
}

function divide(a,b){
	if(b === 0){
		throw "You are triing to divide bt zero !"
	}
	return Math.round(a/b);
}

function createList(items) {
	var list = $('<ul/>');

	$.each(items, function(i, item) {
		if (typeof item !== 'string') { return; }
		list.append(
			$('<li>' + item + '</li>').click(function() {
				$(this).addClass('clicked');
			})
		);
	});

	return list;
}