import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamController::create
* @see app/Http/Controllers/TeamController.php:47
* @route '/teams/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/teams/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::create
* @see app/Http/Controllers/TeamController.php:47
* @route '/teams/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::create
* @see app/Http/Controllers/TeamController.php:47
* @route '/teams/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::create
* @see app/Http/Controllers/TeamController.php:47
* @route '/teams/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:54
* @route '/teams'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:54
* @route '/teams'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:54
* @route '/teams'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::show
* @see app/Http/Controllers/TeamController.php:24
* @route '/teams/{team}'
*/
export const show = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/teams/{team}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::show
* @see app/Http/Controllers/TeamController.php:24
* @route '/teams/{team}'
*/
show.url = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::show
* @see app/Http/Controllers/TeamController.php:24
* @route '/teams/{team}'
*/
show.get = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::show
* @see app/Http/Controllers/TeamController.php:24
* @route '/teams/{team}'
*/
show.head = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TeamController::update
* @see app/Http/Controllers/TeamController.php:61
* @route '/teams/{team}'
*/
export const update = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/teams/{team}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TeamController::update
* @see app/Http/Controllers/TeamController.php:61
* @route '/teams/{team}'
*/
update.url = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::update
* @see app/Http/Controllers/TeamController.php:61
* @route '/teams/{team}'
*/
update.put = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:72
* @route '/teams/{team}'
*/
export const destroy = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teams/{team}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:72
* @route '/teams/{team}'
*/
destroy.url = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:72
* @route '/teams/{team}'
*/
destroy.delete = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TeamController::addMember
* @see app/Http/Controllers/TeamController.php:82
* @route '/teams/{team}/members'
*/
export const addMember = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember.url(args, options),
    method: 'post',
})

addMember.definition = {
    methods: ["post"],
    url: '/teams/{team}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::addMember
* @see app/Http/Controllers/TeamController.php:82
* @route '/teams/{team}/members'
*/
addMember.url = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return addMember.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::addMember
* @see app/Http/Controllers/TeamController.php:82
* @route '/teams/{team}/members'
*/
addMember.post = (args: { team: string | number } | [team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addMember.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::updateMemberRole
* @see app/Http/Controllers/TeamController.php:107
* @route '/teams/{team}/members/{user}'
*/
export const updateMemberRole = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMemberRole.url(args, options),
    method: 'put',
})

updateMemberRole.definition = {
    methods: ["put"],
    url: '/teams/{team}/members/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TeamController::updateMemberRole
* @see app/Http/Controllers/TeamController.php:107
* @route '/teams/{team}/members/{user}'
*/
updateMemberRole.url = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions) => {
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

    return updateMemberRole.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::updateMemberRole
* @see app/Http/Controllers/TeamController.php:107
* @route '/teams/{team}/members/{user}'
*/
updateMemberRole.put = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMemberRole.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TeamController::removeMember
* @see app/Http/Controllers/TeamController.php:123
* @route '/teams/{team}/members/{user}'
*/
export const removeMember = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

removeMember.definition = {
    methods: ["delete"],
    url: '/teams/{team}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamController::removeMember
* @see app/Http/Controllers/TeamController.php:123
* @route '/teams/{team}/members/{user}'
*/
removeMember.url = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions) => {
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

    return removeMember.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::removeMember
* @see app/Http/Controllers/TeamController.php:123
* @route '/teams/{team}/members/{user}'
*/
removeMember.delete = (args: { team: string | number, user: string | number } | [team: string | number, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TeamController::cancelInvitation
* @see app/Http/Controllers/TeamController.php:140
* @route '/teams/{team}/invitations/{invitation}'
*/
export const cancelInvitation = (args: { team: string | number, invitation: string | number } | [team: string | number, invitation: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelInvitation.url(args, options),
    method: 'delete',
})

cancelInvitation.definition = {
    methods: ["delete"],
    url: '/teams/{team}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamController::cancelInvitation
* @see app/Http/Controllers/TeamController.php:140
* @route '/teams/{team}/invitations/{invitation}'
*/
cancelInvitation.url = (args: { team: string | number, invitation: string | number } | [team: string | number, invitation: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            team: args[0],
            invitation: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: args.team,
        invitation: args.invitation,
    }

    return cancelInvitation.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::cancelInvitation
* @see app/Http/Controllers/TeamController.php:140
* @route '/teams/{team}/invitations/{invitation}'
*/
cancelInvitation.delete = (args: { team: string | number, invitation: string | number } | [team: string | number, invitation: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelInvitation.url(args, options),
    method: 'delete',
})

const TeamController = { create, store, show, update, destroy, addMember, updateMemberRole, removeMember, cancelInvitation }

export default TeamController