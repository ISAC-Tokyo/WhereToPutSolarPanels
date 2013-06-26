# Code for aggregated score csv file
# 
# - Check summary of each columns (min, mean, median, max)
# - Draw histgram of score
# - Draw 3D map of score
#
###############################################
#Global Settings
###############################################
data.path       <- './alldate_scale2.csv'
data.resolution <- 0.01
data.resolution_inv <- as.integer(1/data.resolution)
data.lat_start  <- 20
data.lat_end    <- 50
data.lon_start  <- 120
data.lon_end    <- 150
save.file_name  <- "cloudless_level"
###############################################

values <- read.delim(data.path, sep = ',', header = TRUE)
summary(values)

scores.matrix <- function(row_size, col_size, values) {
  result <- matrix(nrow = row_size, ncol = col_size)
  scores = with(values, value.score)
  lat = with(values, value.loc.lat)
  lon = with(values, value.loc.lon)
  lat_min = round(data.lat_start * data.resolution_inv)
  lon_min = round(data.lon_start * data.resolution_inv)
  for(i in 1:length(scores)) {
    row = round((lat[i] * data.resolution_inv)) + 1 - lat_min
    col = round((lon[i] * data.resolution_inv)) + 1 - lon_min
    result[col, row] <- scores[i]
  }
  return(result)
}

show_score_map <- function(values) {
  rows = (data.lat_start * data.resolution_inv):(data.lat_end * data.resolution_inv)
  cols = (data.lon_start * data.resolution_inv):(data.lon_end * data.resolution_inv)
  m <- scores.matrix(length(rows), length(cols), values)

  print("row_size")
  print(nrow(m))
  print("col_size")
  print(ncol(m))

  head(m)
  save_file = paste("./", save.file_name, "_map.png", sep="")
  png(filename = save_file, width = 3200, height = 3200)
  image(cols/data.resolution_inv, rows/data.resolution_inv, m, main="Cloudless level", col=heat.colors(100), xlab="Latitude", ylab="Longitude")
  dev.off()
  print(paste("Saved score map to ", save_file))
}

show_score_hist <- function(values) {
  scores = with(values, value.score)

  save_file = paste("./", save.file_name, "_hist.png", sep="")
  png(filename = save_file, width = 800, height = 800)
  hist = hist(scores)
  dev.off()
  print(paste("Saved score hist to ", save_file))
}

show_score_map(values)
show_score_hist(values)


warnings()
