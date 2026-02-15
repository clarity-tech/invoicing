import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:140
* @route '/teams/{team}/invitations/{invitation}'
*/
export const destroy = (args: { team: string | number, invitation: string | number } | [team: string | number, invitation: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teams/{team}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:140
* @route '/teams/{team}/invitations/{invitation}'
*/
destroy.url = (args: { team: string | number, invitation: string | number } | [team: string | number, invitation: string | number ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::destroy
* @see app/Http/Controllers/TeamController.php:140
* @route '/teams/{team}/invitations/{invitation}'
*/
destroy.delete = (args: { team: string | number, invitation: string | number } | [team: string | number, invitation: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const invitations = {
    destroy: Object.assign(destroy, destroy),
}

export default invitations