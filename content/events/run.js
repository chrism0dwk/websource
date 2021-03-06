(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();
  
pad = function(v){
    if(v<9){
	return "0"+v;
    }else{
	return ""+v;
    };
};

function makedescription(event, max){
    if (!event.description){ 
	return "";
    };
    var trimmed = trimit(event.description, max)
    var text = trimmed[0];
    if(trimmed[1]){
	text = text;
    };
    return [text, trimmed[1]];

};


function trimit(t, max){
    if(!t){ return ["", false] };
    if(t.length <= max){
	return [t, false];
    }
    return [t.substr(0,max), true]
};

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


var templates = {
    eventList: $('<div class="eventlist">'),
    eventItem: $('<div class="event"><h3 class="summary"><a href=""></a></h3><div class="start"><span class="when"/> <span class="where"/></div><div class="description"></div></div>'),
    upcomingBox: $('<div class="upcoming"><h4>Coming Next...</h4></div>'),
    upcomingItem: $('<div class="event"><h6 class="when"/><h5 class="summary"><a title="open calendar entry" href="" target="_blank"></a></h5><p class="description"><a href="more">more</a></p><div class="where"/></div>')
};

dateFormat = function(d){
    return d.getDayName() + ", " + d.getDate() + " " + d.getMonthName();
}

getWhen = function(v){
    starter=v.start;
    if(starter.date){
	var start = new Date(starter.date);
	var end = new Date(v.end.date);
	var startString = dateFormat(start);
	var endString = dateFormat(end);
	if(startString != endString){
	    when = startString + " - " + endString;
	}else{
	    when = startString;
	};
    }else{
	var when = new Date(starter.dateTime);
	when = dateFormat(when) + " at " + when.getHours() + ":" + pad(when.getMinutes());
    };
    return when;
};

now = new Date().toISOString();

api="AIzaSyAB1Jd-Jf3U-R84BJzJAPTIYZZmM1sqtjs";

getN = function(n, root, wrapper, item, trim){
    var r = root;
    var now = new Date().toISOString();
    var URL = "https://www.googleapis.com/calendar/v3/calendars/e8j7bjqajiblsstfcc59iimss0%40group.calendar.google.com/events?callback=?&maxResults="+n+"&timeMin="+now+"&orderBy=startTime&singleEvents=true&key="+api;
    $.getJSON(URL , function(json) {
	var events = json.items;
	var list = templates[wrapper].clone();
	$.each(events, function(){
	    var e = templates[item].clone();
	    var when = getWhen(this);
	    var where;
	    if(this.location){
		where = this.location;
	    }else{
		where = " ";
	    };
	    var texttrim = makedescription(this, trim);
	    e.find("a").text(this.summary).attr("href",this.htmlLink).end()
		.find(".when").text(when).end()
		.find(".where").text(where).end()
		.find(".description").text(texttrim[0]);
	    if (texttrim[1]){
		e.find(".description").append('...<a title="details" href="'+this.htmlLink+'">(more)</a>');
	    };
	    list.append(e);
	});
	$(r).append(list);
	// get event.object[0].summary, htmlLink,start.dateTime
	
    }
	     );
};




