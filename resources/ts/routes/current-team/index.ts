import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CurrentTeamController::update
* @see app/Http/Controllers/CurrentTeamController.php:10
* @route '/current-team'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/current-team',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CurrentTeamController::update
* @see app/Http/Controllers/CurrentTeamController.php:10
* @route '/current-team'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CurrentTeamController::update
* @see app/Http/Controllers/CurrentTeamController.php:10
* @route '/current-team'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

const currentTeam = {
    update: Object.assign(update, update),
}

export default currentTeam