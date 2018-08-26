export interface IWizardStep {
    answers: IAnswer[];
    question: string;
    event: string;
    isLoading: boolean;
    isLastQuestion: boolean;
}

export interface IWizardResult {
    title: string;
    text: string;
    items: IWizardResultItem[];
}

export interface IWizardResultItem {
    title: string;
    introduction: string;
    image: string;
}

export interface IAddress {
    city: string;
    address: string;
    zipcode: string;
    latitude: string;
    longitude: string;
}

export interface IStartWizardResponse {
    id: string;
    statusQueryGetUri: string;
    sendEventPostUri: string;
    terminatePostUri: string;
}

export interface IAnswer {
    id: string;
    text: string;
    value: string;
}

export interface ICustomStatus {
    id: string;
    question: string;
    answers: IAnswer[];
}

export interface IWizardAnsweredResponse {
    instanceId: string;
    runtimeStatus: string;
    input?: any;
    customStatus: ICustomStatus;
    output?: any;
    createdTime: Date;
    lastUpdatedTime: Date;
}
