import React from "react";

import "./tracks.scss";

class Spotify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullTrackList: props.fullTrackList,
            filteredTrackList: props.fullTrackList,
            genres: props.genres,
            artistOccurrences: props.artistOccurrences,
        };
    }

    filterByArtist = (event) => {
        if (event.target.value === '') {
            this.setState({
                filteredTrackList: this.state.fullTrackList,
            });
        } else {
            let foundTracks = this.state.fullTrackList.filter((obj) => {
                const foundArtists = obj.track.artists.find((o, i) => {
                    if (o.name === event.target.value) {
                        return true;
                    }
                });

                if (foundArtists) {
                    return true;
                }
            });

            this.setState({
                filteredTrackList: foundTracks,
            });
        }
    }

    filterByGenre = (event) => {
        if (event.target.value === '') {
            this.setState({
                filteredTrackList: this.state.fullTrackList,
            });
        } else {
            let foundTracks = this.state.fullTrackList.filter((obj) => {
                const foundGenres = obj.track.genres.find((o, i) => {
                    if (o === event.target.value || o.includes(event.target.value)) {
                        return true;
                    }
                });

                if (foundGenres) {
                    return true;
                }
            });

            this.setState({
                filteredTrackList: foundTracks,
            });
        }
    }

    filterByExplicit = (event) => {
        if (event.target.value === '') {
            this.setState({
                filteredTrackList: this.state.fullTrackList,
            });
        } else {
            let foundTracks = this.state.fullTrackList.filter((obj) => {
                if (obj.track.explicit === (event.target.value === 'true')) {
                    return true;
                }
            });

            this.setState({
                filteredTrackList: foundTracks,
            });
        }
    }

    resetForm = (e) => {
        e.preventDefault();
        this.setState({
            filteredTrackList: this.state.fullTrackList,
        });
        document.getElementById('filter-bar').reset();
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className={'tracks-content'}>
                <h2>Tracks</h2>
                <form id="filter-bar">
                    <div className="field">
                        <p>Filter by Artist</p>
                        <select name="artists" id="" onChange={this.filterByArtist}>
                            <option value="">Select Artist</option>
                            {this.state.artistOccurrences.map(artist => (
                                <option value={artist.name}>{artist.name} - {artist.occurrence}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <p>Filter by Genre</p>
                        <select name="genre" id="" onChange={this.filterByGenre}>
                            <option value="">Select Genre</option>
                            {this.state.genres.map(genre => (
                                <option value={genre.name}>{genre.name} - {genre.occurrence}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <p>Filter by Genre (text)</p>
                        <input type="text" onChange={this.filterByGenre} placeholder={'Type genre here'}/>
                    </div>
                    <div className="field">
                        <p>Filter by Explicit</p>
                        <select name="explicit" id="" onChange={this.filterByExplicit}>
                            <option value="">All</option>
                            <option value={false}>Clean</option>
                            <option value={true}>Explicit</option>
                        </select>
                    </div>
                    <div className="field">
                        <p>Filter by Year</p>
                        <select name="year" id="">
                            <option value="">All</option>
                        </select>
                    </div>
                    <div className="field">
                        <p>Order By</p>
                        <select name="orderby" id="">
                            <option value="">Date Added (Default)</option>
                            <option value="">Popularity</option>
                            <option value="">Track Length</option>
                        </select>
                    </div>
                    <div className="field">
                        <p>Make Playlist with Results</p>
                        <button>Make Playlist</button>
                    </div>
                    <div className="field">
                        <p>Reset</p>
                        <button onClick={this.resetForm}>Reset filters</button>
                    </div>
                </form>
                <p>Total count: {this.state.filteredTrackList.length}</p>
                <div className="tracks-wrapper">
                    <div className="tracks-header">
                        <p>Title</p>
                        <p>Artists</p>
                        <p>Genres</p>
                    </div>
                    <div className="tracks">
                        {this.state.filteredTrackList.map(track => (
                            <div className={'track'} key={track.track.id + track.added_at}>
                                <p>{track.track.name}</p>
                                <p>
                                    {track.track.artists.map(artist => (
                                        <span key={artist.id}>{artist.name}</span>
                                    ))}
                                </p>
                                <p>
                                    {track.track.genres.map(genre => (
                                        <span key={genre}>{genre}</span>
                                    ))}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Spotify;
