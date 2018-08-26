export interface IInstrumentation {
    _type: string;
}

export interface IThumbnail {
    width: number;
    height: number;
}

export interface IInsightsMetadata {
    pagesIncludingCount: number;
    availableSizesCount: number;
}

export interface IValue {
    webSearchUrl: string;
    name: string;
    thumbnailUrl: string;
    datePublished: Date;
    contentUrl: string;
    hostPageUrl: string;
    contentSize: string;
    encodingFormat: string;
    hostPageDisplayUrl: string;
    width: number;
    height: number;
    thumbnail: IThumbnail;
    imageInsightsToken: string;
    insightsMetadata: IInsightsMetadata;
    imageId: string;
    accentColor: string;
}

export interface IImageResults {
    _type: string;
    instrumentation: IInstrumentation;
    readLink: string;
    webSearchUrl: string;
    totalEstimatedMatches: number;
    nextOffset: number;
    value: IValue[];
}