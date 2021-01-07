import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { PlayerComponent } from './player/player.component';
import { HeaderComponent } from './template/header/header.component';
import { FooterComponent } from './template/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { AlbumComponent } from './pages/album/album.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { AddToPlaylistComponent } from './template/add-to-playlist/add-to-playlist.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {AuthGuardService} from './helpers/auth-guard.service';
import { routing } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatListModule} from '@angular/material/list';
import { CategoriesComponent } from './pages/categories/categories.component';
import {SearchComponent} from './template/search/search.component';
import {MatMenuModule} from '@angular/material/menu';
import { PlaylistsListComponent } from './pages/playlists-list/playlists-list.component';
import { ModifyComponent } from './users/modify/modify.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Globals } from './helpers/globals';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ModifyComponent,
    PlayerComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchResultComponent,
    ArtistComponent,
    AlbumComponent,
    PlaylistComponent,
    AddToPlaylistComponent,
    NotFoundComponent,
    SearchComponent,
    CategoriesComponent,
    PlaylistsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSliderModule,
    MatListModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatMenuModule,
    routing
  ],
  providers: [AuthService,  AuthGuardService, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
