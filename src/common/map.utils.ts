
import {StoreDto} from '../crud-store/store-dto'
export class PairKeyBody {
    constructor(public key: string, public body: StoreDto) {

    }

}

export function AssignFromNet(that: any, what: any){
    if(that && what){
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

//TBD transfer body to string or ???
export const getBody = (map: Map<string, StoreDto>, key: string)
    : string | undefined => map?.get(key)?.toString();


export function getMapEntries(map: Map<string, StoreDto> | undefined)
    : Array<PairKeyBody> | undefined {
    let arr: Array<PairKeyBody> = [];
    if (map) {
        for (let [key, body] of map.entries()) {
            let item = new PairKeyBody(key, body );
            arr.push(item);

        }

    }
    return arr;
}