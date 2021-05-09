import { StatusCodes } from 'http-status-codes';
export const  OK = StatusCodes.OK;
export const  BAD_REQUEST = StatusCodes.BAD_REQUEST;
export const  CREATED = StatusCodes.CREATED;
export const  CONFLICT = StatusCodes.CONFLICT;///409
export const  NOT_FOUND = StatusCodes.NOT_FOUND;
export const  NOT_IMPLEMENTED = StatusCodes.NOT_IMPLEMENTED; //501
export const NOT_MODIFIED = StatusCodes.NOT_MODIFIED;//NOT_MODIFIED
export const  NO_CONTENT = StatusCodes.NO_CONTENT;
export const  IM_A_TEAPOT = StatusCodes.IM_A_TEAPOT;
export const PRECONDITION_FAILED = 412;//StatusCodes.PRECONDITION_FAILED;
export const FORBIDDEN = StatusCodes.FORBIDDEN;//403//StatusCodes.PRECONDITION_FAILED;


export function StrStatus(status: number) {
	switch (status) {
		case OK:			return 'OK';
		case CREATED:		return 'CREATED';
		case BAD_REQUEST:	return 'BAD_REQUEST';
		case CREATED:		return 'CREATED';
		case CONFLICT:		return 'CONFLICT';
		case NOT_FOUND:		return 'NOT_FOUND';
		case NOT_IMPLEMENTED:
							return 'NOT_IMPLEMENTED';
		case NOT_MODIFIED:	return 'NOT_MODIFIED';
		case NO_CONTENT:	return 'NO_CONTENT';
		case IM_A_TEAPOT:	return 'IM_A_TEAPOT';
		case PRECONDITION_FAILED:
							return 'PRECONDITION_FAILED';
		default:			return 'UNKNOWN';
	}
}

