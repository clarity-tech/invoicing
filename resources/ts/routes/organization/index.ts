import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
} from './../../wayfinder';
import setup90f0be from './setup';
/**
 * @see \App\Http\Controllers\OrganizationSetupController::setup
 * @see app/Http/Controllers/OrganizationSetupController.php:21
 * @route '/organization/setup'
 */
export const setup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setup.url(options),
    method: 'get',
});

setup.definition = {
    methods: ['get', 'head'],
    url: '/organization/setup',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OrganizationSetupController::setup
 * @see app/Http/Controllers/OrganizationSetupController.php:21
 * @route '/organization/setup'
 */
setup.url = (options?: RouteQueryOptions) => {
    return setup.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OrganizationSetupController::setup
 * @see app/Http/Controllers/OrganizationSetupController.php:21
 * @route '/organization/setup'
 */
setup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: setup.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OrganizationSetupController::setup
 * @see app/Http/Controllers/OrganizationSetupController.php:21
 * @route '/organization/setup'
 */
setup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: setup.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/organization/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
});

const organization = {
    setup: Object.assign(setup, setup90f0be),
    edit: Object.assign(edit, edit),
};

export default organization;
