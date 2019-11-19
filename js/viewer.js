//Variables
var CETEIcean = new CETEI();
var manuscripts = {
  "Latin-A": {
    "name": "Latin-A",
    "resource": "https://digital-editing.fas.harvard.edu/xml/Latin-MM/Latin-A.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/Latin-A",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/Latin-A.xml"
  },
  "Latin-B": {
    "name": "Latin-B",
    "resource": "https://digital-editing.fas.harvard.edu/xml/Latin-MM/Latin-B.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/Latin-B",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/Latin-B.xml"
  },
  "Latin-C": {
    "name": "Latin-C",
    "resource": "https://digital-editing.fas.harvard.edu/xml/Latin-MM/Latin-C.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/Latin-C",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/Latin-C.xml"
  },
  "B1" : {
    "name": "B1",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_B1_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/B1",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/B1.xml"
  },
  "B2" : {
    "name": "B2",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_B2_HansPech_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/B2",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/B2.xml"
  },
  "D" : {
    "name": "D",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_D_AnnaKelner_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/D",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/D.xml"
  },
  "G" : {
    "name": "G",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_G_EleanorGoerss_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/G",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/G.xml"
  },
  "K1" : {
    "name": "K1",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_K1_ZacharyHayworth_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/K1",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/K1.xml"
  },
  "K2" : {
    "name": "K2",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_K2_EleanorGoerss_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/K2",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/K2.xml"
  },
  "N" : {
    "name": "N",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_N_SusanneZwierlein_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/N",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/N.xml"
  },
  "S" : {
    "name": "S",
    "resource" : "https://digital-editing.fas.harvard.edu/xml/MaryMagdalene/manuscript_S_RachaKirakosian_HP.xml",
    "manifest_url": "https://digital-editing.fas.harvard.edu/manifests/S",
    "translation": "https://digital-editing.fas.harvard.edu/xml/Translations-MM/S.xml"
  }
};

var msOrdered = ["Latin-A", "Latin-B", "Latin-C", "B1", "B2", "D", "G", "K1", "K2", "N", "S"];
var mirador_instances = {};
var loaded = 0;

var sectionsSet = new Set();

