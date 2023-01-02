import { Connection } from 'typeorm';
import { AllSwapiDataInterface } from '../../common/interfaces/seeding.relations.interface';
import { getIds } from '../../common/utils/seeding.utils';
import { Films } from '../../swapi/film/film.entity';
import { People } from '../../swapi/people/people.entity';
import { Species } from '../../swapi/specie/specie.entity';
import { Starships } from '../../swapi/starship/starship.entity';
import { Vehicles } from '../../swapi/vehicle/vehicle.entity';

export class RelationsBuilder {
  public static dataObj: AllSwapiDataInterface = {
    films: [],
    people: [],
    planets: [],
    species: [],
    starships: [],
    vehicles: [],
  };
  public static setData(category: string, data: number[]) {
    this.dataObj[category] = [...data];
  }

  public static async run(connection: Connection) {
    const data = RelationsBuilder.dataObj;

    // film
    await Promise.all(
      data.films.map(async (film) => {
        const id = +film.url.split('/')[5];
        const charactersIds = getIds(film.characters),
          planetsIds = getIds(film.planets),
          starshipsIds = getIds(film.starships),
          vehiclesIds = getIds(film.vehicles),
          speciesIds = getIds(film.species);
        await Promise.all(
          charactersIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Films, 'characters')
              .of(id)
              .add(x);
          }),
        );
        await Promise.all(
          planetsIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Films, 'planets')
              .of(id)
              .add(x);
          }),
        );
        await Promise.all(
          starshipsIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Films, 'starships')
              .of(id)
              .add(x);
          }),
        );
        await Promise.all(
          vehiclesIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Films, 'vehicles')
              .of(id)
              .add(x);
          }),
        );
        await Promise.all(
          speciesIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Films, 'species')
              .of(id)
              .add(x);
          }),
        );
      }),
    );

    // people
    await Promise.all(
      data.people.map(async (people) => {
        const id = +people.url.split('/')[5];
        const homeworldId = +people.homeworld.split('/')[5];
        const speciesIds = getIds(people.species);

        await connection
          .createQueryBuilder()
          .relation(People, 'homeworld')
          .of(id)
          .set(homeworldId);

        await Promise.all(
          speciesIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(People, 'species')
              .of(id)
              .add(x);
          }),
        );
      }),
    );

    // specie
    await Promise.all(
      data.species.map(async (specie) => {
        const id = +specie.url.split('/')[5];
        const homeworldId = !specie.homeworld
          ? null
          : +specie.homeworld.split('/')[5];
        await connection
          .createQueryBuilder()
          .relation(Species, 'homeworld')
          .of(id)
          .set(homeworldId);
      }),
    );

    // starship
    await Promise.all(
      data.starships.map(async (starship) => {
        const id = +starship.url.split('/')[5];
        const pilotsIds = getIds(starship.pilots);

        await Promise.all(
          pilotsIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Starships, 'pilots')
              .of(id)
              .add(x);
          }),
        );
      }),
    );

    // vehicle
    await Promise.all(
      data.vehicles.map(async (vehicle) => {
        const id = +vehicle.url.split('/')[5];
        const pilotsIds = getIds(vehicle.pilots);
        await Promise.all(
          pilotsIds.map(async (x) => {
            await connection
              .createQueryBuilder()
              .relation(Vehicles, 'pilots')
              .of(id)
              .add(x);
          }),
        );
      }),
    );
  }
}
