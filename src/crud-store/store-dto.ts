//import { uuid } from 'uuidv4';
//export const ITEM_STORE_TABLE_NAME =  Enviro.DB_SCHEMA + '.' + 'item_store'



export class StoreDto {// implements IDto{
    id: number = 0;// integer NOT NULL DEFAULT nextval('item_store_id_seq'::regclass),
    kind: string = '';// text COLLATE pg_catalog."memory" NOT NULL,
    key: string = '';//text COLLATE pg_catalog."memory" NOT NULL,
    jsonb: any;///json (from jsonb)
    status: number = 0;
    stored : Date | undefined = new Date();//timestamp(3) with time zone NOT NULL,
    store_to: Date | undefined;
     
    constructor(that: any = undefined ) {
        this.fromAny(that);

    }   
    normDate(that : any | undefined) : Date{
		if(that instanceof Date) that;
		return new Date(that);

	}
    normJSonB( ) : any{
       if(this.jsonb){
            this.jsonb.id = this.id;
            this.jsonb.status = this.status;
        }
        return this.jsonb;

	}
    // normBody(jsonb : any | string | undefined)  : any{
	//     if(typeof jsonb === 'object') {
    //         this.jsonb = jsonb;
    //     } else if(typeof jsonb === 'string') {
    //         this.jsonb =  JSON.parse(jsonb);
    //     } else {
    //         this.jsonb = {};

    //     }
   
	// }


    fromAny(that: any) {
        if (that) {
            if(that.id)this.id = that.id;
            this.kind = that.kind;
            this.key = that.key;
            if (that.stored) 
                this.stored = this.normDate(that.stored);//| undefined;//timestamp(3) with time zone NOT NULL,
            if (that.store_to) 
                this.store_to = this.normDate(that.store_to);
            if (that.status) 
                this.status = that.status;
            if (that.jsonb) 
                this.jsonb = that.jsonb;
              
		}
    }
    compare(that: StoreDto): boolean {
        let ret: boolean = 
               this.kind == that.kind
            && this.key == that.key
            && this.stored == that.stored
            && this.store_to == that.store_to
            && this.jsonb == that.jsonb;
        return ret;

    }


    //get HashCode(): string {
    //    let hash = uuid(this.kind + '||' + this.key, '', 5);
    //    return hash;
    //};

   
    toString(toTabJson : boolean = false) {
        const json = (!toTabJson) ? JSON.stringify(this.jsonb || {})
            : '\n' + JSON.stringify(this.jsonb || {}, null, 2);
        return `StoreDto:[${this.kind}/${this.key}] => ${json};`
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

