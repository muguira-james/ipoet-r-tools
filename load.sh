#!/bin/bash

#exports
# export STORAGE_CONN_STRING="fill_this_in_with_double_quotes"
# export STORAGE_ACCT_NAME="fill_this_in"
# export STORAGE_ACCT_KEY="fill_this_in"

# storage is in 1,10,11,12,50,5

# these should match in length 
declare -a storage_list=(1 10 11 12 50 5)
declare -a country_list=("Canada " "Japan " "Denmark " "Sweden " "Germany " "France ")

## get length of $distro array
len=${#storage_list[@]}

## Use bash for loop 
for ((i=0;i<len;i++)); 
do 
./add-to-queue.js ipoet-search-queue  "${storage_list[$i]}" "${country_list[$i]} $@" & 
done
