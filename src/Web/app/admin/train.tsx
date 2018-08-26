import * as React from 'react';
import axios from 'axios';
import { config } from './../config';

interface IProps {

}
interface IState {
    displayTrainSuccess: boolean;
    trainErrorMessage: string;
}

export class Train extends React.Component<IProps, IState, {}> {
    static defaultProps =  {};

    constructor(props: IProps) {
        super(props);

        this.state = {
            displayTrainSuccess: false,
            trainErrorMessage: '',
        };
    }

    trainClick = () => {
        axios({
            method: 'POST',
            url: `${config.customVisionApiUrl}${config.projectId}/train`,
            headers: {
                'Training-key': config.trainingKey,
                'Content-Type': 'application/json',
            },
        }).then(() => {
            this.setState({
                displayTrainSuccess: true,
            });
        })
        .catch((error) => {
            this.setState({
                trainErrorMessage: error.response.data.Message,
            });
        });
    }

    render() {
        return (
            <div className="container container-train">
                 <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2 className="section-heading text-uppercase">Train model</h2>
                        <h3
                            className="section-subheading text-muted"
                        >It's important to train the model to return better results.</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button
                            className="btn btn-primary btn-xl text-uppercase image-result-train"
                            onClick={this.trainClick}
                        >
                            Train
                        </button>
                    </div>
                </div>
                {this.state.displayTrainSuccess ? (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-primary" role="alert">
                                Model trained!
                            </div>
                        </div>
                    </div>
                ) : null}
                {this.state.trainErrorMessage !== '' ? (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-danger" role="alert">
                                {this.state.trainErrorMessage}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
