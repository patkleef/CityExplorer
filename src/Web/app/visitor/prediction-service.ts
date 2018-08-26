import axios, { AxiosResponse } from 'axios';
import { IPredictionResult } from './models/index';
import { config } from './../config';

export default class PredictionService {

    predict(blob: Blob, callback: (result: IPredictionResult) => void) {
        this.getIteration((data) => {
            const iteration = data.Id;

            return axios({
                method: 'POST',
                url: `${config.predictionApiUrl}/${config.projectId}/image?iterationId=${iteration}`,
                headers: {
                    'Prediction-key': config.predictionKey,
                    'Content-Type': 'multipart/form-data',
                },
                data: blob,
            }).then((data2: AxiosResponse<IPredictionResult>) => {
                callback(data2.data);
            });
        });
    }

    getIteration = (callback) => {
        axios({
            method: 'GET',
            url: `${config.customVisionApiUrl}${config.projectId}/iterations`,
            headers: {
                'Training-key': config.trainingKey,
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            callback(result.data.filter(i => i.Status === 'Completed').slice(-1).pop());
        });
    }
}