
#  HABITAT CLASSIFICATION SAMPLE CODE
#  TINEVIMBO RUSIKE 


#-------------------------------------------------------------------------------------------#
# 1.  SEGMENTATION
#-------------------------------------------------------------------------------------------#

# A. Loading the required packages

library(raster) # handling rasters
library(OpenImageR) # image segmentation
library(terra) # handling rasters
library(dplyr) # handling df
library(randomForest) # modelling
library(caret) # validation
library(tictoc) # computing the time taken to run the whole code.

tic('Total elapsed time: ')

# B. Setting the working directory
setwd('Write your file path here')


# C. Segmenting Individual images (April to September)

#===APRIL=====

April <- rast('Write your file path here/april.tif')

# Converting the image to an array

APRIL_ARRAY <- as.array(April)
dim(APRIL_ARRAY)

#  Removing Null values and replacing with a 0 
APRIL_ARRAY[is.na(APRIL_ARRAY)] <- 0

# RUNNING THE SEGMENTATION

res_slic <- superpixels(
  input_image = APRIL_ARRAY,
  method = "slic",
  superpixel = 800,      # adjust based on image size
  compactness = 5,
  return_labels = TRUE,
  return_slic_data = TRUE,
  verbose = TRUE
)

# Checking the results
str(res_slic)
image(res_slic$labels)

# Extracting the labels
labels <- res_slic$labels

dim(labels)

labels

# Converting the labels to a raster


seg_raster <- rast(labels)

ext(seg_raster) <- ext(April)
crs(seg_raster) <- crs(April)

plot(seg_raster)
dim(seg_raster)

# Exporting the segmented image

writeRaster(
  seg_raster,
  "April_segments.tif",
  overwrite = TRUE
)

#=== MAY =====

May <- rast('Write your file path here/may.tif')

# Converting the image to an array

MAY_ARRAY <- as.array(May)
dim(MAY_ARRAY)

# Removing Null values and replacing with a 0 
MAY_ARRAY[is.na(MAY_ARRAY)] <- 0

#  RUNNING THE SEGMENTATION

res_slic <- superpixels(
  input_image = MAY_ARRAY,
  method = "slic",
  superpixel = 800,      # adjust based on image size
  compactness = 5,
  return_labels = TRUE,
  return_slic_data = TRUE,
  verbose = TRUE
)

# Checking the results

str(res_slic)
image(res_slic$labels)

# Extracting the labels

labels <- res_slic$labels

dim(labels)

labels

# Converting the labels to a raster

seg_raster <- rast(labels)

ext(seg_raster) <- ext(May)
crs(seg_raster) <- crs(May)

plot(seg_raster)

# Exporting the segmented image

writeRaster(
  seg_raster,
  "May_segments.tif",
  overwrite = TRUE
)

#=== JUNE =====

June <- rast('Write your file path here/june.tif')

# Converting the image to an array

JUNE_ARRAY <- as.array(June)
dim(JUNE_ARRAY)

# Removing Null values and replacing with a 0 
JUNE_ARRAY[is.na(JUNE_ARRAY)] <- 0

# RUNNING THE SEGMENTATION

res_slic <- superpixels(
  input_image = JUNE_ARRAY,
  method = "slic",
  superpixel = 800,      # adjust based on image size
  compactness = 5,
  return_labels = TRUE,
  return_slic_data = TRUE,
  verbose = TRUE
)

#  Checking the results
str(res_slic)
image(res_slic$labels)

#  Extracting the labels
labels <- res_slic$labels

dim(labels)

labels

#  Converting the labels to a raster

seg_raster <- rast(labels)

ext(seg_raster) <- ext(June)
crs(seg_raster) <- crs(June)

plot(seg_raster)

# Exporting the segmented image

writeRaster(
  seg_raster,
  "June_segments.tif",
  overwrite = TRUE
)

#=== JULY =====

July <- rast('Write your file path here/july.tif')

# Converting the image to an array

JULY_ARRAY <- as.array(July)
dim(JULY_ARRAY)

