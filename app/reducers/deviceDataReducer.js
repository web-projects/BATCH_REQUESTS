import * as types from '../actions/actionTypes';

const getInitialDeviceDataViewerPageState = () => ({
        fetching: true,
        isLoaded: false,
        error: false,
        data: [],
    });

export default function deviceDataViewerReducer(state = getInitialDeviceDataViewerPageState(), action) {
    switch (action.type) {
        case types.DEVICE_DATA_VIEWER_LOAD_STARTED:
            return {
                ...state,
            };

        case types.DEVICE_DATA_VIEWER_LOAD_COMPLETED:
            return {
                ...state, fetching: false, data: action.response, isLoaded: true, error: false,
            };

        default:
            return state;
    }
}
