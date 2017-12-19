import React, { Component } from 'react';
import './App.css';

const PlayerDiv = (props) => {
    return (
        <div className="player-container">
            <div className="player">
                player
            </div>
        </div>
    );
}

const ControlsDiv = (props) => {
    return (
        <div className="controls-container">
            <button className="skip">Next Channel</button>
        </div>
    );
}

const FullyLoadedScreen = (props) => {
    return (
        <React.Fragment>
            <PlayerDiv />
            <ControlsDiv />
        </React.Fragment>
    );
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Title</h1>
                </header>
                <FullyLoadedScreen />
            </div>
        );
    }
}

export default App;
