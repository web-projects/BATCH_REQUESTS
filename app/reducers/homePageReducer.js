import * as types from '../actions/actionTypes';

const getInitialHomePageState = () => ({
    fetching: false,
    isLoaded: false,
    error: false,
    data: null,
});

export default function homePageReducer(state = getInitialHomePageState(), action) {
    switch (action.type) {
        // TODO: Fill-in your action types here as your homepage content grows.
        default:
            return state;
    }
}
