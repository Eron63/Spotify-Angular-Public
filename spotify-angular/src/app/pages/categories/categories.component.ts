import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TitresService} from '../../services/titres.service';
import {CategoriesService} from "../../services/categories.service";
import { Titre } from 'src/app/model/Titre';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  p: number = 1;

  titresListe: Titre[] = [];
  categorieId: number;
  categorie: any;
  categoriesSub: Subscription;

  constructor(private titresService: TitresService,
              private categoryService: CategoriesService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.categoriesSub = this.route.params.subscribe(
      params => {
        this.categorieId = params['id'];

        if(this.categorieId){
          this.categoryService.getById(this.categorieId).subscribe(
            (res: any) => {
              this.categorie = res;
            }, err => {
              console.error(err);
            });

          this.titresService.get20ByCategorie(this.categorieId, 20*(this.p-1)).subscribe(
            (res: Titre[]) => {
              this.titresListe = res;
            }, err => {
              console.error(err);
          });
        }
      });
  }
}
