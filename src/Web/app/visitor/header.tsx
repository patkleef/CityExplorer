declare var $: any;

import * as React from 'react';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGoogleMap from 'react-google-map';
import scrollToComponent from 'react-scroll-to-component';
import CameraModel from './camera-modal';
import PredictionService from './prediction-service';
import WizardStep from './wizard/wizard-step';
import WizardService from './wizard/wizard-service';
import { IWizardStep, IStartWizardResponse, IAnswer, IWizardResult } from './wizard/models';
import { IPredictionResult, IEntitySearchResult } from './models';
import EntitySearchService from './entity-search-service';

interface IHeaderProps {
    displayResults: (items: IWizardResult) => void;
}

interface IHeaderState {
    cameraModalOpen: boolean;
    showGoogleMaps: boolean;
    introText: string;
    headerText: string;
    currentLatitude: number;
    currentLongitude: number;
    wizardSteps: any[];
    activeStep: number;
    wizardStepUrls: IStartWizardResponse;
    wizardErrorMessage: string;
    readyToStartWizard: boolean;
}

export class Header extends React.Component<IHeaderProps, IHeaderState, {}> {
    private headerElement;
    private predictionService: PredictionService;
    private entitySearchService: EntitySearchService;
    private wizardService: WizardService;

    constructor(props: IHeaderProps) {
        super(props);

        this.wizardService = new WizardService();
        this.predictionService = new PredictionService();
        this.entitySearchService = new EntitySearchService();

        this.state = {
            cameraModalOpen: false,
            showGoogleMaps: true,
            introText: 'Welcome To The City Explorer',
            headerText: 'Do you like Amsterdam so far?',
            currentLatitude: 52.37502,
            currentLongitude: 4.9117377,
            wizardSteps: [],
            activeStep: -1,
            wizardStepUrls: null,
            wizardErrorMessage: '',
            readyToStartWizard: false,
        };

        this.headerElement = React.createRef();

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        // navigator.geolocation.getCurrentPosition(this.getLocationSuccess, this.getLocationError, options);
    }

    handleSettingsResponse = (data: IStartWizardResponse) => {
        data.sendEventPostUri = data.sendEventPostUri.replace(data.id, '{instanceId}');
        data.statusQueryGetUri = data.statusQueryGetUri.replace(data.id, '{instanceId}');
        data.terminatePostUri = data.terminatePostUri.replace(data.id, '{instanceId}');

        this.setState({
            wizardStepUrls: data,
        });
    }

    handleResponse = (step: IWizardStep, error = '') => {
        if(step === null && error !== '') {
            const temp = this.state.wizardSteps;
            temp[0].isLoading = false;

            this.setState({
                wizardSteps: temp,
                wizardErrorMessage: error,
            });
        }
        else {
            const temp = this.state.wizardSteps;
            temp.pop();
            temp.push(step);

            this.setState({
                wizardSteps: temp,
                activeStep: (this.state.activeStep + 1),
            });
            this.renderGoogleMap();

            const ref = this.refs[`wizardStep${temp.length - 1}`];

            scrollToComponent(ref, { offset: 0, align: 'middle', duration: 500, ease:'inCirc'});
        }
    }

    handleResultResponse = (data) => {
        const temp = this.state.wizardSteps;
        temp[temp.length - 1].isLoading = false;

        this.setState({
            wizardSteps: temp,
        });
        this.props.displayResults(data);
    }

    getLocationSuccess = (pos) => {
        this.setState({
            currentLatitude: pos.coords.latitude,
            currentLongitude: pos.coords.longitude,
        });
      }

    getLocationError = (err) => {
        const error = err;
    }

    takePhotoClick = (e: any) => {
        this.setState({
            cameraModalOpen: true,
            showGoogleMaps: true,
            introText: 'Welcome To The City Explorer',
            headerText: 'Do you like Amsterdam so far?',
            wizardSteps: [],
            activeStep: -1,
            wizardStepUrls: null,
            wizardErrorMessage: '',
            readyToStartWizard: false,
        });

        $('#portfolioModal1').modal('toggle');
    }

    closeCameraModal = (url: string, blob: Blob) => {
        $('#portfolioModal1').modal('toggle');
        this.setState({
            cameraModalOpen: false,
        });

        this.setState({
            showGoogleMaps: false,
        });
        this.headerElement.current.style.backgroundImage = `url('${url}')`;
        // this.headerElement.current.style.backgroundSize = 'cover';
        this.headerElement.current.style.backgroundRepeat = 'no-repeat';
        this.headerElement.current.style.backgroundPosition = 'top center';

        this.predictionService.predict(blob, this.handlePredictionResult);
    }

