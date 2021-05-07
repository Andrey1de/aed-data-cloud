import { StoreRequestHandler } from "./store-request-handler";
import { Subject } from "rxjs";
//import { exitOnError } from "winston";

class TaskMachineClass {
	public readonly Broker: Subject<StoreRequestHandler>

	constructor() {
		this.Broker = new Subject<StoreRequestHandler>();
		this.Broker.subscribe(this.Run$);
	}

	EnqueueTask(p: StoreRequestHandler) {
		this.Broker.next(p);
	}
	async Run$(p: StoreRequestHandler) {
		await p.Run$();
		p.Dump();
    }

}


export const TaskMachine: TaskMachineClass = new TaskMachineClass();


