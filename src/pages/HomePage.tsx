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
	IonItem,
} from '@ionic/react';
import axios from "axios";
import './HomePage.scss';


const ROOT_URL = 'https://api.themoviedb.org/3/';

const PATH_REQUEST = {
	movieDay: 'trending/movie/day',
	search: 'search/movie'
}
const API_KEY = 'fe596d9ecc661f727490237e8d8c7bf8';


const getQueryParams = ({ searchTerm, page}) => {
	switch (true) {
		case Boolean(searchTerm):
			return `&query=${searchTerm}&page=${page}`
		case Boolean(page):
			return `&page=${page}`
		default:
			return `&page=${page}`

	}
}

export const HomePage: React.FC = () => {

	const [pathRequest, setPathRequest] = useState<string>(PATH_REQUEST.movieDay);
	const [cardsData, setCardsData] = useState<any[]>([]);
	const [page, setPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string | undefined>();
	const [stopScroll, setStopScroll] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);


	const loadData = async (pageNumber: number, loadMore?: true) => {
		const resp = await axios.get(`${ROOT_URL}${pathRequest}?api_key=${API_KEY}${getQueryParams({ searchTerm, page: pageNumber })}`)
		const movies = resp.data.results.length ? resp.data.results : [{titleResult: `${searchTerm}`}];

		const titleForSearchMovies = [{titleResult: `${searchTerm}`}];
		const titleForPopularMovies = [{titlePopular: 'Favorite'}];

		let updateMovies = []
		if (pathRequest === PATH_REQUEST.search) {
			updateMovies = [...titleForSearchMovies, ...movies]
		} else if (pathRequest === PATH_REQUEST.movieDay) {
			updateMovies = [...titleForPopularMovies, ...movies]
		}

		console.log('movies', movies);
		console.log('cardsData', cardsData);
		console.log('stopScroll', stopScroll);
		console.log('page', page);
		if (loadMore) {
			setCardsData(prev => [...prev, ...movies])
		} else if (movies.length > 1) {
			setCardsData(updateMovies)
		} else if (movies.length === 1 && searchTerm) {
			setCardsData(movies)
		}

		if (movies.length < 20 && searchTerm) {
			setStopScroll(true)
		} else {
			setStopScroll(false)
		}

		setIsLoading(false)
	}

	useEffect(() => {

		let debounceTimeout = null;

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		const newPath = (path) => {
			setIsLoading(true);
			setPathRequest(path)
			setPage(1)
			debounceTimeout = setTimeout(async () => {
				await loadData(1);
			}, 1000)
		}

		if (searchTerm === undefined || searchTerm === '' ) {
			newPath(PATH_REQUEST.movieDay)
		} else {
			newPath(PATH_REQUEST.search)
		}

		return () => {
			clearTimeout(debounceTimeout)
		}
	}, [searchTerm, pathRequest])

	return (
		<IonPage style={{paddingTop: '60px'}}>
			<IonContent>
				<IonItem className="ion-input-container">
					<IonInput
						label="Search movie"
						color="success"
						value={searchTerm}
						onIonInput={e => setSearchTerm(e.target.value)}
					>
					</IonInput>
					{isLoading && <ion-spinner name="crescent" />}
				</IonItem>
				{
					cardsData.length > 1 && cardsData.map((el, i) => (
						<div key={i} style={{padding: '10px 50px'}}>
								<div style={{padding: '10px 60px', width: '100%', height: '25px', display: 'block', color: 'darkcyan'}}>
									{
										el.titleResult &&
										(`For your search "${el.titleResult}" founded results`)
									}
									{
										el.titlePopular && (
											'Popular movies'
										)
									}
								</div>
							{ !el.titleResult && !el.titlePopular && (
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
								)
							}
						</div>
					))
				}
				{
					!stopScroll && (
						<IonInfiniteScroll onIonInfinite={async (e) => {
							await loadData(page + 1, true);
							setPage(prevState => prevState + 1);
							e.target.complete();
						}}>
							<IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more movie..." />
						</IonInfiniteScroll>
					)
				}
				{
					(stopScroll && page === 1 && cardsData.length === 1 ) && (
						<div className="not-found-movies">
							<div className="not-found-movies-text">
								<h2>There are no results for "{cardsData[0].titleResult}"</h2>
								<div>You may have entered an invalid request. Check spelling.</div>
								<div>Try to use only keywords.</div>
							</div>
						</div>
					)
				}
			</IonContent>
		</IonPage>
	);
};

