import * as React from 'react';
import { Header } from './header';
import { WizardResults } from './wizard/wizard-results';
import { IWizardResult } from './wizard/models';
import scrollToComponent from 'react-scroll-to-component';

interface IVisitorAppProps {
}

interface IVisitorAppState {
    result: IWizardResult;
}

export default class VisitorApp extends React.Component<IVisitorAppProps, IVisitorAppState> {

    private wizardResultsComponent;

    constructor(props: IVisitorAppProps){
        super(props);

        this.state = {
            result: null,
        };
        this.wizardResultsComponent = React.createRef();
    }

    displayResults = (result2: IWizardResult) => {
        this.setState({
            result: result2,
        });

        scrollToComponent(
                this.wizardResultsComponent.current, { offset: 0, align: 'top', duration: 500, ease:'inCirc'});
    }

    render() {
        return (
            <React.Fragment>
                <Header displayResults={this.displayResults} />
                <WizardResults ref={this.wizardResultsComponent} result={this.state.result} />
            </React.Fragment>
        );
    }
}

