import axios from 'axios';
import { config } from './../config';
import { IEntitySearchResult } from './models';

export default class EntitySearchService {

    search = (keyword: string, callback: (result: IEntitySearchResult) => void) => {
        axios({
            method: 'GET',
            url: `${config.entitySearchApiUrl}?q=${keyword}&mkt=en-us`,
            headers: {
                'Ocp-Apim-Subscription-Key': config.entitySearchKey,
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            callback(result.data);
        });
    }
}