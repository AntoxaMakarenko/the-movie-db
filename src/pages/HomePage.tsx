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

const ROOT_URL = 'https://api.themoviedb.org/3/search/movie';
const API_KEY = 'fe596d9ecc661f727490237e8d8c7bf8';

const getQueryParams = ({ searchTerm, page}) => {
	switch (true) {
		case Boolean(searchTerm):
			return `&query=${searchTerm}&page=${page}`
		default:
			return `&page=${page}`
	}
}

export const HomePage: React.FC = () => {
	const [cardsData, setCardsData] = useState<any[]>([]);
	const [page, setPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState<string | undefined>();
	const [stopScroll, setStopScroll] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// const [isLoading, setIsLoading] = useState<boolean>(false);


	const loadData = async (pageNumber: number, loadMore?: true) => {
		const resp = await axios.get(`${ROOT_URL}?api_key=${API_KEY}${getQueryParams({ searchTerm, page: pageNumber })}`)

		const movies = resp.data.results ? resp.data.results : [];

		if (loadMore) {
			setCardsData(prev => [...prev, ...movies])
		} else {
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

		if (searchTerm !== undefined) {
			setIsLoading(true);
			debounceTimeout = setTimeout(async () => {
				setPage(1);
				await loadData(1);
			}, 1500)
		}

		return () => {
			clearTimeout(debounceTimeout)
		}
	}, [searchTerm])

	return (
		<IonPage>
			<IonContent>
				<IonItem className="ion-input-container">
					<IonInput
						label="Search movie"
						color="success"
						// value={test}
						onIonInput={e => setSearchTerm(e.target.value)}
					>
					</IonInput>
					{isLoading && <ion-spinner name="crescent" />}
				</IonItem>
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
					(stopScroll && page === 1) && (
						<div className="not-found-movies">
							<span className="not-found-movies-text">Not found movies</span>
						</div>
					)
				}
			</IonContent>
		</IonPage>
	);
};

