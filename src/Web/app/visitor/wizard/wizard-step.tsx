import * as React from 'react';
import PropTypes from 'prop-types';
import { IAnswer, IWizardStep } from './models';

interface IWizardStepProps {
    id: number;
    eventName: string;
    optionClick: PropTypes.func;
    step: IWizardStep;
    activeStep: boolean;
    errorMessage: string;
}

interface IWizardStepState {
    optionClicked: boolean;
}

export default class WizardStep extends React.Component<IWizardStepProps, IWizardStepState, {}> {
    constructor(props: IWizardStepProps) {
        super(props);
        this.state = {
            optionClicked: false,
        };
    }

    getClassName() {
        return 'wizard-step' + (this.props.activeStep && !this.state.optionClicked ? ' wizard-step-active' : '');
    }

    optionClicked = (item: IAnswer) => {
        this.setState({
            optionClicked: true,
        });
        this.props.optionClick(item, this.props.step.isLastQuestion, this.props.step.event);
    }

    renderWizardContent = () => {
        return (
            <div className="wizard-step-content">
                {this.props.step.question}
                {this.props.step.answers !== null && this.props.step.answers !== undefined ?
                    this.props.step.answers.map((item: IAnswer, i: number) => (
                        <div key={`step-option-${i}`} className="wizard-option">
                            <button
                                onClick={(e) => this.optionClicked(item)}
                                className="btn btn-primary btn-xl text-uppercase">
                                {item.text}
                            </button>
                        </div>
                    )) : null}
            </div>
        );
    }

    renderWizardErrorMessage = () => {
        return (
            <div className="wizard-step-content">
                {this.props.errorMessage}
            </div>
        );
    }

    render() {
        return(
            <div className={this.getClassName()}>
                <div className="wizard-opacity" />
                {(this.props.step.isLoading ? (
                    <div className="wizard-loading" />
                ) : null)}

                {this.props.errorMessage !== '' ? (
                    this.renderWizardErrorMessage()
                ) : this.renderWizardContent()}
            </div>
        );
    }
}
