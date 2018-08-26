import * as React from 'react';
import scrollToComponent from 'react-scroll-to-component';
import { Images } from './images';
import { Train } from './train';

interface IAdminAppProps {
}
export default class AdminApp extends React.Component<IAdminAppProps> {

    private imagesComponent;

    constructor(props: IAdminAppProps) {
        super(props);

        this.imagesComponent = React.createRef();
    }

    startNowClicked = () => {
        scrollToComponent(this.imagesComponent.current, { offset: 0, align: 'top', duration: 500, ease:'inCirc'});
    }

    render() {
        return (
            <React.Fragment>
                <header className="masthead">
                    <div className="container">
                        <div className="intro-text">
                        <div className="intro-lead-in">Upload images and train the model</div>
                            <a
                                className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                                onClick={this.startNowClicked}
                            >Start now</a>
                        </div>
                    </div>
                </header>
                <section id="contact">
                    <Images ref={this.imagesComponent} />
                    <Train />
                </section>
            </React.Fragment>
        );
    }
}
