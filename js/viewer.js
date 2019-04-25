//Variables
var CETEIcean = new CETEI();
var manuscripts = {
  "Latin-A": {
    "name": "Latin-A",
    "resource": "xml/LatinTexts/Latin-A.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/Latin-A",
    "translation": "Placeholder ..."
  },
  "Latin-B": {
    "name": "Latin-B",
    "resource": "xml/LatinTexts/Latin-B.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/Latin-B",
    "translation": "Placeholder ..."
  },
  "Latin-C": {
    "name": "Latin-C",
    "resource": "xml/LatinTexts/Latin-C.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/Latin-C",
    "translation": "Placeholder ..."
  },
  "B1" : {
    "name": "B1",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_B1_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/B1",
    "translation": "Placeholder ..."
  },
  "B2" : {
    "name": "B2",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_B2_HansPech_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/B2",
    "translation": "Placeholder ..."
  },
  "D" : {
    "name": "D",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_D_AnnaKelner_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/D",
    "translation": "Placeholder ..."
  },
  "G" : {
    "name": "G",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_G_EleanorGoerss_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/G",
    "translation": "Placeholder ..."
  },
  "K1" : {
    "name": "K1",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_K1_ZacharyHayworth_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/K1",
    "translation": "Placeholder ..."
  },
  "K2" : {
    "name": "K2",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_K2_EleanorGoerss_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/K2",
    "translation": "Placeholder ..."
  },
  "N" : {
    "name": "N",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_N_SusanneZwierlein_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/N",
    "translation": "Placeholder ..."
  },
  "S" : {
    "name": "S",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_S_RachaKirakosian_HP.xml",
    "manifest": "http://digital-editing.fas.harvard.edu/manifests/S",
    "translation": "Placeholder ..."
  }
};

var sectionsSet = new Set();

//Object for all options
var options = {
  "expanded_abbreviations":true,
  "foliation":false,
  "linebeginnings":false,
  "editor_punctuation":true,
  "editor_capitalization":true,
  "images": false,
  "translations": false
};

var legend_episodes = [
  ["legend_title", "Legend Title"],
  ["genealogy", "Genealogy"],
  ["heritage", "Inheritance"],
  ["MaryMagdalene_mismanagement", "Mary Magdalene's heritage management"],
  ["Martha_confronts_Mary", "Martha's reaction"],
  ["MaryMagdalene_lovers", "Mary Magdaelene in the world"],
  ["market_scene", "Martha and Mary Magdalene meet on the market"],
  ["Mary_at_Marthas_house", "Mary Magdalene visits Martha"],
  ["Jesus_enters", "Jesus visits Martha"],
  ["Mary_retreats", "Mary Magdalene retreats"],
  ["Martha_encourages_Mary", "Martha encourages Mary Magdalene to go to Jesus"],
  ["Martha_in_Simons_house", "Martha in Simon's house"],
  ["Gregory_comment", "Discursive comment attributed to Gregory the Great"],
  ["Mary_in_Simons_house", "Mary Magdalene in Simon's house"],
  ["VirginMary_visits", "Virgin Mary meets Mary Magdalene"],
  ["Mary_rest_of_life", "Mary Magdalene after her conversion"],
  ["epilogue", "Epilogue"]
];

//Functions
function addManuscript(ms){
  CETEIcean.getHTML5(ms.resource, function(data){
    var ms_el = "#"+ms.name;
    $(ms_el).html("");
    $(ms_el).append(data);
    CETEIcean.addStyle(document, data);

    //Add facs div to each cb (foliation) with valid attribute
    addFoliation(ms_el);

    $(ms_el + " tei-lb").toggle(); //Start off manuscripts with line beginnings off
    if(!$(`${ms_el}-display`).is(":checked")){
      $(`${ms_el}`).parent(".ms-col").toggle();
    }
    // $("input[name='manuscript'").change(function(){
    //   var manuscript = $(this).val();
    //   var checked = $(this).is(":checked");
    //   $("#"+manuscript).parent(".ms-col").toggle();

    //Fix weird hard carriage returns - costly to run this regex
    //var s = $(ms_el).html();
    //var s2 = s.replace(/<\/tei-choice>[\s][\n\r\s\t]+</g,'</tei-choice><');
    //var s2 = s.replace(/>[\n\r\s\t]+</g,'><');
    //$(ms_el).html(s2);
    //$(ms_el).html(s.replace(/[\n\r]+/g, " "));
    //console.log($(ms_el));
  });
}


