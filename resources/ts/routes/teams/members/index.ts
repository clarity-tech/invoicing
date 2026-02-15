import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:82
* @route '/teams/{team}/members'
*/
export const store = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teams/{team}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:82
* @route '/teams/{team}/members'
*/
store.url = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: args.team,
    }

    return store.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:82
* @route '/teams/{team}/members'
*/
store.post = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::update
* @see app/Http/Controllers/TeamController.php:107
* @route '/teams/{team}/members/{user}'
*/
export const update = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/teams/{team}/members/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TeamController::update
* @see app/Http/Controllers/TeamController.php:107
* @route '/teams/{team}/members/{user}'
*/
update.url = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            team: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: args.team,
        user: args.user,
    }

    return update.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::update
* @see app/Http/Controllers/TeamController.php:107
* @route '/teams/{team}/members/{user}'
*/
update.put = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:123
* @route '/teams/{team}/members/{user}'
*/
export const destroy = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teams/{team}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:123
* @route '/teams/{team}/members/{user}'
*/
destroy.url = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            team: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: args.team,
        user: args.user,
    }

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:123
* @route '/teams/{team}/members/{user}'
*/
destroy.delete = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const members = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default members