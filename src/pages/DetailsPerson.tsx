import './DetailsPerson.scss'
import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonContent, IonHeader,
	IonItem,
	IonNote,
	IonPage,
	IonSkeletonText, IonText
} from "@ionic/react";
import axios from "axios";

interface typeOfPersonData {
	profile_path: string,
	name: string,
	// original_title: string,
	// release_date: any,
	// vote_average: number,
	// overview: string,
	// titleResult: string
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
	const [loading, setLoading] = useState<boolean>(true)

	const personId = match.params.id
	console.log('personId', personId);

	useEffect(() => {
		const loadDataPerson = async () => {
			const resp = await axios.get(`${ROOT_URL}/person/${personId}?api_key=${API_KEY}&language=en-US'`)
			const dataResp = resp.data ? resp.data : [];
			await delay(500)
			setDataPerson(dataResp)
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


	console.log('dataPerson', dataPerson);
	return (
		<IonPage>
			<IonHeader
				style={{color: 'whitesmoke', backgroundColor: '#0d253f',height: '60px', padding: '20px 50px'}}
			>
				{dataPerson.name}
			</IonHeader>
			<IonContent style={{display: 'flex'}}>
				<IonNote style={{display: 'flex', width: '300px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '30px'}}>
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
				<IonText style={{display: 'flex', width: '300px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '30px'}}>
					<IonText>
						{
							loading ? <IonSkeletonText animated={true} style={{ width: '100px', height: '20px' }}/> : 'Personal information'
						}
					</IonText>
					<IonText>
						{
							loading ? <IonSkeletonText animated={true} style={{ width: '100px', height: '20px' }}/> : dataPerson.name
						}
					</IonText>
				</IonText>

				<IonCard>
					<IonCardHeader>
						{
							loading ? <IonSkeletonText animated={true} style={{ width: '100px', height: '20px' }}/> : dataPerson.name
						}
					</IonCardHeader>
				</IonCard>
			</IonContent>
		</IonPage>

		)

}