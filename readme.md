
# aes-msg-broker
    action is example of one of queue , may be memory,

# GET retrieve data - 
    ~/store/action/kind[/key][?db=1]  db demands to sync 
        with  cloud DB Otherwise data have been readed from cache
    ~/store/action/kind[?db=1] for one record
    ~/store/action/kind/key[?db=1] for one record
    ~/store/action/kind[?db=1] -  all the records on kind
    ~/store/action/all[?db=1 all the records in table

# POST - inserts data - 
    ~/store/action/kind/key , body={"btext":{"item": ...string} [,"store_to": date_string]}

# DELETE removes data - /store/action/kind[/key][?admin=admin] 
    ~/store/action/kind for one record
        admin=admin allows to delete many recors
# GET
    ~/env/get/[all]
    ~/env/set/dump
    ~/env/set/dump
        env.LOG_RESPONSE = (num & 4) ? 'YES' : 'NO';   
        env.LOG_RESPONSE_DATA = (num & 2) ? 'YES' : 'NO';   
        env.LOG_SQL = (num & 1) ? 'YES' : 'NO';
# Queues available now : 

	-store    - stored 1 month
	-users    - stored endless , admin rights
	-actions  - stored 1 year
	-temp     - stored 2 days
	-memory   - default have no DB

# heroku-postgresql
C:\WINDOWS\system32>heroku addons:create heroku-postgresql:hobby-dev -a=aed-data-cloud
Creating heroku-postgresql:hobby-dev on ? aed-data-cloud... free
Database has been created and is available
 ! This database is empty. If upgrading, you can transfer
 ! data from another database with pg:copy
Created postgresql-fitted-12352 as DATABASE_URL
Use heroku addons:docs heroku-postgresql to view documentation


