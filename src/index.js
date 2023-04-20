import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.jsx';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

//STEP 1, npm install redux-saga 
//STEP 2. Import createSagaMiddleware
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

// STEP 8. Import axios, takevery, and put 
import axios from 'axios'; 
//put is dipatch (they do the same thing)
import { takeEvery, put } from 'redux-saga/effects'; 

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

//new saga, create above rootsaga
// MAKE A GET REQUEST AND PASS THE DATA TO REDUX 
function* fetchElements() {
    try {
        //This yield with wait for a server response 
        const elements = yield axios.get('/api/element'); 
        // After we get a response, the rest will run 
        yield put({ type: 'SET_ELEMENTS', payload: elements.data });
    } catch (error) {
        console.log(`error in fetchElements: ${error}`);
        alert('Something went wrong');
    }
}

function* postElement(action) {
    try {
        yield axios.post('/api/element', action.payload);
        yield put ({ type: 'FETCH_ELEMENTS' }); 
    } catch (error) {
        console.log(`Error in postElement: ${error}`);
        alert('Something went wrong'); 
    }
}

//STEP 3. Create a root saga generator function
// this is the saga that will watch for actions
function* rootSaga() {
    // 'FETCH_ELEMENTS' is our action type. 
    // DO NOT USE THE SAME ACTION AS THE REDUCER aka SET_ELEMENTS in the yield put 
    yield takeEvery('FETCH_ELEMENTS', fetchElements); 
    yield takeEvery('ADD_ELEMENT', postElement)
    // More sagas go here 
}


// STEP 4. Create saga middleware 
const sagaMiddleware = createSagaMiddleware();


// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
    }),
// Step 5. Add middleware to redux 
    applyMiddleware(sagaMiddleware, logger),
);
// Step 6. Add our root saga to our middleware 
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