# Removing Null values and replacing with a 0 
JULY_ARRAY[is.na(JULY_ARRAY)] <- 0

# RUNNING THE SEGMENTATION

res_slic <- superpixels(
  input_image = JULY_ARRAY,
  method = "slic",
  superpixel = 800,      # adjust based on image size
  compactness = 5,
  return_labels = TRUE,
  return_slic_data = TRUE,
  verbose = TRUE
)

#  Checking the results
str(res_slic)
image(res_slic$labels)

# Extracting the labels
labels <- res_slic$labels

dim(labels)

labels

# Converting the labels to a raster

seg_raster <- rast(labels)

ext(seg_raster) <- ext(July)
crs(seg_raster) <- crs(July)

plot(seg_raster)

# Exporting the segmented image

writeRaster(
  seg_raster,
  "July_segments.tif",
  overwrite = TRUE
)

#=== September =====

September <-rast('Write your file path here/september.tif')

#  Converting the image to an array

SEPTEMBER_ARRAY <- as.array(September)
dim(SEPTEMBER_ARRAY)

# Removing Null values and replacing with a 0 

SEPTEMBER_ARRAY[is.na(SEPTEMBER_ARRAY)] <- 0

# RUNNING THE SEGMENTATION

res_slic <- superpixels(
  input_image = SEPTEMBER_ARRAY,
  method = "slic",
  superpixel = 800,      # adjust based on image size
  compactness = 5,
  return_labels = TRUE,
  return_slic_data = TRUE,
  verbose = TRUE
)

# Checking the results
str(res_slic)
image(res_slic$labels)

# Extracting the labels
labels <- res_slic$labels

dim(labels)

labels

# Converting the labels to a raster

seg_raster <- rast(labels)

ext(seg_raster) <- ext(September)
crs(seg_raster) <- crs(September)

plot(seg_raster)

# Exporting the segmented image

writeRaster(
  seg_raster,
  "September_segments.tif",
  overwrite = TRUE
)

#===MEDIAN - OUR PREDICTION RASTER =====

Median <- rast('Write your file path here/median.tif')

# Converting the image to an array

MEDIAN_ARRAY <- as.array(Median)
dim(MEDIAN_ARRAY)

# Removing Null values and replacing with a 0 
MEDIAN_ARRAY[is.na(MEDIAN_ARRAY)] <- 0

# RUNNING THE SEGMENTATION

res_slic <- superpixels(
  input_image = MEDIAN_ARRAY,
  method = "slic",
  superpixel = 800,      # adjust based on image size
  compactness = 5,
  return_labels = TRUE,
  return_slic_data = TRUE,
  verbose = TRUE
)

# Checking the results
str(res_slic)
image(res_slic$labels)

#  Extracting the labels
labels <- res_slic$labels

dim(labels)

labels

# Converting the labels to a raster

seg_raster <- rast(labels)

ext(seg_raster) <- ext(Median)
crs(seg_raster) <- crs(Median)

plot(seg_raster)

# Exporting the segmented image

writeRaster(
  seg_raster,
  "Median_segments.tif",
  overwrite = TRUE
)
#-------------------------------------------------------------------------------------------#
# 2. CLASSIFICATION
#-------------------------------------------------------------------------------------------#

# A. LOADING S2 AND S1 PREDICTOR VARIABLES AND STACKING THEM INTO ONE

