// REMEMBER TO IMPORT THE SAMPLE BOUNDARY FIRST

//===============================================================//
// MODULE 3 - INTERACTIVE GRAPHIC USER INTERFACE
//===============================================================//

//1. Loading required assests

// Loading classification

var classified = ee.Image(
    'projects/s2-processing/assets/classified');
    
Map.addLayer(classified, {
  min: 1,
  max: 3,
  palette: [
    '419BDF', // Water
    'F4D03F', // Grassland
    '228B22'  // Forest
  ]
}, 'Habitat Classification');

//  Loading SNIC
var SNIC = ee.Image(
    'projects/s2-processing/assets/SNIC'); 

// 2.  Displaying the classified habitats
var palette = [
'419BDF',
'F4D03F',
'228B22'
];

Map.centerObject(sample,14);

// 3. Adding a title
var title = ui.Label({
value:'STOKE PARK HABITAT CLASSIFICATION EXPLORER',
style:{
fontSize:'22px',
fontWeight:'bold',
margin:'10px'
}
});

// 4. Adding an information panel
var info = ui.Label({
  value:
    'This application presents an Object-Based Habitat Classification produced using Sentinel-1 SAR data, Sentinel-2 multispectral imagery, and a Random Forest classifier.\n\n' +

    'Features:\n' +
    '• View the classified habitat map.\n' +
    '• Display SNIC image segmentation.\n' +
    '• Click anywhere on the map to identify the habitat class.\n' +
    '• View the overall classification accuracy and Kappa statistic.\n\n' +

    'Habitat Classes:\n' +
    '1. Water\n' +
    '2. Grassland\n' +
    '3. Forest\n\n' +

    'To use this application for a different study area or time period, modify the study area, acquisition dates, and training data in Modules 1 and 2 before rerunning the classification workflow.',

  style: {
    fontSize: '13px',
    whiteSpace: 'pre-wrap',
    margin: '8px 0 10px 0'
  }
});
var panel = ui.Panel({
style:{
width:'500px',
padding:'10px'
}
});

panel.add(title);
panel.add(info);

ui.root.insert(0,panel);

// 5. Adding the legend
var legend = ui.Panel({
style:{
position:'bottom-left',
padding:'8px'
}
});

legend.add(ui.Label('Legend'));

function makeRow(color,name){

var colorBox = ui.Label('',{
backgroundColor:'#'+color,
padding:'8px',
margin:'0'
});

var description = ui.Label(name,{
margin:'0 0 4px 6px'
});

return ui.Panel([
colorBox,
description
],ui.Panel.Layout.Flow('horizontal'));

}

legend.add(makeRow('419BDF','Water'));
legend.add(makeRow('F4D03F','Grassland'));
legend.add(makeRow('228B22','Forest'));

Map.add(legend);

// 6. Layer Selector
var selector = ui.Select({
  items: [
    'Habitat',
    'SNIC'
  ],
  placeholder: 'Select Layer'
});

selector.onChange(function(choice) {

  Map.layers().reset();

  if (choice === 'Habitat') {
    Map.addLayer(
      classified,
      {
        min: 1,
        max: 3,
        palette: palette
      },
      'Habitat'
    );
  }

  if (choice === 'SNIC') {
    Map.addLayer(
      SNIC,
      {
        min: 0,
        max: 0.5
      },
      'SNIC'
    );
  }
});

panel.add(selector);

//7.  Adding the classification accuracy

var accuracyResults = ee.FeatureCollection(
  'projects/s2-processing/assets/Classification_Accuracy'
);

accuracyResults.first().evaluate(function(result){

  var accuracy = result.properties.Overall_Accuracy;
  var kappa = result.properties.Kappa;


  panel.add(ui.Label({

    value:
      'Classification Accuracy\n\n' +
      'Overall Accuracy: ' +
      (accuracy * 100).toFixed(1) + '%\n' +
      'Kappa: ' +
      kappa.toFixed(3),

    style:{
      margin:'10px',
      whiteSpace:'pre',
      fontSize:'13px'
    }

  }));

});

var inspector = ui.Label('Click on the map to identify habitat.');

//8. Adding an inspector to get habitat class
panel.add(inspector);

Map.onClick(function(coords) {

  var point = ee.Geometry.Point([coords.lon, coords.lat]);

  var habitat = classified.sample({
    region: point,
    scale: 10,
    numPixels: 1,
    geometries: false
  }).first();

  habitat.evaluate(function(result) {

    if (result === null) {
      inspector.setValue('No habitat data at this location.');
      return;
    }

    var classID = result.properties.classification;

    var habitatName;

    if (classID === 1) {
      habitatName = 'Water';
    } else if (classID === 2) {
      habitatName = 'Grassland';
    } else if (classID === 3) {
      habitatName = 'Forest';
    } else {
      habitatName = 'Unknown';
    }

    inspector.setValue(
      'Habitat Class: ' + habitatName
    );

  });
  
});

Map.centerObject(sample,14)
