jQuery(document).ready(function($){
	window.dotsGoingUp = true;
  var dots = window.setInterval( function() {
    var wait = document.getElementById("typing");
    if ( window.dotsGoingUp ) 
      wait.innerHTML += ".";
    else {
      wait.innerHTML = wait.innerHTML.substring(1, wait.innerHTML.length);
      if ( wait.innerHTML === "")
        window.dotsGoingUp = true;
    }
    if ( wait.innerHTML.length > 4 )
      window.dotsGoingUp = false;
    }, 800);
});