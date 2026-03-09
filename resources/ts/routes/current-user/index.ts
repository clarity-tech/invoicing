import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\CurrentUserController::destroy
 * @see app/Http/Controllers/CurrentUserController.php:14
 * @route '/user'
 */
export const destroy = (
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/user',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\CurrentUserController::destroy
 * @see app/Http/Controllers/CurrentUserController.php:14
 * @route '/user'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CurrentUserController::destroy
 * @see app/Http/Controllers/CurrentUserController.php:14
 * @route '/user'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
});

const currentUser = {
    destroy: Object.assign(destroy, destroy),
};

export default currentUser;
