import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\PublicViewController::showInvoice
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
export const showInvoice = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: showInvoice.url(args, options),
    method: 'get',
});

showInvoice.definition = {
    methods: ['get', 'head'],
    url: '/invoices/view/{ulid}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::showInvoice
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
showInvoice.url = (
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
        showInvoice.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::showInvoice
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
showInvoice.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: showInvoice.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::showInvoice
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
showInvoice.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: showInvoice.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PublicViewController::showEstimate
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
export const showEstimate = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: showEstimate.url(args, options),
    method: 'get',
});

showEstimate.definition = {
    methods: ['get', 'head'],
    url: '/estimates/view/{ulid}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::showEstimate
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
showEstimate.url = (
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
        showEstimate.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::showEstimate
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
showEstimate.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: showEstimate.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::showEstimate
 * @see app/Http/Controllers/PublicViewController.php:23
 * @route '/estimates/view/{ulid}'
 */
showEstimate.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: showEstimate.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PublicViewController::downloadInvoicePdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
export const downloadInvoicePdf = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadInvoicePdf.url(args, options),
    method: 'get',
});

downloadInvoicePdf.definition = {
    methods: ['get', 'head'],
    url: '/invoices/{ulid}/pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::downloadInvoicePdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
downloadInvoicePdf.url = (
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
        downloadInvoicePdf.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::downloadInvoicePdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
downloadInvoicePdf.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadInvoicePdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::downloadInvoicePdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
downloadInvoicePdf.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadInvoicePdf.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PublicViewController::downloadEstimatePdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
export const downloadEstimatePdf = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadEstimatePdf.url(args, options),
    method: 'get',
});

downloadEstimatePdf.definition = {
    methods: ['get', 'head'],
    url: '/estimates/{ulid}/pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::downloadEstimatePdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
downloadEstimatePdf.url = (
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
        downloadEstimatePdf.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::downloadEstimatePdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
downloadEstimatePdf.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadEstimatePdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::downloadEstimatePdf
 * @see app/Http/Controllers/PublicViewController.php:45
 * @route '/estimates/{ulid}/pdf'
 */
downloadEstimatePdf.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadEstimatePdf.url(args, options),
    method: 'head',
});

const PublicViewController = {
    showInvoice,
    showEstimate,
    downloadInvoicePdf,
    downloadEstimatePdf,
};

export default PublicViewController;
