import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::show
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

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

/**
* @see \App\Http\Controllers\OrganizationSetupController::saveStep
* @see app/Http/Controllers/OrganizationSetupController.php:79
* @route '/organization/setup/{organization}/step'
*/
const saveStepForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveStep.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::saveStep
* @see app/Http/Controllers/OrganizationSetupController.php:79
* @route '/organization/setup/{organization}/step'
*/
saveStepForm.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveStep.url(args, options),
    method: 'post',
})

saveStep.form = saveStepForm

const OrganizationSetupController = { show, saveStep }

export default OrganizationSetupController