import React, { Component } from 'react';
import './App.css';
import { YoutubePlayerService } from './YoutubePlayerService';

class PlayerDiv extends Component {
    constructor(props) {
        super(props);

        this.container = null;
    }

    componentDidMount() {
        const { youtubeService } = this.props;

        this.player = youtubeService.createPlayerOn(this.container);
    }

    refContainer = (container) => {
        this.container = container;
    };

    render() {
        return (
            <div className="player-container">
                <div className="player">
                    <div className="uncontrolled-yt-player" ref={this.refContainer}></div>
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
            >Next Channel</button>
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

        this.state = {
            isYoutubeApiReady: false
        };
    }

    componentDidMount() {
        this.youtubeService = new YoutubePlayerService();
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
