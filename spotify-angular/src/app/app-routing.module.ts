import {ModuleWithProviders, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {SigninComponent} from "./auth/signin/signin.component";
import {ModifyComponent} from "./users/modify/modify.component";
import {AuthGuardService} from "./helpers/auth-guard.service";
import { ArtistComponent } from './pages/artist/artist.component';
import { AlbumComponent } from './pages/album/album.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PlaylistsListComponent } from './pages/playlists-list/playlists-list.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


const routes: Routes = [
  { path: 'connexion', component: SigninComponent },
  { path: 'inscription', component: SignupComponent },
  { path: 'editer', canActivate: [AuthGuardService], component: ModifyComponent},
  { path: 'accueil', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'artiste/:id', canActivate: [AuthGuardService], component: ArtistComponent },
  { path: 'album/:id', canActivate: [AuthGuardService], component: AlbumComponent },
  { path: 'categorie/:id', canActivate: [AuthGuardService], component: CategoriesComponent },
  { path: 'playlists/:id', canActivate: [AuthGuardService], component: PlaylistsListComponent },
  { path: 'playlist/:id', canActivate: [AuthGuardService], component: PlaylistComponent },
  { path: 'recherche/:search', canActivate: [AuthGuardService], component: SearchResultComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'notfound' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes)

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
