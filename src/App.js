import React, {useEffect, useState} from 'react'
import Tmdb from './Tmdb'
import MovieRow from './components/movieRow/MovieRow'
import './App.css'
import FeatureMovie from './components/featureMovie/FeatureMovie'
import Header from './components/header/Header'

function App() {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] =useState(false);

  useEffect(() =>{
    const loadAll = async () =>{
      //load list
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //get feature
      let originals = list.filter(i=>i.slug==='originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeatureData(chosenInfo);
    
    }
    loadAll();
  },[]);

  useEffect(()=>{
    const scrollListenner = () =>{
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListenner);
    return() =>{
      window.removeEventListener('scroll', scrollListenner);
    }
  },[]);

  return (
    <div className="page">
      {/*header
      destaque
      as listas
      rodape
      */}
      <Header black={blackHeader} />
      {featureData && <FeatureMovie item={featureData} /> }      
      <section className="lists">
        {movieList.map((item,key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      <footer>
          Copyrights for Netflix <br />
          Data from Themoviedb.org <br />
          Netflix logo from wikipedia <br />
          User logo from pbs.twimg
      </footer>
          {movieList.length <= 0 &&
            <div className="loading">
              <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"/>
            </div>
          }
    </div>
  )
}

export default App
