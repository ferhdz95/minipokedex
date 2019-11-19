export interface Pokemon {
    name: string;
    id: number;
    is_default: boolean;
    order: number;
    base_experience: number;
    height: number;
    weight: number;
    sprites: PokemonSprites,
    types: PokemonType[];
}

export interface PokemonResponse {
    count: number;
    next: string;
    previous: string;
    results: PokemonResult[];
}

export interface PokemonResult {
    name: string;
    url: string;
}

export interface PokemonType {
    slot: number;
    type: PokemonResult;
}

export interface PokemonSprites {
    back_default: string;
    front_default: string;
    front_shiny: string;
    back_shiny: string;
}

export const Types: string[] = [
    "normal", "fighting", "flying", "poison", "ground", "rock", "bug",
    "ghost", "steel", "fire", "water", "grass", "electric", "psychic",
    "ice", "dragon", "dark", "fairy", "unknown", "shadow"
]