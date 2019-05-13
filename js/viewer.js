//Variables
var CETEIcean = new CETEI();
var manuscripts = {
  "Latin-A": {
    "name": "Latin-A",
    "resource": "xml/LatinTexts/Latin-A.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/Latin-A",
    "translation": "xml/Translations-MM/Latin-A.xml"
  },
  "Latin-B": {
    "name": "Latin-B",
    "resource": "xml/LatinTexts/Latin-B.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/Latin-B",
    "translation": "xml/Translations-MM/Latin-B.xml"
  },
  "Latin-C": {
    "name": "Latin-C",
    "resource": "xml/LatinTexts/Latin-C.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/Latin-C",
    "translation": "xml/Translations-MM/Latin-C.xml"
  },
  "B1" : {
    "name": "B1",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_B1_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/B1",
    "translation": "xml/Translations-MM/B1.xml"
  },
  "B2" : {
    "name": "B2",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_B2_HansPech_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/B2",
    "translation": "xml/Translations-MM/B2.xml"
  },
  "D" : {
    "name": "D",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_D_AnnaKelner_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/D",
    "translation": "xml/Translations-MM/D.xml"
  },
  "G" : {
    "name": "G",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_G_EleanorGoerss_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/G",
    "translation": "xml/Translations-MM/G.xml"
  },
  "K1" : {
    "name": "K1",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_K1_ZacharyHayworth_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/K1",
    "translation": "xml/Translations-MM/K1.xml"
  },
  "K2" : {
    "name": "K2",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_K2_EleanorGoerss_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/K2",
    "translation": "xml/Translations-MM/K2.xml"
  },
  "N" : {
    "name": "N",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_N_SusanneZwierlein_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/N",
    "translation": "xml/Translations-MM/N.xml"
  },
  "S" : {
    "name": "S",
    "resource" : "xml/manuscripts_2019_02_20/manuscript_S_RachaKirakosian_HP.xml",
    "manifest_url": "http://digital-editing.fas.harvard.edu/manifests/S",
    "translation": "xml/Translations-MM/S.xml"
  }
};

var msOrdered = ["Latin-A", "Latin-B", "Latin-C", "B1", "B2", "D", "G", "K1", "K2", "N", "S"];
var mirador_instances = {};

var sectionsSet = new Set();

var options = {
  "expanded_abbreviations":true,
  "foliation":false,
  "linebeginnings":false,
  "editor_punctuation":true,
  "editor_capitalization":true,
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

//Functions
//
// async function loadManifests(){
//   const urls = msOrdered.map(function(i){ return manuscripts[i]["manifest_url"]})
//   const promises = [];
//   for(let url of urls){
//     promises.push(fetch(url, {mode:"cors"}).then((response) => response.json()));
//   }
//   let data = await Promise.all(promises);
//   // msOrdered.forEach(function(ms, index){
//   //   manuscripts[ms]["manifest_data"] = data[index];
//   // })
//   return data;
// }

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
}
// function addManuscript(ms, el){
//   console.log("Adding Manuscript");
//   // return new Promise(function(resolve){
//     let ms_desc = manuscripts[el]["manifest_data"];
//     console.log(`MS_DESC ${ms_desc}`)
//     // let ms_desc;
//     let template = document.querySelector("#ms-template").content.cloneNode(true);
//     template.querySelector(".ms-title").innerText = `Manuscript ${ms.name}`;
//     template.querySelector(".manuscript").setAttribute("id", ms.name);
//     template.querySelector(".ms-desc").innerText = ms_desc;
//     document.querySelector("#texts").appendChild(template);
//
//     CETEIcean.getHTML5(ms.resource, function(data){
//       var ms_el = "#"+ms.name;
//       $(ms_el).html("");
//       $(ms_el).append(data);
//       CETEIcean.addStyle(document, data);
//
//       //Add facs div to each cb (foliation) with valid attribute
//       addFoliation(ms_el);
//
//       // Add spans for line break display
//       addLineBreaks(ms_el);
//
//       $(ms_el + " tei-lb").toggle(); //Start off manuscripts with line beginnings off
//       if(!$(`${ms_el}-display`).is(":checked")){
//         $(`${ms_el}`).parent(".ms-col").toggle();
//       }
//
//       console.log(`Add MS ${ms_el}`)
//
//       //Fix weird hard carriage returns - costly to run this regex
//       //var s = $(ms_el).html();
//       //var s2 = s.replace(/<\/tei-choice>[\s][\n\r\s\t]+</g,'</tei-choice><');
//       //var s2 = s.replace(/>[\n\r\s\t]+</g,'><');
//       //$(ms_el).html(s2);
//       //$(ms_el).html(s.replace(/[\n\r]+/g, " "));
//       //console.log($(ms_el));
//     });
//   // });
// }

// function addTranslation(ms){
//   let ms_el = `#${ms.name}-translation`;
//   console.log(`Add Translation ${ms_el}`)
//   let translation = document.querySelector("#translation-template").content.cloneNode(true);
//   translation.querySelector(".ms-container-translation").setAttribute("id", `${ms.name}-translation`);
//   document.querySelector("#texts").appendChild(translation);
//   CETEIcean.getHTML5(ms.translation, function(data){
//     $(ms_el).html("");
//     $(ms_el).append(data);
//     CETEIcean.addStyle(document, data);
//   });
// }

