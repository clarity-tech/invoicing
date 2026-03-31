import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
* @see app/Http/Controllers/OtherBrowserSessionsController.php:14
* @route '/user/other-browser-sessions'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/user/other-browser-sessions',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
* @see app/Http/Controllers/OtherBrowserSessionsController.php:14
* @route '/user/other-browser-sessions'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
* @see app/Http/Controllers/OtherBrowserSessionsController.php:14
* @route '/user/other-browser-sessions'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
* @see app/Http/Controllers/OtherBrowserSessionsController.php:14
* @route '/user/other-browser-sessions'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OtherBrowserSessionsController::destroy
* @see app/Http/Controllers/OtherBrowserSessionsController.php:14
* @route '/user/other-browser-sessions'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const OtherBrowserSessionsController = { destroy }

export default OtherBrowserSessionsController