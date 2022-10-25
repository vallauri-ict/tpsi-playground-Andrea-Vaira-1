"use strict"

let headers = ["name", "gender", "hair", "weight", "loves"]


$(document).ready(function() {
    let _wrapper = $("#wrapper");
    let _table = $("table");
	let _tbody;
	
	createHeaders()
	




	
	function createHeaders(){
		let thead = $("<thead>").appendTo(_table)
		let tr = $("<tr>").appendTo(thead)
		for (let header of headers){
			$("<th>").appendTo(tr).text(header)
		}
		_tbody = $("<tbody>").appendTo(_table)
	}
 
})