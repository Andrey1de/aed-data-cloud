//import { uuid } from 'uuidv4';
//export const ITEM_STORE_TABLE_NAME =  Enviro.DB_SCHEMA + '.' + 'item_store'

export class StoreDto {// implements IDto{
    guid: string | undefined = undefined;//new Guid(md5((key + '|' + kind.ToLower()))
 //   kind: string | undefined = undefined;// text COLLATE pg_catalog."memory" NOT NULL,
    key: string = undefined;//text COLLATE pg_catalog."memory" NOT NULL,
    item: any | undefined;///=>item (from item)
    base64 : string | undefined;
    status: number | undefined = 0;
    stored : Date | undefined = new Date();//timestamp(3) with time zone NOT NULL,
    life_seconds: number ;
      
    constructor(that: any = undefined ) {
        if(!!that) {
            this.fromAny(that);
        }
    }  
    
    IsValid(that: any):boolean {
        let ft = (!!that 
            && that.guid 
            && that.kind 
            && that.key 
            && (that.item || that.base64 ));
        return ft;
    } 
    fromAny(that: any) {
        if (that) {
            this.guid = that.guid;
            this.item = that.item;
            this.base64 = that.base64;
             this.key = that.key;
            this.stored = this.normDate(that.stored,new Date());//| undefined;//timestamp(3) with time zone NOT NULL,
            this.status = +that.status || 0;
            this.life_seconds = +(that.life_seconds || 0);
                   
		}
    }
    normDate(that : any, deflt : Date | undefined = undefined) : Date{
		if(!that) return deflt;
		if(that instanceof Date && !isNaN(that.getDate())) return that;
		var dt =  new Date(that);
		if(dt instanceof Date && !isNaN(dt.getDate())) return dt;
		return deflt;

	}

    normJSonB( ) : any{
    //    if(this.item){
    //         this.item.id = this.id;
    //         this.item.status = this.status;
    //     }
        return this.item;

	}
 
   
    toString(toIdent : boolean = false) {
        let json = '';
        if(this.item){
            json =  (!toIdent) ? JSON.stringify(this.item || {})
            : '\n' + JSON.stringify(this.item || {}, null, 2);
        } else if(this.base64) {
            json = this.base64;
        }
        return `StoreDto:[${this.key}] => ${json};`
	}
 
};

function AssignFromNet(that: any, what: any) {
    if (that && what) {
        for (const prop in (that as any)) {
            if (that.hasOwnProperty(prop) &&
                what.hasOwnProperty(prop))
                that[prop] = what[prop];

        }
        for (const prop in (what as any)) {
            const prop1 = prop.toLowerCase();
            if (that.hasOwnProperty(prop1) &&
                what.hasOwnProperty(prop1))
                that[prop1] = what[prop1];

        }

    }

}

