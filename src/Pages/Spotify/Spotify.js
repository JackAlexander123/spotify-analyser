import React from 'react';

import {get} from "../../Utils/api";
import {arrayChunk, getOccurrences} from "../../Utils/functions";

import './spotify.scss';
import Genres from "./Genres/Genres";
import Artists from "./Artists/Artists";
import Tracks from "./Tracks/Tracks";

class Spotify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            user: [],
            playlists: [],
            analysedPlaylist: [],
            fullTrackList: [],
            genres: [],
            artists: [],
            artistOccurrences: [],
            selectedTab: 'tracks',
        };
    }

    handleLogin () {
        window.location = `${process.env.REACT_APP_AUTHORIZE_URL}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&response_type=token&show_dialog=true`;
    };

    async analysePlaylist (playlist) {
        // Set playlist state and wipe other states
        this.setState({
            analysedPlaylist: playlist,
            genres: [],
            artists: [],
            years: [],
            artistOccurrences: [],
            fullTrackList: [],
        });

        let tracks = [];
        let artists = [];
        let artistIDs = [];
        let fullArtistList = [];
        let allGenres = [];
        let allArtistsNames = [];

        const API_URL = 'https://api.spotify.com/v1/playlists/'+playlist.id+'/tracks';

        var response = await get(API_URL);

        Array.prototype.push.apply(tracks, response.items);

        while(response.next) {
            response = await get(response.next);

            Array.prototype.push.apply(tracks, response.items);
        }

        // Gets all artists
        for (let index = 0; index < tracks.length; ++index) {
            for (let artistIndex = 0; artistIndex < tracks[index].track.artists.length; ++artistIndex) {
                artists.push(tracks[index].track.artists[artistIndex]);
            }
        }

        // Filter out artist duplicates
        artists = artists.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.name === value.name
            ))
        )

        // Seperate artist IDs and isolate
        for (let artistIndex = 0; artistIndex < artists.length; ++artistIndex) {
            artistIDs.push(artists[artistIndex].id);
        }

        // Chuck them into groups of 50
        artistIDs = arrayChunk(artistIDs, 50);

        // Get artists information
        for (let index = 0; index < artistIDs.length; ++index) {
            const API_URL = 'https://api.spotify.com/v1/artists?ids=' + artistIDs[index].join(',');
            await get(API_URL).then(data => {
                Array.prototype.push.apply(fullArtistList, data.artists);
            })
        }

        // Set artists state
        this.setState({
            artists: fullArtistList,
        });

        // Take genres from artists and assign back to tracks
        for (let index = 0; index < tracks.length; ++index) {
            // Overwrite track artists with full detail artists from API
            for (let artistIndex = 0; artistIndex < tracks[index].track.artists.length; ++artistIndex) {
                const foundArtist = fullArtistList.find(function (value, i) {
                    if (typeof value === 'object' && value !== null) {
                        if (value.id === tracks[index].track.artists[artistIndex].id) {
                            return value;
                        }
                    }
                });
                if (typeof foundArtist === 'object') {
                    tracks[index].track.artists[artistIndex] = foundArtist;
                }
            }

            tracks[index].track.genres = [];

            // Take genres from artists and create new genres field in track obj
            for (let artistIndex = 0; artistIndex < tracks[index].track.artists.length; ++artistIndex) {
                if (tracks[index].track.artists[artistIndex].hasOwnProperty('genres')) {
                    Array.prototype.push.apply(tracks[index].track.genres, tracks[index].track.artists[artistIndex].genres);
                }
            }

            // Remove duplicate genres
            tracks[index].track.genres = [...new Set(tracks[index].track.genres)];
        }

        this.setState({
            fullTrackList: tracks,
        });

        // // Pull genres from artists
        // for (let i = 0; i < fullArtistList.length; ++i) {
        //     if (typeof fullArtistList[i] === 'object' && fullArtistList[i] !== null) {
        //         Array.prototype.push.apply(allGenres,fullArtistList[i].genres);
        //     }
        // }

        // Pull genres from tracks
        for (let i = 0; i < tracks.length; ++i) {
            if (typeof tracks[i] === 'object' && tracks[i] !== null) {
                Array.prototype.push.apply(allGenres,tracks[i].track.genres);
            }
        }

        // Pull artist names from tracks
        for (let index = 0; index < tracks.length; ++index) {
            if (typeof tracks[index] === 'object' && tracks[index] !== null) {
                for (let artistIndex = 0; artistIndex < tracks[index].track.artists.length; ++artistIndex) {
                    allArtistsNames.push(tracks[index].track.artists[artistIndex].name);
                }
            }
        }

        // Set genre state
        this.setState({
            genres: getOccurrences(allGenres),
            artistOccurrences: getOccurrences(allArtistsNames),
        });
    }

    async getUserData() {
        const API_URL = 'https://api.spotify.com/v1/me';
        await get(API_URL).then(data => {
            localStorage.setItem('user_data', JSON.stringify(data));

            this.getPlaylists(data.id);

            this.setState({
                user: data,
            });
        })
    };

    async getPlaylists(userID) {
        const API_URL = 'https://api.spotify.com/v1/users/'+userID+'/playlists';
        await get(API_URL).then(data => {
            localStorage.setItem('playlists', JSON.stringify(data.items));

            this.setState({
                playlists: data.items,
            });
        })
    }

    setTab (tab) {
        this.setState({
            selectedTab: tab,
        });
    }

    componentDidMount() {
        if (localStorage.getItem('params') !== null) {
            if (localStorage.getItem('user_data') === null) {
                this.getUserData();
            } else {
                this.setState({
                    user: JSON.parse(localStorage.getItem('user_data')),
                    playlists: JSON.parse(localStorage.getItem('playlists')),
                });
            }
        }
    }

    render() {
        return (
            <div className={'spotify-section'}>
                <div className="sidebar">
                    <button onClick={this.handleLogin}>
                        Login to spotify
                    </button>
                    <h3>Profile</h3>
                    {this.state.user !== null &&
                        <p>{this.state.user.display_name}</p>
                    }
                    <h3>Playlists</h3>
                    {this.state.playlists.map(name => (
                        <div key={name.id}>
                            <p>{name.name} - <button onClick={() => this.analysePlaylist(name)}>Analyse</button></p>
                        </div>
                    ))}
                </div>
                <div className="content">
                    {this.state.analysedPlaylist.length !== 0 ? (
                        <div className="playlist-info">
                            <h3>Playlist - {this.state.analysedPlaylist.name}</h3>
                            <div className="tab-nav">
                                <button onClick={() => this.setTab('tracks')}>Tracks</button>
                                <button onClick={() => this.setTab('artists')}>Artists</button>
                                <button onClick={() => this.setTab('genres')}>Genres</button>
                            </div>
                            {(this.state.fullTrackList.length !== 0 && this.state.genres.length !== 0 && this.state.artistOccurrences.length !== 0 && this.state.selectedTab === 'tracks') &&
                                <Tracks fullTrackList={this.state.fullTrackList} genres={this.state.genres} artistOccurrences={this.state.artistOccurrences} />
                            }
                            {this.state.artists.length !== 0 && this.state.selectedTab === 'artists' &&
                                <Artists artists={this.state.artists} artistOccurrences={this.state.artistOccurrences} />
                            }
                            {this.state.genres.length !== 0 && this.state.selectedTab === 'genres' &&
                                <Genres genres={this.state.genres} />
                            }
                        </div>
                    ) : (
                        <p>No playlist selected</p>
                    )}
                </div>
            </div>
        );
    }
}

export default Spotify;
