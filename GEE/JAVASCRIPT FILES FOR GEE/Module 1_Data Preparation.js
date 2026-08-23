// REMEMBER TO IMPORT THE SAMPLE BOUNDARY FIRST

//===============================================================//
//MODULE 1- PREDICTOR VARIABLE PREPARATION
//===============================================================//

//================ SENTINEL 1 DATA PREPARATION ===============================================//

var wrapper = require('users/tinevimborusike32/s2:wrapper_tine');
var helper = require('users/tinevimborusike32/s2:utilities_tine');

//---------------------------------------------------------------------------//
// DEFINE PARAMETERS
//---------------------------------------------------------------------------//



var parameter = {//1. Data Selection
              START_DATE: "2025-04-01",
              STOP_DATE: "2025-10-31",
              POLARIZATION:'VVVH',
              ORBIT : 'DESCENDING',
              GEOMETRY: sample, 
              //2. Additional Border noise correction
              APPLY_ADDITIONAL_BORDER_NOISE_CORRECTION: true,
              //3.Speckle filter
              APPLY_SPECKLE_FILTERING: true,
              SPECKLE_FILTER_FRAMEWORK: 'MULTI',
              SPECKLE_FILTER: 'REFINED LEE',
              SPECKLE_FILTER_KERNEL_SIZE: 15,
              SPECKLE_FILTER_NR_OF_IMAGES: 10,
              //4. Radiometric terrain normalization
              APPLY_TERRAIN_FLATTENING: true,
              DEM: ee.Image("CGIAR/SRTM90_V4"),
              TERRAIN_FLATTENING_MODEL: 'VOLUME',
              TERRAIN_FLATTENING_ADDITIONAL_LAYOVER_SHADOW_BUFFER: 0,
              //5. Output
              FORMAT : 'DB',
              CLIP_TO_ROI: false,
              SAVE_ASSETS: false
}

//Preprocess the S1 collection
var s1_preprocces = wrapper.s1_preproc(parameter);

var s1 = s1_preprocces[1]; 

//---------------------------------------------------------------------------//
// DO THE JOB MEDIAN
//---------------------------------------------------------------------------/
// Median VV and VH descending.
var VVMedian = s1.select('VV').median().clip(sample).reproject({
    crs: 'EPSG:27700',
    scale: 10
  });
var VHMedian = s1.select('VH').median().clip(sample).reproject({
    crs: 'EPSG:27700',
    scale: 10
  });


// Converting to dB 
var VVMedian = VVMedian.log10().multiply(10);
var VHMedian = VHMedian.log10().multiply(10);


//---------------------------------------------------------------------------//
// VISUALIZE
//---------------------------------------------------------------------------//
Map.centerObject(sample, 15);

//Map.addLayer(VVMedian,
            // {min:-20, max:-6},
            // 'VV Median');

//Map.addLayer(VHMedian,
            // {min:-26, max:-11},
            // 'VH Median');



//---------------------------------------------------------------------------//
// EXPORT TO GOOGLE DRIVE
//---------------------------------------------------------------------------//

Export.image.toDrive({
  image: VVMedian,
  description: 'VVsample',
  folder: 'GEE_Exports',
  fileNamePrefix: 'VVsample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VHMedian,
  description: 'VHsample',
  folder: 'GEE_Exports',
  fileNamePrefix: 'VHsample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
});

// Getting date information for s1 imagery

print('Sentinel-1 images',
  s1.map(function(img) {
    return ee.Feature(null, {
      date: img.date().format('YYYY-MM-dd'),
      id: img.id()
    });
  })
);

//================ SENTINEL 2 ===============================================//
//cloud masking function recommended by GEE.
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

