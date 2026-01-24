# Set CRAN mirror
options(repos = c(CRAN = "https://cran.r-project.org"))


# Install and load necessary packages
#install.packages("arules")
#install.packages("MASS")
#install.packages("reshape")
#install.packages("reshape2")
#install.packages("ggplot2")
#install.packages("dplyr")

library(arules)
library(MASS)
library(reshape)
library(reshape2)
library(ggplot2)
library(dplyr)

# Set working directory
setwd("C:\\Users\\Atharwa Malawade\\OneDrive - Garden City University\\Desktop\\College\\DA\\New sir Class\\Market Basket Analysis")

# Read transactions
transactions <- read.transactions("groceries.csv", format = "basket", sep = ",")

# Summary of transactions
summary(transactions)

# Inspect first 5 transactions
inspect(transactions[1:5])

# Item frequency for the first 20 items
itemFrequency(transactions[, 1:20])

# Plot item frequency with support threshold of 0.1
itemFrequencyPlot(transactions, support = 0.1)

# Calculate and sort item frequencies
item_freq <- itemFrequency(transactions, type = 'absolute')
item_freq <- sort(item_freq, decreasing = TRUE)

# Plot top 10 items by frequency
itemFrequencyPlot(transactions, topN = 10)

# Visualization of sparse matrix of first 100 transactions
image(sample(transactions, 100))

# Training a model on the data
# Default settings result in zero rules learned
rules <- apriori(transactions)

# Set better support and confidence levels to learn more rules
groceryrules <- apriori(transactions, parameter = list(support = 0.005, confidence = 0.25, minlen = 2))

# Summary of rules
summary(groceryrules)

# Inspect first 5 rules
inspect(groceryrules[1:5])

# Sort and inspect rules by confidence
inspect(sort(groceryrules, by = "confidence"))

# Finding subsets of rules containing specific items
berryrules <- subset(groceryrules, items %in% "berries")
yogurtrules <- subset(groceryrules, items %in% "yogurt")

# Inspect subsets
inspect(berryrules)
inspect(yogurtrules)

# Write rules to a CSV file
write(groceryrules, file = "groceryrules1.csv", sep = ",", quote = TRUE, row.names = FALSE)

