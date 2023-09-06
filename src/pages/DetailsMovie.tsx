import React, {useEffect, useState} from "react";
import {
	IonButton,
	IonCard,
	IonCardContent, IonCardHeader, IonCardSubtitle,
	IonCardTitle,
	IonContent, IonHeader,
	IonImg,
	IonItem, IonItemOption,
	IonLabel, IonList, IonListHeader,
	IonNote,
	IonPage, IonSkeletonText, IonSpinner, IonTabBar, IonText, IonTitle, IonToast
} from "@ionic/react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules'

import {RouteComponentProps} from "react-router";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './DetailsMovie.scss'
import axios from "axios";
import {IonContext} from "@ionic/react/dist/types/contexts/IonContext";

interface typeOfDataMovie {
	backdrop_path: string,
	original_language: string,
	release_date: any,
	runtime: number,
	overview: string,
	genres: string,
	tagline: string
}

interface typeOfDataCredits {
	character: string,
	budget: number,
	revenue: number,
	cast: any
}

const ROOT_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'fe596d9ecc661f727490237e8d8c7bf8';
const PATH_REQUEST = {
	credits: 'credits',
	videos: 'videos'
}
type MovieDetailsProps = RouteComponentProps<{ id: string }>;

const delay = ms => {
	return new Promise(resolve => {
		setTimeout(() => {
			return resolve();
		}, ms);
	});
};