// Load Sentinel-2
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(sample)
  .filterDate('2025-04-01', '2025-10-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
  .map(maskS2clouds);
  
var s2_mean = s2.mean();
var s2_median = s2.median();

// Clipping mean to study area
var s2_mean = s2_mean.clip(sample)
  .reproject({
    crs: 'EPSG:27700',
    scale: 10
  });

// Clipping median to study area
var s2_median = s2_median.clip(sample)
  .reproject({
    crs: 'EPSG:27700',
    scale: 10
  });
  
// Visualising the results
var visualization = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};

Map.centerObject(sample, 15);


//Exporting median of different bands  

//Exporting B3(GREEN)
Export.image.toDrive({
  image: s2_median.select('B3'),
  description: 'Green_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'Green_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})


//Exporting B4(RED)
Export.image.toDrive({
  image: s2_median.select('B4'),
  description: 'Red_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'Red_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B5(RE1)
Export.image.toDrive({
  image: s2_median.select('B5'),
  description: 'RE1_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'RE1_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B6(RE2)
Export.image.toDrive({
  image: s2_median.select('B6'),
  description: 'RE2_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'RE2_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B7(RE3)
Export.image.toDrive({
  image: s2_median.select('B7'),
  description: 'RE3_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'RE3_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B8(NIR)
Export.image.toDrive({
  image: s2_median.select('B8'),
  description: 'NIR_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'NIR_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B8A(RE4)
Export.image.toDrive({
  image: s2_median.select('B8A'),
  description: 'RE4_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'RE4_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B11 (SWIR1)
Export.image.toDrive({
  image: s2_median.select('B11'),
  description: 'SWIR1_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'SWIR1_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//Exporting B12 (SWIR2)
Export.image.toDrive({
  image: s2_median.select('B12'),
  description: 'SWIR2_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'SWIR2_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//====================================================================================================================================

// Computing Spatial Texture using GLCM (Grey- Level Co-occurrence Matrix) variables

//=========================================================================================================================

// Computing NIR texture matrices

//1. Coverting the band to interger values
var nir = s2_median.select('B8')
                . multiply(255)
                .toUint8();
                
//GLCM FOR NIR BAND                
var  NIRglcm = nir.glcmTexture({size: 2});

//contrast
var NIRcontrast = NIRglcm.select('B8_contrast');
//Map.addLayer(NIRcontrast,
          //   {min: 0, max: 650, palette:['blue','cyan','yellow','red']},
             //'NIRcontrast');
             
//entropy
var NIRentropy = NIRglcm.select('B8_ent');
//Map.addLayer(NIRentropy,
            // {min: 0, max: 5, palette:['blue','cyan','yellow','red']},
             //'NIRentropy');
             
//correlation             
var NIRcorrelation  = NIRglcm.select('B8_corr');
//Map.addLayer(NIRcorrelation,
          //   {min: -0.5, max: 1, palette:['blue','cyan','yellow','red']},
           //  'NIRcorrelation');
             
//variance             
var NIRvariance  = NIRglcm.select('B8_var');
//Map.addLayer(NIRvariance,
            // {min: 0, max: 1500, palette:['blue','cyan','yellow','red']},
             //'NIRvariance');
             
//=======================================================================================================================
// Computing VV texture matrices

var VVint = VVMedian
  .add(30)      // shift to positive
  .multiply(10) // preserve one decimal place
  .toInt16();
  
//GLCM FOR VV
var VVglcm = VVint.glcmTexture({size: 2});

//contrast
var VVcontrast = VVglcm.select('VV_contrast');

//Map.addLayer(
//  VVcontrast,
 // {min: 6, max: 2500, palette:['blue','cyan','yellow','red']},
 // 'VV contrast'
//);

// entropy
var VVentropy = VVglcm.select('VV_ent');

//Map.addLayer(
//  VVentropy,
 // {min: 2, max: 5, palette:['blue','cyan','yellow','red']},
 // 'VV entropy'
//);

//correlation
var VVcorrelation = VVglcm.select('VV_corr');

//Map.addLayer(
//  VVcorrelation,
 // {min: -1, max: 1, palette:['blue','cyan','yellow','red']},
 // 'VV correlation'
//);

//variance
var VVvariance = VVglcm.select('VV_var');

//Map.addLayer(
 // VVvariance,
 // {min: 0, max: 2500, palette:['blue','cyan','yellow','red']},
  //'VV variance'
//);


//Checking the values to add

print(
  VVvariance.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: sample,
    scale: 10,
    maxPixels: 1e13
  })
);

// Exporting the GLCM results

//NIR
Export.image.toDrive({
  image: NIRcontrast,
  description: 'NIRcontrast_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'NIRcontrast_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

Export.image.toDrive({
  image: NIRentropy,
  description: 'NIRentropy_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'NIRentropy_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

Export.image.toDrive({
  image: NIRcorrelation,
  description: 'NIRcorrelation_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'NIRcorrelation_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

Export.image.toDrive({
  image: NIRvariance,
  description: 'NIRvariance_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'NIRvariance_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

//VV
Export.image.toDrive({
  image: VVcontrast,
  description: 'VVcontrast_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'VVcontrast_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

Export.image.toDrive({
  image: VVentropy,
  description: 'VVentropy_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'VVentropy_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

Export.image.toDrive({
  image: VVcorrelation,
  description: 'VVcorrelation_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'VVcorrelation_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

Export.image.toDrive({
  image: VVvariance,
  description: 'VVvariance_sample',
  folder: 'GEE_exports',
  fileNamePrefix: 'VVvariance_sample',
  region: sample,
  scale: 10,
  crs:'EPSG:27700',
  maxPixels: 1e13
})

// Creating the predictor stack and exporting it

  var predictorStack = ee.Image.cat([
  
    // Sentinel-2 spectral bands
  s2_median.select('B8').rename('NIR'),
  s2_median.select('B4').rename('RED'),
  s2_median.select('B3').rename('GREEN'),
  s2_median.select('B11').rename('SWIR1'),
  s2_median.select('B12').rename('SWIR2'),
  s2_median.select('B5').rename('RE1'),
  s2_median.select('B6').rename('RE2'),
  s2_median.select('B7').rename('RE3'),
  s2_median.select('B8A').rename('RE4'),

  // Sentinel-1
  VVMedian.rename('VV'),
  VHMedian.rename('VH'),

  // NIR texture
  NIRcontrast.rename('NIRcontrast'),
  NIRcorrelation.rename('NIRcorrelation'),
  NIRentropy.rename('NIRentropy'),
  NIRvariance.rename('NIRvariance'),

  // VV texture
  VVcontrast.rename('VVcontrast'),
  VVcorrelation.rename('VVcorrelation'),
  VVentropy.rename('VVentropy'),
  VVvariance.rename('VVvariance')
  
  ]).clip(sample);

Export.image.toAsset({
  image: predictorStack,
  description: 'predictorStack',
  assetId: 'projects/s2-processing/assets/predictorStack',
  region: sample,
  scale: 10,
  maxPixels: 1e13
});


// Creating the training image and exporting it

var trainingS2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(sample)
  .filterDate('2025-04-01', '2025-09-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);
  
  
var trainingImage = trainingS2
  .median()
  .select(['B4', 'B3', 'B2'])
  .rename(['RED', 'GREEN', 'BLUE'])
  .clip(sample)
  .reproject({
    crs: 'EPSG:27700',
    scale: 10
  });
  
Export.image.toAsset({
  image: trainingImage,
  description: 'trainingImage',
  assetId: 'projects/s2-processing/assets/trainingImage',
  region: sample,
  scale: 10,
  maxPixels: 1e13
});  



// Getting date information for s2 imagery
//var s2Dates = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  //  .filterBounds(STOKE_PARK)
    //.filterDate('2025-04-01', '2025-10-31')
   // .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

//print(
 // s2Dates.aggregate_array('system:time_start')
 //   .map(function(d){
     // return ee.Date(d).format('YYYY-MM-dd');
   // })
//);