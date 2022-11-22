import { useEffect } from 'react';
import './App.css';
import Header from './Components/Header/Header';
import { DogService } from './service/Dog.service';
import { useDispatch } from 'react-redux'
import { setBreed } from './store/breedSlicer'
import DynamicBreed from './Components/DynamicBreed';

function App() {
  const dogService = new DogService()
  const dispatch = useDispatch()

  useEffect(() => {
    const getBreeds = async () => {
      try {
        const breeds: any = await dogService.getDogList();
        if (breeds.status === 'success') {
          dispatch(setBreed(breeds.message))
        }
      }
      catch (err: any) {
        alert(err.message)
      }
  
    }
    getBreeds()
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <Header />
      <DynamicBreed />
    </div>
  );
}

export default App;
