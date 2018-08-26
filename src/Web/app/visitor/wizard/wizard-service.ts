import axios, { AxiosResponse } from 'axios';
import { IAnswer, IStartWizardResponse } from './models';
import { config } from '../../config';

export default class WizardService {
    /*
        start wizard
            - start polling for custom status (answers) --> this should stop when answers are given back
            - start polling for output

        give answer request
            - start polling to see if instance is already running --> this should stop when instance is running
            - start polling if custom status answer --> this should stop when answers are given back
    */

    startWizard(
        latitude: any,
        longitude: any,
        handleSettingsResponse: any,
        handleResponse: any,
        handleResultResponse: any) {

        axios({
            method: 'POST',
            url: `${config.functionsBaseUrl}StartWizard`,
            data: {
                latitude,
                longitude,
            },
        })
        .then((response: AxiosResponse<IStartWizardResponse>) => {
            handleSettingsResponse(response.data);

            this.startPolling(
                response.data.statusQueryGetUri.replace('{instanceId}',
                response.data.id), handleResponse, handleResultResponse);
        })
        .catch((error) => {
            handleResponse(null, error.message);
        });
    }

    setAnswer(
        wizardStepUrls: IStartWizardResponse,
        answer: IAnswer,
        isLastQuestion: boolean,
        event: string,
        handleSettingsResponse: any, handleResponse: any) {
        const url = wizardStepUrls.sendEventPostUri
                    .replace('{instanceId}', wizardStepUrls.id)
                    .replace('{eventName}', event);
        axios({
            method: 'POST',
            url: url,
            data: answer,
        })
        .then((response) => {
            wizardStepUrls.id = answer.id;
            handleSettingsResponse(wizardStepUrls);

            const statusUrls =
                wizardStepUrls.statusQueryGetUri
                .replace('{instanceId}', wizardStepUrls.id);
            if(!isLastQuestion) {
                this.startPolling(statusUrls, handleResponse, null);
            }
        });
    }

    startPolling(url: string, callback: any, handleResultResponse: any) {
        axios({
            method: 'GET',
            url: url,
        })
        .then((response) => {
            let callbackCalled = false;
            if(handleResultResponse !== null && response.data.output !== undefined && response.data.output !== null) {
                handleResultResponse(response.data.output);
                return;
            }

            if(callback !== null && response.data.customStatus !== undefined && response.data.customStatus !== null) {
                callback(response.data.customStatus);
                callbackCalled = true;
            }

            if((handleResultResponse !== null &&
                (response.data.output === undefined || response.data.output === null)) ||
                (!callbackCalled &&
                    (response.data.customStatus === undefined || response.data.customStatus === null))) {
                setTimeout(() => {
                    this.startPolling(url, (callbackCalled ? null : callback), handleResultResponse);
                }, 5000);
            }
        })
        .catch((error) => {
            if(error.response) {
                if(error.response.status === 404) {
                    setTimeout(() => {
                        this.startPolling(url, callback, handleResultResponse);
                    }, 5000);
                }
            }
        });
    }
}