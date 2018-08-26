import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { IImageResults, IValue } from './models/index';
import { config } from './../config';

interface IProps {
}
interface IState {
    items: any;
    selectedImageUrls: string[];
    displayResults: boolean;
    displayUploadSuccess: boolean;
}

export class Images extends React.Component<IProps, IState, {}> {
    static defaultProps =  {};

    private searchInput: any;
    private tagsInputField: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            items: [],
            selectedImageUrls: [],
            displayResults: false,
            displayUploadSuccess: false,
        };
        this.searchInput = React.createRef();
        this.tagsInputField = React.createRef();
    }

    search = () => {
        this.setState({
            items: [],
            selectedImageUrls: [],
        });
        axios({
            method: 'GET',
            url: `${config.bingSearchApiUrl}?q=${this.searchInput.current.value}`,
            headers: {
                'Ocp-Apim-Subscription-Key': config.bingSearchSubscriptionKey,
                'Content-Type': 'application/json',
            },
        })
        .then((response: AxiosResponse<IImageResults>) => {
            this.setState({
                items: response.data.value,
                displayResults: true,
                displayUploadSuccess: false,
            });
        });
    }

    uploadClick() {
        const images = [];
        const newTags = this.tagsInputField.current.value.split(',');

        this.getAllCurrentTags().then((response) => {
            const currentTags = response.data.Tags;
            const promises = this.getOrUpdateTags(currentTags, newTags);

            Promise.all(promises).then((response2: any) => {

                const tags = [];

                response2.map((item: any) => {
                    if(item.data !== undefined) {
                        tags.push(item.data.Id);
                    }
                    else {
                        tags.push(item);
                    }
                });

                this.state.selectedImageUrls.map((item) => {
                    images.push({
                        Url: item, TagIds: tags,
                    });
                });

                axios({
                    method: 'POST',
                    url: `${config.customVisionApiUrl}${config.projectId}/images/urls`,
                    headers: {
                        'Training-key': config.trainingKey,
                        'Content-Type': 'application/json',
                    },
                    data: {
                        Images: images,
                        TagIds: tags,
                    },
                }).then(() => {
                    this.setState({
                        displayUploadSuccess: true,
                    });
                });
            });
        });
    }

    imageCheckboxClick = (item: IValue, e: any) => {
        let arr = [];
        if (!e.target.checked){
            e.target.removeAttribute('checked');

            this.state.selectedImageUrls.map((i) => {
                if(i !== item.thumbnailUrl) {
                    arr.push(i);
                }
            });
         } else {
            e.target.setAttribute('checked', true);

            arr = this.state.selectedImageUrls;
            arr.push(item.thumbnailUrl);
         }

        this.setState({
            selectedImageUrls: arr,
        });
    }

    getOrUpdateTags(currentTags: any, tags: string[]): Array<Promise<any>> {
        const promises = [];

        tags.map((tag: string) => {
            const currentTag = currentTags.find(t => t.Name === tag);

            if(currentTag === null || currentTag === undefined) {
                promises.push(this.createTag(tag));
            }
            else {
                promises.push(currentTag.Id);
            }
        });
        return promises;
    }

    getAllCurrentTags() {
        return axios({
            method: 'GET',
            url: `${config.customVisionApiUrl}${config.projectId}/tags/`,
            headers: {
                'Training-key': config.trainingKey,
                'Content-Type': 'application/json',
            },
        });
    }

    createTag(tag: string) {
        return axios({
            method: 'POST',
            url: `${config.customVisionApiUrl}${config.projectId}/tags?name=${tag}`,
            headers: {
                'Training-key': config.trainingKey,
                'Content-Type': 'application/json',
            },
        });
    }

    renderResults = () => {
        return (
            <React.Fragment>
                <div className="row">
                    {this.state.items.map((item: IValue, index: number) => (
                        <div key={`image-result-${index}`} className="col-lg-1 image-result-item">
                            <img src={item.thumbnailUrl} />
                            <div
                                style={{ textAlign: 'center' }}
                            >
                                <input type="checkbox" onClick={this.imageCheckboxClick.bind(this, item)} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                ref={this.tagsInputField}
                                className="form-control"
                                type="text"
                                placeholder="Type tags here (comma separated)"
                                autoComplete="off" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <button
                            className="btn btn-primary btn-xl text-uppercase image-result-upload"
                            onClick={(e) => this.uploadClick()}
                        >
                            Upload
                        </button>
                    </div>
                </div>
                {this.state.displayUploadSuccess ? (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-primary" role="alert">
                                Images were successfully uploaded.
                            </div>
                        </div>
                    </div>
                ) : null}
            </React.Fragment>
        );
    }

    renderNoResults = () => {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="no-results">Sorry no results found</div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container images-container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2 className="section-heading text-uppercase">Images</h2>
                        <h3
                            className="section-subheading text-muted"
                        >Search for images and select the one you would like to upload.</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input
                                            ref={this.searchInput}
                                            className="form-control"
                                            id="name"
                                            type="text"
                                            placeholder="Type here..."
                                            autoComplete="off" />
                                        <p className="help-block text-danger" />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div id="success" />
                                    <button
                                        id="sendMessageButton"
                                        className="btn btn-primary btn-xl text-uppercase"
                                        type="button"
                                        onClick={this.search}
                                    >Search</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {this.state.displayResults ? (
                    <div>
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading text-uppercase">Results</h2>
                            </div>
                        </div>
                        {this.state.items.length > 0 ? this.renderResults() : this.renderNoResults()}
                    </div>
                 ) : null}
            </div>
        );
    }
}
