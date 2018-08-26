import * as React from 'react';
import PropTypes from 'prop-types';
import { config } from '../config';

interface ICameraModalProps {
    open: PropTypes.bool;
    closeModal: PropTypes.func;
}
interface ICameraModalState {
    showVideo: boolean;
    showPhoto: boolean;
}

declare var AzureStorage: any;

export default class CameraModal extends React.Component<ICameraModalProps, ICameraModalState> {
    private player: any;
    private canvas: any;
    private constraints = {
        // video: true,
        //video: { facingMode: 'user' },
        video: { facingMode: 'environment', width: 640 },
        //video: { facingMode: { exact: 'environment' } },
    };

    constructor(props: ICameraModalProps){
        super(props);

        this.state = {
            showVideo: true,
            showPhoto: false,
        };
        this.player = React.createRef();
        this.canvas = React.createRef();
    }

    componentWillReceiveProps(nextProps: ICameraModalProps) {
        if(nextProps.open) {
            navigator.mediaDevices.getUserMedia(this.constraints)
                .then((stream) => {
                this.player.current.srcObject = stream;
            });

            this.setState({
                showVideo: true,
                showPhoto: false,
            });
        }
        else{
            this.setState({
                showVideo: false,
                showPhoto: false,
            });
        }
    }

    captureButtonClicked = () => {
        // Draw the video frame to the canvas.
        const context = this.canvas.current.getContext('2d');
        // console.log(this.player.current.clientWidth + "-" + this.player.current.clientHeight);
        // debugger;
        context.drawImage(this.player.current, 0, 0, this.player.current.clientWidth, this.player.current.clientHeight);

        this.player.current.srcObject.getVideoTracks().forEach(track => track.stop());

        this.setState({
            showVideo: false,
            showPhoto: true,
        });
    }

    closeModal = () => {
        const blobService = AzureStorage.Blob.createBlobService(config.storageAccountConnectionString);

        const img = this.canvas.current.toDataURL('image/jpeg', 1.0).split(',')[1];
        const buffer = new Buffer(img, 'base64');
        const fileName = `${new Date().getTime()}.jpg`;

        blobService.createBlockBlobFromText(
            'user-images',
            fileName,
            buffer,
            {contentType:'image/jpeg'},
            (error, result, response) => {
                if (!error) {
                    const url = `${config.storageAccountImageUrl}/${fileName}`;

                    this.canvas.current.toBlob((blob: Blob) => {
                        this.props.closeModal(url, blob);
                    });
                }
            });
    }

    render() {
        return (
            <div className="portfolio-modal modal fade" id="portfolioModal1" role="dialog" aria-hidden="true">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="close-modal" onClick={this.closeModal}>
                    <div className="lr">
                        <div className="rl" />
                    </div>
                    </div>
                    <div className="modal-body">
                    <h2 className="text-uppercase">Take a photo</h2>
                    <div className="modal-camera">
                        <video
                            ref={this.player}
                            id="player"
                            playsInline={true}
                            autoPlay={true}
                            style={{display: this.state.showVideo ? 'block' : 'none' }} />
                        <canvas
                            ref={this.canvas}
                            id="canvas"
                            style={{display: this.state.showPhoto ? 'block' : 'none' }} />
                    </div>
                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={this.captureButtonClicked} type="button">
                                Capture
                            </button>
                            <button className="btn btn-primary" onClick={this.closeModal} type="button">
                                Save and Close
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}