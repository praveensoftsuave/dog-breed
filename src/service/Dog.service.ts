import { AxiosError, AxiosInstance } from "axios";
import { default as axios } from 'axios';
import { breedPayload, IErrorResponse, ISuccessResponse } from "../interface/apiResponse.interface";
import { apiEndPoint } from "../contsants";
import { baseUrl } from "../contsants";
export class DogService {

    httpClient: AxiosInstance = axios.create({ baseURL: baseUrl });

    public async getDogList(): Promise<ISuccessResponse | IErrorResponse> {
        try {
            const { data } = await this.httpClient.get(apiEndPoint.listAll)
            return data;
        }
        catch (error) {
            return parseAxiosError(error as AxiosError)
        }
    }

    public async getDogImage(payload: breedPayload): Promise<ISuccessResponse | IErrorResponse> {
        try {
            const { data } = await this.httpClient.get(apiEndPoint.random + `${payload.breed + (payload.subBreed ? '/' + payload.subBreed + '/' : '/')}images`)
            return data;
        }
        catch (error) {
            return parseAxiosError(error as AxiosError)
        }
    }

}

const parseAxiosError = (error: AxiosError): IErrorResponse => {
    if (error.isAxiosError && error.response) {
        return { status: 'error', message: error.message, error, data: {} };
    }

    return { status: 'error', message: error.message, error, data: {} };
};