const addTranslation = async (ms) => {
  const ms_el = `#${ms.name}-translation`
  console.log(`async Translation ${ms_el}`)
  const template = document.querySelector("#translation-template").content.cloneNode(true);
  template.querySelector(".ms-container-translation").setAttribute("id", `${ms.name}-translation`);
  document.querySelector("#texts").appendChild(template);
  const cet = await CETEIcean.getHTML5(ms.translation, function(data){
    $(ms_el).empty()
    $(ms_el).append(data);
    CETEIcean.addStyle(document, data);
  });
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
}

// function addMirador(ms, el){
//   console.log(`Add Mirador ${el}`)
//   let miradorTemplate = document.querySelector("#mirador-template").content.cloneNode(true);
//   miradorTemplate.querySelector(".ms-col.ms-mirador").setAttribute("id", `mirador-container-${el}`);
//   miradorTemplate.querySelector(".ms-container-mirador").setAttribute("id", `mirador-viewer-${el}`);
//   document.querySelector("#texts").appendChild(miradorTemplate);
//   $.getJSON(ms["manifest_url"]).done(function(manifest){
//
//     manuscripts[el]["manifest_data"] = manifest;
//     console.log(`Manifest data loaded ${el}`)
//
//     let canvas = manifest.sequences[0].canvases[0]["@id"];
//     console.log(canvas);
//
//     let m = Mirador({
//       "id": `mirador-viewer-${el}`,
//       "layout": "1x1",
//       "mainMenuSettings": {
//         "show": false
//       },
//       "openManifestsPage" : true,
//       "buildPath": "js/mirador-2.7-nobootstrap/",
//       "data": [
//         {"manifestUri": ms["manifest_url"]}
//       ],
//       "windowObjects": [{
//         "loadedManifest": ms["manifest_url"],
//         "canvasID": canvas,
//         "viewType": "ImageView"
//       }],
//       'windowSettings' : {
//         "availableViews" : ['ThumbnailsView', 'ImageView', 'BookView'],
//         "sidePanel" : false,
//         "bottomPanelVisible" : true,
//         "canvasControls": { // The types of controls available to be displayed on a canvas
//           "annotations" : {
//             "annotationLayer" : false
//           }
//         },
//         "fullScreen" : false,
//         "displayLayout" : true,
//         "layoutOptions" : {
//             "newObject" : false,
//             "close" : false,
//             "slotRight" : false,
//             "slotLeft" : false,
//             "slotAbove" : false,
//             "slotBelow" : false,
//         }
//       }
//     });
//     mirador_instances[`mirador-viewer-${el}`] = m;
//     return new Promise(function(resolve){
//
//     });
//   });
// }


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

  //Bind modal
  // $("#options-modal-button").click(function(){
  //   $("#optionsModal").modal("show");
  // })

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


  // Change to use promises or callback?
  msOrdered.forEach(async function(el){
    let ms = manuscripts[el];

    // const man = await loadManifests();
    // console.log(man);

    // addMirador(ms,el).then(addManuscript(ms,el)).then(addTranslation(ms));
    await addMirador(ms,el)
    await addManuscript(ms,el)
    await addTranslation(ms);
  });

  // setTimeout(function(){
  //   $(".ms-mirador").hide();
  // }, 5000)


  //Add ms sections to jump menu
  for (var i = 0; i < legend_episodes.length; i++){
    $('#jump-select').append($('<option>', {
      value: legend_episodes[i][0],
      text: legend_episodes[i][1]
    }));
  }

  function toggleManuscripts(){
    let manuscript = $(this).val();
    options.manuscripts[manuscript] = $(this).is(":checked");
    if(options.manuscripts[manuscript]){
      $("#"+manuscript).parent(".ms-col").show();
    } else {
      $("#"+manuscript).parent(".ms-col").hide();
    }
    toggleMirador(options.images);
    toggleTranslations(options.translations);
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

  // Helper function for changing number of columns
  function change_columns(){
      if(options.images && options.translations){
          $("#texts > div").css("flex-basis", "33%");
          $("#texts > div").css("width", "33%");
      } else {
          $("#texts > div").css("flex-basis", "50%");
          $("#texts > div").css("width", "50%");
      }
  }


  function toggleMirador(override){
    if(typeof override === "boolean"){
      options.images = override;
    } else {
      options.images = $(this).is(":checked");
    }
    if(options.images){
        // $(".ms-mirador").show();
        Object.keys(options.manuscripts).forEach(function(key, index){
          if(options.manuscripts[key]){
            console.log(`#mirador-viewer-${key}`);
            $(`#mirador-viewer-${key}`).parent().show();
          }
        })
    } else {
        $(".ms-mirador").hide();
    }
    change_columns();
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
      // $(".ms-translation").show();
      Object.keys(options.manuscripts).forEach(function(key, index){
        if(options.manuscripts[key]){
          console.log(`#${key}-translation`);
          $(`#${key}-translation`).parent().show();
        }
      })
    } else {
        $(".ms-translation").hide();
    }
    change_columns();
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