const DetailsMovie: React.FC<MovieDetailsProps> = ( { match} ) => {

	const [show, setShow] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [dataMovie, setDataMovie] = useState<typeOfDataMovie | any>({});
	const [dataCredits, setDataCredits] = useState<typeOfDataCredits | any>([])
	const [dataVideos, setDataVideos] = useState<any>([])

	const movieId = match.params.id
	const imageUrl = `https://image.tmdb.org/t/p/w500/${dataMovie && dataMovie.backdrop_path}`

	useEffect(() => {
		const loadDataMovie = async () => {
			const respAbout = await axios.get(`${ROOT_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
			const infoMovie = respAbout.data ? respAbout.data : {};
			await delay(1300);
			setDataMovie(infoMovie);
		}

		const loadDataCredits = async () => {
			const respCredits = await axios.get(`${ROOT_URL}/movie/${movieId}/${PATH_REQUEST.credits}?api_key=${API_KEY}&language=en-US`);
			const credits = respCredits.data.cast ? respCredits.data.cast : [];
			await delay(2500);
			setDataCredits(credits);
		}

		if (movieId) {
			loadDataMovie()
			loadDataCredits()
		}
	}, [match])

	useEffect(() => {
		if(Object.keys(dataMovie).length === 0) {
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [dataMovie])

	useEffect(() => {
		const loadDataTrailers = async () => {
			const respVideos = await axios.get(`${ROOT_URL}/movie/${movieId}/${PATH_REQUEST.videos}?api_key=${API_KEY}&language=en-US`);
			const videos = respVideos.data.results ? respVideos.data.results : [];
			setDataVideos(videos)
		}

		if (show) {
			loadDataTrailers()
		}
	}, [show])


	const budget = (number) => {
		if (number) {
			const numberBudget = number.toString()
			let numberNew = '';
			for(let i = numberBudget.length; i > 0; i = i - 3) {
				if (i === numberBudget.length) {
					numberNew = numberBudget.slice(i - 3, i)
				}
				else if (i === 2 || i === 1) {
					numberNew = numberBudget.slice(i - i, i) + ',' + numberNew
				} else {
					numberNew = numberBudget.slice(i - 3, i) + ',' + numberNew
				}
			}
			return numberNew
		}
	}

	console.log('dataMovie', Object.keys(dataMovie).length);
	console.log('dataCredits', dataCredits);
	console.log('imageUrl', imageUrl);

	return (
		<IonPage>
			<IonHeader
				style={{color: 'whitesmoke', backgroundColor: '#0d253f',height: '60px', padding: '20px 50px'}}
			>
				{dataMovie.title}
			</IonHeader>
			<IonContent>
				<IonCard
					style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', padding: '30px', background: 'none'}}
				>
					{
						!loading &&
						<img
							style={{position: 'absolute', opacity: '20%', width: '100%', height: '100%', objectFit: 'cover'}}
							alt="backdrop_image"
							src={`https://image.tmdb.org/t/p/w500/${dataMovie.backdrop_path}`}
						/>
					}
					{
						!loading
							?
						<img
							style={{height: '400px', borderRadius: '20px',}}
							alt="poster_path"
							src={`https://image.tmdb.org/t/p/w500/${dataMovie.poster_path}`}
						/>
							:
						<IonSkeletonText
						animated={true}
						style={{ width: '280px', height: '400px' }}
						/>

					}
					<IonCardTitle style={{maxWidth: '70%'}}>
								<IonLabel style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
									<IonText style={{display: 'flex', gap: '10px'}}>
										<IonText style={{fontWeight: '700'}}>
											{
												loading ? <IonSkeletonText animated={true} style={{width: '100%'}} /> : dataMovie.original_title
											}
										</IonText>
										<IonText>
											{
												loading ? <IonSkeletonText animated={true} style={{width: '300px'}} /> : (dataMovie.release_date && dataMovie.release_date.slice(0, 4))
											}
										</IonText>
									</IonText>

									<IonText style={{display: 'flex', gap: '20px', fontSize: '14px'}}>
										<IonText style={{display: 'flex', gap: '3px'}}>
											<IonText>
												{
													loading ? <IonSkeletonText animated={true} style={{width: '200px'}}/> : `${dataMovie.release_date.slice(8, 10)}/${dataMovie.release_date.slice(5, 7)}/${dataMovie.release_date.slice(0, 4)}`
												}
											</IonText>
											<IonText>
												{
													loading ? <IonSkeletonText animated={true} style={{width: '200px'}} /> : dataMovie.original_language.toUpperCase()
												}
											</IonText>
										</IonText>
										<IonText>
											{
												loading ? <IonSkeletonText animated={true} style={{width: '200px'}} /> : `${dataMovie.runtime} min`
											}
										</IonText>
										<IonText style={{display: 'flex', gap: '10px', fontSize: '14px'}}>
											{
												loading ? <IonSkeletonText animated={true} /> :
													(
														dataMovie.genres && dataMovie.genres.map((el: any, i: number) => (
															<div key={i}>
																{el.name}
															</div>
														))
													)
											}
										</IonText>
									</IonText>
								</IonLabel>

						<IonCardContent style={{display: 'flex', flexDirection: 'column', marginTop: '50px', gap: '10px', padding: '10px'}}>
							<IonText>
								{
									loading ? <IonSkeletonText animated={true} /> : dataMovie.tagline
								}
							</IonText>
							<IonText>
							{
								loading ? <IonSkeletonText animated={true} /> : 'Review'
							}
							</IonText>
							<IonText>
								{
									loading ? <IonSkeletonText animated={true} /> : dataMovie.overview
								}
							</IonText>
							{
								!show &&
								(
									loading ? <IonSkeletonText animated={true} /> : <IonButton
										onClick={() => {
											setShow(!show)
										}}
									>
										Watch trailer
									</IonButton>
								)
							}
							{
								show && (
									dataVideos.length ?
								<div className="window-video">
									<button className='close-video'
									        onClick={() => setShow(!show)}
									>
										Close
									</button>
									<iframe
										width="610"
										height="400"
										src={`https://www.youtube.com/embed/${dataVideos[0] && dataVideos[0].key}`}
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										title="Embedded youtube"
									/>
								</div>
										: <IonSkeletonText animated={true} />
								)
							}
						</IonCardContent>
					</IonCardTitle>
				</IonCard>




				<IonItem>
						<div style={{width: '75%', padding: '10px 50px'}}>
							<IonText style={{padding: '0 0 0 0', width: '100%'}}>
								{
									dataCredits.length ? 'Cast' : <IonSkeletonText animated={true} style={{ height: '20px'}}/>
								}
							</IonText>
							<Swiper
								modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow]}
								spaceBetween={0}
								slidesPerView={6}
								scrollbar={{draggable: true}}
							>
								{
									dataCredits.length ? dataCredits.slice(0, 10).map((el: any, i: number) => (
										<SwiperSlide
											className="out-team-slide"
											key={i}
											style={{padding: '20px 0'}}
										>
											<IonCard
												button={true}
												key={i}
												style={{ height: '284px'}}
												routerLink={`/person/${el.id}`}
											>
												<img
													style={{objectFit: 'cover', height: '200px', width: '150px' }}
													alt="profile_image"
													src={`https://image.tmdb.org/t/p/w500/${el.profile_path}`}
												/>
												<IonCardHeader>
													<IonCardTitle style={{fontSize: '14px'}}>
														{ el.name }
													</IonCardTitle>
													<IonNote style={{fontSize: '12px'}}>
														{ el.character }
													</IonNote>
												</IonCardHeader>
											</IonCard>
										</SwiperSlide>
									)) : <IonSkeletonText animated={true} style={{ height: '170px'}}/>
								}
							</Swiper>
						</div>
						<IonContent>
							<IonList>
								<IonCardTitle>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : 'Original name'
									}
								</IonCardTitle>
								<IonNote>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : dataMovie.original_title
									}
								</IonNote>
							</IonList>
							<IonList>
								<IonCardTitle>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : 'Status'
									}
								</IonCardTitle>
								<IonNote>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : dataMovie.status
									}
								</IonNote>
							</IonList>
							<IonList>
								<IonCardTitle>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : 'Original language'
									}
								</IonCardTitle>
								<IonNote>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : dataMovie.original_language
									}
								</IonNote>
							</IonList>
							<IonList>
								<IonCardTitle>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : 'Budget'
									}

								</IonCardTitle>
								<IonNote>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : `${budget(dataMovie.budget)}`
									}
								</IonNote>
							</IonList>
							<IonList>
								<IonCardTitle>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : 'Revenue'
									}
								</IonCardTitle>
								<IonNote>
									{
										loading ? <IonSkeletonText animated={true} style={{ height: '10px'}} /> : `$budget(dataMovie.revenue)}`
									}
								</IonNote>
							</IonList>
						</IonContent>
				</IonItem>
			</IonContent>
		</IonPage>
	)
}

export default DetailsMovie