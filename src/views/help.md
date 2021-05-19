# aes-msg-broker
    action is example of one of queue , may be memory,
# New Response full form :
    res.send({status: S.CREATED, rows:[_rows] , msg: 'CREATED'}).status(S.CREATED).end();
    For Delete, Insert(POST) sna Upsert(PUT) may be cancelled by 
    setting environment variable RESP_UPSERT_BODY=NO
# BODY : is content of jsonb !!!!{ } , may contain store_to if absent internalclculate
body={
    ["id":id], - retrieves id of DB
    ["key":"ZZZ"] .... , key - duplicates the key in url 
    ["store_to":"2100-01-01"] - demands to store till Date , if stote_to undefined - store endless
    } these fields
 may be contained in the body
# GET retrieve data - 
    ~/store/action/kind[?db=1] for List of records in Kind
    ~/store/action/kind/key[?db=1] for one record
 # POST - inserts data - 
    ~/store/action/kind/key , body={["id":id],["key"] .... , ["store_to":"2100-01-01"]} }
# PUT - upsert - update/inserts data - 
    ~/store/action/kind/key , body={["id":id],["key"] .... , ["store_to":"2100-01-01"]} }

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


