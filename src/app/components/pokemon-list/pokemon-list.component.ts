import { Component, OnInit } from '@angular/core';

import { PokemonService } from "../../modules/pokemon/pokemon.service";
import { Pokemon, Types } from "../../modules/pokemon/pokemon";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  errorMessage: string = '';
  notFoundImageUrl: string = '../../../assets/icons/unknown.png';
  selected: string = '';
  alphaDown: boolean = true;
  pokeTypes: string[] = Types;
  pokeTypesFilter: string[];
  pageTitle = 'Mini Pokedex';
  offset: number = 0;
  pokemonSub: Subscription;
  pageLimit: number = 60;
  showShiny: boolean = false;
  pokemonList: Pokemon[];
  pokemonListDB: Pokemon[];

  _typeFilter: string[];
  get typeFilter(): string[] {
    return this._typeFilter;
  }
  set typeFilter(value: string[]) {
    this._typeFilter = value;
    this.pokemonList = this.filter()
    this.orderPokemonList();
  }

  _filterName: string = '';
  get filterName(): string {
    return this._filterName;
  }
  set filterName(value: string) {
    this._filterName = value;
    this.pokemonList = this.filter()
    this.orderPokemonList();
  }

  constructor(private pokemonService: PokemonService) { }

  ngOnChanges() {
  }

  async ngOnInit() {
    while (true) {
      let pokeRes = await this.pokemonService.getPokemonsPaginated(this.offset, this.pageLimit).toPromise();
      if (!this.pokemonService.cache || this.pokemonService.cache.length < pokeRes.count) {
        await Promise.all(pokeRes.results.map(async (pokemon) => {
          return await this.pokemonService.getPokemonByID(pokemon.name).toPromise();
        }))
        if (!this.pokemonList) {
          this.pokemonList = this.pokemonService.cache.slice(0, this.pageLimit).sort(this.sortPokemonDescending);
          this.pokemonListDB = this.pokemonListDB ? [...this.pokemonListDB, ...this.pokemonList] : [...this.pokemonList];
        }
        this.offset += this.pageLimit;
      } else {
        break;
      }
    }
  }

  /**
   * Compares two pokemon objects and returns -1 if pokemon B name is greater than pokemon A name
   * if pokemon A name is greater returns 1
   */
  sortPokemonDescending(a: Pokemon, b: Pokemon) {
    if (a.name < b.name) {
      return -1;
    }
    if (b.name < a.name) {
      return 1;
    }
    return 0;
  }
  /**
   * Compares two pokemon objects and returns -1 if pokemon A name is greater than pokemon B name
   * if pokemon B name is greater returns 1
   */
  sortPokemonAscending(a: Pokemon, b: Pokemon) {
    if (a.name > b.name) {
      return -1;
    }
    if (b.name > a.name) {
      return 1;
    }
    return 0;
  }

  /**
   * Returns a pokemons list filter by the Pokemon's name and/or type
   */
  filter(): Pokemon[] {
    let localList: Pokemon[];
    if (this.filterName && this.typeFilter && this.typeFilter.length > 0) {
      //Filter by pokemon's type
      localList = this.pokemonListDB.filter((pokemon: Pokemon) =>
        pokemon.types.findIndex(type =>
          this.typeFilter.findIndex(value =>
            type.type.name === value) !== -1) !== -1);
      //Filter by pokemon's name
      localList = localList.filter((pokemon: Pokemon) =>
        pokemon.name.toLocaleLowerCase().indexOf(this.filterName.toLocaleLowerCase()) !== -1);
    } else if (this.filterName) {
      localList = this.pokemonListDB.filter((pokemon: Pokemon) =>
        pokemon.name.toLocaleLowerCase().indexOf(this.filterName.toLocaleLowerCase()) !== -1);
    } else if (this.typeFilter && this.typeFilter.length > 0) {
      localList = this.pokemonListDB.filter((pokemon: Pokemon) =>
        pokemon.types.findIndex(type =>
          this.typeFilter.findIndex(value =>
            type.type.name === value) !== -1) !== -1);
    } else {
      localList = [...this.pokemonListDB]
    }
    return localList;
  }

  /**
   * Change showShiny attribute from true to false and vice versa.
   */
  toggleImage() {
    this.showShiny = this.showShiny ? false : true;
  }

  /**
   * Change alphaDown attribute from true to false and vice versa. Also sorts the pokemon list.
  */
  toggleOrder() {
    this.alphaDown = this.alphaDown ? false : true;
    this.orderPokemonList();
  }

  /**
   * Adds the selected option filter to typeFilter.
   */
  toggleFilterType() {
    this.typeFilter = this.typeFilter ? this.typeFilter.includes(this.selected) ? this.typeFilter : [...this.typeFilter, this.selected] : [this.selected];
  }
  /**
   * Deletes a specific filter from typeFilter
   */
  deleteFilterType(value: string) {
    const index: number = this.typeFilter.indexOf(value);
    if (index > -1) {
      this.typeFilter.splice(index, 1)
    }
    this.typeFilter = this.typeFilter ? [...this.typeFilter] : [];
  }
  /**
   * Sorts the pokemon list based on attribute alphaDown
   */
  orderPokemonList() {
    if (this.alphaDown) {
      this.pokemonList.sort(this.sortPokemonDescending);
    } else {
      this.pokemonList.sort(this.sortPokemonAscending);
    }
  }
}
