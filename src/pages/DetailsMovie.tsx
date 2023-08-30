import React from "react";
import {IonContent, IonItem, IonPage} from "@ionic/react";

export const DetailsMovie: React.FC = ( { dataMovie } ) => {


	return (
		<IonPage>
			<IonContent>
				<IonItem>
					{dataMovie.release_date}
				</IonItem>
			</IonContent>
		</IonPage>
	)
}