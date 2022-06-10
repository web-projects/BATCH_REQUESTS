import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import homePageReducer from './homePageReducer';
import deviceDataViewerReducer from './deviceDataReducer';

const rootReducer = combineReducers({
    // TODO: Fill-in your reducers here as you update and grow the application.
    homePageReducer,
    deviceDataViewerReducer,
    routing,
});

export default rootReducer;