NIR <- rast('PREDICTOR_VARIABLES/NIR_sample.tif')
RED <- rast('PREDICTOR_VARIABLES/Red_sample.tif')
GREEN <- rast('PREDICTOR_VARIABLES/Green_sample.tif')
SWIR1 <- rast('PREDICTOR_VARIABLES/SWIR1_sample.tif')
SWIR2 <- rast('PREDICTOR_VARIABLES/SWIR2_sample.tif')
RE1 <- rast('PREDICTOR_VARIABLES/RE1_sample.tif')
RE2 <- rast('PREDICTOR_VARIABLES/RE2_sample.tif') 
RE3 <- rast('PREDICTOR_VARIABLES/RE3_sample.tif')
RE4 <- rast('PREDICTOR_VARIABLES/RE4_sample.tif') 
VH <- rast('PREDICTOR_VARIABLES/VHsample.tif')
VV <- rast('PREDICTOR_VARIABLES/VVsample.tif')
NIRcontrast <- rast('PREDICTOR_VARIABLES/NIRcontrast_sample.tif')
NIRentropy <- rast('PREDICTOR_VARIABLES/NIRentropy_sample.tif')
NIRcorrelation <- rast('PREDICTOR_VARIABLES/NIRcorrelation_sample.tif')
NIRvariance <- rast('PREDICTOR_VARIABLES/NIRvariance_sample.tif')
VVcontrast <- rast('PREDICTOR_VARIABLES/VVcontrast_sample.tif')
VVentropy <- rast('PREDICTOR_VARIABLES/VVentropy_sample.tif')
VVcorrelation <- rast('PREDICTOR_VARIABLES/VVcorrelation_sample.tif')
VVvariance <- rast('PREDICTOR_VARIABLES/VVvariance_sample.tif')

STACK <- c(NIR,RED,GREEN,SWIR1,SWIR2,RE1,RE2,RE3,RE4,VH,VV,NIRcontrast,NIRcorrelation,NIRentropy,NIRvariance,VVvariance,VVentropy,VVcontrast,VVcorrelation)
dim(STACK)

# B PREPARING TRAINING DATA FOR EACH IMAGE INDIVIDUALLY

#(labeling each segment with the habitat IDs and extracting the predictor stack values)

#== APRIL=====

segments <- rast("April_segments.tif")
Training <- vect("TRAINING_POLYGONS/april.shp")


# Extracting segment IDs under training polygons
seg_points <- extract(segments, Training)

# Renaming for clarity
seg_points$April_segments <- seg_points$lyr.1

# Adding class labels from polygons
seg_points$ClassID <- Training$ClassID[seg_points$ID]

# Assigning one class to each segment
segment_classes <- seg_points %>%
  group_by(April_segments) %>%
  summarise(
    ClassID = as.numeric(names(which.max(table(ClassID))))
  )


# Extracting the Mean spectral values for each segment
seg_stats_april <- zonal(
  STACK,
  segments,
  fun = mean,
  na.rm = TRUE
)

#renaning the lyr.1 to SegmentsID
names(seg_stats_april)[1] <- "SegmentID"

names(segment_classes)[1] <- "SegmentID"

# Joining the spectral statistics with class labels
train_df_april <- merge(
  seg_stats_april, 
  segment_classes,
  by = "SegmentID"
)

#== MAY =====
segments <- rast("May_segments.tif")
Training <- vect("TRAINING_POLYGONS/may.shp")


# For each segment the tool extracts which polygon it came from  and the segment it belongs to
seg_points <- extract(segments, Training)

# Renaming for clarity
seg_points$May_segments <- seg_points$lyr.1

# Adding class labels every record
seg_points$ClassID <- Training$ClassID[seg_points$ID]

# Assign one class to each segment
segment_classes <- seg_points %>%
  group_by(May_segments) %>%
  summarise(
    ClassID = as.numeric(names(which.max(table(ClassID))))
  )


# Extracting the Mean spectral values for each segment
seg_stats_may <- zonal(
  STACK,
  segments,
  fun = mean,
  na.rm = TRUE
)

#renaming the lyr.1 to SegmentsID
names(seg_stats_may)[1] <- "SegmentID"

names(segment_classes)[1] <- "SegmentID"

# Joining the spectral statistics with classlabels
train_df_may <- merge(
  seg_stats_may,
  segment_classes,
  by = "SegmentID"
)

#== JUNE =====
segments <- rast("June_segments.tif")
Training <- vect("TRAINING_POLYGONS/june.shp")


# For each segment the tool extracts which polygon it came from  and the segment it belongs to
seg_points <- extract(segments, Training)

