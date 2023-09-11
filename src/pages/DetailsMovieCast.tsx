
import React, {useEffect, useState} from "react";

import { useParams } from 'react-router-dom';

import {
	IonButton,
	IonCard,
	IonCardHeader, IonCardSubtitle, IonCardTitle,
	IonContent,
	IonHeader, IonItem, IonList,
	IonNote,
	IonPage,
	IonSkeletonText,
	IonText
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import './DetailsMovieCast.scss'
import axios from "axios";

type MovieCastDetailsProps = RouteComponentProps<{
	cast: string;
	id: string ;
	name: string;
}>;

const ROOT_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'fe596d9ecc661f727490237e8d8c7bf8';
const PATH_REQUEST = {
	credits: 'credits',
	videos: 'videos'
}

const delay = ms => {
	return new Promise(resolve => {
		setTimeout(() => {
			return resolve();
		}, ms);
	});
};

interface typeOfDataCast {

}

interface typeOfDataMovie {

}

export const DetailsMovieCast: React.FC<MovieCastDetailsProps> = ({ match }) => {
	// const { id, name, cast } = useParams();
	const [dataCast, setDataCast] = useState<typeOfDataCast | any>([])
	const [dataActors, setDataActors] = useState<any>()
	const [dataMovieCrew, setDataMovieCrew] = useState<any>()
	const [dataMovie, setDataMovie] = useState<typeOfDataMovie | any>({})
	const [loading, setLoading] = useState<boolean>(true)

	const props = match.params



	useEffect(() => {
		setLoading(true)
		const loadDataMovie = async () => {
			const respAbout = await axios.get(`${ROOT_URL}/movie/${props.id}?api_key=${API_KEY}&language=en-US`);
			const infoMovie = respAbout.data ? respAbout.data : {};
			await delay(1000);
			setDataMovie(infoMovie);
			setLoading(false)
		}

		const loadDataCredits = async () => {
			const respCredits = await axios.get(`${ROOT_URL}/movie/${props.id}/${PATH_REQUEST.credits}?api_key=${API_KEY}&language=en-US`);
			const credits = respCredits.data.cast ? respCredits.data.cast : [];
			await delay(1000);
			setDataCast(credits);
			const dataFindActor = credits.filter(el => el.known_for_department === 'Acting')
			const dataFindCrew = credits.filter(el => el.known_for_department !== 'Acting')
			setDataActors(dataFindActor)
			setDataMovieCrew(dataFindCrew)
		}

		if (props.id) {
			loadDataCredits()
			loadDataMovie()
		}
	}, [props.id]);

	useEffect(() => {
		if(Object.keys(dataMovie).length === 0 && dataCast.length === 0) {
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [dataCast])


	console.log('dataCast', dataCast);
	console.log('dataMovie', dataMovie);
	console.log('dataActors', dataActors);

	return (
		<IonPage>
			<IonHeader
				style={{display: 'flex', alignItems: 'center', gap: '30px', color: 'whitesmoke', backgroundColor: '#0d253f', height: '60px', padding: '20px'}}
			>
				<IonButton
					button={true}
					routerLink={`/`}
				>
					Home
				</IonButton>
				<IonText>
					Movie
				</IonText>
				<IonText>
					{props.name.slice(0, 1).toUpperCase() + props.name.slice(1)}
				</IonText>
				<IonText>
					{props.cast.slice(0, 1).toUpperCase() +  props.cast.slice(1)}
				</IonText>
			</IonHeader>
			{
				loading
					?
					<IonContent>
						<IonText style={{display: 'flex', width: '100%', height: '120px', marginTop: '50px', padding: '10px 50px', gap: '20px'}}>
							<IonSkeletonText animated={true} style={{width: '600px', height: '100px'}}/>
						</IonText>
					</IonContent>
					:
						<IonText style={{display: 'flex', backgroundColor: 'red', width: '100%', height: '120px', margin: '50px 0 20px 0', padding: '10px 50px', gap: '20px'}}>
							<img
								alt='Image of movie'
								style={{width: '60px', objectFit: 'cover'}}
								src={`https://image.tmdb.org/t/p/w500/${dataMovie.poster_path}`}
							/>
							<IonText style={{display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column'}}>
								<IonText>
									<IonText style={{fontSize: '28px', padding: '5px'}}>
										{dataMovie.original_title}
									</IonText>
									<IonText style={{fontSize: '28px', padding: '5px'}}>
										({dataMovie.release_date && dataMovie.release_date.slice(0, 4)})
									</IonText>
								</IonText>
								<IonButton
									style={{fontSize: '12px', padding: '5px'}}
									color='success'
									routerLink={`/movie/${props.id}/${props.name}`}
								>
									Back to home
								</IonButton>

							</IonText>

						</IonText>
			}
			{
				loading
					?
					<IonSkeletonText animated={true} style={{width: '600px', height: '100px'}}/>
					:
					<IonContent>
						<IonItem style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}} >
							<IonNote style={{display: 'flex', flexDirection: 'column', padding: '10px 50px'}}>
								Cast {dataActors.length}
								{
									dataActors && dataActors.map((el, i) => (
										<IonCard style={{width: '200px', height: '100px', display: 'flex'}} key={i}>
											<img
												alt='Image of actor'
												style={{height: '100px', objectFit: 'cover'}}
												src={`https://image.tmdb.org/t/p/w500/${el.profile_path
												}`}
											/>
											<IonCardHeader>
												<IonCardSubtitle style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', padding: '5px'}}>
													{el.name}
												</IonCardSubtitle>
												<IonCardSubtitle style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', padding: '5px'}}>
													{el.known_for_department}
												</IonCardSubtitle>
											</IonCardHeader>
										</IonCard>
									))
								}
							</IonNote>
							<IonNote style={{display: 'flex', flexDirection: 'column', padding: '10px 50px'}}>
								Crew Movie {dataMovieCrew.length}
								{
									dataMovieCrew && dataMovieCrew.map((el, i) => (
										<IonCard style={{width: '200px', height: '100px', display: 'flex'}} key={i}>
											<img
												alt='Image of actor'
												style={{height: '100px', objectFit: 'cover'}}
												src={`https://image.tmdb.org/t/p/w500/${el.profile_path
												}`}
											/>
											<IonCardHeader>
												<IonCardSubtitle style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', padding: '5px'}}>
													{el.name}
												</IonCardSubtitle>
												<IonCardSubtitle style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', padding: '5px'}}>
													{el.known_for_department}
												</IonCardSubtitle>
											</IonCardHeader>
										</IonCard>
									))
								}
							</IonNote>
						</IonItem>

					</IonContent>
			}
		</IonPage>
	)
}