
library(AzureRMR)
library(AzureStor)
library(dplyr)

setwd("~/code/ross/azure/ipoet-r-tools")

account_name_env <- "r21ipoet"
account_key <- "xkQAqkWSD5qzGdgPLCpuTvG6r0xpRs0vIGz+RZG3PE1wcTMrv16WORDSv1FWJwFRhDOyOT5bJ+ciAHbDYCJ08A=="

account_name <- paste0("https://", account_name_env, ".blob.core.windows.net")
# account_key <- paste0()
Sys.setenv(STORAGE_CONN_STRING="DefaultEndpointsProtocol=https;AccountName=r21ipoet;AccountKey=xkQAqkWSD5qzGdgPLCpuTvG6r0xpRs0vIGz+RZG3PE1wcTMrv16WORDSv1FWJwFRhDOyOT5bJ+ciAHbDYCJ08A==;EndpointSuffix=core.windows.net")
account_conn_string <- Sys.getenv("STORAGE_CONN_STRING")
#
print(c("account conn string = ", account_conn_string))
print(c("storage account name = ", account_name, "storage key = ", account_key))
#
# this url points to a storage account I have setup in my resource group (goto portal.azure.com)
# the key from the portal and points to the ipoetproxysa storage account
#
bl_endp_key <- storage_endpoint(account_name, key=account_key)
#
store <- list_storage_containers(bl_endp_key)
#
#
queueName <- "front-door-ipoet"
outQueueName <- "ipoet-1-queue"
userid <- 1
searchstring <- "http://www.google.com/search?q=US%20Sailing"
ss <- paste(queueName, userid, searchstring, sep=" ")
print(ss)
system2("./add-string-queue.js", args=ss)
#
# to get the files that are queued
num <- 0
repeat {
  num <- system2("./number-of-items-in-queue.js", args=outQueueName, stdout=TRUE)
  print(c("num=",num))
  if (num > 0) {
    break
  }
  
}

#
# to gather all the queued items - this just a single file
dd <- system2("./drain-queue.js", args=outQueueName, stdout=TRUE)
print(dd)
# at this point dd is an array of {url, data, flag, userid} objects
for (i in 1:length(dd)){
  result = dd[i] %>% fromJSON()
  print(c("url->", result$url, "blob File->", result$data))
}
#
# search-1-container is pre-setup and contains the downloaded files
cont <- storage_container(bl_endp_key, "search-1-container")
rr <- list_storage_files(cont)

setwd("~/code/ross/azure/ipoet-r-tools/misc-files")

# Get all the blobs

# the params are: container, blob reference, dest dir
for(j in 1:length(rr$Name)) {
  fName <- paste0("test", j, ".json")
  print(c(fName, rr$Name[j]))
  storage_download(cont, rr$Name[j], fName)
}

#
# now let's see how to use advanced front-door
setwd("~/code/ross/azure/ipoet-r-tools")
queueName <- "adv-front-door-ipoet"
outQueueName <- "adv-finish-1-queue"
userid <- 1
outBlobContainer <- paste("advsearch-", userid, "-container")

searchstring <- "http://www.google.com/search?q=US%20Sailing"
ss <- paste(queueName, userid, searchstring, sep=" ")
print(ss)
system2("./add-string-queue.js", args=ss)
#
# to get the files that are queued
num <- 0
repeat {
  num <- system2("./number-of-items-in-queue.js", args=outQueueName, stdout=TRUE)
  print(c("num=",num))
  if (num > 0) {
    break
  }
  
}
# advsearch-1-container is pre-setup and contains the downloaded files
cont <- storage_container(bl_endp_key, "advsearch-1-container")
rr <- list_storage_files(cont)
rr

setwd("~/code/ross/azure/ipoet-r-tools/misc-files")

# Get all the blobs

# the params are: container, blob reference, dest dir
for(j in 1:length(rr$Name)) {
  fName <- paste0("raw_", j, ".json")
  print(c(fName, rr$Name[j]))
  storage_download(cont, rr$Name[j], fName)
}
