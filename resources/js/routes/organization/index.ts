import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import setup90f0be from './setup'
/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
export const setup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setup.url(options),
    method: 'get',
})

setup.definition = {
    methods: ["get","head"],
    url: '/organization/setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
setup.url = (options?: RouteQueryOptions) => {
    return setup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
setup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
setup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: setup.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
const setupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: setup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
setupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: setup.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationSetupController::setup
* @see app/Http/Controllers/OrganizationSetupController.php:21
* @route '/organization/setup'
*/
setupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: setup.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

setup.form = setupForm

const organization = {
    setup: Object.assign(setup, setup90f0be),
}

export default organization