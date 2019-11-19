import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/pokemons'
  },
  {
    path: 'pokemons',
    component: PokemonListComponent,
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [PokemonListComponent]
})
export class PokemonModule { }
