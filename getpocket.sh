curl -o _data/ethicsposts.json -X "POST" "https://getpocket.com/v3/get" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "consumer_key": "82790-7caebed10729397b7c6d5049",
  "count": "100",
  "state": "all",
  "access_token": "aaef4b6d-f671-5d0f-4e3c-24555d",
  "tag": "ethics"
}'

curl -o _data/blockchainposts.json -X "POST" "https://getpocket.com/v3/get" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "consumer_key": "82790-7caebed10729397b7c6d5049",
  "count": "100",
  "state": "all",
  "access_token": "aaef4b6d-f671-5d0f-4e3c-24555d",
  "tag": "blockchain"
}'

curl -o _data/languageposts.json -X "POST" "https://getpocket.com/v3/get" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "consumer_key": "82790-7caebed10729397b7c6d5049",
  "count": "100",
  "state": "all",
  "access_token": "aaef4b6d-f671-5d0f-4e3c-24555d",
  "tag": "language"
}'

curl -o _data/favposts.json -X "POST" "https://getpocket.com/v3/get" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "consumer_key": "82790-7caebed10729397b7c6d5049",
  "count": "100",
  "state": "all",
  "access_token": "aaef4b6d-f671-5d0f-4e3c-24555d",
  "tag": "fav"
}'