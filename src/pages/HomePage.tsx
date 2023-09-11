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
	IonItem, IonSpinner, IonLabel, IonList, IonRouterLink, IonHeader, IonImg, IonSegment, IonSegmentButton, IonButton,
} from '@ionic/react';
import axios from "axios";
import './HomePage.scss';

const getQueryParams = ({ searchTerm, page}: any) => {
	switch (true) {
		case Boolean(searchTerm):
			return `&query=${searchTerm}&page=${page}`
		default:
			return `&page=${page}`

	}
}
const ROOT_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'fe596d9ecc661f727490237e8d8c7bf8';

const PATH_REQUEST = {
	movieDay: 'trending/movie/day',
	movieWeek: 'trending/movie/week',
	search: 'search/movie'
}

interface typeOfCardsData {
	poster_path: string,
	original_title: string,
	release_date: any,
	vote_average: number,
	overview: string,
	titleResult: string
}

export const HomePage: React.FC = ({}) => {

	const [pathRequest, setPathRequest] = useState<any | string>(PATH_REQUEST.movieDay);
	const [pathRequestTrending, setPathRequestTrending] = useState<any | string>()
	const [cardsData, setCardsData] = useState<typeOfCardsData[]>([]);
	const [page, setPage] = useState<any>(1);
	const [searchTerm, setSearchTerm] = useState<any>();
	const [stopScroll, setStopScroll] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [minLength, setMinLength] = useState(false)

	const handleSearchInputChange = (event: any) => {
		const { value } = event.detail;
		const result = value.charAt(0).toUpperCase() + value.slice(1)
		setSearchTerm(result)
	};


	const loadData = async (pageNumber: number, loadMore?: true) => {
		const resp = await axios.get(`${ROOT_URL}${pathRequest}?api_key=${API_KEY}${getQueryParams({ searchTerm, page: pageNumber })}`)
		const movies = resp.data.results.length ? resp.data.results : [];

		const titleForSearchMovies = [{titleResult: `${searchTerm}`}];
		const titleForPopularMovies = [{titlePopular: 'Popular movies'}];

		let updateMovies: any;

		if (pathRequest === PATH_REQUEST.search) {
			updateMovies = [...titleForSearchMovies, ...movies]
		} else if (pathRequest === PATH_REQUEST.movieDay || pathRequest === PATH_REQUEST.movieWeek) {
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

		const newPath = (path: any, time: number) => {
			setIsLoading(true);
			setPathRequest(path)
			setPage(1)
			debounceTimeout = setTimeout(async () => {
				await loadData(1);
			}, time)
		}

		if (!searchTerm && !pathRequestTrending) {
			newPath(PATH_REQUEST.movieDay, 0)
			setMinLength(false)
		} else if (!searchTerm && pathRequestTrending) {
			setPathRequest(pathRequestTrending)
			setPage(1)
			debounceTimeout = setTimeout(async () => {
				await loadData(1);
			}, 500)
			setMinLength(false)
		}else if (searchTerm.length >= 3) {
			setMinLength(false)
			newPath(PATH_REQUEST.search, 1000)
		} else if (1 <= searchTerm.length < 3) {
			setMinLength(true)
			setIsLoading(false)
		}

		return () => {
			clearTimeout(debounceTimeout)
		}
	}, [searchTerm, pathRequest, pathRequestTrending])

	const handleSegmentChange = (e) => {
		setPathRequestTrending(e.detail.value);
	};

	console.log('pathRequest', pathRequest);
	console.log('pathRequestTrending', pathRequestTrending);

	return (
		<IonPage>
			<IonHeader
				style={{color: 'whitesmoke', backgroundColor: '#0d253f',height: '60px', padding: '20px 50px'}}
			>
				Movies
			</IonHeader>
			<IonContent>
				<IonItem className="ion-input-container">
					<IonInput
						label="Search movie"
						color="success"
						value={searchTerm}
						onIonInput={e => handleSearchInputChange(e)}
					>
					</IonInput>
					{isLoading && <IonSpinner name="crescent" />}
				</IonItem>
				<IonLabel className="ion-input-attention">
					{minLength ? 'Please, write more information for search' : ''}
				</IonLabel>
				{
					cardsData.length > 1 && cardsData.map((el: any, i: number) => (
						<IonList
							key={i}
							className="ion-card-list"
						>
							{
								el.titleResult &&
								<div className="ion-card-label-result-search">
									{`For your search "${el.titleResult}" founded results`}
								</div>
							}
							{
								el.titlePopular && (
									<div className="ion-card-label-result-search">
										{el.titlePopular}
										<IonSegment
											color="success"
											onIonChange={handleSegmentChange} value={pathRequest}
										>
											<IonSegmentButton value={PATH_REQUEST.movieDay}>
												<IonLabel>Today</IonLabel>
											</IonSegmentButton>
											<IonSegmentButton value={PATH_REQUEST.movieWeek}>
												<IonLabel >This week</IonLabel>
											</IonSegmentButton>
										</IonSegment>
									</div>
								)
							}
							{ !el.titleResult && !el.titlePopular && (
								<IonItem
								         button={true}
								         routerLink={`/movie/${el.id}/${el.original_title.toLowerCase()}`}
								>
									<img
										alt="Logo of movie"
										src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
										style={{ height: '250px', borderRadius: '5px', objectFit: 'contain', padding: '10px'}}

									/>
									<IonCard
										style={{height: '230px'}}
									>
										<IonCardHeader>
											<IonCardTitle>{el.original_title}</IonCardTitle>
											<IonCardSubtitle>Data of release: {el.release_date}</IonCardSubtitle>
											<IonCardSubtitle>Average: {el.vote_average}</IonCardSubtitle>
										</IonCardHeader>
										<IonCardContent className="ion-card-list-content">{el.overview}</IonCardContent>
									</IonCard>
								</IonItem>
								)
							}
						</IonList>
					))
				}
				{
					!stopScroll && (
						<IonInfiniteScroll onIonInfinite={async (e) => {
							await loadData(page + 1, true);
							setPage((prevState: any) => prevState + 1);
							e.target.complete();
						}}>
							<IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more movies..." />
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

