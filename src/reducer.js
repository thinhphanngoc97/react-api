var defaultState = {
    total: 0,
    countSuccess: 0,
    countFail: 0,
    results: [],
    failAPIs: [],
}

export default (preState = defaultState, action) => {
    switch (action.type) {
        case 'STARTED_CALL_API': {
            let results = [];
            let failAPIs = [];

            action.data.forEach(api => {
                if (!api.status) {
                    results.push(api);
                } else {
                    failAPIs.push(api.config.url);
                }
            });

            return {
                ...preState,
                total: action.data.length,
                countSuccess: results.length,
                countFail: failAPIs.length,
                results: [...results],
                failAPIs: [...failAPIs],
            };
        }
        
        default:
            return preState;
    }
}