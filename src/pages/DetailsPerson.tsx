import './DetailsPerson.scss'
import React, {Fragment, useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader, IonCardSubtitle, IonCardTitle,
	IonContent, IonHeader,
	IonItem, IonList,
	IonNote,
	IonPage,
	IonSkeletonText, IonText
} from "@ionic/react";
import axios from "axios";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface typeOfPersonData {
	profile_path: string,
	name: string,
	birthday: any,
	deathday: any,
	place_of_birth: string,
	also_known_as: object,
	known_for_department: string,
	gender: number,
	biography: string

}

interface typeOfCreditsData {

}

const ROOT_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'fe596d9ecc661f727490237e8d8c7bf8';

type PersonDetailsProps = RouteComponentProps<{ id: string }>;

const delay = ms => {
	return new Promise(resolve => {
		setTimeout(() => {
			return resolve();
		}, ms);
	});
};

export const DetailsPerson: React.FC<PersonDetailsProps> = ({ match}) => {

	const [dataPerson, setDataPerson] = useState<typeOfPersonData | any>([]);
	const [dataCreditsMovies, setDataCreditsMovies] = useState<typeOfCreditsData | any>([]);
	const [loading, setLoading] = useState<boolean>(true)

	const personId = match.params.id
	console.log('personId', personId);

	useEffect(() => {
		setLoading(true)
		const loadDataPerson = async () => {
			const resp = await axios.get(`${ROOT_URL}/person/${personId}?api_key=${API_KEY}&language=en-US'`)
			const respCredits = await axios.get(`${ROOT_URL}/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US'`)
			const dataResp = resp.data ? resp.data : [];
			const dataCredits = respCredits.data ? respCredits.data : [];
			await delay(1500)
			setDataPerson(dataResp)
			setDataCreditsMovies(dataCredits)
		}

		if (personId) {
			loadDataPerson()
		}
	}, [match])

	useEffect(() => {
		if(Object.keys(dataPerson).length === 0) {
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [dataPerson])

	const age = (dataBirthday, dataDeath ) => {
		let now = new Date(); //Текущя дата
		let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //Текущя дата без времени

		if (dataDeath) {
			today = new Date(dataDeath.slice(0,4), dataDeath.slice(5,7), dataDeath.slice(8,10))
		}
		let dob = new Date(dataBirthday.slice(0,4), dataBirthday.slice(5,7), dataBirthday.slice(8,10)); //Дата рождения
		let dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate()); //ДР в текущем году
		let age; //Возраст

//Возраст = текущий год - год рождения
		age = today.getFullYear() - dob.getFullYear();
//Если ДР в этом году ещё предстоит, то вычитаем из age один год
		if (today < dobnow) {
			age = age-1;
		}
		return age;
	}

	const gender = (number) => {
		let genderActor;
		if (number === 1) {
			genderActor = 'Female'
		} else if (number === 2) {
			genderActor = 'Male'
		}
		return genderActor;
	}


	const PERSONAL_INFORM = [
		{
			title: 'Famous for',
			data: dataPerson ? dataPerson.known_for_department : ''
		},
		{
			title: 'Known authorship',
			data: dataCreditsMovies.cast ? dataCreditsMovies.cast.length : ''
		},
		{
			title: 'Gender',
			data: dataPerson ? `${gender(dataPerson.gender)}` : ''
		},
		{
			title: 'Place of birth',
			data: dataPerson ? dataPerson.place_of_birth : ''
		}
	]


	console.log('dataPerson', dataPerson);
	console.log('dataCredits', dataCreditsMovies);
	return (
		<IonPage>
			<IonHeader
				style={{display: 'flex', alignItems: 'center', gap: '30px', color: 'whitesmoke', backgroundColor: '#0d253f', height: '60px', padding: '20px'}}
			>
				<IonButton
					routerLink={`/`}
				>
					Home
				</IonButton>
				{dataPerson.name}
			</IonHeader>
			<IonContent>
				<div style={{display: 'flex'}}>
					<IonText>
						<IonNote style={{display: 'flex', width: '300px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 30px'}}>
							{
								!loading
									?
									<img
										style={{height: '400px', borderRadius: '10px', objectFit: 'cover'}}
										alt={'Actor_photo'}
										src={`https://image.tmdb.org/t/p/w500${dataPerson.profile_path}`}
									/>
									:
									<IonSkeletonText
										animated={true}
										style={{ width: '280px', height: '400px' }}
									/>
							}

						</IonNote>
						<IonContent>
							<IonList className="personal-info">
								<IonCardTitle>
									{
										loading ? <IonSkeletonText animated={true} style={{ width: '300px', height: '20px' }}/> : 'Personal information'
									}
								</IonCardTitle>
							</IonList>
							{/*Famous for, Known authorship, Gender, Place of birth*/}
							{
								 PERSONAL_INFORM.map((el, i) => (
									<Fragment key={i}>
										{
											loading
												?
												<IonList className="personal-info">
													<IonCardTitle
														style={{ fontSize: '14px' }}>
														<IonSkeletonText animated={ true } style={{ width: '300px', height: '20px' }} />
													</IonCardTitle>
													<IonNote>
														<IonSkeletonText animated={ true } style={{ width: '300px', height: '20px' }} />
													</IonNote>
												</IonList>
												: el.data &&
												<IonList className="personal-info">
													<IonCardTitle style={{ fontSize: '14px' }}>
														{el.title}
													</IonCardTitle>
													<IonNote>
														{ el.data }
													</IonNote>
												</IonList>
										}
									</Fragment>
								))
							}
							{/*Birthday Death day*/}
							{
								loading
									?
									<IonList className="personal-info">
										<IonCardTitle>
											<IonSkeletonText animated={true} style={{ width: '300px', height: '20px' }} />
										</IonCardTitle>
										<IonNote>
											<IonSkeletonText animated={true} style={{ width: '300px', height: '20px' }} />
										</IonNote>
									</IonList>
									: (dataPerson.birthday && !dataPerson.deathday)
										?
										<IonList className="personal-info">
											<IonCardTitle
												style={{fontSize: '14px'}}>
												Birthday
											</IonCardTitle>
											<IonNote>
												{`${dataPerson.birthday} (${age(dataPerson.birthday, null)} years old)`}
											</IonNote>
										</IonList>
										:
										<>
											<IonList className="personal-info">
												<IonCardTitle
													style={{fontSize: '14px'}}>
													Birthday
												</IonCardTitle>
												<IonNote>
													{ dataPerson.birthday }
												</IonNote>
											</IonList>
											<IonList className="personal-info">
												<IonCardTitle
													style={{fontSize: '14px'}}>
													Death day
												</IonCardTitle>
												<IonNote>
													{`${dataPerson.deathday} (${age(dataPerson.birthday, dataPerson.deathday)} years old)`}
												</IonNote>
											</IonList>
										</>
							}
							{/*Also known as*/}
							{
								loading
									?
									<IonList className="personal-info">
										<IonCardTitle
											style={{ fontSize: '14px' }}>
											<IonSkeletonText animated={ true } style={{ width: '300px', height: '20px' }} />
										</IonCardTitle>
										<IonNote>
											<IonSkeletonText animated={ true } style={{ width: '300px', height: '20px' }} />
										</IonNote>
									</IonList>
									: dataPerson.also_known_as.length !== 0 &&
									<IonList className="personal-info">
										<IonCardTitle style={{ fontSize: '14px' }}>
											Also known as
										</IonCardTitle>
										<IonList style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
											{
												dataPerson.also_known_as.map((el, i) => (
													<IonNote key={i}>
														{el}
													</IonNote>
												))
											}
										</IonList>
									</IonList>
							}
						</IonContent>
					</IonText>




					<IonText style={{width: '70%', paddingTop: '34px'}}>
						<IonCardHeader >
							<IonCardTitle style={{fontSize: '22px', paddingBottom: '30px'}}>
								{
									loading ? <IonSkeletonText animated={true} style={{ width: '300px', height: '20px' }} /> : dataPerson.name
								}
							</IonCardTitle>
							<IonCardSubtitle style={{fontSize: '16px'}}>
								{
									loading ? <IonSkeletonText animated={true} style={{ width: '300px', height: '20px' }} /> : 'Biography'
								}
							</IonCardSubtitle>
						</IonCardHeader>
						<IonCardContent>
							{
								loading ? <IonSkeletonText animated={true} style={{ width: '1000px', height: '260px' }} /> : dataPerson.biography
							}
						</IonCardContent>
						<div style={{width: '100%', padding: '10px'}}>
							<IonText style={{padding: '10px', width: '100%'}}>
								{
									!loading && dataCreditsMovies.cast ? 'Famous for' : <IonSkeletonText animated={true} style={{ height: '20px'}}/>
								}
							</IonText>
							<Swiper
								modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow]}
								spaceBetween={0}
								slidesPerView={5}
								scrollbar={{draggable: true}}
							>
								{
									dataCreditsMovies.cast && !loading ? dataCreditsMovies.cast.slice(0, 10).map((el: any, i: number) => (
										<SwiperSlide
											className="out-team-slide"
											key={i}
											style={{padding: '10px'}}
										>
											<IonCard
												button={true}
												key={i}
												style={{ height: '270px'}}
												routerLink={`/movie/${el.id}/${el.original_title}`}
											>
												<img
													style={{objectFit: 'cover', height: '200px', width: '200px' }}
													alt="profile_image"
													src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
												/>
												<IonCardHeader>
													<IonCardTitle style={{fontSize: '12px'}}>
														{ el.original_title }
													</IonCardTitle>
												</IonCardHeader>

											</IonCard>
										</SwiperSlide>
									)) : <IonSkeletonText animated={true} style={{ height: '170px'}}/>
								}
							</Swiper>
						</div>
					</IonText>

				</div>

			</IonContent>
		</IonPage>
	)
}