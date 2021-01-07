import { Artiste } from './Artiste';

export class Album{

    constructor(
        public nom_album: string,
        public date_album: number,
        public img_album: any,
        public artiste: Artiste,
        public id_album?: number
    ){}
}