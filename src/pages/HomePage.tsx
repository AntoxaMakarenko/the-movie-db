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
		default:
			return `&page=${page}`

	}
}

interface typeOfCardsData {
	poster_path: string,
	original_title: string,
	release_date: any,
	vote_average: number,
	overview: string,

	titleResult: string
}

export const HomePage: React.FC = () => {

	const [pathRequest, setPathRequest] = useState<any | string>(PATH_REQUEST.movieDay);
	const [cardsData, setCardsData] = useState<typeOfCardsData[]>([]);
	const [page, setPage] = useState<any | number>(1);
	const [searchTerm, setSearchTerm] = useState<any | string | undefined>();
	const [stopScroll, setStopScroll] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSearchInputChange = (event) => {
		const { value } = event.detail;
		const result = value.charAt(0).toUpperCase() + value.slice(1)
		setSearchTerm(result)
	};


	const loadData = async (pageNumber: number, loadMore?: true) => {
		const resp = await axios.get(`${ROOT_URL}${pathRequest}?api_key=${API_KEY}${getQueryParams({ searchTerm, page: pageNumber })}`)
		const movies = resp.data.results.length ? resp.data.results : [];

		const titleForSearchMovies = [{titleResult: `${searchTerm}`}];
		const titleForPopularMovies = [{titlePopular: 'Popular movies'}];

		let updateMovies = []
		if (pathRequest === PATH_REQUEST.search) {
			updateMovies = [...titleForSearchMovies, ...movies]
		} else if (pathRequest === PATH_REQUEST.movieDay) {
			updateMovies = [...titleForPopularMovies, ...movies]
		} else if (!movies.length) {
			updateMovies = [... titleForSearchMovies];
		}

		if (loadMore) {
			setCardsData(prev => [...prev, ...movies])
		} else if (updateMovies.length > 1 && movies[0].id) {
			setCardsData(updateMovies)
		} else if (updateMovies.length === 1 && searchTerm) {
			setCardsData(updateMovies)
		}

		if (movies.length < 20 && searchTerm) {
			setStopScroll(true)
		} else {
			setStopScroll(false)
		}

		setIsLoading(false)
	}

	useEffect(() => {

		let debounceTimeout: any;

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

		if (!searchTerm ) {
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
						onIonInput={e => handleSearchInputChange(e)}
					>
					</IonInput>
					{isLoading && <ion-spinner name="crescent" />}
				</IonItem>
				{
					cardsData.length > 1 && cardsData.map((el: any, i: number) => (
						<div
							key={i}
							className="ion-card-list"
						>
								<div style={{padding: '10px 60px', width: '100%', height: '25px', display: 'block', color: 'darkcyan'}}>
									{
										el.titleResult &&
										(`For your search "${el.titleResult}" founded results`)
									}
									{
										el.titlePopular && (
											el.titlePopular
										)
									}
								</div>
							{ !el.titleResult && !el.titlePopular && (
									<IonCard style={{ display: 'flex', maxHeight: '250px' }}>
										<img
											alt="Logo of movie"
											src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
											style={{ height: '250px', objectFit: 'contain', padding: '16px'}}
										/>
										<div style={{display: 'flex', flexDirection: 'column'}}>
											<IonCardHeader>
												<IonCardTitle>{el.original_title}</IonCardTitle>
												<IonCardSubtitle>Data of release: {el.release_date}</IonCardSubtitle>
												<IonCardSubtitle>Average: {el.vote_average}</IonCardSubtitle>
											</IonCardHeader>
											<IonCardContent className="ion-card-list-content">{el.overview}</IonCardContent>

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
					(stopScroll && page === 1 && cardsData.length === 1) && (
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

