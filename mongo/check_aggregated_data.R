# Code for aggregated score csv file
# 
# - Check summary of each columns (min, mean, median, max)
# - Draw histgram of score
# - Draw 3D map of score
#
###############################################
#Global Settings
###############################################
data.path       <- './japan_score_average_of_10_year.csv'
data.resolution <- 0.1
data.lat_start  <- 20
data.lat_end    <- 50
data.lon_start  <- 120
data.lon_end    <- 150
###############################################

data.lat_start = data.lat_start/data.resolution
data.lat_end   = data.lat_end/data.resolution
data.lon_start = data.lon_start/data.resolution
data.lon_end   = data.lon_end/data.resolution

values <- read.delim(data.path, sep = ',', header = TRUE)
summary(values)


scores.matrix <- function(lat_r, lon_r, values, resolution_inv) {
  result <- matrix(nrow = length(lat_r), ncol = length(lon_r))
  scores = with(values, value.score)
  lat = with(values, value.loc.lat)
  lon = with(values, value.loc.lon)
  lat_min = as.integer(lat[1] * resolution_inv)
  lon_min = as.integer(lon[1] * resolution_inv)
  for(i in 1:length(scores)) {
    row = (lon[i] * resolution_inv) + 1 - lon_min
    col = (lat[i] * resolution_inv) + 1 - lat_min
    result[row, col] <- scores[i]
  }
  return(result)
}

show_score_map <- function(values, resolution) {
  res_inv = 1/resolution
  lat_r <- data.lat_start:data.lat_end * resolution
  lon_r <- data.lon_start:data.lon_end * resolution
  m <- scores.matrix(lat_r, lon_r, values, res_inv)

  head(m)
  save_file = "./cloudless_level_map.png"
  png(filename = save_file, width = 800, height = 800)
  image(lat_r, lon_r, m, main="Cloudless level", col=heat.colors(100), xlab="Latitude", ylab="Longitude")
  dev.off()
  print(paste("Saved score map to ", save_file))
}

show_score_hist <- function(values) {
  scores = with(values, value.score)

  save_file = "./cloudless_level_hist.png"
  png(filename = save_file, width = 800, height = 800)
  hist = hist(scores)
  dev.off()
  print(paste("Saved score hist to ", save_file))
}

show_score_map(values, data.resolution)
show_score_hist(values)


warnings()
