import {ServerResponse} from "http";
import {errors, HttpStatusCode} from "../constants/constants";
import {baseHeaders} from "./router";

export const showNotFoundView = (res: ServerResponse, message = errors.notFound) => {
    res.writeHead(HttpStatusCode.NOT_FOUND, {
        "Content-Type": "text/html"
    });
    res.end(`<h1>Error: ${message}</h1>`)
};
export const responseHandlerHTML = (res: ServerResponse, statusCode: HttpStatusCode, message: string) => {
    res.writeHead(statusCode, {
        "Content-Type": "text/html"
    });
    res.end(`<h1>${message}</h1>`)
}
export const responseHandlerJSON = <T> (res: ServerResponse, statusCode: HttpStatusCode,  data:T): void => {
    res.writeHead(statusCode, baseHeaders);
    res.end(JSON.stringify(data))
}
