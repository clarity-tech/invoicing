import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamInvitationController::accept
* @see app/Http/Controllers/TeamInvitationController.php:13
* @route '/team-invitations/{invitation}'
*/
export const accept = (args: { invitation: string | number } | [invitation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

accept.definition = {
    methods: ["get","head"],
    url: '/team-invitations/{invitation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamInvitationController::accept
* @see app/Http/Controllers/TeamInvitationController.php:13
* @route '/team-invitations/{invitation}'
*/
accept.url = (args: { invitation: string | number } | [invitation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invitation: args }
    }

    if (Array.isArray(args)) {
        args = {
            invitation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invitation: args.invitation,
    }

    return accept.definition.url
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamInvitationController::accept
* @see app/Http/Controllers/TeamInvitationController.php:13
* @route '/team-invitations/{invitation}'
*/
accept.get = (args: { invitation: string | number } | [invitation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: accept.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamInvitationController::accept
* @see app/Http/Controllers/TeamInvitationController.php:13
* @route '/team-invitations/{invitation}'
*/
accept.head = (args: { invitation: string | number } | [invitation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: accept.url(args, options),
    method: 'head',
})

const TeamInvitationController = { accept }

export default TeamInvitationController