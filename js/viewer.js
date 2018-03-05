var CETEIcean = new CETEI();
var images = [];
CETEIcean.addBehaviors({"handlers":
  {
    "gap": ["[", "]"],
    "note": function(elt) {
      var span = document.createElement("span");
      span.innerHTML = elt.getAttribute("place") == "margin"?"[<em>in marg.</em> ":"[";
      span.innerHTML += elt.innerHTML + "]";
      return span;
    },
    "pb": function(elt) {
      var span = document.createElement("span");
      var link = document.createElement("a");
      link.setAttribute("style", "float:right;padding-left:1em;text-decoration:none;color:gray;");
      if (elt.hasAttribute("facs")) {
        var facs = elt.getAttribute("facs").replace("tcp:", "").replace(new RegExp(this.prefixes["tcp"]["matchPattern"]), "?vid=$1&page=$2");
        link.setAttribute("href", "http://eebo.chadwyck.com/fetchimage" + facs + "&width=1500");
        var img = document.createElement("img");
        images.push(img);
        img.setAttribute("src", "http://eebo.chadwyck.com/fetchimage" + facs + "&width=100");
        img.setAttribute("height", "50px");
        if (elt.hasAttribute("n")) {
          link.innerHTML = "<span style=\"position:relative; top: -1em;\">p. " + elt.getAttribute("n") + " </span>";
        }
        link.appendChild(img);
      }
      span.appendChild(document.createElement("br"));
      span.appendChild(link);
      span.appendChild(document.createElement("br"));
      span.appendChild(document.createElement("br"));
      span.appendChild(document.createElement("br"));
      return span;
    }
  }});
CETEIcean.getHTML5('https://raw.githubusercontent.com/textcreationpartnership/A00689/master/A00689.xml', function(data) {
  document.getElementById("TEI").innerHTML = "";
  document.getElementById("TEI").appendChild(data);
  CETEIcean.addStyle(document, data);
  // Fix combining abbreviation marker in Chrome
  if (!!window.chrome) {
    var gs = document.getElementsByTagName("tei-g");
    for (var i = 0; i < gs.length; i++) {
      if (gs[i].getAttribute("ref") == "char:cmbAbbrStroke") {
        gs[i].setAttribute("class", "cmbAbbr");
      }
    }
  }
  // If not logged in to EEBO, use a local image instead of the preview
  var testimg = new Image();
  testimg.onerror = function() {
    console.log("Not logged in.");
    images.forEach(function(elt) {
      elt.src = elt.src.replace("http://eebo.chadwyck.com/fetchimage", "images/page.jpg");
    });
  }
  testimg.src = "http://eebo.chadwyck.com/fetchimage?vid=5891&page=1&width=100";
});
