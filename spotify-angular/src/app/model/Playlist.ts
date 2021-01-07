import { User } from './user';
import { Titre } from './Titre';

export class Playlist{

    constructor(
        public nom_playlist: string,
        public user?: User,
        public listTitres?: Titre[],
        public id_playlist?: number
    ){}
}