import axios from 'axios';

export const getParamValues = (url) => {
    return url
        .slice(1)
        .split('&')
        .reduce((prev, curr) => {
            const [title, value] = curr.split('=');
            prev[title] = value;
            return prev;
        }, {});
};

export const setAuthHeader = () => {
    try {
        const params = JSON.parse(localStorage.getItem('params'));
        if (params) {
            axios.defaults.headers.common[
                'Authorization'
                ] = `Bearer ${params.access_token}`;
        }
    } catch (error) {
        console.log('Error setting auth', error);
    }
};

export const arrayChunk = (array = [], chunkSize = 1) => {
    return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, []);
};

export const getOccurrences = (array) => {
    let filteredArray = [],
        finalArray = [];

    // Get occurrences
    filteredArray = array.reduce((acc, curr)=>{
        const str = curr;
        acc[str] = (acc[str] || 0) + 1;
        return acc;
    }, {});

    // Convert to bar charts data format
    Object.keys(filteredArray).forEach(key => {
        finalArray.push({
            'name': key,
            'occurrence': filteredArray[key],
        })
    });

    // Sort genres by occurrence
    finalArray.sort((a,b) => (b.occurrence > a.occurrence) ? 1 : ((a.occurrence > b.occurrence) ? -1 : 0))

    return finalArray;
}