var options = {
  "expanded_abbreviations":true,
  "foliation":false,
  "linebeginnings":false,
  "editor_punctuation":true,
  "editor_capitalization":true,
  "scribal_corrections":true,
  "images": false,
  "translations": false,
  "manuscripts": {
    "Latin-A": true,
    "Latin-B": false,
    "Latin-C": false,
    "B1": false,
    "B2": true,
    "D": false,
    "G": false,
    "K1": false,
    "K2": false,
    "N": false,
    "S": false
  }
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

const addManuscript = async (ms, el) => {
  console.log("async - adding MS");
  const ms_desc = manuscripts[el]["manifest_data"]["description"];
  console.log(`MS_DESC ${ms_desc}`)

  const template = document.querySelector("#ms-template").content.cloneNode(true);
  template.querySelector(".ms-title").innerText = `Manuscript ${ms.name}`;
  template.querySelector(".manuscript").setAttribute("id", ms.name);
  template.querySelector(".ms-desc").innerText = ms_desc;
  document.querySelector("#texts").appendChild(template);

  const cet = await CETEIcean.getHTML5(ms.resource, function(data){
    const ms_el = `#${ms.name}`
    console.log(`HERE ${ms_el}`);
    $(ms_el).empty()
    $(ms_el).append(data)
    CETEIcean.addStyle(document, data)
    addFoliation(ms_el)
    addLineBreaks(ms_el);
    $(ms_el + " tei-lb").toggle(); //Start off manuscripts with line beginnings off
    if(!$(`${ms_el}-display`).is(":checked")){
      $(`${ms_el}`).parent(".ms-col").toggle();
    }
  })
  advanceProgressBar("#loading-bar");
}

const addTranslation = async (ms) => {
  const ms_el = `#${ms.name}-translation`
  console.log(`async Translation ${ms_el}`)
  const template = document.querySelector("#translation-template").content.cloneNode(true);
  template.querySelector(".ms-container-translation").setAttribute("id", `${ms.name}-translation`);
  template.querySelector(".translation-title").innerText = `${ms.name} Translation`;
  document.querySelector("#texts").appendChild(template);
  const cet = await CETEIcean.getHTML5(ms.translation, function(data){
    $(ms_el).empty()
    $(ms_el).append(data);
    CETEIcean.addStyle(document, data);
  });
  advanceProgressBar("#loading-bar");
}

const addMirador = async (ms, el) => {
  console.log("async - adding Mirador");
  console.log(ms);
  console.log(el);

  const miradorTemplate = document.querySelector("#mirador-template").content.cloneNode(true);
  miradorTemplate.querySelector(".ms-col.ms-mirador").setAttribute("id", `mirador-container-${el}`);
  miradorTemplate.querySelector(".ms-container-mirador").setAttribute("id", `mirador-viewer-${el}`);
  document.querySelector("#texts").appendChild(miradorTemplate);

  const response = await fetch(ms["manifest_url"])
  const manifest = await response.json();
  await console.log("Manifest loaded")
  await console.log(manifest)
  manuscripts[el]["manifest_data"] = manifest;
  const canvas = manifest.sequences[0].canvases[0]["@id"];

  const m = await Mirador({
    "id": `mirador-viewer-${el}`,
    "layout": "1x1",
    "mainMenuSettings": {
      "show": false
    },
    "openManifestsPage" : true,
    "buildPath": "js/mirador-2.7-nobootstrap/",
    "data": [
      {"manifestUri": ms["manifest_url"]}
    ],
    "windowObjects": [{
      "loadedManifest": ms["manifest_url"],
      "canvasID": canvas,
      "viewType": "ImageView"
    }],
    'windowSettings' : {
      "availableViews" : ['ThumbnailsView', 'ImageView', 'BookView'],
      "sidePanel" : false,
      "bottomPanelVisible" : true,
      "canvasControls": { // The types of controls available to be displayed on a canvas
        "annotations" : {
          "annotationLayer" : false
        }
      },
      "fullScreen" : false,
      "displayLayout" : true,
      "layoutOptions" : {
          "newObject" : false,
          "close" : false,
          "slotRight" : false,
          "slotLeft" : false,
          "slotAbove" : false,
          "slotBelow" : false,
      }
    }
  });
  mirador_instances[`mirador-viewer-${el}`] = m;
  console.log(`Mirador ${el} finished`)
  advanceProgressBar("#loading-bar");
}

function advanceProgressBar(bar){
  const elements = (Object.keys(manuscripts).length * 3);
  const advance = Math.round(100 / elements);
  loaded += advance;
  $(bar).html(`${loaded}%`)
  $(bar).css('width', loaded + '%').attr('aria-valuenow', loaded);
}

function msOverflowCorrect(){
  let mss = $(".ms-col.ms");
  mss.each(function(){
    let correctHeight = $(this).outerHeight() - $(this).find(".ms-desc-container").outerHeight() - $(this).find(".ms-title").outerHeight() - 3;
    $(this).find(".manuscript").css({"maxHeight": correctHeight});
  })
}
$( window ).resize(msOverflowCorrect);

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

function addLineBreaks(el){
  $(el+" tei-lb").each(function(){
    let n = $(this).attr("n");
    let pb = "";
    if(typeof(n) === "undefined"){
      let facs = $(this).attr("facs");
      if(typeof(facs) != "undefined"){
        let trimmed = facs.substring(facs.lastIndexOf("_") + 1);
        if(typeof(trimmed) != "undefined"){
          pb = trimmed;
        }
      }
    } else {
      pb = n;
    }
    $(this).html("<span class='line-break'>" + pb + "</span>");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Bind vanilla JS modal
  var modal = $("#optionsModal");
  $("#options-modal-button").click(function(){
    modal.show()
  })
  $("#closeModal").click(function(){
    modal.hide();
  })
  $("#closeModalFooter").click(function(){
    modal.hide();
  });
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.hide()
    }
  }

  function resizeAllMiradorViewers(){
    Object.keys(mirador_instances).forEach(function(key, index){
      mirador_instances[key].eventEmitter.publish("resizeMirador");
    });
  }
  $( window ).resize(resizeAllMiradorViewers);

  async function loadAll(){
    $("html, body, .viewport").css("overflow","hidden");
    const promises = []
    for(let el of msOrdered){
      let ms = manuscripts[el];
      await addMirador(ms,el);
      await addManuscript(ms,el);
      await addTranslation(ms);
    }
  }
  loadAll()
    .then(function(){
      $("html, body, .viewport").css("overflow","initial");
      resizeAllMiradorViewers()
      $(".ms-mirador").hide();
      $("#loading-bar").css('width', '100%').attr('aria-valuenow', 100);
      $("#loading-bar").html("100%")
      $("#loading").hide();
      msOverflowCorrect();
    });

  //Add ms sections to jump menu
  for (var i = 0; i < legend_episodes.length; i++){
    $('#jump-select').append($('<option>', {
      value: legend_episodes[i][0],
      text: legend_episodes[i][1]
    }));
  }

  function toggleManuscripts(){
    console.log("toggleManuscripts");
    let manuscript = $(this).val();
    options.manuscripts[manuscript] = $(this).is(":checked");
    if(options.manuscripts[manuscript]){
      $("#"+manuscript).parent(".ms-col").show();
    } else {
      $("#"+manuscript).parent(".ms-col").hide();
    }
    toggleMirador(options.images);
    toggleTranslations(options.translations);
    msOverflowCorrect()
  }
  $("input[name='manuscript']").change(toggleManuscripts);

  function toggleAbbreviations(){
    $("tei-choice").each(function(){
      $(this).children("tei-expan").toggle();
      $(this).children("tei-abbr").toggle();
    })
    options.expanded_abbreviations = $(this).is(":checked");
  }
  $("input[name='abbreviations-toggle'").change(toggleAbbreviations);

  function toggleFoliation(){
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
  }
  $("input[name='foliation-toggle'").change(toggleFoliation);

  function toggleLineBeginnings(){
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
  }
  $("input[name='linebeginnings-toggle'").change(toggleLineBeginnings);

  function togglePunctuation(){
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
  }
  $("input[name='editor-punctuation-toggle'").change(togglePunctuation);

  function toggleCapitalization(){
    options.editor_capitalization = $(this).is(":checked");
    if(options.editor_capitalization){
      $("tei-choice > tei-reg[resp='editor'][type='capit']").show();
      $("tei-choice > tei-orig").hide();
    } else {
      $("tei-choice > tei-reg[resp='editor'][type='capit']").hide();
      $("tei-choice > tei-orig").show();
    }
  }
  $("input[name='editor-capitalization-toggle'").change(toggleCapitalization);

  function toggleScribalCorrections(){
    console.log("toggleScribalCorrections()");
    options.scribal_corrections = $(this).is(":checked");
    if(options.scribal_corrections){
      //Does not display text tagged with <del> and displays text tagged with <add> as normal letters integrated into the body of the text
      $("tei-del").hide();
      $("tei-add").css("vertical-align", "baseline");
      $("tei-add").css("font-size", "unset");
    } else {
      //Shows text tagged with <del> as crossed-out words and text tagged with <add> as superscript letters
      $("tei-add").css("vertical-align", "super");
      $("tei-add").css("font-size", "smaller");
      $("tei-del").show();
      $("tei-del").css("display", "inline");
      $("tei-del").css("text-decoration", "line-through");
    }
  }
  $("input[name='scribal-corrections-toggle']").change(toggleScribalCorrections);

  // Helper function for changing number of columns
  function change_columns(){
      if(options.images && options.translations){
          $("#texts > div").css("flex-basis", "33%");
          $("#texts > div").css("width", "33%");
          resizeAllMiradorViewers();
      } else {
          $("#texts > div").css("flex-basis", "50%");
          $("#texts > div").css("width", "50%");
          resizeAllMiradorViewers();
      }
  }

  function toggleMirador(override){
    if(typeof override === "boolean"){
      options.images = override;
    } else {
      options.images = $(this).is(":checked");
    }
    if(options.images){
        Object.keys(options.manuscripts).forEach(function(key, index){
          if(options.manuscripts[key]){
            $(`#mirador-viewer-${key}`).parent().show();
          } else {
            $(`#mirador-viewer-${key}`).parent().hide();
          }
        })
    } else {
        $(".ms-mirador").hide();
    }
    change_columns();
    msOverflowCorrect()
  }
  $("input[name='images-toggle']").change(toggleMirador);
  $("input[name='mirador-display']").change(toggleMirador);

  function toggleTranslations(override){
    if(typeof override === "boolean"){
      options.translations = override;
    } else {
      options.translations = $(this).is(":checked");
    }
    if(options.translations){
      Object.keys(options.manuscripts).forEach(function(key, index){
        if(options.manuscripts[key]){
          $(`#${key}-translation`).parent().show();
        } else {
          $(`#${key}-translation`).parent().hide();
        }
      })
    } else {
        $(".ms-translation").hide();
    }
    change_columns();
    msOverflowCorrect()
  }
  $("input[name='translations-toggle']").change(toggleTranslations);
  $("input[name='translation-display']").change(toggleTranslations);

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
