import React, { Component } from 'react';
import './App.css';
import { VideoStore } from './VideoStore';
import { YoutubePlayerService } from './YoutubePlayerService';
import ContainerDimensions from 'react-container-dimensions'

class PlayerDiv extends Component {
    constructor(props) {
        super(props);

        this.container = null;
    }

    _containerMounted() {
        const { youtubeService } = this.props;

        youtubeService.createPlayerOn(this.container);
    }

    _resizeYoutubePlayer(width, height) {
        const { youtubeService } = this.props;

        youtubeService.resizePlayer(width, height);
    }

    refContainer = (container) => {
        if (this.container == null) {
            this.container = container;
            this._containerMounted();
        } else {
            this.container = container;
        }
    };

    render() {
        return (
            <div className="player-container">
                <div className="player">
                    <ContainerDimensions>
                        {
                            ({width, height}) => {
                                this._resizeYoutubePlayer(width, height);
                                return <div className="uncontrolled-yt-player" ref={this.refContainer}></div>;
                            }
                        }
                    </ContainerDimensions>
                </div>
            </div>
        );
    }
}

const ControlsDiv = (props) => {
    return (
        <div className="controls-container">
            <button 
                className="skip"
                onClick={() => {
                    props.youtubeService.skipVideo()
                }}
            >Change the Channel</button>
        </div>
    );
}

const FullyLoadedScreen = (props) => {
    return (
        <React.Fragment>
            <PlayerDiv youtubeService={props.youtubeService} />
            <ControlsDiv youtubeService={props.youtubeService} />
        </React.Fragment>
    );
}

class App extends Component {
    constructor(props) {
        super(props);

        this.youtubeService = null;
        this.videoStore = null;

        this.state = {
            isYoutubeApiReady: false
        };
    }

    componentDidMount() {
        const startupSeed = 5;

        this.videoStore = new VideoStore(startupSeed);
        this.youtubeService = new YoutubePlayerService(this.videoStore);
        this.youtubeService.loadIframePlayer();

        this.youtubeService.isYoutubeApiReady.subscribe(isYoutubeApiReady => {
            this.setState({ isYoutubeApiReady })
        });
    }

    render() {
        const { isYoutubeApiReady } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Title</h1>
                </header>
                {isYoutubeApiReady ? (
                    <FullyLoadedScreen youtubeService={this.youtubeService} />
                ) : (
                    <div>loading youtube api</div>
                )}
            </div>
        );
    }
}

export default App;
