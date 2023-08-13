import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios"

export const serverBaseURL: string =  "http://localhost:3000";

export default class AxiosManager {

    private axios: AxiosInstance;
    private contentType: string = "application/json";
    private token = 'your token';
    private headers?: AxiosRequestHeaders;

    constructor(private baseURL: string = serverBaseURL) {
        this.axios = axios.create({
            baseURL: this.baseURL
        })
    }

    public getToken() {
        return this.token;
    }

    public setToken(token: string) {
        this.token = token;
    }

    public setHeaders(headers: AxiosRequestHeaders) {
        this.headers = headers;
    }

    
    public setContentType(contentType: string) {
        this.contentType = contentType;
    }

    public async getData(path: string) {
        if (!this.getToken() ) {
            throw new Error("no token");
        }
        const config: AxiosRequestConfig = {
            headers: this.headers || { "Content-Type": this.contentType, "Authorization": this.getToken() }
        };
        if (this.baseURL) {
            config.baseURL = this.baseURL
        }
        return this.axios.get(path, config);
    }

    public async setData(path: string, data: any) {
        if (!this.getToken() && this.baseURL === serverBaseURL) {
            throw new Error("no token");
        }
        const config: AxiosRequestConfig = {
            headers: this.headers || { "Content-Type": this.contentType, "Authorization": this.getToken() }
        };
        if (this.baseURL) {
            config.baseURL = this.baseURL
        }
        return this.axios.post(path, data, config);
    }

    public async removeData(path: string, data?: any) {
        if (!this.getToken() && this.baseURL === serverBaseURL) {
            throw new Error("no token");
        }
        const config: AxiosRequestConfig = {
            headers: this.headers || { "Content-Type": this.contentType, "Authorization": this.getToken() },
            data
        };
        if (this.baseURL) {
            config.baseURL = this.baseURL
        }
        return this.axios.delete(path, config);
    }

    public async updateData(path: string, data: any) {
        if (!this.getToken() && this.baseURL === serverBaseURL) {
            throw new Error("no token");
        }
        const config: AxiosRequestConfig = {
            headers: this.headers || { "Content-Type": this.contentType, "Authorization": this.getToken() }
        };
        if (this.baseURL) {
            config.baseURL = this.baseURL
        }
        return this.axios.put(path, data, config);
    }

}