# Renaming for clarity
seg_points$June_segments <- seg_points$lyr.1

# Adding class labels every record
seg_points$ClassID <- Training$ClassID[seg_points$ID]

# Assigning one class to each segment
segment_classes <- seg_points %>%
  group_by(June_segments) %>%
  summarise(
    ClassID = as.numeric(names(which.max(table(ClassID))))
  )


# Extracting the Mean spectral values for each segment
seg_stats_june <- zonal(
  STACK,
  segments,
  fun = mean,
  na.rm = TRUE
)
#remaning the lyr.1 to SegmentsID
names(seg_stats_june)[1] <- "SegmentID"

names(segment_classes)[1] <- "SegmentID"

# Joining the spectral statistics with classlabels
train_df_june <- merge(
  seg_stats_june,
  segment_classes,
  by = "SegmentID"
)

#== JULY =====
segments <- rast("July_segments.tif")
Training <- vect("TRAINING_POLYGONS/july.shp")


# For each segment the tool extracts which polygon it came from  and the segment it belongs to
seg_points <- extract(segments, Training)

# Renaming for clarity
seg_points$July_segments <- seg_points$lyr.1

# Adding class labels every record
seg_points$ClassID <- Training$ClassID[seg_points$ID]

# Assigning one class to each segment
segment_classes <- seg_points %>%
  group_by(July_segments) %>%
  summarise(
    ClassID = as.numeric(names(which.max(table(ClassID))))
  )


# Extracting the Mean spectral values for each segment
seg_stats_july <- zonal(
  STACK,
  segments,
  fun = mean,
  na.rm = TRUE
)

#remaning the lyr.1 to SegmentsID
names(seg_stats_july)[1] <- "SegmentID"

names(segment_classes)[1] <- "SegmentID"

# Joining the spectral statistics with classlabels
train_df_july <- merge(
  seg_stats_july,
  segment_classes,
  by = "SegmentID"
)

#== SEPTEMBER =====
segments <- rast("September_segments.tif")
Training <- vect("TRAINING_POLYGONS/september.shp")


# For each segment the tool extracts which polygon it came from  and the segment it belongs to
seg_points <- extract(segments, Training)

# Renaming for clarity
seg_points$September_segments <- seg_points$lyr.1

# Adding class labels every record
seg_points$ClassID <- Training$ClassID[seg_points$ID]

# Assigning one class to each segment
segment_classes <- seg_points %>%
  group_by(September_segments) %>%
  summarise(
    ClassID = as.numeric(names(which.max(table(ClassID))))
  )


# Extracting the Mean spectral values for each segment
seg_stats_september <- zonal(
  STACK,
  segments,
  fun = mean,
  na.rm = TRUE
)

#remaning the lyr.1 to SegmentsID
names(seg_stats_september)[1] <- "SegmentID"

names(segment_classes)[1] <- "SegmentID"

# Joining the spectral statistics with classlabels
train_df_september <- merge(
  seg_stats_september,
  segment_classes,
  by = "SegmentID"
)

# C COMBINING ALL THE MONTHS

train_df <- bind_rows(
  train_df_april,
  train_df_may,
  train_df_june,
  train_df_july,
  train_df_september
)

# D == MEDIAN=====

# Also preparing the median of all the images as that is what we will use as the prediction raster
# We need one raster to predict the habitat classes for ( we have 5 segmented images)

segments <- rast("Median_segments.tif")
Training <- vect("TRAINING_POLYGONS/trainingPolygons.shp")


# Extract segment IDs under training polygons
seg_points <- extract(segments, Training)

# Renaming for clarity
seg_points$Median_segments <- seg_points$lyr.1

# Adding class labels from polygons
seg_points$ClassID <- Training$ClassID[seg_points$ID]

# Assigning one class to each segment
segment_classes <- seg_points %>%
  group_by(Median_segments) %>%
  summarise(
    ClassID = as.numeric(names(which.max(table(ClassID))))
  )
# Resampling the median segments to match the stack
segments <- resample(
  segments,
  STACK[[1]],
  method = "near"
)

