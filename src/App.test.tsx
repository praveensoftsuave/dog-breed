
import {render} from '@testing-library/react';
import {screen} from '@testing-library/dom'
import App from './App';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('With React Testing Library', () => {
    const initialState = { test:10};
    const mockStore = configureStore();
    let store;

    beforeEach(() => {
        store = mockStore(initialState);
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
    });
    it('test header present',()=>{
      expect(screen.getByText('Dog Poster Generator')).toBeInTheDocument();
    })
    it('test add button present',()=>{
      expect(screen.getByText('+')).toBeInTheDocument();
    })
    it('test generate button present',()=>{
      expect(screen.getByText('Generate')).toBeInTheDocument();
    })
    it('test breed option available',()=>{
      expect(screen.getByTestId('breed')).toBeInTheDocument();
    })
});