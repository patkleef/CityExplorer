import * as React from 'react';
import { IWizardResult, IWizardResultItem } from './models';

interface IWizardResultsProps {
    result: IWizardResult;
}

export class WizardResults extends React.Component<IWizardResultsProps> {

    constructor(props: IWizardResultsProps) {
        super(props);
    }

    renderItems(item: IWizardResultItem, i: number) {
        return(
            <div key={`result-item-${i}`} className="col-md-4 col-sm-6 portfolio-item">
                <a className="portfolio-link" data-toggle="modal" href="#portfolioModal1">
                    <div className="portfolio-hover">
                        <div className="portfolio-hover-content">
                            <i className="fa fa-plus fa-3x" />
                        </div>
                    </div>
                    {item.image !== null && item.image !== '' ? (
                        <img className="img-fluid" src={item.image} alt="" />
                    ) : null}
                </a>
                <div className="portfolio-caption">
                    <h4>{item.title}</h4>
                    <p className="text-muted">{item.introduction}</p>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div id="results">
                <section className="bg-light" id="results">
                    {this.props.result !== null ? (
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h2 className="section-heading text-uppercase">{this.props.result.title}</h2>
                                    <h3 className="section-subheading text-muted">{this.props.result.text}</h3>
                                </div>
                            </div>
                            <div className="row">
                                {this.props.result.items.map((item: IWizardResultItem, i: number) => (
                                    this.renderItems(item, i)
                                ))}

                                {this.props.result.items.length ===0 ? (
                                    <p>Sorry no items were found.</p>
                                ) : null}
                            </div>
                        </div>
                     ) : null}
                </section>
            </div>
        );
    }
}