# Extracting the Mean spectral values for each segment
seg_stats_median <- zonal(
  STACK,
  segments,
  fun = mean,
  na.rm = TRUE
)

# renaming the lyr.1 to SegmentsID
names(seg_stats_median)[1] <- "SegmentID"

names(segment_classes)[1] <- "SegmentID"

# Joining the spectral statistics with class labels
train_df_median <- merge(
  seg_stats_median,
  segment_classes,
  by = "SegmentID"
)


# E. Splitting the training data set into train and test
set.seed(123)

trainIndex <- createDataPartition(
  train_df$ClassID,
  p = 0.7,
  list = FALSE
)


train_set <- train_df[trainIndex, ]
test_set  <- train_df[-trainIndex, ]



# F. Changing the train_df to a factor variable
train_set$ClassID <- factor(train_set$ClassID)

# G. Training the RF model

rf_model <- randomForest(
  ClassID ~ .,
  data = train_set[, !(names(train_set) %in% "SegmentID")],
  ntree = 1000,
  #mtry = 4, # commented this out to let the model auto adjust depending on the predictor variables. 
  importance = TRUE
)


# H. Creating a data frame to use for prediction
pred_df <- seg_stats_median

pred_df$ClassID <- predict(
  rf_model,
  newdata = pred_df[, !(names(pred_df) %in% "SegmentID")]
)

# I. Creating a look up for raster creation
lookup <- pred_df[, c("SegmentID","ClassID")]

lookup$ClassID <- as.numeric(as.character(lookup$ClassID))

lookup$ClassID[is.na(lookup$ClassID)] <- 0

#-------------------------------------------------------------------------------------------#
# 3. RASTER CREATION
#-------------------------------------------------------------------------------------------#

# A.  Creating the predicted raster by substituting the segment IDs with the class IDs in a new raster 

classified <- subst(
  segments,
  from = lookup$SegmentID,
  to = lookup$ClassID
)

# B.  Clipping the newly classified raster using the study area polygon

AOI <- vect('SAMPLE_BOUNDARY/sample_boundaryBNG.shp')
classified <- mask(classified, AOI)

# C. Changing the classified raster to a factor
classified <- as.factor(classified)

# D.  Plotting the classified raster
levels(classified) <- data.frame(
  value = c(0,1,2,3),
  class = c("No data","Water","Grassland","Forest")
)

plot(
  classified,
  type = "classes",
  col = c("grey","blue","gold","forestgreen")
)

# E. Exporting the raster
writeRaster(
  classified,
  "Habitat_RF_Classification.tif",
  overwrite = TRUE
)

#-------------------------------------------------------------------------------------------#
# 4. VALIDATION
#-------------------------------------------------------------------------------------------#

#A. Changing the test_set to a factor variable

test_set$ClassID <- factor(
  test_set$ClassID,
  levels = levels(train_set$ClassID)
)


#B. Model validation results
pred_val <- predict(
  rf_model,
  newdata = test_set[, !(names(test_set) %in% c("SegmentID","ClassID"))]
)

confusionMatrix(pred_val, test_set$ClassID)


# C. Error Matrix Heat Map

# creating a table with the predicted and actual values
cm <- table(
  Predicted = pred_val,
  Actual = test_set$ClassID
)
# Creating a data frame from the table
cm_df <- as.data.frame(cm)

# Plotting the Error Matrix Heat Map.
ggplot(cm_df, aes(x = Actual, y = Predicted, fill = Freq)) +
  geom_tile(color = "white", linewidth = 0.5) +
  geom_text(aes(label = Freq), size = 5, fontface = "bold") +
  scale_fill_gradient(low = "white", high = "steelblue") +
  labs(
    title = "Confusion Matrix",
    x = "Actual Class",
    y = "Predicted Class",
    fill = "Count"
  ) +
  theme_minimal(base_size = 14) +
  theme(
    panel.grid = element_blank(),
    plot.title = element_text(hjust = 0.5, face = "bold")
  )

toc()

