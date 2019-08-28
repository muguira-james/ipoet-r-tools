
library(AzureRMR)
library(AzureStor)

# account_name_env <- Sys.getenv("STORAGE_ACCT_NAME")
# account_key <- Sys.getenv("STORAGE_ACCOUNT_KEY")

# account_name <- paste0("https://", account_name_env, ".blob.core.windows.net")
# account_key <- paste0()
Sys.setenv(STORAGE_CONN_STRING="DefaultEndpointsProtocol=https;AccountName=ipoetstorage;AccountKey=f2sjPkjWk4ZAtGflOL7MxomOu8X5kh0Nu3T3xXaaJhB9A9Ji99AuEof0tn5tOiQ5brL0XmsHAuZQUwcCXk/eUA==;EndpointSuffix=core.windows.net")
account_conn_string <- Sys.getenv("STORAGE_CONN_STRING")
print(c("account conn string = ", account_conn_string))
# print(c("storage account name = ", account_name, "storage key = ", account_key))
#
# this url points to a storage account I have setup in my resource group (goto portal.azure.com)
# the key from the portal and points to the ipoetproxysa storage account
#
# bl_endp_key <- storage_endpoint(account_name, key=account_key)
# bl_endp_key <- storage_endpoint("")
# store <- list_storage_containers(bl_endp_key)
system2("./add-to-queue.js", args="searchstring 42 'Iran energy .pdf' 30")
#
# to get the files that are queued
num <- 0
repeat {
  num <- system2("./number-of-items-in-queue.js", args="ipoet-42-search-queue", stdout=TRUE)
  print(c("num=",num))
  if (num > 0) {
    break
  }
  
}

#
# to gather all the queued items and figure out which are good or not
dd <- system2("./drain-queue.js", args="ipoet-42-queue", stdout=TRUE)
print(dd)
#
# outblobq is a blob contain I have setup in jam-que-rg
# cont <- storage_container(bl_endp_key, "search-41-container")
# rr <- list_storage_files(cont)

# setwd("~/code/ross/azure")
#
# Get all the blobs
#
# the params are: container, blob reference, dest dir
# for(j in 1:length(rr$Name)) {
#   fName <- paste0("test", j, ".json")
#   print(c(fName, rr$Name[j]))
#   storage_download(cont, rr$Name[j], fName) 
# }


# 
#
# experimental code - not needed to get blob contents
#
# tenant_id <- "48bf86e8-11a2-4b8a-8cb3-68d8be2227f3"
# app_id <- "fb5f14f1-2417-476e-bfee-493efc5bf261"
# 
# password <- "97a4776f-921d-45a1-b9b6-91d431d98d1c"
# subscription_id <- "d5351d73-3388-4c1f-aea1-cb78a3466165"
# 
# az <- az_rm$new(tenant=tenant_id,
#                 app=app_id,
#                 password=password)
# 

