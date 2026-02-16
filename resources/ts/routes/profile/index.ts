import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserProfileController::show
* @see app/Http/Controllers/UserProfileController.php:16
* @route '/user/profile'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/user/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserProfileController::show
* @see app/Http/Controllers/UserProfileController.php:16
* @route '/user/profile'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfileController::show
* @see app/Http/Controllers/UserProfileController.php:16
* @route '/user/profile'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfileController::show
* @see app/Http/Controllers/UserProfileController.php:16
* @route '/user/profile'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

const profile = {
    show: Object.assign(show, show),
}

export default profile