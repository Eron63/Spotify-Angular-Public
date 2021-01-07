export class Titre{

    constructor(
        public nom_titre: string,
        public nb_vues: number,
        public listArtistes: any[],
        public id_titre?: number
    ){}
}