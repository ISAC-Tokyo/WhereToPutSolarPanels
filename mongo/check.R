values <- read.delim('./alldate_scale1.csv', sep = ',', header = TRUE)
summary(values)

head(scores)

scores = with(values, value.score)
hist(scores)
