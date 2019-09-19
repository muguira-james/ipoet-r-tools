


library(AzureRMR)
library(AzureStor)
library(dplyr)
library(jsonlite)
account_name_env <- "ipoetobscuresa"
account_key <- "9e+P/C1fKIkDNgKSixN3MyHMaBhqTCTictyw7e0qOPk0SlVxVhbQxZRx76ekKPzbpnIJ2JSXb2co2Y2YKK2Wiw=="

account_name <- paste0("https://", account_name_env, ".blob.core.windows.net")

print(c("storage account name = ", account_name, "storage key = ", account_key))
#
# this url points to a storage account I have setup in my resource group (goto portal.azure.com)
# the key from the portal and points to the ipoetproxysa storage account
#
bl_endp_key <- storage_endpoint(account_name, key=account_key)
store <- list_storage_containers(bl_endp_key)

userid = 41
user.search.string = "'japan power energy alternate .pdf'"
userid.string = paste0(userid)
queue.name = paste0("ipoet-",userid,"-queue")
container.name = paste0("search-",userid,"-container")

# create storage if it isn't thre queue
#try(system2("./clear-all-user-storage.js", args=userid.string),silent=TRUE)
#Sys.sleep(20)
#try(system2("./create-user-storage.js", args=userid.string),silent=TRUE)

system2("./add-to-queue.js", args=paste("searchstring", userid, user.search.string))

Sys.sleep(1)
# to get the files that are queued
initial.items.in.queue = system2("./number-of-items-in-queue.js", args=queue.name, stdout=TRUE) %>% as.numeric()
print(initial.items.in.queue)
total.sleep = 0
while(initial.items.in.queue == 0)
{
	Sys.sleep(10)
	# to get the files that are queued
	initial.items.in.queue = system2("./number-of-items-in-queue.js", args=queue.name, stdout=TRUE) %>% as.character() %>% as.numeric()
	total.sleep = total.sleep +10
	print(total.sleep)
}
print(paste("Things are starting to come into the user's queue: ", initial.items.in.queue))
Sys.sleep(15)

# to gather all the queued items and figure out which are good or not
dd <- system2("./drain-queue.js", args=queue.name, stdout=TRUE)
cont <- storage_container(bl_endp_key, container.name)
rr <- list_storage_files(cont)
filenames = c()
blobnames = c()
for(i in 1:length(dd))
{
	normed = dd[i] %>% fromJSON()
	normed$url = normed$url %>% as.character()
	normed$data = normed$data %>% as.character()
	if (grepl("pdf", normed$url, ignore.case=TRUE))
	{
		print("Found a pdf")
		fName <- paste0("./test", i, ".pdf")
		filenames = c(filenames, fName)
		blobnames = c(normed$data)
		
	}
	else
	{
		print("Found a html")
		fName <- paste0("./test", i, ".html")
		filenames = c(filenames, fName)
		blobnames = c(normed$data)
	}

}

#figure out what is smaller between rr and filenames and go through that
for(i in 1:length(filenames)) {
  print(c(filenames[i], blobnames[i]))
  storage_download(cont, blobnames[i], filenames[i]) 
}
