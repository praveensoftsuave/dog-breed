export type ISuccessResponse<T = {message:any,status:number}> = {
    data: {message:T,status:number},
    status: string,
    message: T,
    statusCode?:number
}
export type IErrorResponse<T = any> = {
    error: T,
    data?: unknown,
    status: string,
    message: T, 
    statusCode?:number
}
export type breedPayload={
count:number,
breed:string,
subBreed?:string
}