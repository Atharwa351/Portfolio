# Set CRAN mirror
options(repos = c(CRAN = "https://cran.r-project.org"))


#install.packages,
install.packages('conjoint')
install.packages('MASS')
install.packages('reshape')
install.packages('dplyr')
install.packages('reshape2')
install.packages('ggplot2')

#Load the Libraries,
library(conjoint)
library(MASS)
library(reshape)
library(reshape2)
library(dplyr)
library(ggplot2)

getwd()
setwd('C:/Users/Atharwa Malawade/OneDrive - Garden City University/Desktop/College/DA/New sir Class/Conjoint Analysis')

preferences = read.csv("preferences.csv")
profiles = read.csv("profiles.csv")

#Calculating the importance of attributes

importance = caImportance(preferences,profiles)
importance
profiles

#Part Worth Calculation

levelnames <- read.csv("levelnames.csv")

partutil <- caPartUtilities(preferences,profiles,levelnames)
summary(partutil)

#Max Utility Calculation
maxutil<- caMaxUtility(profiles,preferences,profiles)

#BTL Calculation
btl<- caBTL(profiles, preferences, profiles)

maxutil
btl

