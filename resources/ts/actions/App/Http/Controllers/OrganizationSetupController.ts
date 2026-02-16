import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/organization/setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::saveStep
* @see app/Http/Controllers/OrganizationSetupController.php:79
* @route '/organization/setup/{organization}/step'
*/
export const saveStep = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveStep.url(args, options),
    method: 'post',
})

saveStep.definition = {
    methods: ["post"],
    url: '/organization/setup/{organization}/step',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationSetupController::saveStep
* @see app/Http/Controllers/OrganizationSetupController.php:79
* @route '/organization/setup/{organization}/step'
*/
saveStep.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        organization: typeof args.organization === 'object'
        ? args.organization.id
        : args.organization,
    }

    return saveStep.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationSetupController::saveStep
* @see app/Http/Controllers/OrganizationSetupController.php:79
* @route '/organization/setup/{organization}/step'
*/
saveStep.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveStep.url(args, options),
    method: 'post',
})

const OrganizationSetupController = { show, saveStep }

export default OrganizationSetupController