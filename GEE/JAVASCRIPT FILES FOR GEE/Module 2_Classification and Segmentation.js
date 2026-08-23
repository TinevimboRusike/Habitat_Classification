// REMEMBER TO IMPORT THE SAMPLE BOUNDARY AND TRAINING POLYGONS FIRST

//===============================================================//
// MODULE 2 - OBJECT BASED CLASSIFICATION
//===============================================================//


// 1. LOADING PREDICTOR STACK


var predictorStack = ee.Image(
  'projects/s2-processing/assets/predictorStack'
);


print('Predictor Stack', predictorStack);



// 2. LOADING TRAINING IMAGE FOR SNIC SEGMENTATION


var trainingImage = ee.Image(
  'projects/s2-processing/assets/trainingImage'
);



// 3. SNIC IMAGE SEGMENTATION


var SNIC = ee.Algorithms.Image.Segmentation.SNIC({

  image: trainingImage,

  size: 5,

  compactness: 0.6,

  connectivity: 8

});


print('SNIC', SNIC);


// Display SNIC
Map.addLayer(
  SNIC.select('clusters'),
  {
    min:0,
    max:500
  },
  'SNIC Segments'
);




// EXPORTING SNIC


Export.image.toAsset({

  image: SNIC,

  description:'SNIC',

  assetId:'projects/s2-processing/assets/SNIC',

  region:sample,

  scale:10,

  maxPixels:1e13

});




// 4. CALCULATE MEAN VALUES PER OBJECT



var segmentMeans = predictorStack
  .addBands(SNIC)
  .reduceConnectedComponents({

    reducer:ee.Reducer.mean(),

    labelBand:'clusters'

  });


print('Segment Means',segmentMeans);




// 5. EXTRACTING TRAINING SAMPLES


var trainingSamples = segmentMeans.sampleRegions({

  collection:trainingPolygons,

  properties:['ClassID'],

  scale:10,

  geometries:false

});


print(
  'Training Samples',
  trainingSamples.limit(5)
);


// 6. RANDOM FOREST FUNCTION



function trainRF(samples){


var predictors=[

'GREEN',

'NIR',

'NIRcontrast',

'NIRcorrelation',

'NIRentropy',

'NIRvariance',

'RE1',

'RE2',

'RE3',

'RE4',

'RED',

'SWIR1',

'SWIR2',

'VH',

'VV',

'VVcontrast',

'VVcorrelation',

'VVentropy',

'VVvariance'

];


var classifier = ee.Classifier.smileRandomForest({

numberOfTrees:1000,

variablesPerSplit:4,

minLeafPopulation:1,

bagFraction:0.7,

seed:1

});


return classifier.train({

features:samples,

classProperty:'ClassID',

inputProperties:predictors

});


}




// 7. TRAINING CLASSIFIER



var classifier = trainRF(trainingSamples);



print(
'Variable Importance',
classifier.explain()
);




// 8. PERFORMING THE CLASSIFICATION



var classified = segmentMeans
  .classify(classifier)
  .clip(sample)
  .rename('classification');



Map.addLayer(

classified,

{

min:1,

max:3,

palette:[

'419BDF',

'F4D03F',

'228B22'

]

},

'Habitat Classification'

);




// EXPORTING CLASSIFICATION



Export.image.toAsset({

image:classified.toByte(),

description:'classified',

assetId:'projects/s2-processing/assets/classified',

region:sample,

scale:10,

maxPixels:1e13

});

// EXPORTING CLASSIFICATION TO DRIVE



Export.image.toDrive({

image:classified.toByte(),

description:'classified',

region:sample,

scale:10,

maxPixels:1e13,

crs:'EPSG:27700',

folder: 'GEE_Exports'
});


// 9. ACCURACY ASSESSMENT


// Adding a random split

var validation = trainingSamples.randomColumn('random');


// 70% training data

var train = validation.filter(
ee.Filter.lt('random',0.7)
);


// 30% testing data

var test = validation.filter(
ee.Filter.gte('random',0.7)
);



// Training the  validation model

var validationRF = trainRF(train);


// Predicting on test data

var validated = test.classify(validationRF);



// Creating a Confusion Matrix

var matrix = validated.errorMatrix(

'ClassID',

'classification'

);



print(
'Confusion Matrix',
matrix
);


print(
'Overall Accuracy',
matrix.accuracy()
);


print(
'Kappa',
matrix.kappa()
);

print(
'Producer Accuracy',
matrix.producersAccuracy()
);

print(
'Users Accuracy',
matrix.consumersAccuracy()
);

// 10. EXPORTING THE ACCURACY RESULTS



var accuracyResults = ee.FeatureCollection([

ee.Feature(

ee.Geometry.Point([0,0]),

{

'Overall_Accuracy':
matrix.accuracy(),

'Kappa':
matrix.kappa()

}

)

]);



Export.table.toAsset({

collection:accuracyResults,

description:'Classification_Accuracy',

assetId:'projects/s2-processing/assets/Classification_Accuracy'

});