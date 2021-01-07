import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  search: string;
  searchResult: any[] = [];
  searchSub: Subscription;

  constructor(private searchService: SearchService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.searchSub = this.route.params.subscribe(
      params => {
        this.search = params['search'];

        if(this.search){
          this.searchService.globalSearch(this.search).subscribe(
            (res: any[]) => {
              this.searchResult = res;
            }, err => {
              console.error(err);
            }
          )
        }
      });
  }

}
