import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
export const publicMethod = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
});

publicMethod.definition = {
    methods: ['get', 'head'],
    url: '/estimates/view/{ulid}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
publicMethod.url = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ulid: args };
    }

    if (Array.isArray(args)) {
        args = {
            ulid: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        ulid: args.ulid,
    };

    return (
        publicMethod.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
publicMethod.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
publicMethod.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: publicMethod.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
export const pdf = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
});

pdf.definition = {
    methods: ['get', 'head'],
    url: '/estimates/{ulid}/pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
pdf.url = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ulid: args };
    }

    if (Array.isArray(args)) {
        args = {
            ulid: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        ulid: args.ulid,
    };

    return (
        pdf.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
pdf.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
pdf.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/estimates/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/estimates/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/estimates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/estimates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/estimates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

const estimates = {
    public: Object.assign(publicMethod, publicMethod),
    pdf: Object.assign(pdf, pdf),
    create: Object.assign(create, create),
};

export default estimates;
