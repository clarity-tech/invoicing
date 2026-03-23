import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
import members from './members';
import invitations from './invitations';
/**
 * @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:47
 * @route '/teams/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/teams/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:47
 * @route '/teams/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:47
 * @route '/teams/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\TeamController::create
 * @see app/Http/Controllers/TeamController.php:47
 * @route '/teams/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:54
 * @route '/teams'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/teams',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:54
 * @route '/teams'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\TeamController::store
 * @see app/Http/Controllers/TeamController.php:54
 * @route '/teams'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\TeamController::show
 * @see app/Http/Controllers/TeamController.php:24
 * @route '/teams/{team}'
 */
export const show = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/teams/{team}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\TeamController::show
 * @see app/Http/Controllers/TeamController.php:24
 * @route '/teams/{team}'
 */
show.url = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args };
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        team: args.team,
    };

    return (
        show.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\TeamController::show
 * @see app/Http/Controllers/TeamController.php:24
 * @route '/teams/{team}'
 */
show.get = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\TeamController::show
 * @see app/Http/Controllers/TeamController.php:24
 * @route '/teams/{team}'
 */
show.head = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/{team}'
 */
export const update = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/teams/{team}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/{team}'
 */
update.url = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args };
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        team: args.team,
    };

    return (
        update.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\TeamController::update
 * @see app/Http/Controllers/TeamController.php:61
 * @route '/teams/{team}'
 */
update.put = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:72
 * @route '/teams/{team}'
 */
export const destroy = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/teams/{team}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:72
 * @route '/teams/{team}'
 */
destroy.url = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args };
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        team: args.team,
    };

    return (
        destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\TeamController::destroy
 * @see app/Http/Controllers/TeamController.php:72
 * @route '/teams/{team}'
 */
destroy.delete = (
    args: { team: string | number } | [team: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

const teams = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    members: Object.assign(members, members),
    invitations: Object.assign(invitations, invitations),
};

export default teams;
