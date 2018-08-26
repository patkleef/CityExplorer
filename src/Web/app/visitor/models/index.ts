export interface IPrediction {
    TagId: string;
    Tag: string;
    Probability: number;
}

export interface IPredictionsResponse {
    Id: string;
    Project: string;
    Iteration: string;
    Created: Date;
    Predictions: IPrediction[];
}

export interface Image {
    Id: string;
    Created: Date;
    Width: number;
    Height: number;
    ImageUri: string;
    ThumbnailUri: string;
}

export interface ImageResponse {
    SourceUrl: string;
    Status: string;
    Image: Image;
}

export interface ITrainingImagesResponse {
    IsBatchSuccessful: boolean;
    Images: ImageResponse[];
}

export interface ITag {
    Id: string;
    Name: string;
    Description: string;
    ImageCount: number;
}

export interface ITagsResult {
    Tags: ITag[];
}


export interface IPrediction {
    TagId: string;
    Tag: string;
    Probability: number;
}

export interface IPredictionResult {
    Id: string;
    Project: string;
    Iteration: string;
    Created: Date;
    Predictions: IPrediction[];
}

export interface Iteration {
    Id: string;
    Name: string;
    IsDefault: boolean;
    Status: string;
    Created: Date;
    LastModified: Date;
    TrainedAt: Date;
    ProjectId: string;
    Exportable: boolean;
    DomainId: string;
}

export interface IQueryContext {
    originalQuery: string;
    askUserForLocation: boolean;
}

export interface ILicense {
    name: string;
    url: string;
}

export interface IContractualRule {
    _type: string;
    targetPropertyName: string;
    mustBeCloseToContent: boolean;
    license: ILicense;
    licenseNotice: string;
    text: string;
    url: string;
}

export interface IProvider {
    _type: string;
    url: string;
}

export interface IImage {
    name: string;
    thumbnailUrl: string;
    provider: IProvider[];
    hostPageUrl: string;
    width: number;
    height: number;
}

export interface IEntityPresentationInfo {
    entityScenario: string;
    entityTypeHints: string[];
    entityTypeDisplayHint?: any;
}

export interface IValue {
    contractualRules: IContractualRule[];
    image: Image;
    description: string;
    bingId: string;
    webSearchUrl: string;
    name: string;
    url?: any;
    entityPresentationInfo: IEntityPresentationInfo;
}

export interface IEntities {
    value: IValue[];
}

export interface IValue2 {
    id: string;
}

export interface Item {
    resultIndex: number;
    answerType: string;
    textualIndex: number;
    value: IValue2;
}

export interface ISidebar {
    items: Item[];
}

export interface IRankingResponse {
    mainline?: any;
    pole?: any;
    sidebar: ISidebar;
}

export interface IEntitySearchResult {
    _type: string;
    queryContext: IQueryContext;
    entities: IEntities;
    places?: any;
    rankingResponse: IRankingResponse;
}
