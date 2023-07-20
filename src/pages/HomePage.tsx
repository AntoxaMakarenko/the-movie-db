import React from 'react';
import { useState, useEffect } from 'react'
import {
    IonContent,
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCardSubtitle,
    IonInput,
    IonItem, IonSearchbar,
} from '@ionic/react';
import axios from "axios";

export const HomePage: React.FC = () => {
    const [cardsData, setCardsData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [stopScroll, setStopScroll] = useState(false);
    const [request, setRequest] = useState('')
    const [newMovies, setNewMovies] = useState([])
    const [notMovies, setNotMovies] = useState(false)


    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=fe596d9ecc661f727490237e8d8c7bf8&query=${searchTerm}&page=${page}`;

    const onInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;
        const movie = value
        const result = movie.charAt(0).toUpperCase() + movie.slice(1)
        setPage(1)
        setSearchTerm(result)
    };

    useEffect(() => {
        loadData()
        console.log('1');
    }, [searchTerm ]);

    useEffect(() => {
        console.log('2')
        onUpdatePage()
    }, [newMovies])

    useEffect(() => {
        console.log('3')
        if (searchTerm === request) {
            loadData()
        }
    }, [page])

    const loadData = () => {
        console.log('page', page);
        axios.get (apiUrl)
            .then((resp) => {
                console.log('4')

                const movies = resp.data.results;

                setNewMovies(movies)

                if (movies.length < 20 && searchTerm) {
                    setStopScroll(true)
                } else {
                    setStopScroll(false)
                }

                if (movies.length === 0 && searchTerm !== '') {
                    setNotMovies(true)
                } else {
                    setNotMovies(false)
                }

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const loadMoreData  =  () => {
        console.log('8');
        setPage(prevState => prevState + 1)
    };

    const onUpdatePage = () => {
        if (cardsData.length === 0) {
            console.log('cardsData', cardsData);
            console.log('5');
            setCardsData(newMovies)
            setRequest(searchTerm)
            return
        } else if ((request === searchTerm) && (cardsData.length > 0)) {
            console.log('6');
            setCardsData(() => [...cardsData, ...newMovies]);
        } else if ((request !== searchTerm) && (cardsData.length > 0)) {
            console.log('7');
            setPage(1)
            if(page === 1) {
                setCardsData(newMovies)
                setRequest(searchTerm)
            }
        }
    }

    return (
        <IonPage>
            <IonContent>
                <IonItem className="ion-input-container">
                    <IonInput
                        label="Search movie"
                        debounce={2000}
                        color="success"
                        value={searchTerm}
                        onIonInput={onInput}
                        // ref={ionInputEl}
                    >
                    </IonInput>
                </IonItem>
                {/*<IonSearchbar*/}
                {/*    debounce={2000}*/}
                {/*    style={{marginTop: '100px'}}*/}
                {/*    value={searchTerm}*/}
                {/*    onIonChange={onInput}*/}
                {/*    placeholder="Search for cards"*/}
                {/*/>*/}

                {
                    cardsData.length > 0 && cardsData.map((el, i) => (
                        <div key={i}>
                            <IonCard style={{display: 'flex'}}>
                                <img
                                    alt="Logo of movie"
                                    src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                                    style={{ height: '250px', objectFit: 'contain', padding: '16px'}}
                                />
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <IonCardHeader>
                                        <IonCardTitle>{el.original_title}</IonCardTitle>
                                        <IonCardSubtitle>{el.release_date}</IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent>{el.overview}</IonCardContent>

                                </div>
                            </IonCard>
                        </div>
                    ))
                }
                {
                    (!stopScroll) && (
                        <IonInfiniteScroll onIonInfinite={(e) => {

                            setTimeout(() => {
                                e.target.complete()
                                loadMoreData()
                            }, 500)
                        }}>
                            <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more movie..." />
                        </IonInfiniteScroll>
                    )
                }
                {
                    notMovies && (
                        <div className="not-found-movies">
                            <span className="not-found-movies-text">Not found movies</span>
                        </div>
                    )
                }

            </IonContent>
        </IonPage>
    );
};