    handlePredictionResult = (result: IPredictionResult) => {
        const prediction = result.Predictions[0];

        this.entitySearchService.search(prediction.Tag, this.handleEntitySearchResult);
    }

    handleEntitySearchResult = (result: IEntitySearchResult) => {
        let intro = '';
        let headerText = '';

        if(result !== null && result.entities !== undefined && result.entities.value.length > 0) {
            const entity = result.entities.value[0];
            intro = entity.description;
            headerText = `You're at: ${entity.name}`;
        }
        else {
            intro = `Sorry we can't recognize where you at.`;
            headerText = `You're at an unknown location`;
        }
        this.setState({
            introText: intro,
            headerText: headerText,
            readyToStartWizard: true,
        });
    }

    startWizardButtonClick = () => {
        this.setState({
            wizardSteps: [
                {
                    answers: [],
                    question: '',
                    event: '',
                    isLoading: true,
                },
            ],
        });

        this.wizardService.startWizard(
            this.state.currentLatitude,
            this.state.currentLongitude,
            this.handleSettingsResponse,
            this.handleResponse,
            this.handleResultResponse);

        scrollToComponent(this.refs['wizardStep0'], { offset: 0, align: 'top', duration: 500, ease:'inCirc'});
    }

    render() {
        return (
            <header id="header" className="masthead">
                <div ref={this.headerElement}>
                    <div className="header-bg-opacity" />
                    {this.state.showGoogleMaps ? this.renderGoogleMap() : null}
                    <div className="container intro-header-container">
                        <div className="intro-text">
                            <div className="intro-lead-in">{this.state.introText}</div>
                            <div className="intro-heading text-uppercase">{this.state.headerText}</div>
                            {!this.state.readyToStartWizard ? (
                                 <a
                                    onClick={this.takePhotoClick}
                                    className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                                >Take photo</a>
                            ) : (
                                <a
                                    onClick={this.startWizardButtonClick}
                                    className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                                >Start Wizard!</a>
                            )}
                        </div>
                    </div>
                    <div className="container">
                        <div className="wizard">
                            {this.state.wizardSteps !== null && this.state.wizardSteps !== undefined ?
                                this.state.wizardSteps.map((item: IWizardStep, i: number) => (
                                <WizardStep
                                    ref={`wizardStep${i}`}
                                    key={`wizard-step-${i}`}
                                    id={i}
                                    activeStep={this.state.activeStep === i}
                                    eventName="event 1"
                                    optionClick={this.wizardOptionClick}
                                    step={item}
                                    errorMessage={this.state.wizardErrorMessage}
                                />
                            )) : null }
                        </div>
                    </div>
                    <CameraModel open={this.state.cameraModalOpen} closeModal={this.closeCameraModal} />
                </div>
            </header>
        );
    }

    wizardOptionClick = (answer: IAnswer, isLastQuestion: boolean, event: string) => {
        const temp = this.state.wizardSteps;
        if(isLastQuestion) {
            temp[temp.length - 1].isLoading = true;
        }
        else {
            temp.push(
                {
                    answers: [],
                    question: '',
                    event: '',
                    isLoading: true,
                });
        }

        this.wizardService.setAnswer(
            this.state.wizardStepUrls,
            answer,
            isLastQuestion,
            event,
            this.handleSettingsResponse,
            this.handleResponse);
    }

    renderGoogleMap() {
        return (
            <ReactGoogleMapLoader
                params={{
                    key: 'AIzaSyBCNgdFABzZdMzSY3Ynt1hugVAwf8lZR34',
                    libraries: 'places,geometry',
                }}
                render={(g) => this.renderMapsLoader(g)}
            />
        );
    }

    renderMapsLoader(googleMaps: any) {
        if(googleMaps === null) {
            return null;
        }
        const styleOptions = [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}],
            },
          ];

        const currentLatitude = this.state.currentLatitude;
        const currentLongitude = this.state.currentLongitude;
        return(
            <div className="google-map-container">
                <ReactGoogleMap
                    googleMaps={googleMaps}
                    coordinates={[
                        {
                        title: 'Address',
                        position: {
                            lat: currentLatitude, lng: currentLongitude,
                        },
                        onLoaded: (googleMaps2, map, marker) => {
                            marker.setIcon('/img/marker.png');
                        },
                    }]}
                    center={{lat: currentLatitude, lng: currentLongitude}}
                    zoom={14}
                    disableDefaultUI={true}
                    zoomControl={false}
                    gestureHandling="none"
                    styles={styleOptions}
                />
            </div>
        );
    }
}