function addFoliation(el) {
  $(el+" tei-cb").each(function(){
    var n = $(this).attr("n");
    var pb = "";
    if(typeof(n) === "undefined"){
      var facs = $(this).attr("facs");
      if(typeof(facs) != "undefined"){
        pb = facs;
      }
    } else {
      pb = n;
    }
    $(this).html("<span class='page-break'>" + pb + "</span>");
  });
}

document.addEventListener('DOMContentLoaded', () => {

  //Add all manuscripts
  var msOrdered = ["Latin-A", "Latin-B", "Latin-C", "B1", "B2", "D", "G", "K1", "K2", "N", "S"];
  var mirador_instances = {}
  msOrdered.forEach(function(el){
    let ms = manuscripts[el];

    let miradorTemplate = document.querySelector("#mirador-template").content.cloneNode(true);
    miradorTemplate.querySelector(".ms-container-mirador").setAttribute("id", `mirador-viewer-${el}`);
    document.querySelector("#texts").appendChild(miradorTemplate);
    $.getJSON(ms["manifest"]).done(function(manifest){
      let m = Mirador({
        "id": `mirador-viewer-${el}`,
        "layout": "1x1",
        "mainMenuSettings": {
          "show": false
        },
        "openManifestsPage" : true,
        "buildPath": "js/mirador-2.7/",
        "data": [
          {"manifestUri": ms["manifest"]}
        ],
        'windowSettings' : {
          "availableViews" : ['ThumbnailsView', 'ImageView'],
          "sidePanel" : false,
          "bottomPanelVisible" : false,
          "canvasControls": { // The types of controls available to be displayed on a canvas
            "annotations" : {
              "annotationLayer" : false
            }
          },
          "fullScreen" : false,
          "displayLayout" : true,
          "layoutOptions" : {
              "newObject" : true,
              "close" : true,
              "slotRight" : false,
              "slotLeft" : false,
              "slotAbove" : false,
              "slotBelow" : false,
          }
        }

        // "windowObjects":[{
        //   loadedManifest: ms["manifest"],
        //   canvasID: manifest.sequences[0].canvases[0]["@id"],
        //   viewType: "ImageView",
        //   bottomPanelVisible: "false",
        //   sidePanel: "false",
        //   sidePanelVisible: "false"
        // }],
      });

      mirador_instances[`mirador-viewer-${el}`] = m;
    });

    let template = document.querySelector("#ms-template").content.cloneNode(true);
    template.querySelector(".ms-title").innerText = `Manuscript ${ms.name}`;
    template.querySelector(".manuscript").setAttribute("id", ms.name);
    document.querySelector("#texts").appendChild(template);
    addManuscript(ms);

    let translation = document.querySelector("#translation-template").content.cloneNode(true);
    translation.querySelector(".ms-container-translation").setAttribute("id", "test");
    translation.querySelector(".ms-container-translation").innerText = ms.translation;
    document.querySelector("#texts").appendChild(translation);
  })

  //Add ms sections to jump menu
  for (var i = 0; i < legend_episodes.length; i++){
    $('#jump-select').append($('<option>', {
      value: legend_episodes[i][0],
      text: legend_episodes[i][1]
    }));
  }

  //Show and hide manuscripts
  $("input[name='manuscript'").change(function(){
    var manuscript = $(this).val();
    var checked = $(this).is(":checked");
    $("#"+manuscript).parent(".ms-col").toggle();
  });

  //Function to toggle abbreviations
  $("input[name='abbreviations-toggle'").change(function(){
    $("tei-choice").each(function(){
      $(this).children("tei-expan").toggle();
      $(this).children("tei-abbr").toggle();
    })
    options.expanded_abbreviations = $(this).is(":checked");
  });

  //Function to toggle foliation
  $("input[name='foliation-toggle'").change(function(){
    options.foliation = $(this).is(":checked");
    if(options.foliation){
      if(options.linebeginnings){
        $("tei-cb").css("display", "block");
      } else {
        $("tei-cb").css("display", "inline");
      }
    } else {
      $("tei-cb").hide();
    }
  });

  //Function to toggle line beginnings
  $("input[name='linebeginnings-toggle'").change(function(){
    options.linebeginnings = $(this).is(":checked");
    if(options.linebeginnings){
      $("tei-lb").show();
      if(options.foliation){
        $("tei-cb").css("display", "block");
      }
    } else {
      $("tei-lb").hide();
      if(options.foliation){
        $("tei-cb").css("display", "inline");
      }
    }
  });

  //Function to toggle punctuation
  $("input[name='editor-punctuation-toggle'").change(function(){
    options.editor_punctuation = $(this).is(":checked");
    if(options.editor_punctuation){
      $("tei-pc[resp='editor']").show();
      $("tei-pc[source='manuscript']").hide();
      $("tei-pc > tei-choice > tei-reg[resp='editor'][type='punct']").show();
      $("tei-pc > tei-choice > tei-orig").hide();
    } else {
      $("tei-pc[resp='editor']").hide();
      $("tei-pc[source='manuscript']").show();
      $("tei-pc > tei-choice > tei-reg[resp='editor'][type='punct']").hide();
      $("tei-pc > tei-choice > tei-orig").show();
    }
  });

  //Function to toggle capitalization
  $("input[name='editor-capitalization-toggle'").change(function(){
    options.editor_capitalization = $(this).is(":checked");
    if(options.editor_capitalization){
      $("tei-choice > tei-reg[resp='editor'][type='capit']").show();
      $("tei-choice > tei-orig").hide();
    } else {
      $("tei-choice > tei-reg[resp='editor'][type='capit']").hide();
      $("tei-choice > tei-orig").show();
    }
  });

  // Helper function for changing number of columns
  function change_columns(){
      if(options.images && options.translations){
          $("#texts > div").css("flex-basis", "33%");
      } else {
          $("#texts > div").css("flex-basis", "50%");
      }
  }

  //Function to toggle Mirador viewers
  $("input[name='images-toggle']").change(function(){
     options.images = $(this).is(":checked");
     if(options.images){
         $(".ms-mirador").show();
     } else {
         $(".ms-mirador").hide();
     }
     change_columns();
  });

  //Function to toggle translations
  $("input[name='translations-toggle']").change(function(){
     options.translations = $(this).is(":checked");
     if(options.translations){
         $(".ms-translation").show();
     } else {
         $(".ms-translation").hide();
     }
     change_columns();
  });

  function scroll_manuscripts(xmlid){
    for(ms in manuscripts){
      var ms_el = "#" + manuscripts[ms].name;
      var ms_name = manuscripts[ms].name;
      var jump_position = "#" + ms_name + "_" + xmlid;
      if( $(ms_el).find(jump_position).length > 0){
        var topPosition = $(jump_position).position().top;
        $(ms_el).animate({
          scrollTop: topPosition
        }, 300)
      }
    }
  }

  //Jump menu change
  $("#jump-select").change(function(){
    var xmlid = $(this).val();
    if(xmlid !== null && xmlid !== ''){
      scroll_manuscripts(xmlid);
    }
  })

});
