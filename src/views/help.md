# aes-msg-broker
    action is example of one of queue , may be memory,
# New Response full form :
    res.send({status: S.CREATED, key: key,rows:[row1,row2 ...] , msg: 'CREATED'}).status(S.CREATED).end();
    For Delete, Insert(POST) sna Upsert(PUT) may be cancelled by 
    setting environment variable RESP_UPSERT_BODY=NO
# BODY : is content of jsonb !!!!{ } , may contain store_to if absent internalclculate
body={
    ["id":id], - retrieves id of DB
    ["key":"zzz"] .... , key - lowercase duplicates the key in url 
    ["store_to":"2100-01-01"] - demands to store till Date , if stote_to undefined - store endless
    } these fields
 may be contained in the body
 # GET ~/cloud/queue/kind/key - one Record Short format
[ 
    {
        "key": "ddd",
        "item": {
            "ask": 3.1,
            "bid": 3.4,
            "code": "ddd",
            "name": "New Israeli shekel",
            "rate": 3.3
        }
    },
    {
        "key": "zzz",
        "item": {
            "ask": 3.1,
            "bid": 3.4,
            "code": "ZZZ",
            "name": "New Israeli shekel",
            "rate": 3.3
        }
    },
# GET ~/cloud/queue/kind/key?db=1 - one Record from DB full format
   {
        "guid": "a48c0353-f1c1-4ca8-0acf-a661507890f4",
        "key": "ddd",
        "status": 0,
        "stored": "2021-06-05T17:03:45.499Z",
        "item": {
            "ask": 3.1,
            "bid": 3.4,
            "code": "ddd",
            "name": "New Israeli shekel",
            "rate": 3.3
        },
        "base64": null,
        "life_seconds": 0
    },
    ..............................
    {
        "guid": null,
        "key": "zzz",
        "status": 0,
        "stored": "2021-06-06T16:37:18.972Z",
        "item": {
            "ask": 3.1,
            "bid": 3.4,
            "code": "zzz",
            "name": "New Israeli shekel",
            "rate": 3.3
        },
        "base64": null,
        "life_seconds": 0
    }]

# GET ~/cloud/queue/kind[?db=1] - List of records in Kind
# POST ~/cloud/queue/kind/key inserts data - 
# PUT ~/cloud/queue/kind/key updates/inserts data  
##    necessary fields : 
    body=    {
        "status": 0,
        "stored": "2021-06-06T16:37:18.879Z",
        "item": {
            "ask": 3.1,
            "bid": 3.4,
            "name": "New Israeli shekel",
            "rate": 3.3,
            "code": "ILS"
        },
        "life_seconds": 0
    }
## returns {kind,key,status(0 - new , > 1 updated),guid)
					.status(S.CREATED / S.OK).end();
 
# DELETE ~~/cloud/queue/kind/[key][?admin=admin] removes data - 
## returns {kind,key,status(-1 ),guid)
   
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


