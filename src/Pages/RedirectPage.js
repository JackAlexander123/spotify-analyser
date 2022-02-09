import React from 'react';
import { getParamValues } from '../Utils/functions';

export default class RedirectPage extends React.Component {
    componentDidMount() {
        try {
            const access_token = getParamValues(window.location.hash);
            const expiryTime = new Date().getTime() + access_token.expires_in * 1000;
            localStorage.setItem('params', JSON.stringify(access_token));
            localStorage.setItem('expiry_time', expiryTime);
            window.location = '/spotify';
        } catch (error) {
            console.log(error)
        }
    }
    render() {
        return null;
    }
}