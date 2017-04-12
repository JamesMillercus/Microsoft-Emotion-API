export class EmotionClass{
	constructor(text){
		$('#clicker').on('click', this.take_snapshot.bind(this));
		$(document).ready(this.ShowCam.bind(this));
		self = this;
	}

	take_snapshot(){
	    Webcam.snap(function(data_uri) {
	    	document.getElementById('results').innerHTML = '<img id="base64image" src="'+data_uri+'"/>';
		});
		this.SaveSnap();
	}

	ShowCam(){
		Webcam.set({
			width: 320,
			height: 240,
			image_format: 'jpeg',
			jpeg_quality: 100
		});
		Webcam.attach('#my_camera');
	}

	SaveSnap(){
		document.getElementById("loading").innerHTML="Analyzing, please wait...";
	    var file = document.getElementById("base64image").src.substring(23).replace(' ', '+');
		var img = Base64Binary.decodeArrayBuffer(file);
		console.log(img);
	    var ajax = new XMLHttpRequest();
	    ajax.addEventListener("load", function(event) { self.uploadcomplete(event);}, false);
	    ajax.open("POST", "https://api.projectoxford.ai/emotion/v1.0/recognize","image/jpg");
		ajax.setRequestHeader("Content-Type","application/octet-stream");
		//ajax.setRequestHeader("Accept-Encoding","gzip, deflate");
		ajax.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml");
		ajax.setRequestHeader("Ocp-Apim-Subscription-Key","ff13bf142ed04898878517396d0b067b");
		ajax.send(img);
	}

	uploadcomplete(event){
	    document.getElementById("loading").innerHTML="Completed";
		var xmlDoc=event.target.responseXML;
		var list = xmlDoc.getElementsByTagName("scores");
		if(list.length >= 1){
			document.getElementById("anger").innerHTML = list[0].childNodes[0].textContent;
			document.getElementById("contempt").innerHTML = list[0].childNodes[1].textContent;
			document.getElementById("disgust").innerHTML = list[0].childNodes[2].textContent;
			document.getElementById("fear").innerHTML = list[0].childNodes[3].textContent;
			document.getElementById("happiness").innerHTML = list[0].childNodes[4].textContent;
			document.getElementById("neutral").innerHTML = list[0].childNodes[5].textContent;
			document.getElementById("sadness").innerHTML = list[0].childNodes[6].textContent;
			document.getElementById("surprise").innerHTML = list[0].childNodes[7].textContent;
		}
		else {
			document.getElementById("loading").innerHTML="Error getting results";
			document.getElementById("anger").innerHTML = "";
			document.getElementById("contempt").innerHTML = "";
			document.getElementById("disgust").innerHTML = "";
			document.getElementById("fear").innerHTML = "";
			document.getElementById("happiness").innerHTML = "";
			document.getElementById("neutral").innerHTML = "";
			document.getElementById("sadness").innerHTML = "";
			document.getElementById("surprise").innerHTML = "";
		}
	}

}